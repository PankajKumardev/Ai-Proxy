import { PrismaClient } from "@prisma/client"
import type { Metadata } from "next"
import { CacheDistributionChart } from "@/components/cache-distribution-chart"

export const metadata: Metadata = { title: "Cache — AI Gateway Dashboard" }

export default async function CachePage() {
  // Bypassed auth and DB for UI testing
  
  const total = 14500
  const hits = 5200
  const misses = total - hits
  const hitRate = Math.round((hits / total) * 100)
  const avgCostPerRequest = 0.015
  const costSaved = hits * avgCostPerRequest

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-white">Cache Performance</h1>
          <p className="text-[#a3a3a3] mt-1 text-lg leading-relaxed">How much the cache is saving you.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Hit Rate", value: `${hitRate}%` },
          { label: "Total Hits", value: hits.toLocaleString() },
          { label: "Total Misses", value: misses.toLocaleString() },
          { label: "Cost Saved", value: `$${costSaved.toFixed(2)}` },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 relative flex flex-col shadow-sm transition-all duration-200 hover:bg-white/[0.02] hover:border-white/20 cursor-default"
          >
            <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest mb-4">{s.label}</div>
            <div className="text-3xl font-semibold tracking-tight text-white mt-1">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Hit vs Miss visual */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 relative flex flex-col h-full shadow-sm transition-all duration-200 hover:bg-white/[0.02] hover:border-white/20 cursor-default">
          <h2 className="text-sm font-medium tracking-wide text-white uppercase mb-8 relative z-10">Cache Distribution</h2>
          
          <div className="flex-1 flex flex-col justify-center relative z-10">
            <CacheDistributionChart hits={hits} misses={misses} />
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center mt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm bg-[#2DD4BF]" />
                <span className="text-[13px] font-medium tracking-tight text-neutral-400">
                  Hits: <span className="text-white ml-1">{hitRate}%</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm bg-[#52525B]" />
                <span className="text-[13px] font-medium tracking-tight text-neutral-400">
                  Misses: <span className="text-white ml-1">{100 - hitRate}%</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 shadow-sm transition-all duration-200 hover:bg-white/[0.02] hover:border-white/20 cursor-default">
          <h2 className="text-sm font-medium tracking-wide text-white uppercase mb-8">How the Cache Works</h2>
          <div className="space-y-6">
             {[
              ["Cache Key", "SHA-256 hash of the full request body (model + messages + temperature + max_tokens)"],
              ["Free Plan TTL", "24 hours — cache entries expire after 1 day"],
              ["Pro Plan TTL", "7 days — entries stay in cache for a full week"],
              ["Invalidation", "Streaming requests are never cached. Temperature > 0.9 skips cache. Image requests skip cache."],
              ["Opt-out", "Send X-AI-Gateway-No-Cache: true header to bypass cache for a specific request"],
              ["Cost on HIT", "$0.00 — provider is not called, no tokens billed"],
            ].map(([label, value], i) => (
              <div key={label} className={`flex flex-col sm:flex-row sm:gap-6 pb-6 ${i !== 5 ? "border-b border-white/5" : "pb-0"}`}>
                <div className="w-36 flex-shrink-0 text-[11px] font-medium tracking-widest text-neutral-500 uppercase mb-2 sm:mb-0 pt-1">
                  {label}
                </div>
                <div className="text-[13px] text-neutral-400 leading-relaxed tracking-tight">
                  <span className={label === "Cost on HIT" ? "text-white font-mono" : ""}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
