import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "API Key Management — AI Gateway Docs" }

export default function ApiKeysPage() {
  return (
    <>
      <div className="mb-10">
        <h1>API Key Management</h1>
        <p className="lead text-lg text-[#a3a3a3] mt-4">
          Creating deterministic API gateway keys for unique app contexts or environments.
        </p>
      </div>

      <h2>Gateway Key Structure</h2>
      <p>
        Gateway keys are structured using the prefix <code>sk-gw-</code> followed by secure hexadecimal or cryptographic text allocations natively. When interacting with the AI Gateway proxy endpoints running on your servers, only these specific generated strings operate valid payloads contextually.
      </p>

      <div className="not-prose my-8 bg-black border border-white/10 rounded-xl p-6 relative overflow-hidden flex gap-4">
        <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-blue-500 rounded-l-xl"></div>
        <div className="text-xl">🔐</div>
        <div>
          <h4 className="font-semibold text-white mb-1">Key Encryption Standard</h4>
          <p className="text-sm text-[#888888] leading-relaxed m-0">
            For maximum enterprise security compliance, Gateway Keys are only explicitly emitted during instantiation on the client UI. Subsequent logic merely identifies the hashes of said items within Postgres, mitigating vast security gaps.
          </p>
        </div>
      </div>

      <h2>Revocation</h2>
      <p>
        If a Gateway API key is leaked publicly, simply destroy it via the Dashboard interface. Subsequent payloads operating that precise Gateway Key format will instantly drop yielding HTTP Unauthorized contexts natively, irrespective of the core upstream LLM allocations intrinsically configured via the local <code>.env</code> file schemas.
      </p>
    </>
  )
}
