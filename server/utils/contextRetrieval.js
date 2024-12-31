// utils/contextRetrieval.js
import { embeddings } from './embeddingsLoader.js';
import { calculateCosineSimilarity } from './cosineSimilarity.js';

export function getRelevantContext(questionEmbedding) {
  // If no embeddings are loaded, return safely
  if (!embeddings) {
    return {
      context: '',
      sources: []
    };
  }

  const similarities = embeddings.map(entry => ({
    text: entry.text,
    source: entry.source,
    similarity: calculateCosineSimilarity(questionEmbedding, entry.embedding)
  }));

  // Sort by similarity, descending, then take the top 3
  const topResults = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  const sources = [...new Set(
    topResults
      .map(result => result.source.replace('.jsx', ''))
      .filter(Boolean)
  )];

  return {
    context: topResults.map(result => result.text).join('\n\n'),
    sources
  };
}