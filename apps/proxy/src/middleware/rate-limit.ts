// Per-user rate limiting using Upstash Ratelimit

import type { Context, Next } from "hono"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    parseInt(process.env.RATE_LIMIT_REQUESTS ?? "100"),
    "1 m"
  ),
  prefix: "rate_limit",
})

export async function rateLimitMiddleware(c: Context, next: Next) {
  const userId = c.get("userId") as string
  const { success, reset } = await rateLimiter.limit(userId)

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000)
    c.header("Retry-After", retryAfter.toString())
    return c.json(
      {
        error: {
          type: "rate_limit_error",
          message: `Too many requests. Retry after ${retryAfter} seconds.`,
          retry_after: retryAfter,
        },
      },
      429
    )
  }

  await next()
}
