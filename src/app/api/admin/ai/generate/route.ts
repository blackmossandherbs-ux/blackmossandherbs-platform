/**
 * Black Moss & Herbs Platform - Admin AI Article Generation
 *
 * Generates a wellness article in a chosen author persona's voice using Claude.
 * Optionally saves it straight to drafts. Admin-only.
 */
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api-auth'
import { AIContentService } from '@/services/AIContentService'
import { isAIConfigured } from '@/lib/anthropic'
import { PERSONAS, DEFAULT_PERSONA_KEY } from '@/lib/personas'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(req: Request) {
    const denied = await requireAdmin()
    if (denied) return denied

    if (!isAIConfigured()) {
        return NextResponse.json(
            { error: 'AI is not configured. Set ANTHROPIC_API_KEY to enable article generation.' },
            { status: 503 }
        )
    }

    try {
        const { topic, persona, saveDraft } = await req.json()

        if (!topic || typeof topic !== 'string') {
            return NextResponse.json({ error: 'A topic is required.' }, { status: 400 })
        }

        const personaKey = PERSONAS.some(p => p.key === persona) ? persona : DEFAULT_PERSONA_KEY
        const content = await AIContentService.generatePack(topic, personaKey)

        let draftId: string | undefined
        if (saveDraft) {
            const draft = await AIContentService.saveToDrafts(content, personaKey)
            draftId = draft.id
        }

        return NextResponse.json({ content, persona: personaKey, draftId })
    } catch (error) {
        console.error('[admin/ai/generate] FAILURE:', error)
        const message = error instanceof Error ? error.message : 'Generation failed.'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
