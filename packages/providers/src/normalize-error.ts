export function normalizeProviderError(provider: string, error: unknown) {
  const err = error as Record<string, unknown>
  // OpenAI: error.error.code, Gemini: error.error.status, Anthropic: error.type
  const status =
    (err?.status as number) ??
    ((err?.error as Record<string, unknown>)?.status as number) ??
    500

  const typeMap: Record<number, string> = {
    429: "rate_limit_error",
    401: "auth_error",
    403: "auth_error",
    400: "invalid_request_error",
    500: "provider_error",
    503: "provider_error",
  }

  return {
    error: {
      type: typeMap[status] ?? "provider_error",
      message: "Provider request failed",
      provider,
    },
  }
}

export function isRetryable(error: unknown): boolean {
  const err = error as Record<string, unknown>
  const status =
    (err?.status as number) ??
    ((err?.response as Record<string, unknown>)?.status as number)
  if (!status) return true // network error / timeout — always retry
  return [429, 500, 503].includes(status)
}
