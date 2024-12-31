import http from 'http';
  import app from './app.js';
  import environment from './config/environment.js';
  import logger from './utils/logger.js';
  
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