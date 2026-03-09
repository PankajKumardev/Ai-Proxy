// Fallback router with provider health tracking, smart routing modes, and exponential backoff

import { Redis } from "@upstash/redis"
import { modelMap, callOpenAI, callOpenAIStream, callGemini, callGeminiStream, callAnthropic, callAnthropicStream, isRetryable } from "@ai-gateway/providers"
import type { ChatRequest, ChatResponse, UserContext } from "@ai-gateway/providers"

const redis = Redis.fromEnv()

const TIMEOUT_MS = parseInt(process.env.PROVIDER_TIMEOUT_MS ?? "10000")
const STREAM_TIMEOUT_MS = parseInt(process.env.STREAM_TIMEOUT_MS ?? "30000")

// Exponential backoff delays between provider attempts
const backoffMs = [0, 200, 500]

// Routing modes — provider order by strategy (March 2026)
const routingModes: Record<string, string[]> = {
  cheap: ["gemini", "anthropic", "openai"],   // Gemini 2.5 Flash-Lite cheapest ($0.10/1M)
  balanced: ["openai", "gemini", "anthropic"],    // GPT-5.2 / 2.5 Flash — fast + good
  quality: ["openai", "anthropic", "gemini"],    // GPT-5.4 → Claude Opus 4.6 → Gemini 3.1 Pro
}

// --- Provider health tracking ---

async function markProviderUnhealthy(provider: string): Promise<void> {
  const key = `provider:${provider}:failures`
  const failures = await redis.incr(key)
  if (failures === 1) await redis.expire(key, 60) // reset window every 60s
  if (failures >= 5) {
    await redis.set(`provider:${provider}:down`, "1", { ex: 60 })
  }
}

async function isProviderHealthy(provider: string): Promise<boolean> {
  const down = await redis.get(`provider:${provider}:down`)
  return !down
}

async function markProviderHealthy(provider: string): Promise<void> {
  await redis.del(`provider:${provider}:failures`)
  await redis.del(`provider:${provider}:down`)
}

// --- Provider caller ---

async function callProvider(
  provider: string,
  model: string,
  body: ChatRequest,
  options: { timeout: number; signal?: AbortSignal }
): Promise<ChatResponse> {
  const callOptions = { timeout: options.timeout, signal: options.signal }
  if (provider === "openai") {
    return callOpenAI({ ...body, model }, callOptions)
  } else if (provider === "gemini") {
    const geminiModel = modelMap[body.model]?.gemini ?? model
    return callGemini({ ...body, model }, geminiModel, callOptions)
  } else if (provider === "anthropic") {
    const anthropicModel = modelMap[body.model]?.anthropic ?? model
    return callAnthropic({ ...body, model }, anthropicModel, callOptions)
  }
  throw new Error(`Unknown provider: ${provider}`)
}

// --- Main router ---

export interface RouterResult {
  data: ChatResponse
  provider: string
  model: string
}

export async function router(
  body: ChatRequest,
  context: { user: UserContext; mode?: string; signal?: AbortSignal }
): Promise<RouterResult> {
  const { user, signal } = context
  const mode = context.mode ?? "balanced"

  // Free users only get OpenAI
  const providers =
    user.plan === "free"
      ? ["openai"]
      : (routingModes[mode] ?? routingModes.balanced)

  const errors: Error[] = []

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i]

    // Skip known-bad providers
    const healthy = await isProviderHealthy(provider)
    if (!healthy) {
      errors.push(new Error(`Provider ${provider} is temporarily unavailable`))
      continue
    }

    // Exponential backoff between retries
    if (i > 0 && backoffMs[i]) {
      await new Promise((res) => setTimeout(res, backoffMs[i]))
    }

    try {
      const response = await callProvider(provider, body.model, body, {
        timeout: body.stream ? STREAM_TIMEOUT_MS : TIMEOUT_MS,
        signal,
      })

      await markProviderHealthy(provider)
      return { data: response, provider, model: body.model }
    } catch (e) {
      const err = e as Error
      errors.push(err)

      if (!isRetryable(e)) {
        // 400, 401, 403 — caller error, fail immediately
        throw e
      }

      await markProviderUnhealthy(provider)
      // For retryable errors, try next provider
    }
  }

  // All providers failed
  const providersTried = providers
  const err = new Error("All providers failed") as Error & {
    status: number
    providers_tried: string[]
  }
  err.status = 502
  err.providers_tried = providersTried
  throw err
}

// --- Streaming router: returns raw SSE Response for passthrough ---

export interface RouterStreamResult {
  response: Response
  provider: string
  model: string
}

export async function routerStream(
  body: ChatRequest,
  context: { user: UserContext; mode?: string; signal?: AbortSignal }
): Promise<RouterStreamResult> {
  const { user, signal } = context
  const mode = context.mode ?? "balanced"

  const providers =
    user.plan === "free"
      ? ["openai"]
      : (routingModes[mode] ?? routingModes.balanced)

  const errors: Error[] = []

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i]

    const healthy = await isProviderHealthy(provider)
    if (!healthy) {
      errors.push(new Error(`Provider ${provider} is temporarily unavailable`))
      continue
    }

    if (i > 0 && backoffMs[i]) {
      await new Promise((res) => setTimeout(res, backoffMs[i]))
    }

    try {
      let streamResponse: Response

      if (provider === "openai") {
        streamResponse = await callOpenAIStream({ ...body, stream: true }, { timeout: STREAM_TIMEOUT_MS, signal })
      } else if (provider === "gemini") {
        const geminiModel = modelMap[body.model]?.gemini ?? body.model
        streamResponse = await callGeminiStream({ ...body }, geminiModel, { timeout: STREAM_TIMEOUT_MS, signal })
      } else if (provider === "anthropic") {
        const anthropicModel = modelMap[body.model]?.anthropic ?? body.model
        streamResponse = await callAnthropicStream({ ...body }, anthropicModel, { timeout: STREAM_TIMEOUT_MS, signal })
      } else {
        throw new Error(`Unknown provider: ${provider}`)
      }

      await markProviderHealthy(provider)
      return { response: streamResponse, provider, model: body.model }
    } catch (e) {
      const err = e as Error
      errors.push(err)
      if (!isRetryable(e)) throw e
      await markProviderUnhealthy(provider)
    }
  }

  const err = new Error("All providers failed") as Error & {
    status: number
    providers_tried: string[]
  }
  err.status = 502
  err.providers_tried = providers
  throw err
}
