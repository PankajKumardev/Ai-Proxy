// apps/proxy/src/index.ts
// Main Hono proxy server — wire together all middleware and routes

import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { cors } from "hono/cors"
import { bodyLimit } from "hono/body-limit"
import { Redis } from "@upstash/redis"
import { logger as httpLogger } from "hono/logger"
import { modelMap, countTokens, calculateCost } from "@ai-gateway/providers"
import type { ChatRequest, UserContext } from "@ai-gateway/providers"
import { authMiddleware } from "./middleware/auth"
import { quotaMiddleware } from "./middleware/quota"
import { rateLimitMiddleware } from "./middleware/rate-limit"
import { cacheMiddleware } from "./middleware/cache"
import { router } from "./router"

// Type the context variables so c.set/c.get are not 'never'
type AppVariables = {
  requestId: string
  user: UserContext
  userId: string
}

// Fire-and-forget logger (write to prisma after response)
const redis = Redis.fromEnv()

async function logUsage(data: Record<string, unknown>) {
  const { PrismaClient } = await import("@prisma/client")
  const prisma = new PrismaClient()
  setImmediate(() => {
    prisma.usageLog.create({ data: data as Parameters<typeof prisma.usageLog.create>[0]["data"] })
      .catch((err: Error) => console.error("[logger] DB write failed:", err.message))
      .finally(() => prisma.$disconnect())
  })
}

const app = new Hono<{ Variables: AppVariables }>()

// --- 0. HTTP logger ---
app.use("*", httpLogger())

// --- 1. CORS ---
app.use("*", cors({
  origin: process.env.DASHBOARD_URL ?? "*",
  allowMethods: ["POST", "GET", "OPTIONS"],
  allowHeaders: ["Authorization", "Content-Type", "X-Request-ID", "X-AI-Gateway-Mode", "X-AI-Gateway-No-Cache"],
}))

// --- 2. Request ID middleware — runs first, before everything else ---
app.use("*", async (c, next) => {
  const requestId =
    c.req.header("X-Request-ID") ?? `req_${crypto.randomUUID().slice(0, 8)}`
  c.set("requestId", requestId)
  c.header("X-Request-ID", requestId)
  await next()
})

// --- 3. Dynamic body size limit (1MB text / 10MB images) ---
app.use("/v1/*", async (c, next) => {
  // Clone body first — consuming body stream prevents downstream middleware from reading it
  let hasImages = false
  try {
    const cloned = await c.req.raw.clone().json() as ChatRequest
    hasImages = cloned.messages?.some((m) =>
      Array.isArray(m.content) &&
      m.content.some((p) => (p as Record<string, unknown>).type === "image_url")
    ) ?? false
  } catch {
    // If not JSON, use default 1MB limit
  }
  const maxSize = hasImages ? 10 * 1024 * 1024 : 1 * 1024 * 1024
  return bodyLimit({ maxSize, onError: (c) =>
    c.json({ error: { type: "payload_error", message: "Request body exceeds allowed size" } }, 413)
  })(c, next)
})

// --- Health Check ---
app.get("/health", (c) =>
  c.json({
    status: "ok",
    version: "1.0.0",
    providers: Object.keys(modelMap),
  })
)

// --- Metrics endpoint ---
app.get("/metrics", async (c) => {
  const [totalReqs, cacheHits, cacheMisses, providerFailures] = await Promise.all([
    redis.get("metrics:total_requests").then((v) => Number(v ?? 0)),
    redis.get("metrics:cache_hits").then((v) => Number(v ?? 0)),
    redis.get("metrics:cache_misses").then((v) => Number(v ?? 0)),
    redis.get("metrics:provider_failures").then((v) => Number(v ?? 0)),
  ])
  c.header("Content-Type", "text/plain")
  return c.text(
    [
      `total_requests=${totalReqs}`,
      `cache_hits=${cacheHits}`,
      `cache_misses=${cacheMisses}`,
      `provider_failures=${providerFailures}`,
    ].join("\n")
  )
})

// --- Main Chat Completions Endpoint ---
app.post(
  "/v1/chat/completions",
  authMiddleware,
  quotaMiddleware,
  rateLimitMiddleware,
  async (c) => {
    const body = await c.req.json<ChatRequest>()
    const user = c.get("user") as UserContext
    const requestId = c.get("requestId") as string
    const mode = c.req.header("X-AI-Gateway-Mode") ?? "balanced"
    const startTime = Date.now()

    // Track total requests
    setImmediate(() => redis.incr("metrics:total_requests"))

    // --- Streaming path ---
    if (body.stream) {
      c.header("Content-Type", "text/event-stream")
      c.header("Cache-Control", "no-cache")
      c.header("Connection", "keep-alive")

      const abortController = new AbortController()
      c.req.raw.signal?.addEventListener("abort", () => abortController.abort())

      try {
        const result = await router(body, { user, mode, signal: abortController.signal })
        const { data: response, provider, model } = result

        const tokens = response.usage?.total_tokens ?? countTokens(model, body.messages)
        const cost = calculateCost(
          model,
          response.usage?.prompt_tokens ?? Math.floor(tokens * 0.7),
          response.usage?.completion_tokens ?? Math.floor(tokens * 0.3)
        )

        // Log after stream (fire-and-forget)
        const latencyMs = Date.now() - startTime
        setImmediate(() => logUsage({
          requestId,
          userId: user.userId,
          provider,
          model,
          tokens,
          cost,
          cacheHit: false,
          latencyMs,
        }))

        // Return SSE stream
        const streamBody = new ReadableStream({
          start(controller) {
            const content = response.choices?.[0]?.message?.content ?? ""
            const words = content.split(" ")

            // Simulate SSE chunks
            const sendChunk = async () => {
              for (const word of words) {
                const chunk = JSON.stringify({
                  id: response.id,
                  choices: [{ delta: { content: word + " " } }],
                })
                controller.enqueue(new TextEncoder().encode(`data: ${chunk}\n\n`))
                await new Promise((r) => setTimeout(r, 20))
              }
              controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
              controller.close()
            }

            sendChunk().catch(() => controller.close())
          },
        })

        return new Response(streamBody, {
          headers: {
            "Content-Type": "text/event-stream",
            "X-Request-ID": requestId,
          },
        })
      } catch (e) {
        setImmediate(() => redis.incr("metrics:provider_failures"))
        const err = e as Error & { providers_tried?: string[] }
        return c.json({
          error: {
            type: "provider_error",
            message: "All providers failed. Please try again.",
            providers_tried: err.providers_tried ?? [],
          }
        }, 502)
      }
    }

    // --- Non-streaming path (with cache) ---
    return cacheMiddleware(c, body, async () => {
      try {
        const result = await router(body, { user, mode })
        const { data: response, provider, model } = result

        const tokens = response.usage?.total_tokens ?? countTokens(model, body.messages)
        const cost = calculateCost(
          model,
          response.usage?.prompt_tokens ?? Math.floor(tokens * 0.7),
          response.usage?.completion_tokens ?? Math.floor(tokens * 0.3)
        )

        const latencyMs = Date.now() - startTime
        setImmediate(() => redis.incr("metrics:cache_misses"))

        // Fire-and-forget DB log
        setImmediate(() => logUsage({
          requestId,
          userId: user.userId,
          provider,
          model,
          tokens,
          cost,
          cacheHit: false,
          latencyMs,
        }))

        return {
          request_id: requestId,
          id: response.id,
          provider,
          model,
          object: response.object,
          created: response.created,
          choices: response.choices,
          usage: {
            prompt_tokens: response.usage?.prompt_tokens ?? Math.floor(tokens * 0.7),
            completion_tokens: response.usage?.completion_tokens ?? Math.floor(tokens * 0.3),
            total_tokens: tokens,
            estimated_cost: cost,
          },
        }
      } catch (e) {
        setImmediate(() => redis.incr("metrics:provider_failures"))
        const err = e as Error & { status?: number; providers_tried?: string[] }

        if (err.status === 502) {
          throw c.json({
            error: {
              type: "provider_error",
              message: "All providers failed. Please try again.",
              providers_tried: err.providers_tried ?? [],
            }
          }, 502)
        }
        throw e
      }
    })
  }
)

// --- 404 fallback ---
app.notFound((c) =>
  c.json({ error: { type: "not_found", message: "Route not found" } }, 404)
)

// --- Start server ---
const port = parseInt(process.env.PORT ?? "3000")
console.log(`🚀 AI Gateway proxy running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })

export default app
