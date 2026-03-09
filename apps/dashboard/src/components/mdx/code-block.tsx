"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CodeBlock({ code, language = "bash", title }: { code: string, language?: string, title?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="not-prose my-6 relative group overflow-hidden rounded-xl border border-border/50 bg-[#0d0d10] shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-zinc-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {/* macOS traffic lights */}
          <div className="flex gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">{title || language}</span>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-md transition-colors",
            "text-muted-foreground hover:bg-white/10 hover:text-foreground",
            copied && "text-emerald-500 hover:text-emerald-400"
          )}
          title="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="p-4 md:p-5 overflow-auto bg-black font-mono text-sm leading-relaxed text-zinc-300">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}
