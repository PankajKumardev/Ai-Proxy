// packages/providers/src/anthropic.ts
// Wraps Anthropic API and converts request/response to OpenAI-compatible format

import type { ChatRequest, ChatResponse, ProviderCallOptions, Message } from "./types"
import { getProviderKey } from "./key-pool"

const BASE_URL = process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com"

interface AnthropicResponse {
  id: string
  content: { type: string; text: string }[]
  model: string
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

interface AnthropicMessage {
  role: "user" | "assistant"
  content: string
}

export async function callAnthropic(
  body: ChatRequest,
  anthropicModel: string,
  options: ProviderCallOptions = {}
): Promise<ChatResponse> {
  const apiKey = await getProviderKey("anthropic")
  const timeout = options.timeout ?? 10000

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort())
  }

  try {
    // Extract system message; Anthropic handles it separately
    const systemMessages = body.messages.filter((m: Message) => m.role === "system")
    const systemText = systemMessages
      .map((m: Message) =>
        typeof m.content === "string" ? m.content : JSON.stringify(m.content)
      )
      .join("\n")

    const nonSystemMessages: AnthropicMessage[] = body.messages
      .filter((m: Message) => m.role !== "system")
      .map((m: Message) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content:
          typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      }))

    const anthropicBody: Record<string, unknown> = {
      model: anthropicModel,
      messages: nonSystemMessages,
      max_tokens: body.max_tokens ?? 4096,
      ...(systemText && { system: systemText }),
      ...(body.temperature !== undefined && { temperature: body.temperature }),
    }

    const response = await fetch(`${BASE_URL}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2024-06-20",
      },
      body: JSON.stringify(anthropicBody),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      const err = new Error(`Anthropic error: ${response.status}`) as Error & {
        status: number
        body: unknown
      }
      err.status = response.status
      err.body = errBody
      throw err
    }

    const anthropicResponse = (await response.json()) as AnthropicResponse

    // Convert Anthropic response to OpenAI format
    const content =
      anthropicResponse.content?.find((c) => c.type === "text")?.text ?? ""
    return {
      id: anthropicResponse.id,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: anthropicModel,
      choices: [
        {
          message: { role: "assistant", content },
          finish_reason: anthropicResponse.stop_reason,
          index: 0,
        },
      ],
      usage: {
        prompt_tokens: anthropicResponse.usage?.input_tokens ?? 0,
        completion_tokens: anthropicResponse.usage?.output_tokens ?? 0,
        total_tokens:
          (anthropicResponse.usage?.input_tokens ?? 0) +
          (anthropicResponse.usage?.output_tokens ?? 0),
      },
    }
  } finally {
    clearTimeout(timer)
  }
}

export async function callAnthropicStream(
  body: ChatRequest,
  anthropicModel: string,
  options: ProviderCallOptions = {}
): Promise<Response> {
  const apiKey = await getProviderKey("anthropic")
  const timeout = options.timeout ?? 30000

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort())
  }

  try {
    const systemMessages = body.messages.filter((m: Message) => m.role === "system")
    const systemText = systemMessages
      .map((m: Message) =>
        typeof m.content === "string" ? m.content : JSON.stringify(m.content)
      )
      .join("\n")

    const nonSystemMessages = body.messages
      .filter((m: Message) => m.role !== "system")
      .map((m: Message) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content:
          typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      }))

    const anthropicBody: Record<string, unknown> = {
      model: anthropicModel,
      messages: nonSystemMessages,
      max_tokens: body.max_tokens ?? 4096,
      stream: true,
      ...(systemText && { system: systemText }),
      ...(body.temperature !== undefined && { temperature: body.temperature }),
    }

    const response = await fetch(`${BASE_URL}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2024-06-20",
      },
      body: JSON.stringify(anthropicBody),
      signal: controller.signal,
    })

    if (!response.ok) {
      clearTimeout(timer)
      const errBody = await response.json().catch(() => ({}))
      const err = new Error(`Anthropic stream error: ${response.status}`) as Error & {
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
