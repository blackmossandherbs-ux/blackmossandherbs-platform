/**
 * Internal linking utilities for SEO
 */

export interface InternalLink {
  url: string;
  anchor: string;
  title: string;
  description?: string;
}

/**
 * Generate internal links for a page
 */
export function generateInternalLinks(context: {
  type: "product" | "article" | "video" | "page";
  currentSlug: string;
  relatedIds?: string[];
}): InternalLink[] {
  // This would fetch related content from database
  // For now, return empty array - implement based on your needs
  return [];
}

/**
 * Add internal links to content
 */
export function addInternalLinks(content: string, links: InternalLink[]): string {
  let enhancedContent = content;

  links.forEach((link) => {
    const regex = new RegExp(`\\b${link.anchor}\\b`, "gi");
    enhancedContent = enhancedContent.replace(
      regex,
      `<a href="${link.url}" title="${link.title}" class="internal-link">${link.anchor}</a>`
    );
  });

  return enhancedContent;
}

/**
 * Generate related content links
 */
export async function getRelatedContent(
  type: "product" | "article" | "video",
  currentId: string,
  limit: number = 3
) {
  const { prisma } = await import("@/lib/db");

  switch (type) {
    case "product":
      // Get products from same category
      const product = await prisma.product.findUnique({
        where: { id: currentId },
        include: { categories: true },
      });
      if (product && product.categories.length > 0) {
        return prisma.product.findMany({
          where: {
            id: { not: currentId },
            status: "ACTIVE",
            categories: { some: { id: product.categories[0].id } },
          },
          take: limit,
        });
      }
      break;

    case "article":
      const article = await prisma.content.findUnique({
        where: { id: currentId },
        include: { categories: true, tags: true },
      });
      if (article) {
        return prisma.content.findMany({
          where: {
            id: { not: currentId },
            status: "PUBLISHED",
            OR: [
              { categories: { some: { id: { in: article.categories.map((c) => c.id) } } } },
              { tags: { some: { id: { in: article.tags.map((t) => t.id) } } } },
            ],
          },
          take: limit,
        });
      }
      break;
  }

  return [];
}
