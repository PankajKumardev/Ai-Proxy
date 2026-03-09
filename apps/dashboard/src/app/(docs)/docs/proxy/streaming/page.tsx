import React from "react"
import type { Metadata } from "next"
import CodeBlock from "@/components/mdx/code-block"
import { Zap } from "lucide-react"

export const metadata: Metadata = { title: "Streaming — AI Gateway Docs" }

export default function StreamingPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Streaming</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Utilizing real-time stream processing with AI Gateway and native browser integrations.
        </p>
      </div>

      <h2>Server-Sent Events</h2>
      <p>
        AI Gateway does not disrupt standard LLM stream behaviors. If you deploy `stream: true` within your payload architectures, Hono and Edge middleware structures instantly pass the chunk-payload data forward via SSE.
      </p>

      <CodeBlock 
        title="curl"
        language="bash"
        code={`curl -X POST https://gateway.yourdomain.com/v1/chat/completions \\
  -H "Authorization: Bearer sk-gw-1234abcd5678efgh" \\
  -d '{
    "model": "gpt-5.2",
    "stream": true,
    "messages": [{"role": "user", "content": "Write a long essay."}]
  }'`} 
      />

      <div className="not-prose my-8 bg-[#111111] border border-white/10 rounded-xl p-6 relative overflow-hidden flex gap-4 shadow-lg">
        <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-yellow-500 rounded-l-xl"></div>
        <div className="mt-1 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">Streaming & Cache Intersections</h4>
          <p className="text-sm text-[#888888] leading-relaxed m-0">
            If a payload targets a cached response, the data is delivered non-streamed instantly within ~15ms. Streaming behavior only actively operates when a cache MISS occurs, invoking the actual upstream LLM instance natively.
          </p>
        </div>
      </div>

      <h2>Usage Analysis during Streams</h2>
      <p>
        The Gateway internally aggregates stream chunk topologies in buffer memory arrays before executing standard Database commit behaviors. Thus, stream operations still adequately map and reflect inside the Dashboard tokens telemetry properly accurately.
      </p>
    </>
  )
}
