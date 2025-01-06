// server/server.js
import http from 'http';
import https from 'https';
import fs from 'fs';
import app from './app.js';
import environment from './config/environment.js';
import logger from './utils/logger.js';

// Create HTTP server
const httpServer = http.createServer(app);

// Try to create HTTPS server if certificates exist
let httpsServer;
// server/server.js - Update SSL configuration
try {
  logger.info('SSL Setup: Starting...');
  const certPath = '/etc/letsencrypt/live/api.synergycodelabs.com/fullchain.pem';
  const keyPath = '/etc/letsencrypt/live/api.synergycodelabs.com/privkey.pem';

  // Read files with explicit encoding
  const cert = fs.readFileSync(certPath, 'utf8');
  const key = fs.readFileSync(keyPath, 'utf8');

  logger.info('SSL Setup: Files read successfully');
  
  const sslOptions = { cert, key };
  httpsServer = https.createServer(sslOptions, app);
  logger.info('SSL Setup: HTTPS server created');

} catch (error) {
  logger.error('SSL Setup Failed:', {
    error: error.message,
    stack: error.stack
  });
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