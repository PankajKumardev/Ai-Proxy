import type { ChatRequest, ChatResponse, ProviderCallOptions } from "./types"
import { getProviderKey } from "./key-pool"

const BASE_URL =
  process.env.OPENAI_BASE_URL ?? "https://api.openai.com"

export async function callOpenAI(
  body: ChatRequest,
  options: ProviderCallOptions = {}
): Promise<ChatResponse> {
  const apiKey = await getProviderKey("openai")
  const timeout = options.timeout ?? 10000

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  const signal = options.signal
    ? AbortSignal.any([options.signal, controller.signal])
    : controller.signal

  try {
    const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      const err = new Error(`OpenAI error: ${response.status}`) as Error & {
        status: number
        body: unknown
      }
      err.status = response.status
      err.body = errBody
      throw err
    }

    return response.json() as Promise<ChatResponse>
  } finally {
    clearTimeout(timer)
  }
}

export async function callOpenAIStream(
  body: ChatRequest,
  options: ProviderCallOptions = {}
): Promise<Response> {
  const apiKey = await getProviderKey("openai")
  const timeout = options.timeout ?? 30000

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort())
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ ...body, stream: true }),
      signal: controller.signal,
    })

    if (!response.ok) {
      clearTimeout(timer)
      const errBody = await response.json().catch(() => ({}))
      const err = new Error(`OpenAI stream error: ${response.status}`) as Error & {
        status: number
        body: unknown
      }
      err.status = response.status
      err.body = errBody
      throw err
    }

    return response
  } catch (e) {
    clearTimeout(timer)
    throw e
  }
}
