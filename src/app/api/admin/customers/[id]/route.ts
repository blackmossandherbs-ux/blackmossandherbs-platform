/**
 * Black Moss & Herbs Platform - Admin Customer Detail API
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const denied = await requireAdmin()
    if (denied) return denied
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                biologicalProfile: true,
                orders: {
                    orderBy: { createdAt: 'desc' },
                    include: { items: { include: { product: { select: { name: true } } } } },
                },
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'Customer not found.' }, { status: 404 })
        }

        const spent = user.orders.reduce((acc, o) => acc + o.total, 0)
        const bp = user.biologicalProfile

        return NextResponse.json({
            id: user.id,
            name: user.name || 'Anonymous Entity',
            email: user.email,
            joinDate: user.createdAt,
            loyaltyPoints: user.loyaltyPoints,
            ordersCount: user.orders.length,
            spent,
            status: spent > 500 ? 'VIP Authority' : 'Active Member',
            bioProfile: {
                healthGoals: bp?.healthGoals ?? [],
                dietType: bp?.dietType ?? null,
                allergies: bp?.allergies ?? [],
                activeCondition: bp?.activeCondition ?? null,
                clinicalNotes: bp?.clinicalNotes ?? '',
            },
            orders: user.orders.map((o) => ({
                id: o.orderNumber,
                date: o.createdAt,
                items: o.items.map((i) => i.product.name).join(', ') || '—',
                total: o.total,
                status: o.status,
            })),
        })
    } catch (error) {
        console.error('[admin/customers/[id] GET] FAILURE:', error)
        return NextResponse.json({ error: 'Failed to load customer.' }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const denied = await requireAdmin()
    if (denied) return denied
    try {
        const { clinicalNotes, activeCondition } = await req.json()

        const profile = await prisma.biologicalProfile.upsert({
            where: { userId: params.id },
            update: {
                ...(clinicalNotes !== undefined ? { clinicalNotes } : {}),
                ...(activeCondition !== undefined ? { activeCondition } : {}),
            },
            create: {
                userId: params.id,
                clinicalNotes: clinicalNotes ?? null,
                activeCondition: activeCondition ?? null,
            },
        })

        return NextResponse.json({ ok: true, profile })
    } catch (error) {
        console.error('[admin/customers/[id] PATCH] FAILURE:', error)
        return NextResponse.json({ error: 'Failed to save clinical record.' }, { status: 500 })
    }
}
