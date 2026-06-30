/**
 * Black Moss & Herbs Platform - Mr. Moss Guide Chat
 *
 * The on-site AI guide. Runs on whichever provider/keys are configured in the
 * admin panel (free providers like Groq/OpenRouter/Gemini are supported), with
 * key rotation and graceful fallback when AI is off or unavailable.
 */
import { NextResponse } from 'next/server'
import { chat, aiEnabled } from '@/lib/ai'
import { getPersona, DEFAULT_PERSONA_KEY } from '@/lib/personas'

export const dynamic = 'force-dynamic'

// All on-site guides now speak as Mr. Moss; legacy ids still resolve cleanly.
const GUIDE_TO_PERSONA: Record<string, string> = {
    'mr-moss': 'MR_MOSS',
    moss: 'MR_MOSS',
    alchemist: 'MR_MOSS',
    herbalist: 'MR_MOSS',
    clinical: 'MR_MOSS',
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

const FRIENDLY_FALLBACK =
    "I can't chat live just at the moment. Please explore our Wisdom archive, or book a consultation and a real herbalist will help you personally."

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const guideId: string = body.guideId || 'mr-moss'
        const persona = getPersona(GUIDE_TO_PERSONA[guideId] || 'MR_MOSS') || getPersona(DEFAULT_PERSONA_KEY)

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

        if (!(await aiEnabled())) {
            return NextResponse.json({
                content:
                    "I'm just catching my breath at the moment and can't chat live. In the meantime, explore our Wisdom archive or book a consultation and a real herbalist will help you personally.",
                status: 'unconfigured',
            })
        }

        const text = await chat({
            maxTokens: 1024,
            system: `${persona?.systemPrompt ?? ''}\n\n${CHAT_BEHAVIOUR}`,
            messages: history.map((m) => ({ role: m.role, content: m.content })),
        })

        return NextResponse.json({
            content: text || "I'm here — could you say that another way?",
            status: 'success',
        })
    } catch (error) {
        console.error('[Mr. Moss Chat] Error:', error)
        // Degrade gracefully: never show the visitor a hard error.
        return NextResponse.json({ content: FRIENDLY_FALLBACK, status: 'error' })
    }
}
