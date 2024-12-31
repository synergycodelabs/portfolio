import http from 'http';
import https from 'https';
import app from './app.js';
import environment from './config/environment.js';
import sslConfig from './config/sslConfig.js';
import logger from './utils/logger.js';

// Create HTTP server
const httpServer = http.createServer(app);

// Create HTTPS server if in production
let httpsServer = null;
if (environment.USE_SSL) {
    httpsServer = https.createServer(sslConfig, app);
}

// Start HTTP server
httpServer.listen(environment.PORT, environment.HOST, () => {
    logger.info(`HTTP Server running on ${environment.HOST}:${environment.PORT}`);
    if (environment.NODE_ENV === 'development') {
        logger.info(`Development server accessible at http://${environment.HOST}:${environment.PORT}`);
    }
});

// Start HTTPS server if in production
if (httpsServer) {
    httpsServer.listen(environment.HTTPS_PORT, environment.HOST, () => {
        logger.info(`HTTPS Server running on port ${environment.HTTPS_PORT}`);
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
    
    // Give processes 10 seconds to close gracefully
    setTimeout(() => {
        process.exit(0);
    }, 10000);
};

// Handle termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);