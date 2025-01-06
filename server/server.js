// server/server.js
import http from 'http';
import app from './app.js';
import environment from './config/environment.js';
import logger from './utils/logger.js';

// CORS settings for all environments
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (environment.ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Create HTTP server
const httpServer = http.createServer(app);

// Start HTTP server
httpServer.listen(environment.PORT, environment.HOST, () => {
  logger.info(`Server running on ${environment.HOST}:${environment.PORT}`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
    httpServer.close(() => {
        logger.info('Server closed');
    });

    // Give processes 10 seconds to close gracefully
    setTimeout(() => {
        process.exit(0);
    }, 10000);
};

// Handle termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);