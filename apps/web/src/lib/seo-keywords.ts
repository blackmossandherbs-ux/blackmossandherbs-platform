/**
 * SEO Keywords extraction and optimization
 */

export function extractKeywords(text: string, limit: number = 10): string[] {
  // Simple keyword extraction (in production, use NLP library)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const stopWords = new Set([
    "the",
    "and",
    "for",
    "are",
    "but",
    "not",
    "you",
    "all",
    "can",
    "her",
    "was",
    "one",
    "our",
    "out",
    "day",
    "get",
    "has",
    "him",
    "his",
    "how",
    "its",
    "may",
    "new",
    "now",
    "old",
    "see",
    "two",
    "way",
    "who",
    "boy",
    "did",
    "use",
  ]);

  const wordFreq: Record<string, number> = {};
  words.forEach((word) => {
    if (!stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  return Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([word]) => word);
}

export function generateProductKeywords(product: {
  name: string;
  description: string;
  categories: Array<{ name: string }>;
  tags: Array<{ name: string }>;
}): string[] {
  const keywords = new Set<string>();

  // Add category names
  product.categories.forEach((cat) => keywords.add(cat.name.toLowerCase()));

  // Add tag names
  product.tags.forEach((tag) => keywords.add(tag.name.toLowerCase()));

  // Extract from name
  product.name
    .toLowerCase()
    .split(/\s+/)
    .forEach((word) => {
      if (word.length > 3) keywords.add(word);
    });

  // Extract from description
  const descKeywords = extractKeywords(product.description, 5);
  descKeywords.forEach((kw) => keywords.add(kw));

  // Add common wellness keywords
  keywords.add("herbal");
  keywords.add("wellness");
  keywords.add("natural");
  keywords.add("health");

  return Array.from(keywords).slice(0, 15);
}

export function generateArticleKeywords(article: {
  title: string;
  description: string;
  categories: Array<{ name: string }>;
  tags: Array<{ name: string }>;
}): string[] {
  const keywords = new Set<string>();

  // Add category names
  article.categories.forEach((cat) => keywords.add(cat.name.toLowerCase()));

  // Add tag names
  article.tags.forEach((tag) => keywords.add(tag.name.toLowerCase()));

  // Extract from title
  article.title
    .toLowerCase()
    .split(/\s+/)
    .forEach((word) => {
      if (word.length > 3) keywords.add(word);
    });

  // Extract from description
  const descKeywords = extractKeywords(article.description, 5);
  descKeywords.forEach((kw) => keywords.add(kw));

  // Add common blog keywords
  keywords.add("wellness");
  keywords.add("herbal");
  keywords.add("health");
  keywords.add("guide");

  return Array.from(keywords).slice(0, 15);
}
