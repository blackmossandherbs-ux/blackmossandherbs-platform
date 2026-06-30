/**
 * GDPR Article 15/20 — Subject Access & Data Portability.
 * Returns all personal data we hold for the signed-in user as a JSON download.
 */
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const { session, denied } = await requireUser()
    if (denied) return denied

    const userId = session!.user!.id

    const [user, orders, subscriptions, consultations, downloads] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, createdAt: true, termsAcceptedAt: true, loyaltyPoints: true },
        }),
        prisma.order.findMany({ where: { userId }, include: { items: true } }),
        prisma.subscription.findMany({ where: { userId }, include: { plan: true } }),
        prisma.consultation.findMany({ where: { userId } }),
        prisma.download.findMany({ where: { userId } }),
    ])

    const newsletter = user?.email
        ? await prisma.newsletterSubscriber.findUnique({ where: { email: user.email } })
        : null

    const exportData = {
        exportedAt: new Date().toISOString(),
        account: user,
        orders,
        subscriptions,
        consultations,
        downloads,
        newsletterSubscription: newsletter,
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="blackmoss-my-data-${userId}.json"`,
        },
    })
}
