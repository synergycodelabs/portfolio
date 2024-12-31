// controllers/chatController.js
import openai from '../config/openaiClient.js';
import { embeddings } from '../utils/embeddingsLoader.js';
import { getRelevantContext } from '../utils/contextRetrieval.js';

export async function postChat(req, res) {
  try {
    const { message } = req.body;

    if (!embeddings) {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Embeddings not loaded. Please try again later.'
      });
    }

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });

    const { context, sources } = getRelevantContext(embeddingResponse.data[0].embedding);

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant focused on providing information about Angel's portfolio website content. Your responses should be based strictly on the provided context.

Context from sections [${sources.join(', ')}]:
${context}

Guidelines:
- Base your responses only on the above context from Angel's portfolio
- When appropriate, mention which section contains the information you're referencing
- Keep responses concise and factual
- If you can't find relevant information in the context, say "I don't have that specific information in the portfolio content"
- Don't make assumptions beyond what's explicitly stated in the context
- Direct users to specific sections when they ask about related topics`,
        },
        { role: 'user', content: message },
      ],
      temperature: 0.5,
    });

    res.json({ response: chatResponse.choices[0].message.content });
  } catch (error) {
    console.error('Error in /api/chat route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}