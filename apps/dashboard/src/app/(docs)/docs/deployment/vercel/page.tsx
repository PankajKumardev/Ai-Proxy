import React from "react"
import type { Metadata } from "next"
import { Triangle } from "lucide-react"

export const metadata: Metadata = { title: "Vercel Deployment — AI Gateway Docs" }

export default function VercelDeploymentPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Vercel Deployment</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Running AI Gateway serverless workflows efficiently via Vercel.
        </p>
      </div>

      <h2>Vercel Architectures</h2>
      <p>
        Because AI Gateway encapsulates a Next.js framework explicitly hosting both the marketing schema and the Dashboard layout natively, it intrinsically deploys via standard Vercel configurations effortlessly.
      </p>
      
      <p>
        <strong>Note:</strong> Hono API proxy routes utilizing Edge configurations also deploy synchronously to Vercel's global edge network without configuration overhead natively.
      </p>

      <div className="not-prose my-8 bg-[#111111] border border-white/10 rounded-xl p-6 relative overflow-hidden flex gap-4 shadow-xl">
        <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-white rounded-l-xl"></div>
        <div className="mt-1 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10">
          <Triangle className="w-3.5 h-3.5 text-white fill-white" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">Monorepo Root Setup</h4>
          <p className="text-sm text-[#888888] leading-relaxed m-0">
            During Vercel project instantiation, explicitly map the Root Directory configuration pointing generically at the <code>apps/dashboard</code> local path. Turbo handles local dependency resolution seamlessly.
          </p>
        </div>
      </div>

      <h2>Database Contexts in Serverless</h2>
      <p>
        If deploying AI Gateway explicitly on Vercel, ensure the Postgres <code>DATABASE_URL</code> string leverages connection pooling formats strictly. Direct un-pooled DB connections easily overwhelm serverless database topologies simultaneously.
      </p>
    </>
  )
}
