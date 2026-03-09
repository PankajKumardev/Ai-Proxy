// Hash incoming key, check Redis first, fall back to DB only on miss

import type { Context, Next } from "hono"
import { createHash } from "crypto"
import { Redis } from "@upstash/redis"
import { PrismaClient } from "@prisma/client"

const redis = Redis.fromEnv()
const prisma = new PrismaClient()

interface CachedApiKey {
  userId: string
  plan: "free" | "pro" | "enterprise"
}

async function resolveApiKey(rawKey: string): Promise<CachedApiKey | null> {
  const keyHash = createHash("sha256").update(rawKey).digest("hex")

  // 1. Check Redis first
  const cached = await redis.get(`apikey:${keyHash}`)
  if (cached) return JSON.parse(cached as string) as CachedApiKey

  // 2. Miss → query DB
  const record = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: {
      user: {
        select: {
          id: true,
          plan: true,
          quotaUsed: true,
          quotaResetAt: true,
        },
      },
    },
  })
  if (!record) return null

  const data: CachedApiKey = {
    userId: record.userId,
    plan: record.user.plan as "free" | "pro" | "enterprise",
  }

  // 3. Cache for 1 hour
  await redis.set(`apikey:${keyHash}`, JSON.stringify(data), { ex: 3600 })
  return data
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json(
      { error: { type: "auth_error", message: "Missing Authorization header" } },
      401
    )
  }

  const rawKey = authHeader.slice("Bearer ".length).trim()
  const user = await resolveApiKey(rawKey)

  if (!user) {
    return c.json(
      { error: { type: "auth_error", message: "Invalid API key" } },
      401
    )
  }

  c.set("user", user)
  c.set("userId", user.userId)
  await next()
}
