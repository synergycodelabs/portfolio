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
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3001',
  ALLOWED_ORIGINS: process.env.NODE_ENV === 'production' 
    ? [
        'https://synergycodelabs.github.io',
        'https://www.synergycodelabs.github.io',
        'https://angel.synergycodelabs.com',
        'http://localhost:3001',
        'http://localhost:3003'
      ]
    : ['http://localhost:3001', 'http://localhost:3003'],

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