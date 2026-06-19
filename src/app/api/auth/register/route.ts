import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/mail'

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()

        if (!name?.trim() || !email?.trim() || !password) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
        }

        const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
        if (existing) {
            return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
        }

        const hashed = await bcrypt.hash(password, 12)
        await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashed,
            },
        })

        sendWelcomeEmail(email.toLowerCase(), name.trim()).catch(() => {})

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[register] error:', error)
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
}
