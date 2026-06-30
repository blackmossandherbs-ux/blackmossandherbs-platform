/**
 * GDPR Article 17 — Right to erasure.
 * Permanently deletes the signed-in user's account and associated personal data.
 * Related records (orders, subscriptions, consultations, downloads, sessions)
 * are removed via onDelete: Cascade in the schema.
 */
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    const { session, denied } = await requireUser()
    if (denied) return denied

    const userId = session!.user!.id
    const email = session!.user!.email || ''

    // Require an explicit confirmation phrase to avoid accidental deletion.
    let body: any = {}
    try {
        body = await req.json()
    } catch {
        /* no body — treat as missing confirmation */
    }
    if (body?.confirm !== 'DELETE') {
        return NextResponse.json({ error: 'Please confirm account deletion.' }, { status: 400 })
    }

    try {
        // Remove marketing record (keyed by email, not FK to user).
        if (email) {
            await prisma.newsletterSubscriber.deleteMany({ where: { email } })
        }
        // Cascades to orders, order items, subscriptions, consultations, downloads, sessions, accounts.
        await prisma.user.delete({ where: { id: userId } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[user/delete] error:', error)
        return NextResponse.json({ error: 'Could not delete your account. Please contact support.' }, { status: 500 })
    }
}
