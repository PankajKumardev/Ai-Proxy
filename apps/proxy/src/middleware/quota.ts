// Track usage in Redis using atomic INCR — no Postgres race conditions

import type { Context, Next } from "hono"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

function secondsUntilMonthEnd(): number {
  const now = new Date()
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  return Math.floor((nextMonth.getTime() - now.getTime()) / 1000)
}

// Plan limits
const FREE_LIMIT = 10_000
const PRO_LIMIT = 500_000

export async function quotaMiddleware(c: Context, next: Next) {
  const user = c.get("user") as { userId: string; plan: string }

  if (user.plan === "free") {
    const month = new Date().toISOString().slice(0, 7) // "2026-03"
    const quotaKey = `quota:${user.userId}:${month}`

    // Atomic increment — no race condition
    const used = await redis.incr(quotaKey)

    if (used === 1) {
        // expire() takes TTL in seconds — correct API
        await redis.expire(quotaKey, secondsUntilMonthEnd())
      }

    if (used > FREE_LIMIT) {
      return c.json(
        {
          error: {
            type: "quota_error",
            message: "Monthly request limit reached. Upgrade to Pro to continue.",
          },
        },
        402
      )
    }
  } else if (user.plan === "pro") {
    const month = new Date().toISOString().slice(0, 7)
    const quotaKey = `quota:${user.userId}:${month}`
    const used = await redis.incr(quotaKey)

    if (used === 1) {
      await redis.expire(quotaKey, secondsUntilMonthEnd())
    }

    if (used > PRO_LIMIT) {
      return c.json(
        {
          error: {
            type: "quota_error",
            message: "Monthly request limit reached. Upgrade to Enterprise for unlimited requests.",
          },
        },
        402
      )
    }
  }

  // Enterprise: no quota limit
  await next()
}
