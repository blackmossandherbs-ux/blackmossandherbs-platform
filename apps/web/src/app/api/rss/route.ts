import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com";

  const posts = await prisma.content.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    },
    include: {
      categories: true,
      tags: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 50,
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
  <channel>
    <title>BlackMoss & Herbs - Wellness Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Discover premium herbal wellness insights, expert guides, and evidence-based articles on natural health and wellness.</description>
    <language>en-us</language>
    <copyright>Copyright ${new Date().getFullYear()} BlackMoss & Herbs</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${posts[0]?.publishedAt?.toUTCString() || new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>BlackMoss & Herbs</title>
      <link>${baseUrl}</link>
    </image>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${escapeXml(post.excerpt || post.description || "")}]]></description>
      <content:encoded><![CDATA[${escapeXml(post.content)}]]></content:encoded>
      <pubDate>${post.publishedAt?.toUTCString()}</pubDate>
      <dc:creator>${post.authorName || "BlackMoss & Herbs"}</dc:creator>
      ${post.categories.map((cat) => `<category><![CDATA[${escapeXml(cat.name)}]]></category>`).join("")}
      ${post.tags.map((tag) => `<category><![CDATA[${escapeXml(tag.name)}]]></category>`).join("")}
      ${post.featuredImage ? `<enclosure url="${baseUrl}${post.featuredImage}" type="image/jpeg"/>` : ""}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
