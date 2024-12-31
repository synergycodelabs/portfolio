import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const environment = {
    // Node environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Server port
    PORT: process.env.PORT || 3002,
    
    // CORS settings
    ALLOWED_ORIGINS: process.env.NODE_ENV === 'production'
        ? [
            'https://synergycodelabs.github.io',
            'https://api.synergycodelabs.com'
          ]
        : ['http://localhost:3001', 'http://localhost:3002'],
    
    // OpenAI configuration
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    
    // Server settings
    HOST: '0.0.0.0',
    
    // Debug information
    DEBUG: process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development',
};

// Log configuration on startup
if (environment.DEBUG) {
    console.log('Environment Configuration:', {
        ...environment,
        OPENAI_API_KEY: '[REDACTED]'
    });
}

export default environment;