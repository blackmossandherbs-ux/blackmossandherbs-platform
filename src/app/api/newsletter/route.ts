/**
 * Black Moss & Herbs Platform - Newsletter Signup Handler
 */
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    if (!checkRateLimit(`newsletter:${getClientIp(req)}`, 5, 60 * 1000)) {
        return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }

    try {
        const { email } = await req.json()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email || !emailRegex.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
        }

        // Persist the subscriber (idempotent on email).
        try {
            await prisma.newsletterSubscriber.upsert({
                where: { email },
                update: {},
                create: { email },
            })
        } catch (e) {
            console.error('[newsletter] could not persist subscriber:', e)
        }

        const destination = process.env.NEWSLETTER_INBOX || process.env.EMAIL_FROM

        if (process.env.EMAIL_SERVER_HOST && destination) {
            await sendEmail({
                to: destination,
                type: 'Newsletter',
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
