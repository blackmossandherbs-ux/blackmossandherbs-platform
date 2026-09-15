import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/mobile-auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const session = await getAuthSession(req)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            biologicalProfile: true,
            orders: { orderBy: { createdAt: 'desc' }, take: 10, include: { items: { include: { product: true } } } },
            subscriptions: { orderBy: { createdAt: 'desc' }, take: 1, include: { plan: true } },
            consultations: { orderBy: { date: 'desc' } },
        }
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { password: _password, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
}

export async function PATCH(req: NextRequest) {
    const session = await getAuthSession(req)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    try {
        const { name, phone, dateOfBirth, socialLinks, image, doctorNote, currentPassword, newPassword } = await req.json()

        // Profile field update (name/phone/DOB/social links/avatar)
        if (name !== undefined || phone !== undefined || dateOfBirth !== undefined || socialLinks !== undefined || image !== undefined) {
            if (name !== undefined && !name.trim()) {
                return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 })
            }
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    ...(name !== undefined && { name: name.trim() }),
                    ...(phone !== undefined && { phone }),
                    ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
                    ...(socialLinks !== undefined && { socialLinks }),
                    ...(image !== undefined && { image }),
                }
            })
            return NextResponse.json({ success: true })
        }

        // Doctor note lives on BiologicalProfile, not User
        if (doctorNote !== undefined) {
            await prisma.biologicalProfile.upsert({
                where: { userId: session.user.id },
                update: { doctorNote, doctorNoteAt: doctorNote ? new Date() : null },
                create: { userId: session.user.id, doctorNote, doctorNoteAt: doctorNote ? new Date() : null },
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
