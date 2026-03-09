// Fallback chain: tiktoken → character estimate

import type { Message } from "./types"

function messageToText(msg: Message): string {
  if (typeof msg.content === "string") return msg.content
  if (Array.isArray(msg.content)) {
    return msg.content
      .map((part) =>
        typeof part === "string"
          ? part
          : (part.text ?? JSON.stringify(part))
      )
      .join(" ")
  }
  return JSON.stringify(msg.content)
}

export function countTokens(model: string, messages: Message[]): number {
  try {
    // Primary: tiktoken (exact, OpenAI models)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { encoding_for_model } = require("tiktoken")
    const enc = encoding_for_model(model as Parameters<typeof encoding_for_model>[0])
    return messages.reduce(
      (sum: number, m: Message) => sum + enc.encode(messageToText(m)).length,
      0
    )
  } catch {
    // Last resort: 1 token ≈ 4 characters
    const text = messages.map(messageToText).join(" ")
    return Math.ceil(text.length / 4)
  }
}
