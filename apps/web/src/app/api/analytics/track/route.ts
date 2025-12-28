import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const trackSchema = z.object({
  event: z.string(),
  properties: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Only track in production or if explicitly enabled
    if (process.env.NODE_ENV !== "production" && process.env.ANALYTICS_ENABLED !== "true") {
      return NextResponse.json({ success: true });
    }

    const body = await req.json();
    const { event, properties } = trackSchema.parse(body);

    // Store analytics events (you can use a dedicated analytics DB or service)
    // For now, we'll just log them
    console.log("Analytics Event:", event, properties);

    // In production, send to your analytics service:
    // - Google Analytics Measurement Protocol
    // - Mixpanel
    // - Amplitude
    // - Custom analytics database

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Don't fail requests if analytics fails
    console.error("Analytics error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
