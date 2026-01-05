/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Readiness Check Endpoint
 */
import { NextResponse } from 'next/server'

export async function GET() {
    const checks = {
        database: false,
        stripe: false,
        nextauth: false,
    }

    try {
        // Check database
        const { prisma } = await import('@/lib/prisma')
        await prisma.$queryRaw`SELECT 1`
        checks.database = true
    } catch (error) {
        console.error('Database check failed:', error)
    }

    // Check Stripe
    if (process.env.STRIPE_SECRET_KEY) {
        checks.stripe = true
    }

    // Check NextAuth
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL) {
        checks.nextauth = true
    }

    const allReady = Object.values(checks).every(check => check === true)

    return NextResponse.json({
        ready: allReady,
        checks,
        timestamp: new Date().toISOString(),
    }, { status: allReady ? 200 : 503 })
}
