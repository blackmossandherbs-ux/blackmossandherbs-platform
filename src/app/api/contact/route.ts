/**
 * Black Moss & Herbs Platform - Contact Form Handler
 */
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    // Defense in depth alongside reCAPTCHA - still useful when that isn't configured.
    if (!checkRateLimit(`contact:${getClientIp(req)}`, 5, 60 * 1000)) {
        return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }

    try {
        const { name, email, message, recaptchaToken } = await req.json()

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
        }

        if (!(await verifyRecaptcha(recaptchaToken))) {
            return NextResponse.json({ error: 'Spam verification failed. Please try again.' }, { status: 400 })
        }

        const destination = process.env.CONTACT_INBOX || process.env.EMAIL_FROM

        // Only attempt delivery when SMTP is configured; otherwise record it so
        // the submission is not silently lost.
        if (process.env.EMAIL_SERVER_HOST && destination) {
            await sendEmail({
                to: destination,
                type: 'Enquiry',
                subject: `New contact enquiry from ${name}`,
                html: `
                    <h2>New Contact Enquiry</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${String(message).replace(/</g, '&lt;')}</p>
                `,
            })
        } else {
            console.log('[contact] Enquiry received (SMTP not configured):', { name, email })
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[contact] FAILURE:', error)
        return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 500 })
    }
}
