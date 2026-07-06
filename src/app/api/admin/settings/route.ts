/**
 * Black Moss & Herbs Platform - Admin Site Settings API
 */
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { SettingsService } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
    const denied = await requireAdmin()
    if (denied) return denied
    const settings = await SettingsService.get()
    return NextResponse.json(settings)
}

export async function POST(req: Request) {
    const denied = await requireAdmin()
    if (denied) return denied
    try {
        const body = await req.json()
        const updated = await SettingsService.update(body)
        return NextResponse.json(updated)
    } catch (error) {
        console.error('[admin/settings POST] FAILURE:', error)
        return NextResponse.json({ error: 'Could not save settings.' }, { status: 500 })
    }
}
