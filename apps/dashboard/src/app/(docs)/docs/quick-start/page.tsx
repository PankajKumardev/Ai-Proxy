import React from "react"
import type { Metadata } from "next"
import CodeBlock from "@/components/mdx/code-block"

export const metadata: Metadata = { title: "Quick Start — AI Gateway Docs" }

export default function QuickStartPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Quick Start</h1>
        <p className="lead text-lg text-muted-foreground mt-4">
          Get the gateway running and accepting requests in under 5 minutes.
        </p>
      </div>

      <h2>1. Clone and configure</h2>
      <CodeBlock 
        title="bash"
        code={`git clone https://github.com/you/ai-gateway
cd ai-gateway
cp .env.example .env`} 
      />

      <p className="mt-6 mb-4">
        Open <code>.env</code> and add your credentials:
      </p>

      <CodeBlock 
        title=".env"
        language="env"
        code={`DATABASE_URL=postgresql://...pooler...     # Neon pooled string
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
OPENAI_KEYS=sk-proj-...
NEXTAUTH_SECRET=any-random-string`} 
      />

      <h2>2. Run with Docker</h2>
      <CodeBlock 
        title="bash"
        code={`docker compose up`} 
      />
      <p className="text-sm text-muted-foreground mt-2">
        The proxy is now running on <code>http://localhost:3000</code>.
      </p>

      <h2>3. Create a gateway API key</h2>
      <p>
        Sign up at <code>/signup</code>, go to API Keys, click <strong>+ Create New Key</strong>, and copy the key (shown only once).
      </p>

      <h2>4. Make your first request</h2>
      <CodeBlock 
        title="curl"
        language="bash"
        code={`curl -X POST http://localhost:3000/v1/chat/completions \\
  -H "Authorization: Bearer sk-gw-xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5.2",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`} 
      />

      <h2>5. Use the OpenAI SDK (zero changes)</h2>
      <CodeBlock 
        title="api.ts"
        language="typescript"
        code={`import OpenAI from "openai"  // npm install openai

const openai = new OpenAI({
  baseURL: "http://localhost:3000/v1",
  apiKey: "sk-gw-xxxx",         // your AI Gateway key
})

// Works with any supported model — OpenAI, Gemini, Anthropic
const res = await openai.chat.completions.create({
  model: "gpt-5.2",            // or gemini-2.5-flash, claude-sonnet-4-6
  messages: [{ role: "user", content: "Hello!" }],
})
console.log(res.choices[0].message.content)

// Use smart routing to pick the cheapest provider automatically:
const cheap = await openai.chat.completions.create({
  model: "gpt-5-mini",
  messages: [{ role: "user", content: "Summarise this text" }],
  // @ts-ignore - extra header for routing mode
  headers: { "X-AI-Gateway-Mode": "cheap" },
})`} 
      />

      <h2>6. Python example</h2>
      <CodeBlock 
        title="script.py"
        language="python"
        code={`# pip install openai
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3000/v1",
    api_key="sk-gw-xxxx",
)

response = client.chat.completions.create(
    model="gpt-5.2",  # or claudesonnet-4-6, gemini-2.5-flash
    messages=[{"role": "user", "content": "Hello from Python!"}],
)
print(response.choices[0].message.content)`} 
      />

      <div className="not-prose mt-12 mb-8 bg-primary/10 border border-primary/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 font-semibold text-primary">
          <span>⚡</span>
          <h4>That's it!</h4>
        </div>
        <p className="text-sm text-foreground/80 m-0 leading-relaxed">
          Make the same request twice — the second call returns instantly from cache and costs $0.00.
          Check the dashboard at <code className="bg-primary/5 px-1 py-0.5 rounded text-primary">/dashboard</code> to see usage data.
        </p>
      </div>
    </>
  )
}
