/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Health Check Endpoint
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`
        
        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            database: 'connected',
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
            database: 'disconnected',
        }, { status: 503 })
    }
}
