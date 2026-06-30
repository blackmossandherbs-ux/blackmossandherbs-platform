/**
 * Admin AI Settings — read status, save provider/model/keys, and run a live test.
 * Admin-only.
 */
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { AI_PROVIDERS, ProviderId, getAIConfig, saveAIConfig, aiStatus, chat } from '@/lib/ai'

export const dynamic = 'force-dynamic'

export async function GET() {
    const denied = await requireAdmin()
    if (denied) return denied

    const status = await aiStatus()
    const providers = Object.values(AI_PROVIDERS).map(p => ({
        id: p.id,
        label: p.label,
        defaultModel: p.defaultModel,
        keyHint: p.keyHint,
        free: p.free,
        envPrefix: p.envPrefix,
    }))
    return NextResponse.json({ ...status, providers })
}

export async function POST(req: Request) {
    const denied = await requireAdmin()
    if (denied) return denied

    let body: any
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request format.' }, { status: 400 })
    }

    // "test" action: send a tiny prompt through the live config.
    if (body?.action === 'test') {
        try {
            const reply = await chat({
                maxTokens: 64,
                messages: [{ role: 'user', content: 'In one short sentence, introduce yourself as Mr. Moss from Black Moss & Herbs.' }],
            })
            if (!reply) {
                return NextResponse.json({ ok: false, error: 'AI is disabled or no keys are configured.' })
            }
            return NextResponse.json({ ok: true, reply })
        } catch (error: any) {
            return NextResponse.json({ ok: false, error: error?.message?.slice(0, 200) || 'Test failed.' })
        }
    }

    // Save action.
    const partial: any = {}
    if (typeof body.enabled === 'boolean') partial.enabled = body.enabled
    if (body.provider && AI_PROVIDERS[body.provider as ProviderId]) partial.provider = body.provider
    if (typeof body.model === 'string') partial.model = body.model.trim()
    // keys: array of full keys. Only replace when explicitly provided (non-undefined).
    if (Array.isArray(body.keys)) {
        partial.keys = body.keys.map((k: any) => String(k).trim()).filter(Boolean)
    }

    try {
        await saveAIConfig(partial)
        const status = await aiStatus()
        return NextResponse.json({ success: true, ...status })
    } catch (error) {
        console.error('[admin/ai-settings] save error:', error)
        return NextResponse.json({ error: 'Could not save AI settings.' }, { status: 500 })
    }
}
