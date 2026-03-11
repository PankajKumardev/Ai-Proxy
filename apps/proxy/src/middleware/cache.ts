// Hybrid cache: SHA-256 exact match first, semantic vector similarity as fallback
// Uses Upstash Vector built-in inference (no separate embedding API call needed)

import type { Context } from "hono"
import { Redis } from "@upstash/redis"
import { Index } from "@upstash/vector"
import { createHash } from "crypto"
import type { ChatRequest } from "@ai-gateway/providers"

const redis = Redis.fromEnv()
const vector = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

// Cosine similarity threshold for semantic cache hit
// 0.97 = very similar, safe to return cached. Tune lower (0.92) for more hits.
const SIMILARITY_THRESHOLD = parseFloat(
  process.env.SEMANTIC_CACHE_THRESHOLD ?? "0.97"
)

// Per-plan cache TTL (seconds)
function getCacheTTL(plan: string): number {
  const enterpriseTTL = parseInt(process.env.ENTERPRISE_TTL_SECONDS ?? "604800")
  if (plan === "free") return 86400    // 24 hours
  if (plan === "pro") return 604800   // 7 days
  return enterpriseTTL               // enterprise: configurable
}

// Skip cache for: streaming, high temperature (creative), images, manual bypass
function shouldSkipCache(body: ChatRequest, c: Context): boolean {
  if (body.stream === true) return true
  if ((body.temperature ?? 1) > 0.9) return true
  if (c.req.header("X-AI-Gateway-No-Cache") === "true") return true
  const hasImages = body.messages?.some((m) =>
    Array.isArray(m.content) &&
    m.content.some(
      (p) => (p as unknown as Record<string, unknown>).type === "image_url"
    )
  )
  if (hasImages) return true
  return false
}

// Build SHA-256 key from the full body (exact match)
function exactCacheKey(body: ChatRequest): string {
  return `cache:exact:${createHash("sha256").update(JSON.stringify(body)).digest("hex")}`
}

// Extract the semantic "meaning" of a request — just user messages, no params
// This is what we embed and compare semantically
function extractPromptText(body: ChatRequest): string {
  return (body.messages ?? [])
    .filter((m) => m.role === "user")
    .map((m) =>
      typeof m.content === "string"
        ? m.content
        : JSON.stringify(m.content) // handle multi-modal content arrays
    )
    .join("\n---\n")
}

// Build a stable vector ID namespaced per user — prevents cross-user cache leakage
function vectorId(userId: string, promptText: string): string {
  return createHash("sha256").update(`${userId}:${promptText}`).digest("hex")
}

// ─── Main cache middleware ────────────────────────────────────────────────────
export async function cacheMiddleware(
  c: Context,
  body: ChatRequest,
  handler: () => Promise<Record<string, unknown>>
): Promise<Response> {
  const user = c.get("user") as { userId: string; plan: string }

  if (shouldSkipCache(body, c)) {
    const result = await handler()
    return c.json({ ...result, cached: false, cache_type: "skip" })
  }

  const exactKey = exactCacheKey(body)
  const promptText = extractPromptText(body)

  // ── Phase 1: Exact SHA-256 cache lookup (< 1ms) ────────────────────────────
  const exactHit = await redis.get(exactKey)
  if (exactHit) {
    // Track metrics
    setImmediate(() => redis.incr("metrics:cache_hits"))
    return c.json({
      ...(JSON.parse(exactHit as string) as Record<string, unknown>),
      cached: true,
      cache_type: "exact",
      request_id: c.get("requestId"),
    })
  }

  // ── Phase 2: Semantic vector similarity search (~10-20ms) ──────────────────
  let semanticHit: Record<string, unknown> | null = null

  if (promptText.length > 0) {
    try {
      const results = await vector.query({
        data: promptText,                   // Upstash handles embedding server-side
        topK: 1,
        includeMetadata: true,
        filter: `userId = '${user.userId}'`, // per-user isolation — no cross-user cache hits
      })

      const top = results[0]
      if (top && top.score >= SIMILARITY_THRESHOLD && top.metadata) {
        semanticHit = top.metadata as Record<string, unknown>
      }
    } catch {
      // Vector search is best-effort — never block the request if it fails
    }
  }

  if (semanticHit) {
    // Track metrics
    setImmediate(() => redis.incr("metrics:cache_hits"))
    return c.json({
      ...semanticHit,
      cached: true,
      cache_type: "semantic",
      request_id: c.get("requestId"),
    })
  }

  // ── Phase 3: Cache miss — acquire stampede lock, call LLM ─────────────────
  const lockKey = `${exactKey}:lock`
  const lockAcquired = await redis.set(lockKey, "1", { nx: true, ex: 10 })

  if (!lockAcquired) {
    // Another concurrent request is already fetching — wait briefly, then retry
    await new Promise((res) => setTimeout(res, 250))
    const retried = await redis.get(exactKey)
    if (retried) {
      return c.json({
        ...(JSON.parse(retried as string) as Record<string, unknown>),
        cached: true,
        cache_type: "exact",
        request_id: c.get("requestId"),
      })
    }
    // Still nothing — fall through and call LLM anyway
  }

  try {
    const response = await handler()
    const responseSize = Buffer.byteLength(JSON.stringify(response))
    const ttl = getCacheTTL(user.plan)

    if (responseSize < 500 * 1024) {
      // Store in both SHA-256 cache and vector DB (fire-and-forget writes)
      await Promise.allSettled([
        // Exact cache: fast lookup for identical future requests
        redis.set(exactKey, JSON.stringify(response), { ex: ttl }),

        // Semantic cache: similarity lookup for paraphrased future requests
        promptText.length > 0
          ? vector.upsert({
              id: vectorId(user.userId, promptText), // namespaced per user
              data: promptText,             // Upstash embeds this server-side
              metadata: { ...response, userId: user.userId }, // tag for filter isolation
            })
          : Promise.resolve(),
      ])
    }

    return c.json({
      ...response,
      cached: false,
      cache_type: "miss",
      request_id: c.get("requestId"),
    })
  } finally {
    await redis.del(lockKey)
  }
}
