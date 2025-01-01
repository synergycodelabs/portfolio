import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import environment from './config/environment.js';
import statusRoutes from './routes/statusRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { loadEmbeddings } from './utils/embeddingsLoader.js';
import logger from './utils/logger.js';

// Setup dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Express app
const app = express();

// Load embeddings on startup
loadEmbeddings(__dirname);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

/**
 * Very permissive CORS for *all* requests:
 * - Allows any origin
 * - Allows GET, POST, OPTIONS
 * - Allows all headers
 * You can tighten this later if needed.
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Parse JSON bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  const serverType = environment.NODE_ENV === 'production' ? 'Production' : 'Development';
  res.json({
    message: `Portfolio API Server (${serverType})`,
    version: '1.0.0',
    environment: environment.NODE_ENV,
    endpoints: [
      '/api/status - Get server status',
      '/api/chat - Chat with the portfolio bot',
    ],
  });
});

// Register routes
app.use('/api', statusRoutes);
app.use('/api', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message:
      environment.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected error occurred',
  });
});

export default app;