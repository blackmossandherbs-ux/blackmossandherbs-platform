/**
 * Black Moss & Herbs Platform - Anthropic (Claude) client with multi-key fallback
 *
 * Powers AI article generation and the on-site botanical guide chat.
 *
 * Resilience model:
 *  - Loads MANY API keys (ANTHROPIC_API_KEY, ANTHROPIC_API_KEY_2..10, and a
 *    comma/space-separated ANTHROPIC_API_KEYS list). Add as many free or paid
 *    keys as you like — the client spreads load across them and fails over.
 *  - Rotates the starting key each call so no single (free-tier) key gets hammered.
 *  - On an exhausted / rate-limited / invalid / overloaded key, transparently
 *    retries the request on the next key.
 *  - Falls back down a model chain (Opus -> Sonnet -> Haiku) so a key that only
 *    has access to a cheaper model still works.
 */
import Anthropic from '@anthropic-ai/sdk'

// Primary model, plus the fallback chain used when a key/model is unavailable.
export const CLAUDE_MODEL = 'claude-opus-4-8'
export const MODEL_FALLBACKS = ['claude-opus-4-8', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001']

/** Collect every configured key, de-duplicated, primary first. */
function loadKeys(): string[] {
    const keys: string[] = []
    const seen = new Set<string>()
    const add = (raw?: string | null) => {
        if (!raw) return
        const k = raw.trim()
        if (k && !seen.has(k)) {
            seen.add(k)
            keys.push(k)
        }
    }

    add(process.env.ANTHROPIC_API_KEY)
    for (let i = 2; i <= 10; i++) add(process.env[`ANTHROPIC_API_KEY_${i}`])
    if (process.env.ANTHROPIC_API_KEYS) {
        for (const part of process.env.ANTHROPIC_API_KEYS.split(/[,\s]+/)) add(part)
    }
    return keys
}

// One SDK client per key, cached across requests.
const clientCache = new Map<string, Anthropic>()
function clientFor(key: string): Anthropic {
    let c = clientCache.get(key)
    if (!c) {
        c = new Anthropic({ apiKey: key, maxRetries: 1 })
        clientCache.set(key, c)
    }
    return c
}

// Rotates which key we try first, spreading load across the pool.
let rotation = 0

export function isAIConfigured(): boolean {
    return loadKeys().length > 0
}

/** Number of keys currently available (handy for admin/status display). */
export function aiKeyCount(): number {
    return loadKeys().length
}

/** Back-compat: a single client using the primary key, or null if unconfigured. */
export function getAnthropic(): Anthropic | null {
    const keys = loadKeys()
    return keys.length ? clientFor(keys[0]) : null
}

function statusOf(err: any): number | undefined {
    return err?.status ?? err?.response?.status
}

/** True when the error means "this key is no good right now — try the next one". */
function shouldTryNextKey(err: any): boolean {
    const s = statusOf(err)
    return (
        s === 401 || // invalid/expired key
        s === 403 || // key lacks permission
        s === 429 || // rate limited / quota exhausted
        s === 500 || // upstream error
        s === 502 ||
        s === 503 || // temporarily unavailable
        s === 529 || // overloaded
        err?.name === 'APIConnectionError' ||
        err?.name === 'APIConnectionTimeoutError'
    )
}

/** True when the error means "this model isn't available — try a cheaper one". */
function isModelUnavailable(err: any): boolean {
    const s = statusOf(err)
    const msg = String(err?.message || '').toLowerCase()
    return s === 404 || (s === 400 && msg.includes('model'))
}

export interface CreateMessageOptions {
    model?: string
    max_tokens: number
    system?: string
    messages: Array<{ role: 'user' | 'assistant'; content: any }>
    /** Extra params merged into the request (e.g. output_config for JSON schema). */
    extra?: Record<string, any>
    /** Set false to disable the Opus->Sonnet->Haiku fallback (default: enabled). */
    modelFallback?: boolean
}

/**
 * Create a message, transparently failing over across keys and models.
 * Returns null only when NO keys are configured (caller shows the unconfigured
 * fallback copy). Throws if every key/model combination genuinely failed.
 */
export async function createMessage(opts: CreateMessageOptions): Promise<Anthropic.Message | null> {
    const keys = loadKeys()
    if (keys.length === 0) return null

    const models =
        opts.modelFallback === false
            ? [opts.model || CLAUDE_MODEL]
            : Array.from(new Set([opts.model || CLAUDE_MODEL, ...MODEL_FALLBACKS]))

    // Rotate the starting key to spread load across the pool.
    const start = rotation++ % keys.length
    const orderedKeys = [...keys.slice(start), ...keys.slice(0, start)]

    let lastErr: any = null

    for (const key of orderedKeys) {
        for (const model of models) {
            try {
                return await clientFor(key).messages.create({
                    model,
                    max_tokens: opts.max_tokens,
                    ...(opts.system ? { system: opts.system } : {}),
                    messages: opts.messages,
                    ...(opts.extra || {}),
                } as any)
            } catch (err: any) {
                lastErr = err
                if (isModelUnavailable(err)) {
                    // Try the next (cheaper) model on this same key.
                    continue
                }
                if (shouldTryNextKey(err)) {
                    // This key is exhausted/invalid — abandon it, try the next key.
                    break
                }
                // Genuine client error (e.g. malformed request) — surface immediately.
                throw err
            }
        }
    }

    throw lastErr || new Error('All AI keys failed.')
}

/** Convenience: pull the first text block out of a Claude response. */
export function firstText(message: Anthropic.Message | null): string {
    if (!message) return ''
    const block = message.content.find((b): b is Extract<typeof b, { type: 'text' }> => b.type === 'text')
    return block?.text ?? ''
}
