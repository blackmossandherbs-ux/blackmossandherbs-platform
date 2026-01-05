/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Rate Limiting Utility
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface RateLimitStore {
    [key: string]: {
        count: number
        resetTime: number
    }
}

const store: RateLimitStore = {}

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
            delete store[key]
        }
    })
}, 5 * 60 * 1000)

export function rateLimit(
    request: NextRequest,
    limit: number = 100,
    windowMs: number = 60 * 1000 // 1 minute default
): { success: boolean; remaining: number; resetTime: number } {
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'

    const now = Date.now()
    const key = `rate_limit_${ip}`

    if (!store[key] || store[key].resetTime < now) {
        store[key] = {
            count: 1,
            resetTime: now + windowMs
        }
        return {
            success: true,
            remaining: limit - 1,
            resetTime: store[key].resetTime
        }
    }

    if (store[key].count >= limit) {
        return {
            success: false,
            remaining: 0,
            resetTime: store[key].resetTime
        }
    }

    store[key].count++
    return {
        success: true,
        remaining: limit - store[key].count,
        resetTime: store[key].resetTime
    }
}

export function rateLimitMiddleware(
    limit: number = 100,
    windowMs: number = 60 * 1000
) {
    return (request: NextRequest) => {
        const result = rateLimit(request, limit, windowMs)
        
        if (!result.success) {
            return NextResponse.json(
                { 
                    error: 'Too many requests',
                    message: 'Rate limit exceeded. Please try again later.',
                    retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
                },
                { 
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': result.remaining.toString(),
                        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
                        'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
                    }
                }
            )
        }

        return null
    }
}
