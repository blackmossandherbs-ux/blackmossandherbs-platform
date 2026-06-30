/**
 * Black Moss & Herbs Platform - Newsletter Signup Handler
 */
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { email, consent } = await req.json()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email || !emailRegex.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
        }

        // PECR: marketing emails require explicit prior consent.
        if (consent !== true) {
            return NextResponse.json({ error: 'Please confirm your consent to receive marketing emails.' }, { status: 400 })
        }

        // Persist the subscriber with a consent timestamp (idempotent on email).
        try {
            await prisma.newsletterSubscriber.upsert({
                where: { email },
                update: { consentedAt: new Date(), source: 'website' },
                create: { email, consentedAt: new Date(), source: 'website' },
            })
        } catch (e) {
            console.error('[newsletter] could not persist subscriber:', e)
        }

        const destination = process.env.NEWSLETTER_INBOX || process.env.EMAIL_FROM

        if (process.env.EMAIL_SERVER_HOST && destination) {
            await sendEmail({
                to: destination,
                subject: 'New newsletter subscriber',
                html: `<p>New subscriber: <strong>${email}</strong></p>`,
            })
        } else {
            console.log('[newsletter] New subscriber (SMTP not configured):', email)
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[newsletter] FAILURE:', error)
        return NextResponse.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 })
    }
}
