import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Railway Deployment — AI Gateway Docs" }

export default function RailwayDeploymentPage() {
  return (
    <>
      <div className="mb-10">
        <h1>Railway Deployment</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          One-click launch strategy via Railway App frameworks natively.
        </p>
      </div>

      <h2>Deploy on Railway</h2>
      <p>
        Railway comprises an ideal infrastructure host for the Gateway given native Redis and Postgres primitives strictly available in identical projects seamlessly.
      </p>

      <div className="not-prose my-16 bg-black border border-white/10 rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <h4 className="font-semibold text-white mb-4">Deploy Instant Instance</h4>
        <a href="https://railway.app/new" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white text-black h-12 px-8 rounded-md font-semibold font-mono tracking-tight hover:scale-[0.98] transition-transform shadow-lg shadow-white/10">
          Deploy to Railway  →
        </a>
      </div>

      <h2>Manual Setup Checklist</h2>
      <p>If instantiating Railway without the one-click template:</p>
      <ul>
        <li>Deploy a <b>PostgreSQL</b> module locally inside the Railway Project.</li>
        <li>Deploy a <b>Redis</b> module locally.</li>
        <li>Connect Github Repo defining the monorepo root.</li>
        <li>Execute explicit builds via <code>npm run build</code> utilizing Turbo pipelines.</li>
      </ul>
    </>
  )
}
