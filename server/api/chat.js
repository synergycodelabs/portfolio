import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const embeddingsPath = path.join(__dirname, '../data/embeddings.json');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// At the top, import logger
import logger from '../utils/logger.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      logger.error('OpenAI API key is missing');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Get embedding for the user's question
    try {
      const questionEmbedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: message,
      });
      
      // Log successful embedding
      logger.info(`Generated embedding for message: ${message.substring(0, 50)}...`);

      // Get relevant context
      const context = await getRelevantContext(questionEmbedding.data[0].embedding);
      
      // Generate chat completion
      const completion = await openai.chat.completions.create({
        model: "ft:gpt-4o-mini-2024-07-18:aplusg:portfolio-bot-v1:AjLmxhRS",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for Angel's portfolio website. Use the following context to answer questions about Angel's experience, projects, and skills: ${context}`,
          },
          { role: "user", content: message },
        ],
      });

      return res.status(200).json({ response: completion.choices[0].message.content });
      
    } catch (openaiError) {
      logger.error('OpenAI API error:', openaiError);
      return res.status(500).json({ message: 'Error communicating with AI service' });
    }

  } catch (error) {
    logger.error('General error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function getRelevantContext(questionEmbedding) {
  try {
    // Read embeddings from file
    const fileContent = await fs.promises.readFile(embeddingsPath, 'utf8');
    const embeddings = JSON.parse(fileContent);

    if (!embeddings || embeddings.length === 0) {
      return '';
    }

    // Calculate cosine similarity and get most relevant chunks
    const similarities = embeddings.map(entry => ({
      text: entry.text,
      similarity: calculateCosineSimilarity(questionEmbedding, entry.embedding),
    }));

    // Sort by similarity and get top 3 chunks
    const topChunks = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map(chunk => chunk.text);

    return topChunks.join('\n\n');
  } catch (error) {
    console.error('Error reading embeddings:', error);
    return '';
  }
}

function calculateCosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}