/**
 * Black Moss & Herbs Platform - API Authorization Guards
 *
 * The route matcher in src/middleware.ts deliberately excludes /api, so API
 * routes must enforce their own authentication. These helpers gate admin-only
 * and authenticated endpoints.
 */
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Returns a 401/403 NextResponse if the caller is not an authenticated admin,
 * or null if the request may proceed.
 *
 * Usage:
 *   const denied = await requireAdmin()
 *   if (denied) return denied
 */
export async function requireAdmin(): Promise<NextResponse | null> {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 })
    }

    return null
}

/**
 * Returns the authenticated session, or a 401 NextResponse if unauthenticated.
 */
export async function requireUser() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return { session: null, denied: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) }
    }
    return { session, denied: null as NextResponse | null }
}
