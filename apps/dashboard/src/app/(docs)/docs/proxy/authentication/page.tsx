import React from "react"
import type { Metadata } from "next"
import CodeBlock from "@/components/mdx/code-block"
import { Key } from "lucide-react"

export const metadata: Metadata = { title: "Authentication — AI Gateway Docs" }

export default function AuthPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Authentication</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Securely authenticating requests against the proxy utilizing generated API gateway keys.
        </p>
      </div>

      <h2>Standard Bearer Authentication</h2>
      <p>
        Just like OpenAI or Anthropic, AI Gateway expects its API keys to be passed via the standard HTTP <code>Authorization</code> header in the format <code>Bearer sk-gw-...</code>.
      </p>

      <CodeBlock 
        title="curl"
        language="bash"
        code={`curl -X POST https://gateway.yourdomain.com/v1/chat/completions \\
  -H "Authorization: Bearer sk-gw-1234abcd5678efgh" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "What is authentication?"}]
  }'`} 
      />

      <div className="not-prose my-8 bg-[#111111] border border-white/10 rounded-xl p-6 relative overflow-hidden flex gap-4 shadow-xl">
        <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-blue-500 rounded-l-xl"></div>
        <div className="mt-1 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10">
          <Key className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">Key Segregation</h4>
          <p className="text-sm text-[#888888] leading-relaxed m-0">
            Never expose your actual OpenAI or Anthropic credentials in your client code. AI Gateway entirely abstracts your root credentials. You should generate unique gateway keys on the dashboard for disparate microservices to track usage explicitly.
          </p>
        </div>
      </div>

      <h2>Using Official SDKs</h2>
      <p>
        Because AI Gateway mirrors OpenAI's endpoints completely, you can utilize the standard SDKs out-of-the-box by overriding the <code>baseURL</code> and supplying your Gateway Key instead of your OpenAI key.
      </p>

      <CodeBlock 
        title="typescript"
        language="typescript"
        code={`import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://gateway.yourdomain.com/v1",
  apiKey: "sk-gw-YOUR_GATEWAY_KEY", // Note: This is your Gateway Key!
});`} 
      />

      <h2>Key Hashes & Security</h2>
      <p>
        When you create an API Key on the Dashboard, the raw string is only ever shown once. In the Postgres Database, keys are securely stored utilizing cryptographic hashing (SHA-256) preventing lateral movement in the event of a database compromise. 
      </p>
    </>
  )
}
