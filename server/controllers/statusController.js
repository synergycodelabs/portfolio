// controllers/statusController.js
import path from 'path';
import { fileURLToPath } from 'url';
import { embeddings } from '../utils/embeddingsLoader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getStatus(req, res) {
  try {
    const statusResponse = {
      status: 'online',
      embeddings: embeddings ? 'loaded' : 'not loaded',
      embeddingsCount: embeddings ? embeddings.length : 0,
      currentPath: __dirname,
      dataPath: path.join(__dirname, '..', 'data', 'embeddings.json'),
      timestamp: new Date().toISOString()
    };
    console.log('Status response:', statusResponse);
    res.json(statusResponse);
  } catch (error) {
    console.error('Error in status endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}