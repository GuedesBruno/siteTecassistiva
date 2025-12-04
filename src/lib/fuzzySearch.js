/**
 * Calcula a distância de Levenshtein entre duas strings
 * Útil para detectar typos e variações de escrita
 */
export function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[len2][len1];
}

/**
 * Calcula a similaridade entre duas strings (0 a 1)
 * 1 = idêntico, 0 = completamente diferente
 */
export function calculateSimilarity(str1, str2) {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - distance / maxLength;
}

/**
 * Busca fuzzy que encontra itens mesmo com typos/variações
 * Retorna array ordenado por relevância
 */
export function fuzzySearch(query, items, options = {}) {
  const {
    keys = ['title', 'description', 'content'],
    threshold = 0.5, // Mínima similaridade aceitável (0-1)
    maxResults = 50,
  } = options;

  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase();
  const results = [];

  items.forEach(item => {
    let bestScore = 0;
    let matchedKey = null;

    // Testa cada chave para encontrar a melhor correspondência
    keys.forEach(key => {
      const value = item[key];
      if (!value) return;

      const normalizedValue = String(value).toLowerCase();

      // 1. Busca exata (maior prioridade)
      if (normalizedValue.includes(normalizedQuery)) {
        bestScore = 1.0;
        matchedKey = key;
        return;
      }

      // 2. Busca por palavras individuais
      const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
      const valueWords = normalizedValue.split(/\s+/).filter(w => w.length > 0);

      let matchedQueryWords = 0;
      queryWords.forEach(qWord => {
        // Verifica se a palavra da busca existe no texto (parcialmente)
        // Apenas vWord.includes(qWord) é válido (ex: "cadeira" acha "cadeiras")
        if (valueWords.some(vWord => vWord.includes(qWord))) {
          matchedQueryWords++;
        }
      });

      const wordMatchScore = matchedQueryWords / Math.max(queryWords.length, 1);

      // 3. Busca fuzzy por proximidade
      const fuzzyScore = calculateSimilarity(normalizedQuery, normalizedValue);

      // Usa o melhor score entre palavra e fuzzy
      const score = Math.max(wordMatchScore, fuzzyScore);

      if (score > bestScore) {
        bestScore = score;
        matchedKey = key;
      }
    });

    // Adiciona ao resultado se passar no threshold
    if (bestScore >= threshold) {
      results.push({
        ...item,
        score: bestScore,
        matchedKey: matchedKey,
      });
    }
  });

  // Ordena por relevância (score mais alto primeiro)
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(({ score, matchedKey, ...item }) => item);
}

/**
 * Realiza busca híbrida: primeiro exata, depois fuzzy
 */
export function hybridSearch(query, items, options = {}) {
  const {
    keys = ['title', 'description', 'content'],
    exactThreshold = 0.8, // Se encontrar com 80%+ de similiaridade, consideramos exato
    fuzzyThreshold = 0.5,
    maxResults = 50,
  } = options;

  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase();
  const results = [];
  const seen = new Set();

  items.forEach(item => {
    if (seen.has(item.id)) return;

    let bestScore = 0;
    let matchType = 'none'; // 'exact', 'fuzzy', 'none'

    keys.forEach(key => {
      const value = item[key];
      if (!value) return;

      const normalizedValue = String(value).toLowerCase();

      // Busca exata - máxima prioridade
      if (normalizedValue.includes(normalizedQuery)) {
        bestScore = 1.0;
        matchType = 'exact';
        return;
      }

      // Busca por palavras
      const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
      const valueWords = normalizedValue.split(/\s+/).filter(w => w.length > 0);

      let matchedQueryWords = 0;
      queryWords.forEach(qWord => {
        // Verifica se a palavra da busca existe no texto (parcialmente)
        // Apenas vWord.includes(qWord) é válido (ex: "cadeira" acha "cadeiras")
        // qWord.includes(vWord) causava falsos positivos (ex: "cadeira" achava "a")
        if (valueWords.some(vWord => vWord.includes(qWord))) {
          matchedQueryWords++;
        }
      });

      const wordMatchScore = matchedQueryWords / Math.max(queryWords.length, 1);

      // Busca fuzzy
      const fuzzyScore = calculateSimilarity(normalizedQuery, normalizedValue);
      const finalScore = Math.max(wordMatchScore, fuzzyScore);

      if (finalScore > bestScore) {
        bestScore = finalScore;
        matchType = finalScore >= exactThreshold ? 'exact' : 'fuzzy';
      }
    });

    // Adiciona se passou no threshold apropriado
    const threshold = matchType === 'exact' ? exactThreshold : fuzzyThreshold;
    if (bestScore >= threshold) {
      results.push({
        ...item,
        score: bestScore,
        matchType: matchType,
      });
      seen.add(item.id);
    }
  });

  // Ordena: exatos primeiro, depois por score
  return results
    .sort((a, b) => {
      // Prioriza exatos
      if (a.matchType === 'exact' && b.matchType !== 'exact') return -1;
      if (a.matchType !== 'exact' && b.matchType === 'exact') return 1;
      // Depois por score
      return b.score - a.score;
    })
    .slice(0, maxResults)
    .map(({ score, matchType, ...item }) => item);
}
