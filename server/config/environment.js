// server/config/environment.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const environment = {
  // Core settings
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3002,
  HOST: process.env.HOST || '0.0.0.0',

  // API settings
  API_VERSION: process.env.API_VERSION || '1.0.0',
  API_PREFIX: process.env.API_PREFIX || '/api',

  // CORS settings
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost',
  ALLOWED_ORIGINS: process.env.NODE_ENV === 'production'
    ? [
        'https://synergycodelabs.github.io',
        'https://www.synergycodelabs.github.io',
        'https://angel.synergycodelabs.com',
        'https://api.synergycodelabs.com',
        'https://api.synergycodelabs.com:48763'
      ]
    : [
        'http://localhost',
        'http://localhost:3001',
        'http://localhost:3003',
        'http://192.168.1.152:3001',    // Windows IP
        'http://192.168.1.152:3003',    // Windows IP - HTTP
        'https://192.168.1.152:48763',  // Windows IP - HTTPS
        'http://192.168.1.174:3001',    // WSL IP
        'https://192.168.1.174:48763',  // WSL IP - HTTPS
        'https://api.synergycodelabs.com',
        'https://api.synergycodelabs.com:48763'
    ],

  // OpenAI configuration  
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Logging & Debug
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DEBUG: process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development',
  
  // Security
  TRUST_PROXY: process.env.TRUST_PROXY === 'true',

  // Helper methods
  isDevelopment() {
    return this.NODE_ENV === 'development';
  },
  
  isProduction() {
    return this.NODE_ENV === 'production';
  }
};

// Log configuration on startup
if (environment.DEBUG) {
  console.log('Environment Configuration:', {
    ...environment,
    OPENAI_API_KEY: '[REDACTED]'
  });
}

export default environment;