import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    try {
        const { name, currentPassword, newPassword } = await req.json()

        // Name update
        if (name !== undefined) {
            if (!name.trim()) return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 })
            await prisma.user.update({
                where: { id: session.user.id },
                data: { name: name.trim() }
            })
            return NextResponse.json({ success: true })
        }

        // Password change
        if (currentPassword && newPassword) {
            const user = await prisma.user.findUnique({ where: { id: session.user.id } })
            if (!user?.password) {
                return NextResponse.json({ error: 'Password change not available for this account.' }, { status: 400 })
            }
            const valid = await bcrypt.compare(currentPassword, user.password)
            if (!valid) {
                return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
            }
            const hashed = await bcrypt.hash(newPassword, 12)
            await prisma.user.update({
                where: { id: session.user.id },
                data: { password: hashed }
            })
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
    } catch (error) {
        console.error('[User Profile API] Error:', error)
        return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
    }
}
