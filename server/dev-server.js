import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';

// Initialize environment and dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3004;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize embeddings as null
let embeddings = null;

// Function to load embeddings
function loadEmbeddings() {
  try {
    const dataPath = path.join(__dirname, 'data', 'embeddings.json');
    console.log('Looking for embeddings at:', dataPath);

    if (fs.existsSync(dataPath)) {
      console.log('Found embeddings file');
      const rawData = fs.readFileSync(dataPath, 'utf8');
      console.log('File read successfully, parsing JSON...');
      embeddings = JSON.parse(rawData);
      console.log(`Loaded ${embeddings.length} embeddings successfully`);
    } else {
      console.error('No embeddings file found at:', dataPath);
    }
  } catch (error) {
    console.error('Error loading embeddings:', error);
  }
}

// Load embeddings on startup
loadEmbeddings();

// Security middleware with development-friendly settings
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3004'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio API Server (Development)',
    version: '1.0.0',
    endpoints: [
      '/api/status - Get server status',
      '/api/chat - Chat with the portfolio bot'
    ]
  });
});

// Basic status endpoint with error handling
app.get('/api/status', (req, res) => {
  try {
    res.json({
      status: 'online',
      embeddings: embeddings ? 'loaded' : 'not loaded',
      embeddingsCount: embeddings ? embeddings.length : 0,
      environment: 'development',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in status endpoint:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Function to calculate cosine similarity
function calculateCosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}

// Function to get relevant context with sources
function getRelevantContext(questionEmbedding) {
  if (!embeddings) {
    return {
      context: '',
      sources: []
    };
  }

  const similarities = embeddings.map(entry => ({
    text: entry.text,
    source: entry.source,
    similarity: calculateCosineSimilarity(questionEmbedding, entry.embedding)
  }));

  const topResults = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  const sources = [...new Set(topResults
    .map(result => result.source.replace('.jsx', ''))
    .filter(source => source))];

  return {
    context: topResults.map(result => result.text).join('\n\n'),
    sources
  };
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!embeddings) {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Embeddings not loaded. Please try again later.'
      });
    }

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });

    const { context, sources } = getRelevantContext(embeddingResponse.data[0].embedding);

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant focused on providing information about Angel's portfolio website content. Your responses should be based strictly on the provided context.

Context from sections [${sources.join(', ')}]:
${context}

Guidelines:
- Base your responses only on the above context from Angel's portfolio
- When appropriate, mention which section contains the information you're referencing
- Keep responses concise and factual
- If you can't find relevant information in the context, say "I don't have that specific information in the portfolio content"
- Don't make assumptions beyond what's explicitly stated in the context
- Direct users to specific sections when they ask about related topics`,
        },
        { role: 'user', content: message },
      ],
      temperature: 0.5,
    });

    res.json({ response: chatResponse.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Development server running on http://localhost:${port}`);
});