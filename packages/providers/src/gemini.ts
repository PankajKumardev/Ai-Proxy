// packages/providers/src/gemini.ts
// Wraps Gemini API and converts request/response to OpenAI-compatible format

import type { ChatRequest, ChatResponse, ProviderCallOptions, Message } from "./types"
import { getProviderKey } from "./key-pool"

const BASE_URL =
  process.env.GEMINI_BASE_URL ?? "https://generativelanguage.googleapis.com"

interface GeminiContent {
  role: string
  parts: { text: string }[]
}

interface GeminiResponse {
  candidates: {
    content: { parts: { text: string }[] }
    finishReason: string
  }[]
  usageMetadata?: {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
  }
}

function convertMessagesToGemini(messages: Message[]): GeminiContent[] {
  // Gemini doesn't have a "system" role — prepend to first user message
  const systemMessages = messages.filter((m) => m.role === "system")
  const nonSystemMessages = messages.filter((m) => m.role !== "system")

  const systemText = systemMessages
    .map((m) => (typeof m.content === "string" ? m.content : JSON.stringify(m.content)))
    .join("\n")

  return nonSystemMessages.map((m, i) => {
    const text = typeof m.content === "string" ? m.content : JSON.stringify(m.content)
    const finalText = i === 0 && systemText ? `${systemText}\n\n${text}` : text
    return {
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: finalText }],
    }
  })
}

export async function callGemini(
  body: ChatRequest,
  geminiModel: string,
  options: ProviderCallOptions = {}
): Promise<ChatResponse> {
  const apiKey = await getProviderKey("gemini")
  const timeout = options.timeout ?? 10000

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort())
  }

  try {
    const url = `${BASE_URL}/v1/models/${geminiModel}:generateContent?key=${apiKey}`
    const geminiBody = {
      contents: convertMessagesToGemini(body.messages),
      generationConfig: {
        ...(body.temperature !== undefined && { temperature: body.temperature }),
        ...(body.max_tokens !== undefined && { maxOutputTokens: body.max_tokens }),
      },
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      const err = new Error(`Gemini error: ${response.status}`) as Error & {
        status: number
        body: unknown
      }
      err.status = response.status
      err.body = errBody
      throw err
    }

    const geminiResponse = (await response.json()) as GeminiResponse

    // Convert Gemini response to OpenAI format
    const content = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    return {
      id: `gemini-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: geminiModel,
      choices: [
        {
          message: { role: "assistant", content },
          finish_reason: "stop",
          index: 0,
        },
      ],
      usage: geminiResponse.usageMetadata
        ? {
            prompt_tokens: geminiResponse.usageMetadata.promptTokenCount ?? 0,
            completion_tokens: geminiResponse.usageMetadata.candidatesTokenCount ?? 0,
            total_tokens: geminiResponse.usageMetadata.totalTokenCount ?? 0,
          }
        : undefined,
    }
  } finally {
    clearTimeout(timer)
  }
}
