import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if SSL files exist
const sslFilesExist = () => {
    try {
        const keyPath = path.join(__dirname, '..', 'ssl', 'private.key');
        const certPath = path.join(__dirname, '..', 'ssl', 'certificate.crt');
        return fs.existsSync(keyPath) && fs.existsSync(certPath);
    } catch (error) {
        console.error('Error checking SSL files:', error);
        return false;
    }
};

// Determine if we should use SSL based on environment and file existence
const shouldUseSSL = process.env.NODE_ENV === 'production' && sslFilesExist();

const environment = {
    // Node environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Server ports
    PORT: process.env.PORT || 3002,
    HTTPS_PORT: process.env.HTTPS_PORT || 3003,
    
    // CORS settings
    ALLOWED_ORIGINS: process.env.NODE_ENV === 'production'
        ? (process.env.ALLOWED_ORIGINS || '').split(',').filter(origin => origin)
        : ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'],
    
    // OpenAI configuration
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    
    // Server settings
    HOST: '0.0.0.0', // Always bind to all network interfaces
    
    // SSL settings
    USE_SSL: shouldUseSSL,
    
    // Debug information
    DEBUG: process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development',
};

// Log configuration on startup
if (environment.DEBUG) {
    console.log('Environment Configuration:', {
        ...environment,
        OPENAI_API_KEY: '[REDACTED]' // Don't log sensitive information
    });
}

export default environment;