import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;
let redisSessionClient: ReturnType<typeof createClient> | null = null;
let redisQueueClient: ReturnType<typeof createClient> | null = null;

export function getRedisClient() {
  if (!redisClient && process.env.REDIS_URL) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("error", (err) => console.error("Redis Client Error", err));
    redisClient.connect().catch(console.error);
  }
  return redisClient;
}

export function getRedisSessionClient() {
  if (!redisSessionClient && process.env.REDIS_SESSION_URL) {
    redisSessionClient = createClient({
      url: process.env.REDIS_SESSION_URL,
    });

    redisSessionClient.on("error", (err) => console.error("Redis Session Client Error", err));
    redisSessionClient.connect().catch(console.error);
  }
  return redisSessionClient;
}

export function getRedisQueueClient() {
  if (!redisQueueClient && process.env.REDIS_QUEUE_URL) {
    redisQueueClient = createClient({
      url: process.env.REDIS_QUEUE_URL,
    });

    redisQueueClient.on("error", (err) => console.error("Redis Queue Client Error", err));
    redisQueueClient.connect().catch(console.error);
  }
  return redisQueueClient;
}

// Rate limiting with Redis
export async function rateLimitRedis(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const client = getRedisClient();
  if (!client) {
    // Fallback to in-memory if Redis not available
    return { allowed: true, remaining: limit, resetAt: Date.now() + windowMs };
  }

  const now = Date.now();
  const windowKey = `rate_limit:${key}`;
  const resetAt = now + windowMs;

  try {
    const count = await client.incr(windowKey);
    if (count === 1) {
      await client.pexpire(windowKey, windowMs);
    }

    const remaining = Math.max(0, limit - count);
    return {
      allowed: count <= limit,
      remaining,
      resetAt,
    };
  } catch (error) {
    console.error("Redis rate limit error:", error);
    // Fail open - allow request if Redis fails
    return { allowed: true, remaining: limit, resetAt };
  }
}
