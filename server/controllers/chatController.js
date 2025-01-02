// controllers/chatController.js
import openai from '../config/openaiClient.js';
import { embeddings } from '../utils/embeddingsLoader.js';
import { getRelevantContext } from '../utils/contextRetrieval.js';
import { PORTFOLIO_SECTIONS, SECTION_PROMPTS } from '../config/portfolioSections.js';

/**
 * Handle chat message requests and generate contextual responses
 * about Angel's portfolio
 */
export async function postChat(req, res) {
  try {
    const { message } = req.body;

    // Validate embeddings availability
    if (!embeddings) {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Embeddings not loaded. Please try again later.'
      });
    }

    // Generate embeddings for the user's message
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });

    // Get relevant context based on message similarity
    const { context, sources } = getRelevantContext(embeddingResponse.data[0].embedding);

    // Identify most relevant section for contextual intro
    const primarySection = sources[0]?.split('/').pop().replace('.jsx', '').toUpperCase();
    const sectionIntro = primarySection && SECTION_PROMPTS[primarySection] 
      ? `\
${SECTION_PROMPTS[primarySection]}\
` 
      : '';

    // Generate chat response with enhanced context
    const chatResponse = await openai.chat.completions.create({
      model: 'ft:gpt-4o-mini-2024-07-18:aplusg:portfolio-bot-v1:AjLmxhRS',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant focused on providing information about Angel's portfolio website content. Your responses should be based strictly on the provided context.

Context from sections [${sources.join(', ')}]:${sectionIntro}${context}

Guidelines:
- Greetings are allowed when customer greets or say something like Hi or Hello
- Base your responses only on the above context from Angel's portfolio
- When appropriate, mention which section contains the information you're referencing
- Keep responses concise and factual
- If you can't find relevant information in the context, say \"I don't have that specific information in the portfolio content\"
- Don't make assumptions beyond what's explicitly stated in the context
- Direct users to specific sections when they ask about related topics`,
        },
        { role: 'user', content: message },
      ],
      temperature: 0.5,
    });

    // Return response with section information
    res.json({ 
      response: chatResponse.choices[0].message.content,
      section: primarySection ? PORTFOLIO_SECTIONS[primarySection] : null
    });
  } catch (error) {
    console.error('Error in /api/chat route:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process chat message. Please try again.'
    });
  }
}