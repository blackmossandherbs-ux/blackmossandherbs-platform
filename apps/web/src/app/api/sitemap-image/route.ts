import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com";

  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", featuredImage: { not: null } },
    select: { slug: true, featuredImage: true, name: true },
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${products
    .map(
      (product) => `
  <url>
    <loc>${baseUrl}/shop/${product.slug}</loc>
    <image:image>
      <image:loc>${baseUrl}${product.featuredImage}</image:loc>
      <image:title><![CDATA[${product.name}]]></image:title>
      <image:caption><![CDATA[${product.name} - Premium Herbal Product]]></image:caption>
    </image:image>
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
