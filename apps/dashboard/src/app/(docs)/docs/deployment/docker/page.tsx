import React from "react"
import type { Metadata } from "next"
import CodeBlock from "@/components/mdx/code-block"
import { Server } from "lucide-react"

export const metadata: Metadata = { title: "Docker Deployment — AI Gateway Docs" }

export default function DockerDeploymentPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Docker Deployment</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Running the complete AI Gateway locally or on servers instantly.
        </p>
      </div>

      <h2>Docker Compose</h2>
      <p>
        The absolute fastest way to instantiate AI Gateway outside of Vercel or Railway is strictly utilizing Docker Compose logic. Our pre-bundled Compose architecture spins both the <b>Web Dashboard</b> and the <b>Edge Proxy</b> on local ports synchronously.
      </p>

      <CodeBlock 
        title="bash"
        code={`git clone https://github.com/your-repo/ai-gateway.git
cd ai-gateway
cp .env.example .env

# Edit .env variables, then...
docker compose up -d`} 
      />

      <div className="not-prose my-8 bg-[#111111] border border-white/10 rounded-xl p-6 relative overflow-hidden flex gap-4 shadow-xl">
        <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-blue-500 rounded-l-xl"></div>
        <div className="mt-1 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20">
          <Server className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">Port Mapping</h4>
          <p className="text-sm text-[#888888] leading-relaxed m-0">
            By default, <code>docker-compose.yml</code> will bind the Dashboard UI to port <code>3000</code> and the Proxy API logic directly to port <code>8787</code> natively.
          </p>
        </div>
      </div>

      <h2>Container Image Specifics</h2>
      <p>
        We build minimalist Node.js Alpine images explicitly to ensure ultra-low storage footprints natively. If deploying explicitly via Swarm or Kubernetes, configure contexts utilizing normal load balancers mapping Port <code>3000</code> respectively.
      </p>
    </>
  )
}
