/**
 * Black Moss & Herbs Platform - Rate Limiting
 * In-memory sliding-window limiter, keyed by IP. Good enough for a single
 * server instance (this app's deployment target - PM2 or one Docker
 * container); would need a shared store (e.g. Redis) behind a multi-instance
 * load balancer.
 */
const hits = new Map<string, number[]>()

// Periodically drop stale keys so this doesn't grow unbounded.
setInterval(() => {
    const cutoff = Date.now() - 60 * 60 * 1000
    for (const [key, timestamps] of hits) {
        const kept = timestamps.filter((t) => t > cutoff)
        if (kept.length === 0) hits.delete(key)
        else hits.set(key, kept)
    }
}, 10 * 60 * 1000).unref?.()

export function getClientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()
    return req.headers.get('x-real-ip') || 'unknown'
}

/** Returns true if the request is within the allowed rate, false if it should be rejected. */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs)

    if (timestamps.length >= limit) {
        hits.set(key, timestamps)
        return false
    }

    timestamps.push(now)
    hits.set(key, timestamps)
    return true
}
