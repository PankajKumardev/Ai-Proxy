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
import { router, routerStream } from "./router"

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
  setImmediate(async () => {
    try {
      // Check if user has opted into request/response logging
      let logData = { ...data }
      if (data.userId && (data.promptJson || data.responseJson)) {
        // UI Preview mode: default to not storing logs without querying missing Prisma fields
        const storeRequestLogs = false;
        if (!storeRequestLogs) {
          // User hasn't opted in — strip prompt/response content
          delete logData.promptJson
          delete logData.responseJson
        }
      }

      await prisma.usageLog.create({
        data: logData as Parameters<typeof prisma.usageLog.create>[0]["data"],
      })

      // Log retention: cap at 1,000 logs per user (fire-and-forget trim)
      if (data.userId) {
        const oldLogs = await prisma.usageLog.findMany({
          where: { userId: data.userId as string },
          orderBy: { timestamp: "desc" },
          skip: 1000,
          select: { id: true },
        })
        if (oldLogs.length > 0) {
          await prisma.usageLog.deleteMany({
            where: { id: { in: oldLogs.map((l) => l.id) } },
          })
        }
      }
    } catch (err: unknown) {
      console.error("[logger] DB write failed:", (err as Error).message)
    } finally {
      await prisma.$disconnect()
    }
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
  return bodyLimit({
    maxSize, onError: (c) =>
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

    // --- Streaming path (user opted in via stream: true) ---
    if (body.stream) {
      const abortController = new AbortController()
      c.req.raw.signal?.addEventListener("abort", () => abortController.abort())

      try {
        const { response: providerResponse, provider, model } = await routerStream(
          body,
          { user, mode, signal: abortController.signal }
        )

        const latencyMs = Date.now() - startTime

        // Fire-and-forget log (tokens unknown at stream-start — logged as 0)
        setImmediate(() => logUsage({
          requestId,
          userId: user.userId,
          provider,
          model,
          tokens: 0,         // unknown at stream-start; logged as 0
          cost: 0,
          cacheHit: false,
          latencyMs,
        }))

        // Pipe the raw provider SSE body directly to the client — real chunk passthrough
        const providerBody = providerResponse.body
        if (!providerBody) {
          return c.json({ error: { type: "provider_error", message: "Empty stream from provider" } }, 502)
        }

        return new Response(providerBody, {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
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
console.log(`AI Gateway proxy running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })

export default app
