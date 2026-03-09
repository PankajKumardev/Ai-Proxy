// Async fire-and-forget logger — response is returned to user first, DB write happens after

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface LogEntry {
  requestId: string
  userId: string
  provider: string
  model: string
  tokens: number
  cost: number
  cacheHit: boolean
  latencyMs: number
  promptJson?: string
  responseJson?: string
}

export const logger = {
  log: (data: LogEntry) => {
    // setImmediate defers the Prisma write to the next iteration of the Node.js event loop
    // The user gets their response immediately, DB write happens milliseconds later
    setImmediate(() => {
      prisma.usageLog.create({ data }).catch((err: Error) => {
        console.error("[logger] Failed to write usage log:", err.message)
      })
    })
  },
}

export { prisma }
