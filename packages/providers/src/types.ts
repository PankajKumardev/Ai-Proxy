export interface MessageContentPart {
  type: string
  text?: string
  image_url?: { url: string }
  [key: string]: unknown
}

export interface Message {
  role: "system" | "user" | "assistant" | "tool"
  content: string | MessageContentPart[]
}

export interface ChatRequest {
  model: string
  messages: Message[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
  [key: string]: unknown
}

export interface UsageInfo {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface ChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    message: {
      role: string
      content: string
    }
    finish_reason: string
    index: number
  }[]
  usage?: UsageInfo
}

export interface GatewayResponse extends ChatResponse {
  request_id: string
  provider: string
  cached: boolean
  usage: UsageInfo & { estimated_cost: number }
}

export interface ProviderCallOptions {
  timeout?: number
  signal?: AbortSignal
  stream?: boolean
}

export interface UserContext {
  userId: string
  plan: "free" | "pro" | "enterprise"
  quotaUsed: number
  quotaResetAt: Date
}
