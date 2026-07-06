/**
 * Black Moss & Herbs Platform - Anthropic (Claude) client
 *
 * Powers AI article generation and the on-site botanical guide chat.
 * Requires ANTHROPIC_API_KEY in the environment.
 */
import Anthropic from '@anthropic-ai/sdk'

export const CLAUDE_MODEL = 'claude-opus-4-8'

let client: Anthropic | null = null

export function getAnthropic(): Anthropic | null {
    if (!process.env.ANTHROPIC_API_KEY) return null
    if (!client) {
        client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    }
    return client
}

export function isAIConfigured(): boolean {
    return Boolean(process.env.ANTHROPIC_API_KEY)
}
