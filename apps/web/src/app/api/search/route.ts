import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().min(1).max(100),
  type: z.enum(["products", "content", "videos", "all"]).default("all"),
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { q, type, limit, offset } = searchSchema.parse({
      q: searchParams.get("q"),
      type: searchParams.get("type"),
      limit: searchParams.get("limit"),
      offset: searchParams.get("offset"),
    });

    const searchTerm = `%${q}%`;
    const results: any = {
      products: [],
      content: [],
      videos: [],
      total: 0,
    };

    // Search products
    if (type === "all" || type === "products") {
      const products = await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { shortDescription: { contains: q, mode: "insensitive" } },
          ],
        },
        include: {
          variants: { take: 1 },
          categories: true,
        },
        take: limit,
        skip: offset,
      });
      results.products = products;
    }

    // Search content
    if (type === "all" || type === "content") {
      const content = await prisma.content.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        },
        include: {
          categories: true,
        },
        take: limit,
        skip: offset,
      });
      results.content = content;
    }

    // Search videos
    if (type === "all" || type === "videos") {
      const videos = await prisma.video.findMany({
        where: {
          publishedAt: { not: null },
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { transcript: { contains: q, mode: "insensitive" } },
          ],
        },
        include: {
          series: true,
        },
        take: limit,
        skip: offset,
      });
      results.videos = videos;
    }

    results.total =
      results.products.length + results.content.length + results.videos.length;

    return NextResponse.json(results);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid search parameters", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}
