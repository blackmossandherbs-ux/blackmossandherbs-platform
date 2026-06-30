/**
 * Black Moss & Herbs Platform - Provider-agnostic AI client
 *
 * Powers the on-site "Mr. Moss" guide chat and AI article generation.
 *
 * Designed for FREE providers (Groq, OpenRouter, Google Gemini) which all speak
 * the OpenAI chat-completions dialect, plus optional Anthropic. Configuration —
 * which provider, which model, and the API keys — is editable from the admin
 * panel (stored in the `ai` site setting) and/or supplied via environment
 * variables. Keys are pooled and rotated, and the client fails over to the next
 * key (and then the next provider that has keys) on rate-limit / auth / 5xx.
 */
import { prisma } from '@/lib/prisma'

export type ProviderId = 'groq' | 'openrouter' | 'gemini' | 'anthropic'

interface ProviderDef {
    id: ProviderId
    label: string
    /** How to obtain a key, shown in the admin UI. */
    keyHint: string
    /** OpenAI-compatible base (chat/completions) or Anthropic messages base. */
    baseUrl: string
    style: 'openai' | 'anthropic'
    defaultModel: string
    /** Env var prefix: PREFIX, PREFIX_2..10, and PREFIXS (comma/space list). */
    envPrefix: string
    free: boolean
}

export const AI_PROVIDERS: Record<ProviderId, ProviderDef> = {
    groq: {
        id: 'groq',
        label: 'Groq (free, very fast)',
        keyHint: 'Free key at console.groq.com → API Keys',
        baseUrl: 'https://api.groq.com/openai/v1',
        style: 'openai',
        defaultModel: 'llama-3.3-70b-versatile',
        envPrefix: 'GROQ_API_KEY',
        free: true,
    },
    openrouter: {
        id: 'openrouter',
        label: 'OpenRouter (free models)',
        keyHint: 'Free key at openrouter.ai → Keys (use a model ending in :free)',
        baseUrl: 'https://openrouter.ai/api/v1',
        style: 'openai',
        defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
        envPrefix: 'OPENROUTER_API_KEY',
        free: true,
    },
    gemini: {
        id: 'gemini',
        label: 'Google Gemini (free tier)',
        keyHint: 'Free key at aistudio.google.com → Get API key',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
        style: 'openai',
        defaultModel: 'gemini-2.0-flash',
        envPrefix: 'GEMINI_API_KEY',
        free: true,
    },
    anthropic: {
        id: 'anthropic',
        label: 'Anthropic Claude (paid)',
        keyHint: 'Key at console.anthropic.com',
        baseUrl: 'https://api.anthropic.com',
        style: 'anthropic',
        defaultModel: 'claude-haiku-4-5-20251001',
        envPrefix: 'ANTHROPIC_API_KEY',
        free: false,
    },
}

const DEFAULT_PROVIDER: ProviderId = 'groq'

export interface AIConfig {
    enabled: boolean
    provider: ProviderId
    model: string
    /** Admin-entered keys (in addition to any env keys). */
    keys: string[]
}

const SETTING_KEY = 'ai'

// ---- Config (DB-backed, short-cached) ----

let configCache: { value: AIConfig; at: number } | null = null
const CONFIG_TTL_MS = 15_000

export async function getAIConfig(): Promise<AIConfig> {
    const now = Date.now()
    if (configCache && now - configCache.at < CONFIG_TTL_MS) return configCache.value

    let value: AIConfig = { enabled: false, provider: DEFAULT_PROVIDER, model: AI_PROVIDERS[DEFAULT_PROVIDER].defaultModel, keys: [] }
    try {
        const row = await prisma.siteSetting.findUnique({ where: { key: SETTING_KEY } })
        if (row?.value && typeof row.value === 'object') {
            const v = row.value as any
            const provider: ProviderId = AI_PROVIDERS[v.provider as ProviderId] ? v.provider : DEFAULT_PROVIDER
            value = {
                enabled: Boolean(v.enabled),
                provider,
                model: typeof v.model === 'string' && v.model.trim() ? v.model.trim() : AI_PROVIDERS[provider].defaultModel,
                keys: Array.isArray(v.keys) ? v.keys.filter((k: any) => typeof k === 'string' && k.trim()) : [],
            }
        }
    } catch (err) {
        console.error('[ai] could not read config, using defaults:', err)
    }
    configCache = { value, at: now }
    return value
}

export async function saveAIConfig(partial: Partial<AIConfig>): Promise<AIConfig> {
    const current = await getAIConfig()
    const next: AIConfig = {
        enabled: partial.enabled ?? current.enabled,
        provider: partial.provider ?? current.provider,
        model: partial.model ?? current.model,
        keys: partial.keys ?? current.keys,
    }
    // If the provider changed and no explicit model was given, reset to its default.
    if (partial.provider && !partial.model) {
        next.model = AI_PROVIDERS[partial.provider].defaultModel
    }
    await prisma.siteSetting.upsert({
        where: { key: SETTING_KEY },
        update: { value: next as any },
        create: { key: SETTING_KEY, value: next as any },
    })
    configCache = { value: next, at: Date.now() }
    return next
}

// ---- Key loading ----

function envKeysFor(prefix: string): string[] {
    const keys: string[] = []
    const add = (raw?: string | null) => {
        if (!raw) return
        const k = raw.trim()
        if (k) keys.push(k)
    }
    add(process.env[prefix])
    for (let i = 2; i <= 10; i++) add(process.env[`${prefix}_${i}`])
    if (process.env[`${prefix}S`]) {
        for (const part of process.env[`${prefix}S`]!.split(/[,\s]+/)) add(part)
    }
    return keys
}

/** All keys available for a provider (admin-entered + env), de-duplicated. */
function keysForProvider(provider: ProviderId, config: AIConfig): string[] {
    const seen = new Set<string>()
    const out: string[] = []
    const both = [
        ...(provider === config.provider ? config.keys : []),
        ...envKeysFor(AI_PROVIDERS[provider].envPrefix),
    ]
    for (const k of both) {
        if (!seen.has(k)) {
            seen.add(k)
            out.push(k)
        }
    }
    return out
}

/** True when AI is enabled in config AND at least one key is available. */
export async function aiEnabled(): Promise<boolean> {
    const config = await getAIConfig()
    if (!config.enabled) return false
    return keysForProvider(config.provider, config).length > 0
}

/** Status snapshot for the admin panel (never returns full keys). */
export async function aiStatus() {
    const config = await getAIConfig()
    const providerKeys = keysForProvider(config.provider, config)
    return {
        enabled: config.enabled,
        provider: config.provider,
        model: config.model,
        adminKeyCount: config.keys.length,
        envKeyCount: envKeysFor(AI_PROVIDERS[config.provider].envPrefix).length,
        totalKeyCount: providerKeys.length,
        keyPreviews: config.keys.map(maskKey),
        ready: config.enabled && providerKeys.length > 0,
    }
}

export function maskKey(key: string): string {
    if (key.length <= 8) return '••••'
    return `${key.slice(0, 4)}…${key.slice(-4)}`
}

// ---- Chat ----

let rotation = 0

export interface ChatRequest {
    system?: string
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
    maxTokens?: number
    /** Ask the model for a single JSON object (OpenAI providers only). */
    json?: boolean
}

function isRetryable(status: number): boolean {
    return status === 401 || status === 403 || status === 408 || status === 409 || status === 429 || status >= 500
}

async function callOpenAIStyle(p: ProviderDef, key: string, model: string, req: ChatRequest): Promise<string> {
    const messages = [
        ...(req.system ? [{ role: 'system', content: req.system }] : []),
        ...req.messages,
    ]
    const res = await fetch(`${p.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
            // OpenRouter attribution headers (ignored by others).
            'HTTP-Referer': 'https://blackmossandherbs.com',
            'X-Title': 'Black Moss & Herbs',
        },
        body: JSON.stringify({
            model,
            max_tokens: req.maxTokens ?? 1024,
            messages,
            ...(req.json ? { response_format: { type: 'json_object' } } : {}),
        }),
    })
    if (!res.ok) {
        const body = await res.text().catch(() => '')
        const err: any = new Error(`${p.id} ${res.status}: ${body.slice(0, 200)}`)
        err.status = res.status
        throw err
    }
    const data = await res.json()
    return data?.choices?.[0]?.message?.content ?? ''
}

async function callAnthropic(p: ProviderDef, key: string, model: string, req: ChatRequest): Promise<string> {
    const res = await fetch(`${p.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model,
            max_tokens: req.maxTokens ?? 1024,
            ...(req.system ? { system: req.system } : {}),
            messages: req.messages,
        }),
    })
    if (!res.ok) {
        const body = await res.text().catch(() => '')
        const err: any = new Error(`anthropic ${res.status}: ${body.slice(0, 200)}`)
        err.status = res.status
        throw err
    }
    const data = await res.json()
    const block = Array.isArray(data?.content) ? data.content.find((b: any) => b.type === 'text') : null
    return block?.text ?? ''
}

/**
 * Run a chat completion against the configured provider, rotating across all of
 * its keys and falling back to any other provider that has keys. Returns the
 * text, or null when AI is disabled / no keys are configured anywhere.
 */
export async function chat(req: ChatRequest): Promise<string | null> {
    const config = await getAIConfig()
    if (!config.enabled) return null

    // Try the configured provider first, then any others that have keys.
    const order: ProviderId[] = [config.provider, ...(Object.keys(AI_PROVIDERS) as ProviderId[]).filter(p => p !== config.provider)]

    let lastErr: any = null
    let triedAnyKey = false

    for (const providerId of order) {
        const p = AI_PROVIDERS[providerId]
        const keys = keysForProvider(providerId, config)
        if (keys.length === 0) continue

        const model = providerId === config.provider ? config.model : p.defaultModel

        // Rotate the starting key so load spreads across the pool.
        const start = rotation++ % keys.length
        const ordered = [...keys.slice(start), ...keys.slice(0, start)]

        for (const key of ordered) {
            triedAnyKey = true
            try {
                const text = p.style === 'anthropic'
                    ? await callAnthropic(p, key, model, req)
                    : await callOpenAIStyle(p, key, model, req)
                if (text) return text
            } catch (err: any) {
                lastErr = err
                const status = Number(err?.status) || 0
                if (status && !isRetryable(status)) {
                    // Genuine client error (e.g. bad model/request) — don't hammer other keys.
                    throw err
                }
                // else: rate-limited / auth / 5xx — try the next key.
            }
        }
    }

    if (!triedAnyKey) return null
    throw lastErr || new Error('All AI providers/keys failed.')
}
