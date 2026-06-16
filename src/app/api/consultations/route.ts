import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/mail'

export const dynamic = 'force-dynamic'

const PRICES: Record<string, number> = {
    initial: 150,
    'follow-up': 85,
    intensive: 250,
}

const TYPE_NAMES: Record<string, string> = {
    initial: 'Initial Bio-Assessment (60 min)',
    'follow-up': 'Follow-up Session (30 min)',
    intensive: 'Intensive Protocol (90 min)',
}

export async function POST(req: NextRequest) {
    try {
        const { name, email, type, date, time, objectives } = await req.json()

        if (!name || !email || !type || !date || !time) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
        }

        const session = await getServerSession(authOptions)
        const price = PRICES[type] || 0
        const typeName = TYPE_NAMES[type] || type
        const requestedBy = session?.user?.email || email
        const inbox = process.env.CONTACT_INBOX || process.env.EMAIL_FROM || ''

        // Notify admin
        if (inbox) {
            await sendEmail({
                to: inbox,
                subject: `New Consultation Request: ${typeName}`,
                html: `
                    <div style="font-family: serif; color: #1a1a1a; padding: 40px; background: #f9f6f0;">
                        <h1 style="color: #2f5233; margin-bottom: 8px;">New Consultation Request</h1>
                        <p style="color: #666; margin-bottom: 32px; font-size: 14px;">Submitted via blackmossandherbs.com</p>

                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; color: #666; font-size: 13px; width: 140px;">Client Name</td><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; font-weight: bold;">${name}</td></tr>
                            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; color: #666; font-size: 13px;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8;">${email}</td></tr>
                            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; color: #666; font-size: 13px;">Session Type</td><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; font-weight: bold;">${typeName}</td></tr>
                            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; color: #666; font-size: 13px;">Price</td><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; color: #2f5233; font-weight: bold;">£${price}</td></tr>
                            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; color: #666; font-size: 13px;">Requested Date</td><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8;">${date}</td></tr>
                            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8; color: #666; font-size: 13px;">Requested Time</td><td style="padding: 10px 0; border-bottom: 1px solid #e8e0d8;">${time}</td></tr>
                            <tr><td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Objectives</td><td style="padding: 10px 0;">${objectives || 'Not provided'}</td></tr>
                        </table>
                        <hr style="border: 0; border-top: 1px solid #e8e0d8; margin: 32px 0;" />
                        <p style="font-size: 11px; color: #999;">Black Moss & Herbs — Consultation Request System</p>
                    </div>
                `
            })
        }

        // Confirmation to client
        await sendEmail({
            to: email,
            subject: 'Consultation Request Received — Black Moss & Herbs',
            html: `
                <div style="font-family: serif; color: #1a1a1a; padding: 40px; background: #f9f6f0;">
                    <h1 style="color: #2f5233;">Your Request Has Been Received, ${name}</h1>
                    <p>Thank you for reaching out. We have received your consultation request and our practitioners will confirm your appointment within 24 hours.</p>
                    <div style="background: #fff; border: 1px solid #e8e0d8; border-radius: 12px; padding: 24px; margin: 24px 0;">
                        <p style="margin: 0 0 8px; font-size: 13px; color: #666;">Session Type</p>
                        <p style="margin: 0 0 20px; font-weight: bold; color: #1a1a1a;">${typeName} — £${price}</p>
                        <p style="margin: 0 0 8px; font-size: 13px; color: #666;">Requested Slot</p>
                        <p style="margin: 0; font-weight: bold; color: #1a1a1a;">${date} at ${time}</p>
                    </div>
                    <p style="color: #555; font-size: 14px;">You will receive a secure video meeting link and payment details once your slot is confirmed.</p>
                    <hr style="border: 0; border-top: 1px solid #e8e0d8; margin: 32px 0;" />
                    <p style="font-size: 11px; color: #999;">Black Moss & Herbs — Botanical Wellness Authority</p>
                </div>
            `
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[Consultations API] Error:', error)
        return NextResponse.json({ error: 'Failed to submit consultation request.' }, { status: 500 })
    }
}
