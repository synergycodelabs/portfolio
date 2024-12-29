import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import helmet from 'helmet';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const httpsPort = process.env.HTTPS_PORT || 3003;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// SSL configuration
// Remove or comment out these lines at the top
// const sslOptions = {
//   key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
//   cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt'))
// };

// Initialize embeddings as null
let embeddings = null;

// Function to load embeddings
function loadEmbeddings() {
  try {
    const dataPath = path.join(__dirname, 'data', 'embeddings.json');
    console.log('Looking for embeddings at:', dataPath);

    if (fs.existsSync(dataPath)) {
      console.log('Found embeddings file');
      embeddings = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      console.log(`Loaded ${embeddings.length} embeddings successfully`);
    } else {
      console.log('No embeddings file found at:', dataPath);
      console.log('Please run generate-embeddings.js first');
    }
  } catch (error) {
    console.error('Error loading embeddings:', error);
  }
}

// Load embeddings on startup
loadEmbeddings();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "blob:", "data:"],
      connectSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3001',
  'https://synergycodelabs.github.io',
  'http://72.79.21.7:8443',
  'https://72.79.21.7:8444'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Add security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json());

// Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
  });
}

// Rate limiting - basic implementation
const rateLimit = {};
const WINDOW_SIZE_IN_HOURS = 24;
const MAX_REQUESTS_PER_WINDOW = 100;

app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!rateLimit[ip]) {
    rateLimit[ip] = {
      count: 0,
      firstRequest: now
    };
  }

  // Reset counter if window has passed
  if (now - rateLimit[ip].firstRequest > WINDOW_SIZE_IN_HOURS * 60 * 60 * 1000) {
    rateLimit[ip] = {
      count: 0,
      firstRequest: now
    };
  }

  rateLimit[ip].count++;

  if (rateLimit[ip].count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.'
    });
  }

  next();
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

// Endpoint to check server status and embeddings
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    embeddings: embeddings ? 'loaded' : 'not loaded',
    embeddingsCount: embeddings ? embeddings.length : 0,
    secure: req.secure
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!embeddings) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'I am temporarily unavailable. Please try again later when the content has been loaded.',
          },
          { role: 'user', content: message },
        ],
      });

      return res.json({ response: response.choices[0].message.content });
    }

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });

    const { context, sources } = getRelevantContext(embeddingResponse.data[0].embedding);

    const chatResponse = await openai.chat.completions.create({
      model: 'ft:gpt-4o-mini-2024-07-18:aplusg:portfolio-bot-v1:AjLmxhRS',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant focused on providing information about Angel's portfolio website content. Your responses should be based strictly on the provided context.

Context from sections [${sources.join(', ')}]:
${context}

Guidelines:
- Base your responses only on the above context from Angel's portfolio
- When appropriate, mention which section (${sources.join(', ')}) contains the information you're referencing
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

// Create HTTPS server
// const httpsServer = https.createServer(sslOptions, app);

// Start both HTTP and HTTPS servers
app.listen(port, () => {
  console.log(`HTTP Server running on port ${port}`);
  console.log(`Check HTTP status at http://localhost:${port}/api/status`);
});

// httpsServer.listen(httpsPort, () => {
//   console.log(`HTTPS Server running on port ${httpsPort}`);
//   console.log(`Check HTTPS status at https://localhost:${httpsPort}/api/status`);
// });