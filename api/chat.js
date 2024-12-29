import { OpenAI } from 'openai';
import { createClient } from '@vercel/kv';
import { json } from '@vercel/node';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize KV storage for embeddings
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    // Get embedding for the user's question
    const questionEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });

    // Get relevant context from KV store
    const context = await getRelevantContext(questionEmbedding.data[0].embedding);

    // Generate chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for Angel's portfolio website. Use the following context to answer questions about Angel's experience, projects, and skills: ${context}`,
        },
        { role: "user", content: message },
      ],
    });

    return res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getRelevantContext(questionEmbedding) {
  // Get all embeddings from KV store
  const embeddings = await kv.get('embeddings');
  
  if (!embeddings) {
    return '';
  }

  // Calculate cosine similarity and get most relevant chunks
  const similarities = embeddings.map(entry => ({
    text: entry.text,
    similarity: calculateCosineSimilarity(questionEmbedding, entry.embedding),
  }));

  // Sort by similarity and get top 3 chunks
  const topChunks = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map(chunk => chunk.text);

  return topChunks.join('\n\n');
}

function calculateCosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}