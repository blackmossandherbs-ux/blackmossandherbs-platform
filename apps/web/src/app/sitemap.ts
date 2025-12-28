import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/consultations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Products
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true, updatedAt: true },
  });

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog posts
  const posts = await prisma.content.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true, publishedAt: true },
  });

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Videos
  const videos = await prisma.video.findMany({
    where: { publishedAt: { not: null } },
    select: { slug: true, updatedAt: true },
  });

  const videoPages: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${baseUrl}/videos/${video.slug}`,
    lastModified: video.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...blogPages, ...videoPages];
}
