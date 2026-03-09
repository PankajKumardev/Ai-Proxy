// SHA-256 cache with stampede protection (SET NX lock), per-plan TTL, and invalidation rules

import type { Context, Next } from "hono"
import { Redis } from "@upstash/redis"
import { createHash } from "crypto"
import type { ChatRequest } from "@ai-gateway/providers"

const redis = Redis.fromEnv()

// Per-plan TTL
function getCacheTTL(plan: string): number {
  const enterpriseTTL = parseInt(process.env.ENTERPRISE_TTL_SECONDS ?? "604800")
  if (plan === "free") return 86400          // 24 hours
  if (plan === "pro") return 604800          // 7 days
  return enterpriseTTL                       // enterprise: configurable
}

function shouldSkipCache(body: ChatRequest, c: Context): boolean {
  if (body.stream === true) return true
  if ((body.temperature ?? 1) > 0.9) return true
  if (c.req.header("X-AI-Gateway-No-Cache") === "true") return true
  const hasImages = body.messages?.some((m) =>
    Array.isArray(m.content) &&
    m.content.some((p) => (p as unknown as Record<string, unknown>).type === "image_url")
  )
  if (hasImages) return true
  return false
}

export async function cacheMiddleware(
  c: Context,
  body: ChatRequest,
  handler: () => Promise<Record<string, unknown>>
): Promise<Response> {
  const user = c.get("user") as { userId: string; plan: string }

  if (shouldSkipCache(body, c)) {
    const result = await handler()
    return c.json(result)
  }

  const hash = createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex")

  const cacheKey = `cache:${hash}`

  // Check cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    return c.json({
      ...(JSON.parse(cached as string) as Record<string, unknown>),
      cached: true,
      request_id: c.get("requestId"),
    })
  }

  // Stampede protection — atomic lock with 10s TTL
  const lockKey = `cache:${hash}:lock`
  const lockAcquired = await redis.set(lockKey, "1", { nx: true, ex: 10 })

  if (!lockAcquired) {
    // Another request is already fetching — wait briefly then read from cache
    await new Promise((res) => setTimeout(res, 200))
    const retried = await redis.get(cacheKey)
    if (retried) {
      return c.json({
        ...(JSON.parse(retried as string) as Record<string, unknown>),
        cached: true,
        request_id: c.get("requestId"),
      })
    }
    // Still no cache after wait — fall through and call provider anyway
  }

  try {
    const response = await handler()

    // Only cache if response is under 500KB
    const responseSize = Buffer.byteLength(JSON.stringify(response))
    if (responseSize < 500 * 1024) {
      const ttl = getCacheTTL(user.plan)
      await redis.set(cacheKey, JSON.stringify(response), { ex: ttl })
    }

    return c.json({ ...response, cached: false, request_id: c.get("requestId") })
  } finally {
    // Always release the lock — even if provider throws
    await redis.del(lockKey)
  }
}
