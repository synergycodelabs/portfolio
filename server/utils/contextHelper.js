// File: server/utils/contextHelper.js

export function getRelevantContext(questionEmbedding, embeddings) {
  if (!embeddings) {
    return {
      context: '',
      sources: []
    };
  }

  // Calculate similarities and include sources
  const similarities = embeddings.map(entry => ({
    text: entry.text,
    source: entry.source,
    similarity: calculateCosineSimilarity(questionEmbedding, entry.embedding)
  }));

  // Sort by similarity and get top chunks
  const topResults = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  // Extract sources without file extensions and duplicates
  const sources = [...new Set(topResults
    .map(result => result.source.replace('.jsx', ''))
    .filter(source => source))];

  return {
    context: topResults.map(result => result.text).join('\n\n'),
    sources
  };
}

function calculateCosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}