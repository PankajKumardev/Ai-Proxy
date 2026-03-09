import React from "react"
import type { Metadata } from "next"
import CodeBlock from "@/components/mdx/code-block"

export const metadata: Metadata = { title: "Caching — AI Gateway Docs" }

export default function CachingPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Response Caching</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Save compute, eliminate latency, and reduce API bills by leveraging edge-ready caching.
        </p>
      </div>

      <h2>How it works</h2>
      <p>
        Every time a request passes through the gateway, it is cryptographically hashed using SHA-256 (incorporating the model, the messages array, the temperature, and other deterministic payload properties). 
      </p>
      <p>
        If an identical payload is detected within the TTL window, the gateway entirely skips querying the upstream LLM provider and immediately responds with the Redis-cached string.
      </p>

      <div className="not-prose border border-white/10 rounded-xl overflow-hidden mb-8 my-6">
        <table className="w-full text-sm text-left font-mono">
          <thead className="bg-[#111111] text-xs uppercase text-[#888888] border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold text-white">Cache Status</th>
              <th className="px-6 py-4 font-semibold text-emerald-400">Gateway Cost</th>
              <th className="px-6 py-4 font-semibold text-white">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-black">
            <tr className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 text-[#d4d4d4]">MISS</td>
              <td className="px-6 py-4 text-emerald-400 font-medium font-sans">Full upstream cost</td>
              <td className="px-6 py-4 text-[#888888]">1,000ms - 5,000ms</td>
            </tr>
            <tr className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 text-[#d4d4d4]">HIT</td>
              <td className="px-6 py-4 text-emerald-400 font-medium font-sans">$0.00</td>
              <td className="px-6 py-4 text-[#888888]">&lt; 20ms</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Bypassing the Cache</h2>
      <p>
        In scenarios where you want to guarantee a fresh response (such as interactive chatting applications), simply pass the caching bypass header in your request.
      </p>

      <CodeBlock 
        title="curl"
        language="bash"
        code={`curl -X POST https://gateway... \\
  -H "Authorization: Bearer sk-gw-..." \\
  -H "X-AI-Gateway-Cache: false" \\
  -d '{"model": "gpt-5.2", "messages": [...] }'`} 
      />

      <p>Alternatively, using SDKs:</p>
      <CodeBlock 
        title="typescript"
        language="typescript"
        code={`const res = await openai.chat.completions.create({
  model: "gpt-5.2",
  messages: [{ role: "user", content: "Tell me a joke" }],
  // @ts-ignore - Bypass cache
  headers: { "X-AI-Gateway-Cache": "false" }
});`} 
      />

      <h2>TTL Configuration</h2>
      <p>
        TTL (Time-To-Live) governs how long items stay in the Redis payload dictionary. This varies based on the plan linked to your Gateway API key. Non-Pro tiers typically experience 24-hr TTL drops, while Production usage expands configuration limits significantly.
      </p>
    </>
  )
}
