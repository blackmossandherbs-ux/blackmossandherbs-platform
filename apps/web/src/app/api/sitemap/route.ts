import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com";

  const [products, posts, videos] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.content.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.video.findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/shop</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/videos</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/consultations</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  ${products
    .map(
      (product) => `
  <url>
    <loc>${baseUrl}/shop/${product.slug}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <mobile:mobile/>
  </url>`
    )
    .join("")}
  ${posts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>`
    )
    .join("")}
  ${videos
    .map(
      (video) => `
  <url>
    <loc>${baseUrl}/videos/${video.slug}</loc>
    <lastmod>${video.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
