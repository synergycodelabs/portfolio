// server/server.js
import http from 'http';
import https from 'https';
import app from './app.js';
import environment from './config/environment.js';
import logger from './utils/logger.js';
import loadSSLConfig from './config/sslConfig.js';

console.log('Starting server with NODE_ENV:', process.env.NODE_ENV);
console.log('Environment check:', {
  isProduction: environment.isProduction(),
  NODE_ENV: environment.NODE_ENV
});

// Create HTTP server
const httpServer = http.createServer(app);

// Try to create HTTPS server if we're in production
let httpsServer;
if (environment.isProduction()) {
  console.log('Attempting SSL setup in production mode...');
  try {
    logger.info('SSL Setup: Starting...');
    
    // Load SSL configuration using the new method
    const sslOptions = loadSSLConfig();
    
    // Log certificate status (for debugging)
    if (sslOptions.cert && sslOptions.key) {
      logger.info('SSL Setup: Certificates loaded successfully');
      console.log('Certificate length:', sslOptions.cert.length);
      console.log('Key length:', sslOptions.key.length);
    }
    
    // Create HTTPS server with the loaded configuration
    httpsServer = https.createServer(sslOptions, app);
    logger.info('SSL Setup: HTTPS server created');

  } catch (error) {
    logger.error('SSL Setup Failed:', {
      error: error.message,
      stack: error.stack
    });
  }
} else {
  console.log('Not in production mode, skipping SSL setup');
}

// Start HTTP server
httpServer.listen(environment.PORT, environment.HOST, () => {
  logger.info(`HTTP Server running on ${environment.HOST}:${environment.PORT}`);
});

// Start HTTPS server if available
if (httpsServer) {
  httpsServer.listen(48763, environment.HOST, () => {
    logger.info(`HTTPS Server running on ${environment.HOST}:48763`);
  });

  // Add error handlers for HTTPS server
  httpsServer.on('error', (error) => {
    logger.error('HTTPS Server error:', error);
  });

  httpsServer.on('secureConnection', (tlsSocket) => {
    logger.info('New secure connection established');
  });
}

// Handle graceful shutdown
const gracefulShutdown = () => {
    httpServer.close(() => {
        logger.info('HTTP Server closed');
    });

    if (httpsServer) {
        httpsServer.close(() => {
            logger.info('HTTPS Server closed');
        });
    }

    setTimeout(() => {
        process.exit(0);
    }, 10000);
};

// Handle termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);