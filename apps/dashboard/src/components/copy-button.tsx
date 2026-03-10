"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <>
      <button 
        onClick={handleCopy}
        className="p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-white/10 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 outline-none"
        title="Copy to clipboard"
        type="button"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      {copied && (
         <div className="fixed bottom-6 right-6 bg-[#000000] border border-white/10 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-sm font-medium z-50 animate-in slide-in-from-bottom-5 duration-300">
           <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
             <Check className="w-3.5 h-3.5 text-emerald-500" />
           </div>
           Key copied to clipboard
         </div>
      )}
    </>
  )
}
