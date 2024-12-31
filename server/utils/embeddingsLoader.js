// utils/embeddingsLoader.js
import fs from 'fs';
import path from 'path';

// We'll store embeddings in a local variable, 
// and export it so other modules can access it.
export let embeddings = null;

export function loadEmbeddings(baseDir) {
  try {
    const dataPath = path.join(baseDir, 'data', 'embeddings.json');
    console.log('Looking for embeddings at:', dataPath);

    if (fs.existsSync(dataPath)) {
      console.log('Found embeddings file');
      const rawData = fs.readFileSync(dataPath, 'utf8');
      console.log('File read successfully, parsing JSON...');
      embeddings = JSON.parse(rawData);
      console.log(`Loaded ${embeddings.length} embeddings successfully`);
    } else {
      console.error('No embeddings file found at:', dataPath);
      console.error('Current directory:', baseDir);
      try {
        console.error('Directory contents:', fs.readdirSync(path.join(baseDir, 'data')));
      } catch (err) {
        console.error('Could not read data directory:', err.message);
      }
    }
  } catch (error) {
    console.error('Error loading embeddings:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
  }
}