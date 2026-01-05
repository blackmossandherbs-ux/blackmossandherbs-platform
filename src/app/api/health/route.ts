/**
 * Health Check Endpoint
 * Enterprise-grade health monitoring for load balancers and orchestration
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    app: {
      status: 'up';
      memory: {
        used: number;
        total: number;
        percentage: number;
      };
    };
  };
}

export async function GET() {
  const startTime = Date.now();
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  // Check database connection
  let dbStatus: 'up' | 'down' = 'down';
  let dbResponseTime: number | undefined;
  let dbError: string | undefined;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbResponseTime = Date.now() - dbStart;
    dbStatus = 'up';

    // Database is slow
    if (dbResponseTime > 1000) {
      status = 'degraded';
    }
  } catch (error) {
    dbStatus = 'down';
    dbError = error instanceof Error ? error.message : 'Unknown error';
    status = 'unhealthy';
  }

  // Get memory usage
  const memUsage = process.memoryUsage();
  const memUsed = Math.round(memUsage.heapUsed / 1024 / 1024);
  const memTotal = Math.round(memUsage.heapTotal / 1024 / 1024);
  const memPercentage = Math.round((memUsed / memTotal) * 100);

  // High memory usage warning
  if (memPercentage > 90) {
    status = status === 'healthy' ? 'degraded' : status;
  }

  const healthStatus: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
        ...(dbError && { error: dbError }),
      },
      app: {
        status: 'up',
        memory: {
          used: memUsed,
          total: memTotal,
          percentage: memPercentage,
        },
      },
    },
  };

  // Return appropriate status code
  const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

  return NextResponse.json(healthStatus, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

// Simple readiness check
export async function HEAD() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
