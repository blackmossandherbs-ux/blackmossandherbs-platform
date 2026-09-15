/**
 * Black Moss & Herbs Platform - Mobile Bearer Token Auth
 *
 * The web app authenticates via NextAuth's session cookie. The iOS app has no
 * cookie jar shared with a browser, so it authenticates via a Bearer JWT
 * issued by /api/auth/mobile-token or /api/auth/mobile-register instead.
 * getAuthSession() lets a single route handler accept either, so mobile and
 * web clients can share the same protected API routes.
 */
import { jwtVerify } from 'jose'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export interface AuthedUser {
    id: string
    email: string
    name: string | null
    role: string
}

export async function getAuthSession(req: Request): Promise<{ user: AuthedUser } | null> {
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice('Bearer '.length)
        const secretValue = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET
        if (!secretValue) return null

        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(secretValue))
            if (!payload.id || !payload.email) return null
            return {
                user: {
                    id: payload.id as string,
                    email: payload.email as string,
                    name: (payload.name as string) ?? null,
                    role: (payload.role as string) ?? 'CUSTOMER',
                }
            }
        } catch {
            return null
        }
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session.user.email) return null
    return {
        user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name ?? null,
            role: (session.user as { role?: string }).role ?? 'CUSTOMER',
        }
    }
}
