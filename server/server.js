// server/server.js
import http from 'http';
import app from './app.js';
import environment from './config/environment.js';
import logger from './utils/logger.js';

// Development CORS settings
if (environment.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });
}

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