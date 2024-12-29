import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to extract text content from components
function extractContent() {
  const content = [];
  const componentsDir = path.join(__dirname, '../src/components/sections');
  
  // Read content from experience data
  const experienceData = JSON.parse(
    fs.readFileSync(path.join(componentsDir, 'experience/experienceData.js'), 'utf8')
  );
  content.push({
    source: 'experience',
    text: JSON.stringify(experienceData)
  });

  // Read content from other components
  const files = fs.readdirSync(componentsDir);
  
  files.forEach(file => {
    if (file.endsWith('.jsx') && !file.includes('.bak')) {
      const filePath = path.join(componentsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Extract text content from JSX
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
  });
  
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
    const content = extractContent();
    
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
      }
    }
    
    console.log('Storing embeddings...');
    fs.writeFileSync(
      path.join(__dirname, '../src/data/embeddings.json'),
      JSON.stringify(embeddings, null, 2)
    );
    
    console.log('Done!');
  } catch (error) {
    console.error('Error generating embeddings:', error);
  }
}

// Run the script
generateEmbeddings();