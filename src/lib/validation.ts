/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Request Validation Utilities
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

export function validateRequest<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: NextResponse } {
    try {
        // This is a placeholder - actual implementation depends on request type
        // For POST requests, you'd parse the body
        // For GET requests, you'd parse query params
        return { success: false, error: NextResponse.json({ error: 'Validation not implemented for this request type' }, { status: 400 }) }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: NextResponse.json(
                    {
                        error: 'Validation failed',
                        details: error.errors
                    },
                    { status: 400 }
                )
            }
        }
        return {
            success: false,
            error: NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            )
        }
    }
}

export async function validateJsonBody<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
    try {
        const body = await request.json()
        const data = schema.parse(body)
        return { success: true, data }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: NextResponse.json(
                    {
                        error: 'Validation failed',
                        details: error.errors.map(e => ({
                            path: e.path.join('.'),
                            message: e.message
                        }))
                    },
                    { status: 400 }
                )
            }
        }
        return {
            success: false,
            error: NextResponse.json(
                { error: 'Invalid JSON' },
                { status: 400 }
            )
        }
    }
}

export function validateQueryParams<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: NextResponse } {
    try {
        const url = new URL(request.url)
        const params: Record<string, string> = {}
        url.searchParams.forEach((value, key) => {
            params[key] = value
        })
        const data = schema.parse(params)
        return { success: true, data }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: NextResponse.json(
                    {
                        error: 'Invalid query parameters',
                        details: error.errors.map(e => ({
                            path: e.path.join('.'),
                            message: e.message
                        }))
                    },
                    { status: 400 }
                )
            }
        }
        return {
            success: false,
            error: NextResponse.json(
                { error: 'Invalid query parameters' },
                { status: 400 }
            )
        }
    }
}

// Common validation schemas
export const paginationSchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 20),
})

export const idSchema = z.object({
    id: z.string().min(1, 'ID is required'),
})
