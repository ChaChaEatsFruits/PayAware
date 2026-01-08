
import Redis from 'ioredis'

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

interface RateLimitConfig {
    uniqueToken: string
    limit: number
    window: number // in seconds
}

interface RateLimitResult {
    success: boolean
    remaining: number
    reset: number
}

// Function to check rate limit (Sliding Window or Fixed Window)
// Using a simple fixed window for simplicity and robustness in this demo
export async function rateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
    const { uniqueToken, limit, window } = config
    const key = `rate_limit:${uniqueToken}`

    const currentUsage = await redis.incr(key)

    if (currentUsage === 1) {
        await redis.expire(key, window)
    }

    const ttl = await redis.ttl(key)

    return {
        success: currentUsage <= limit,
        remaining: Math.max(0, limit - currentUsage),
        reset: Date.now() + (ttl * 1000),
    }
}
