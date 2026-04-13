/**
 * Rate Limiting Utility
 * 
 * Protects against brute force attacks by limiting request frequency
 * 
 * For Development: Uses in-memory store
 * For Production: Use Upstash Redis (see instructions below)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (for development only)
const rateLimitStore: Map<string, RateLimitEntry> = new Map();

/**
 * Check if a request should be rate limited
 * 
 * @param key - Identifier (email, IP, user ID, etc)
 * @param maxAttempts - Maximum allowed attempts
 * @param windowMs - Time window in milliseconds
 * @returns Object with success flag and remaining attempts
 * 
 * @example
 * const result = checkRateLimit('user@example.com', 5, 3600000); // 5 attempts per hour
 * if (!result.success) {
 *   return { error: `Too many attempts. Try again in ${result.retryAfterSeconds}s` };
 * }
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 3600000 // 1 hour
): {
  success: boolean;
  remaining: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    rateLimitStore.delete(key);
    return {
      success: true,
      remaining: maxAttempts,
    };
  }

  // First request from this key
  if (!entry) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: maxAttempts - 1,
    };
  }

  // Check if limit exceeded
  if (entry.count >= maxAttempts) {
    const retryAfterMs = entry.resetTime - now;
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  // Increment counter
  entry.count++;
  return {
    success: true,
    remaining: maxAttempts - entry.count,
  };
}

/**
 * Reset rate limit for a specific key
 * Useful for successful authentication
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * PRODUCTION SETUP: Using Upstash Redis
 * 
 * For production, replace the in-memory implementation with Upstash:
 * 
 * 1. Install Upstash package:
 *    npm install @upstash/ratelimit @upstash/redis
 * 
 * 2. Create Upstash database at: https://upstash.com
 * 
 * 3. Add to .env.local:
 *    UPSTASH_REDIS_REST_URL=https://...
 *    UPSTASH_REDIS_REST_TOKEN=...
 * 
 * 4. Replace this implementation:
 * 
 *    import { Ratelimit } from "@upstash/ratelimit";
 *    import { Redis } from "@upstash/redis";
 * 
 *    const ratelimit = new Ratelimit({
 *      redis: Redis.fromEnv(),
 *      limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 requests per hour
 *    });
 * 
 *    export async function checkRateLimit(key: string) {
 *      const { success } = await ratelimit.limit(key);
 *      return { success };
 *    }
 */
