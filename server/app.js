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
  
  // Security middleware with environment-specific settings
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
 
  // Body parser
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
        '/api/chat - Chat with the portfolio bot'
      ]
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
      message: environment.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
  });
  
  export default app;