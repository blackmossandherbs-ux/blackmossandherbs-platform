import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/mail'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { email } = await req.json()
    if (!email?.trim()) {
        return NextResponse.json({ error: 'Email address is required.' }, { status: 400 })
    }

    try {
        await sendEmail({
            to: email,
            subject: 'Test Email — Black Moss & Herbs',
            html: `
                <div style="font-family: serif; padding: 40px; background: #f9f6f0; color: #1a1a1a;">
                    <h1 style="color: #2f5233;">Email System Working</h1>
                    <p>This is a test email from your Black Moss & Herbs admin panel.</p>
                    <p>If you received this, your SMTP configuration is working correctly.</p>
                    <hr style="border: 0; border-top: 1px solid #e8e0d8; margin: 24px 0;" />
                    <p style="font-size: 11px; color: #999;">Black Moss & Herbs — Admin System</p>
                </div>
            `,
        })
        return NextResponse.json({ message: `Test email sent to ${email}` })
    } catch (error) {
        console.error('[admin/test-email] error:', error)
        return NextResponse.json({ message: 'Failed to send. Check SMTP credentials in your .env file.' }, { status: 500 })
    }
}
