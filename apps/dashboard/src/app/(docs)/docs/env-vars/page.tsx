import React from "react"
import type { Metadata } from "next"
import CodeBlock from "@/components/mdx/code-block"

export const metadata: Metadata = { title: "Environment Variables — AI Gateway Docs" }

export default function EnvVarsPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Environment Variables</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Complete reference for configuring AI Gateway.
        </p>
      </div>

      <h2>Required Variables</h2>
      <p>These environment variables must be defined for the gateway to operate correctly.</p>

      <div className="not-prose border border-white/10 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm text-left font-mono">
          <thead className="bg-[#111111] text-xs uppercase text-[#888888] border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold text-white">Variable</th>
              <th className="px-6 py-4 font-semibold text-white">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-black">
            <tr className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 font-medium text-blue-400">DATABASE_URL</td>
              <td className="px-6 py-4 text-[#a3a3a3]">Connection string for your Postgres instance. If using Neon, ensure you use the pooled connection string.</td>
            </tr>
            <tr className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 font-medium text-blue-400">NEXTAUTH_SECRET</td>
              <td className="px-6 py-4 text-[#a3a3a3]">Used to encrypt JWT tokens. Generate via <code className="text-[#d4d4d4] bg-white/5 px-1 py-0.5 rounded">openssl rand -base64 32</code>.</td>
            </tr>
            <tr className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 font-medium text-blue-400">UPSTASH_REDIS_REST_URL</td>
              <td className="px-6 py-4 text-[#a3a3a3]">HTTP endpoint for your Redis instance (required for rate limiting and caching).</td>
            </tr>
            <tr className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 font-medium text-blue-400">UPSTASH_REDIS_REST_TOKEN</td>
              <td className="px-6 py-4 text-[#a3a3a3]">Access token for your Redis instance.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Provider Credentials</h2>
      <p>You only need to configure API keys for the AI providers you actually intend to use.</p>

      <CodeBlock 
        title=".env"
        language="env"
        code={`OPENAI_KEYS="sk-proj-...,sk-proj-..."        # Comma separated
GEMINI_KEYS="AIzaSy...,AIzaSy..."            # Comma separated
ANTHROPIC_KEYS="sk-ant-...,sk-ant-..."       # Comma separated`} 
      />

      <h2>Optional Configuration</h2>
      <ul>
        <li><code>CACHE_TTL_MODIFIER</code> — Globally scale the TTL duration for all caching queries. Default is <code>1</code>.</li>
        <li><code>LOG_RETENTION_DAYS</code> — Specify how many days logs remain in the Postgres database before cleanup. Default is <code>30</code>.</li>
        <li><code>NEXT_PUBLIC_APP_URL</code> — Set to your production domain to fix auth callback routing. Example: <code>https://gateway.mycompany.com</code>.</li>
      </ul>
    </>
  )
}
