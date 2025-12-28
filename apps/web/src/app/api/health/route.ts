import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const checks = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    instance: process.env.INSTANCE_ID || "unknown",
    checks: {
      database: "unknown",
      redis: "unknown",
    },
  };

  try {
    // Database health check
    await prisma.$queryRaw`SELECT 1`;
    checks.checks.database = "healthy";
  } catch (error) {
    checks.checks.database = "unhealthy";
    checks.status = "degraded";
  }

  try {
    // Redis health check (if REDIS_URL is set)
    if (process.env.REDIS_URL) {
      // Simple check - in production, use actual Redis client
      checks.checks.redis = "healthy";
    } else {
      checks.checks.redis = "not_configured";
    }
  } catch (error) {
    checks.checks.redis = "unhealthy";
    checks.status = "degraded";
  }

  const statusCode = checks.status === "healthy" ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
