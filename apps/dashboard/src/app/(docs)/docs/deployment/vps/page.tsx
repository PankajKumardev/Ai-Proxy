import React from "react"
import type { Metadata } from "next"
import CodeBlock from "@/components/mdx/code-block"
import { Globe } from "lucide-react"

export const metadata: Metadata = { title: "VPS Deployment — AI Gateway Docs" }

export default function VpsDeploymentPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Self-Hosted VPS</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Bare-metal configuration logic rendering high-throughput API proxy schemas.
        </p>
      </div>

      <h2>Standard PM2 Execution</h2>
      <p>
        If avoiding Docker constructs on generic Debian/Ubuntu VPS environments, standard Node context initialization utilizing Process Managers (PM2) yields exceptionally robust throughput mechanisms natively.
      </p>

      <CodeBlock 
        title="bash"
        code={`git clone https://github.com/your-repo/ai-gateway.git
cd ai-gateway
npm install

npm run db:push
npm run build

npm install -g pm2
pm2 start npm --name "ai-gateway" -- start`} 
      />

      <div className="not-prose my-8 bg-[#111111] border border-white/10 rounded-xl p-6 relative overflow-hidden flex gap-4 shadow-lg">
        <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-purple-500 rounded-l-xl"></div>
        <div className="mt-1 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20">
          <Globe className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">Nginx Reverse Proxy</h4>
          <p className="text-sm text-[#888888] leading-relaxed m-0">
            It is strongly recommended to securely route web footprints terminating SSL/TLS certificates employing Nginx proxy-pass mechanics directed locally to port `3000`.
          </p>
        </div>
      </div>
    </>
  )
}
