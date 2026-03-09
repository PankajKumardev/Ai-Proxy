import type { Metadata } from "next"

export const metadata: Metadata = { title: "Quick Start — AI Gateway Docs" }

export default function QuickStartPage() {
  return (
    <>
      <h1 style={{ fontSize: "36px", fontWeight: 800, color: "white", marginBottom: "16px" }}>Quick Start</h1>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", marginBottom: "32px" }}>
        Get the gateway running and accepting requests in under 5 minutes.
      </p>

      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "white", marginTop: "36px", marginBottom: "16px" }}>1. Clone and configure</h2>
      <pre style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "20px", fontSize: "13px", fontFamily: "monospace", color: "rgba(255,255,255,0.85)", overflow: "auto", lineHeight: 1.7 }}>
        {`git clone https://github.com/you/ai-gateway
cd ai-gateway
cp .env.example .env`}
      </pre>

      <p style={{ color: "rgba(255,255,255,0.65)", marginTop: "16px", marginBottom: "24px" }}>
        Open <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace", fontSize: "13px" }}>.env</code> and add your credentials:
      </p>

      <pre style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "20px", fontSize: "13px", fontFamily: "monospace", color: "rgba(255,255,255,0.85)", overflow: "auto", lineHeight: 1.7 }}>
        {`DATABASE_URL=postgresql://...pooler...     # Neon pooled string
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
OPENAI_KEYS=sk-proj-...
NEXTAUTH_SECRET=any-random-string`}
      </pre>

      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "white", marginTop: "36px", marginBottom: "16px" }}>2. Run with Docker</h2>
      <pre style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "20px", fontSize: "13px", fontFamily: "monospace", color: "rgba(255,255,255,0.85)", overflow: "auto", lineHeight: 1.7 }}>
        {`docker compose up`}
      </pre>
      <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "12px" }}>The proxy is now running on <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace", fontSize: "13px" }}>http://localhost:3000</code>.</p>

      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "white", marginTop: "36px", marginBottom: "16px" }}>3. Create a gateway API key</h2>
      <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: "16px" }}>Sign up at <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace", fontSize: "13px" }}>/signup</code>, go to API Keys, click <strong style={{ color: "white" }}>+ Create New Key</strong>, and copy the key (shown only once).</p>

      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "white", marginTop: "36px", marginBottom: "16px" }}>4. Make your first request</h2>
      <pre style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "20px", fontSize: "13px", fontFamily: "monospace", color: "rgba(255,255,255,0.85)", overflow: "auto", lineHeight: 1.7 }}>
{`curl -X POST http://localhost:3000/v1/chat/completions \\
  -H "Authorization: Bearer sk-gw-xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5.2",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
      </pre>

      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "white", marginTop: "36px", marginBottom: "16px" }}>5. Or use the OpenAI SDK (zero changes)</h2>
      <pre style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "20px", fontSize: "13px", fontFamily: "monospace", color: "rgba(255,255,255,0.85)", overflow: "auto", lineHeight: 1.7 }}>
{`import OpenAI from "openai"  // npm install openai

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
      </pre>

      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "white", marginTop: "36px", marginBottom: "16px" }}>6. Python example</h2>
      <pre style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "20px", fontSize: "13px", fontFamily: "monospace", color: "rgba(255,255,255,0.85)", overflow: "auto", lineHeight: 1.7 }}>
{`# pip install openai
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
      </pre>

      <div style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "10px", padding: "20px", marginTop: "32px" }}>
        <strong style={{ color: "#a855f7" }}>✓ That&apos;s it!</strong>
        <p style={{ color: "rgba(255,255,255,0.6)", margin: "8px 0 0", fontSize: "14px" }}>
          Make the same request twice — the second call returns instantly from cache and costs $0.00.
          Check the dashboard at <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>/dashboard</code> to see usage data.
        </p>
      </div>
    </>
  )
}
