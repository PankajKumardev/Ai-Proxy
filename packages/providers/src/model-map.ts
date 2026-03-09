// packages/providers/src/model-map.ts
// Updated: March 2026 — latest models + verified per-1M pricing from provider pages

export interface ProviderModel {
  gemini?: string
  anthropic?: string
}

// Maps OpenAI-compatible model names → equivalent models on fallback providers
export const modelMap: Record<string, ProviderModel> = {
  // ─── GPT-5 family (OpenAI, released Aug–Mar 2025/26) ──────────────────────
  "gpt-5.4":      { gemini: "gemini-3.1-pro",      anthropic: "claude-opus-4-6" },
  "gpt-5.2":      { gemini: "gemini-2.5-pro",      anthropic: "claude-sonnet-4-6" },
  "gpt-5-mini":   { gemini: "gemini-2.5-flash",    anthropic: "claude-haiku-4-5" },
  "gpt-5-nano":   { gemini: "gemini-2.5-flash-lite", anthropic: "claude-haiku-4-5" },

  // ─── GPT-4o family (still widely used) ────────────────────────────────────
  "gpt-4o":       { gemini: "gemini-2.5-pro",      anthropic: "claude-sonnet-4-6" },
  "gpt-4o-mini":  { gemini: "gemini-2.5-flash",    anthropic: "claude-haiku-4-5" },

  // ─── Reasoning models ─────────────────────────────────────────────────────
  "o3-mini":      { gemini: "gemini-2.5-flash",    anthropic: "claude-sonnet-4-6" },
}

// Per-1M token pricing → stored as $/1K for the calculateCost() math below
// Source: OpenAI, Google AI Studio, Anthropic pricing pages (March 2026)
export const pricing: Record<string, { input: number; output: number }> = {
  // ─── OpenAI ───────────────────────────────────────────────────────────────
  //                              $/1M  →  /1000
  "gpt-5.4":           { input: 0.0025,  output: 0.015   }, // $2.50 / $15.00
  "gpt-5.2":           { input: 0.00175, output: 0.014   }, // $1.75 / $14.00
  "gpt-5-mini":        { input: 0.00025, output: 0.002   }, // $0.25 / $2.00
  "gpt-5-nano":        { input: 0.00005, output: 0.0004  }, // $0.05 / $0.40
  "gpt-4o":            { input: 0.0025,  output: 0.010   }, // $2.50 / $10.00
  "gpt-4o-mini":       { input: 0.00015, output: 0.0006  }, // $0.15 / $0.60
  "o3-mini":           { input: 0.0011,  output: 0.0044  }, // $1.10 / $4.40

  // ─── Google Gemini ────────────────────────────────────────────────────────
  "gemini-3.1-pro":       { input: 0.002,   output: 0.012   }, // $2.00 / $12.00
  "gemini-2.5-pro":       { input: 0.00125, output: 0.010   }, // $1.25 / $10.00
  "gemini-2.5-flash":     { input: 0.0003,  output: 0.0025  }, // $0.30 / $2.50
  "gemini-2.5-flash-lite":{ input: 0.0001,  output: 0.0004  }, // $0.10 / $0.40

  // ─── Anthropic Claude ─────────────────────────────────────────────────────
  "claude-opus-4-6":   { input: 0.005,   output: 0.025   }, // $5.00 / $25.00
  "claude-sonnet-4-6": { input: 0.003,   output: 0.015   }, // $3.00 / $15.00
  "claude-haiku-4-5":  { input: 0.001,   output: 0.005   }, // $1.00 / $5.00
}

export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const rates = pricing[model]
  if (!rates) return 0
  // rates are $/1K tokens
  return (promptTokens / 1000) * rates.input + (completionTokens / 1000) * rates.output
}
