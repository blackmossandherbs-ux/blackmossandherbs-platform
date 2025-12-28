import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().optional(),
  context: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { message, sessionId, context } = chatSchema.parse(body);

    // Get user's product history for context
    const userContext = session?.user?.id
      ? await getUserContext(session.user.id)
      : {};

    const response = await aiOrchestrator.route({
      prompt: message,
      userId: session?.user?.id,
      sessionId: sessionId || `anon-${Date.now()}`,
      context: { ...userContext, ...context },
    });

    return NextResponse.json({
      response: response.content,
      provider: response.provider,
      cached: response.cached,
    });
  } catch (error: any) {
    console.error("AI chat error:", error);
    if (error.message.includes("quota")) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    return NextResponse.json({ error: error.message || "AI request failed" }, { status: 500 });
  }
}

async function getUserContext(userId: string) {
  const { prisma } = await import("@/lib/db");

  const [orders, downloads, consultations] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.download.findMany({
      where: { userId },
      include: { product: true },
      take: 5,
    }),
    prisma.consultation.findMany({
      where: { customerId: userId },
      take: 3,
    }),
  ]);

  return {
    recentOrders: orders.map((o) => ({
      products: o.items.map((i) => i.product.name),
    })),
    recentDownloads: downloads.map((d) => d.product.name),
    consultations: consultations.length,
  };
}
