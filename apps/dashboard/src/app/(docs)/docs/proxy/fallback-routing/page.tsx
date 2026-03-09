import React from "react"
import type { Metadata } from "next"
import CodeBlock from "@/components/mdx/code-block"
import { ShieldCheck } from "lucide-react"

export const metadata: Metadata = { title: "Fallback Routing — AI Gateway Docs" }

export default function FallbackPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Fallback & Smart Routing</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Eliminate cascading downtime across LLM services with deterministic fallback patterns.
        </p>
      </div>

      <h2>Cross-Provider Fallbacks</h2>
      <p>
        Often, OpenAI or Anthropic might experience intermittent 503 errors or extensive rate limiting. Instead of your app crashing, AI Gateway intercepts the upstream failure, analyzes payload maps, and dynamically translates your prompt architecture to be executed by a fallback provider instantly.
      </p>

      <div className="not-prose my-8 bg-[#111111] border border-white/10 rounded-xl p-6 relative overflow-hidden flex gap-4 shadow-lg">
        <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-emerald-500 rounded-l-xl"></div>
        <div className="mt-1 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">Zero-Config Defense</h4>
          <p className="text-sm text-[#888888] leading-relaxed m-0">
            Fallback routing initiates automatically. If you query <code>gpt-4o</code> and OpenAI's API flags an error, AI Gateway transparently modifies the request on the fly and retrieves an equivalent result from Gemini or Anthropic without alerting the client or dropping the promise.
          </p>
        </div>
      </div>

      <h2>Smart Routing Header</h2>
      <p>
        You can leverage specific models automatically by declaring an implicit architecture via the <code>X-AI-Gateway-Mode</code> header. The gateway contains a logic-map of relative equivalents.
      </p>

      <div className="not-prose border border-white/10 rounded-xl overflow-hidden mb-8 my-6">
        <table className="w-full text-sm text-left font-mono">
          <thead className="bg-[#111111] text-xs uppercase text-[#888888] border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold text-white">Routing Mode</th>
              <th className="px-6 py-4 font-semibold text-white">Targeted Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-black">
            <tr className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 text-[#d4d4d4]">cheap</td>
              <td className="px-6 py-4 text-[#a3a3a3] font-sans">Forces route to models like <code>gpt-4o-mini</code> or <code>gemini-2.5-flash</code> prioritizing lowest billable metric.</td>
            </tr>
            <tr className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 text-[#d4d4d4]">balanced</td>
              <td className="px-6 py-4 text-[#a3a3a3] font-sans">Weighs speed + cognitive capability (e.g., <code>gpt-5.2</code>).</td>
            </tr>
            <tr className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 text-[#d4d4d4]">quality</td>
              <td className="px-6 py-4 text-[#a3a3a3] font-sans">Prioritizes reasoning performance irrespective of token cost (e.g., <code>gpt-5.4</code>, <code>claude-opus-4-6</code>).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Implementation</h2>
      <p>Simply inject the preferred header parameter to your requests:</p>

      <CodeBlock 
        title="typescript"
        language="typescript"
        code={`const res = await openai.chat.completions.create({
  model: "gpt-5.2", // Will be mapped down to 'cheap' automatically if enabled
  messages: [{ role: "user", content: "Parse this data:" }],
  // @ts-ignore - Intelligent Router
  headers: { "X-AI-Gateway-Mode": "cheap" }
});`} 
      />
    </>
  )
}
