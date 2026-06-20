import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json()

        if (!token || !password || password.length < 8) {
            return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
        }

        const record = await prisma.verificationToken.findUnique({ where: { token } })

        if (!record) {
            return NextResponse.json({ error: 'This reset link is invalid or has already been used.' }, { status: 400 })
        }

        if (record.expires < new Date()) {
            await prisma.verificationToken.delete({ where: { token } })
            return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email: record.identifier } })
        if (!user) {
            return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
        }

        const hashed = await bcrypt.hash(password, 12)

        await prisma.$transaction([
            prisma.user.update({ where: { id: user.id }, data: { password: hashed } }),
            prisma.verificationToken.delete({ where: { token } }),
        ])

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[reset-password] error:', error)
        return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
}
