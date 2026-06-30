import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/mail'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()
        if (!email?.trim()) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({ success: true })
        }

        // Store reset token in VerificationToken table (reusing NextAuth's table)
        const token = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

        await prisma.verificationToken.upsert({
            where: { token },
            update: { expires },
            create: { identifier: email.toLowerCase(), token, expires },
        })

        const origin = (
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.NEXTAUTH_URL ||
            new URL(req.url).origin
        ).replace(/\/$/, '')
        const resetUrl = `${origin}/reset-password?token=${token}`
        await sendPasswordResetEmail(email, resetUrl)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[forgot-password] error:', error)
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
}
