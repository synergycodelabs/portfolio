import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to extract text content from components
async function extractContent() {
  const content = [];
  const componentsDir = path.join(__dirname, '../../src/components/sections');
  
  try {
    const files = await fs.promises.readdir(componentsDir);
    
    for (const file of files) {
      if (file.endsWith('.jsx') && !file.includes('.bak')) {
        const filePath = path.join(componentsDir, file);
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        
        // Extract text content (you might want to enhance this regex based on your components)
        const textContent = fileContent
          .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
          .replace(/<[^>]+>/g, ' ') // Remove JSX tags
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        if (textContent) {
          content.push({
            source: file,
            text: textContent
          });
        }
      }
    }
  } catch (error) {
    console.error('Error reading components:', error);
  }
  
  return content;
}

// Function to chunk text into smaller segments
function chunkText(text, maxLength = 1000) {
  const chunks = [];
  let currentChunk = '';
  
  const sentences = text.split('. ');
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxLength) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + '. ';
    } else {
      currentChunk += sentence + '. ';
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Main function to generate and store embeddings
async function generateEmbeddings() {
  try {
    console.log('Extracting content...');
    const content = await extractContent();
    
    console.log('Generating embeddings...');
    const embeddings = [];
    
    for (const item of content) {
      const chunks = chunkText(item.text);
      
      for (const chunk of chunks) {
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
        });
        
        embeddings.push({
          source: item.source,
          text: chunk,
          embedding: embeddingResponse.data[0].embedding,
        });

        // Log progress
        console.log(`Generated embedding for chunk from ${item.source}`);
      }
    }
    
    console.log('Storing embeddings...');
    await fs.promises.writeFile(
      path.join(dataDir, 'embeddings.json'),
      JSON.stringify(embeddings, null, 2)
    );
    
    console.log('Done! Embeddings saved to data/embeddings.json');
  } catch (error) {
    console.error('Error generating embeddings:', error);
  }
}

// Run the script
generateEmbeddings();