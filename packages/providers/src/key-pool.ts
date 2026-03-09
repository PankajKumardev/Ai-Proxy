// Round-robin key rotation using Redis atomic counters

import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

const pools: Record<string, string[]> = {
  openai: (process.env.OPENAI_KEYS ?? process.env.OPENAI_API_KEY ?? "")
    .split(",")
    .filter(Boolean),
  gemini: (process.env.GEMINI_KEYS ?? process.env.GEMINI_API_KEY ?? "")
    .split(",")
    .filter(Boolean),
  anthropic: (
    process.env.ANTHROPIC_KEYS ??
    process.env.ANTHROPIC_API_KEY ??
    ""
  )
    .split(",")
    .filter(Boolean),
}

export async function getProviderKey(provider: string): Promise<string> {
  const pool = pools[provider]
  if (!pool?.length) throw new Error(`No keys configured for ${provider}`)
  if (pool.length === 1) return pool[0]

  // Round-robin counter per provider stored in Redis
  const idx = await redis.incr(`keypool:${provider}`)
  return pool[idx % pool.length]
}

export function hasProviderKey(provider: string): boolean {
  return Boolean(pools[provider]?.length)
}
