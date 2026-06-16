/**
 * Black Moss & Herbs Platform - Botanical Guide Chat
 *
 * Real Claude-powered chat. Each on-site guide maps to an author persona so the
 * voice is consistent with the rest of the brand. Falls back to a safe message
 * when AI is not configured.
 */
import { NextResponse } from 'next/server'
import { getAnthropic, CLAUDE_MODEL } from '@/lib/anthropic'
import { getPersona } from '@/lib/personas'

export const dynamic = 'force-dynamic'

const GUIDE_TO_PERSONA: Record<string, string> = {
    alchemist: 'MARCUS_ADEYEMI',
    herbalist: 'SISTER_IFE_OKONKWO',
    clinical: 'DR_AMARA_WILLIAMS',
}

const CHAT_BEHAVIOUR = `
You are chatting live with a visitor on the Black Moss & Herbs website.
- Keep replies warm, concise (2-4 short paragraphs max), and conversational.
- You are a wellness guide, NOT a doctor. Never diagnose, prescribe, or promise to cure/treat any condition.
- If someone describes a serious or worsening symptom, gently encourage them to see a qualified health professional.
- You may suggest exploring relevant Black Moss & Herbs products or a consultation when genuinely helpful, without being pushy.
`.trim()

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const guideId: string = body.guideId || 'alchemist'
        const persona = getPersona(GUIDE_TO_PERSONA[guideId] || 'MARCUS_ADEYEMI')

        // Accept either a single `message` or a full `messages` history.
        let history: ChatMessage[] = Array.isArray(body.messages) ? body.messages : []
        history = history
            .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
            .slice(-12)
        if (body.message && (history.length === 0 || history[history.length - 1].content !== body.message)) {
            history.push({ role: 'user', content: String(body.message) })
        }
        if (history.length === 0) {
            return NextResponse.json({ error: 'No message provided.' }, { status: 400 })
        }

        const anthropic = getAnthropic()
        if (!anthropic) {
            return NextResponse.json({
                content:
                    "I'm just catching my breath at the moment and can't chat live. In the meantime, explore our Wisdom archive or book a consultation and a real herbalist will help you personally.",
                status: 'unconfigured',
            })
        }

        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 1024,
            system: `${persona?.systemPrompt ?? ''}\n\n${CHAT_BEHAVIOUR}`,
            messages: history.map((m) => ({ role: m.role, content: m.content })),
        })

        const textBlock = response.content.find(
            (b): b is Extract<typeof b, { type: 'text' }> => b.type === 'text'
        )

        return NextResponse.json({
            content: textBlock?.text ?? "I'm here — could you say that another way?",
            status: 'success',
        })
    } catch (error) {
        console.error('[AI Chat API] Error:', error)
        return NextResponse.json({ error: 'The guide is momentarily unavailable. Please try again.' }, { status: 500 })
    }
}
