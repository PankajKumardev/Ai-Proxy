import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

export const redis = Redis.fromEnv()

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    parseInt(process.env.RATE_LIMIT_REQUESTS ?? "100"),
    (process.env.RATE_LIMIT_WINDOW ?? "1 m") as "1 m"
  ),
  prefix: "rate_limit",
})

export type { Redis } from "@upstash/redis"
