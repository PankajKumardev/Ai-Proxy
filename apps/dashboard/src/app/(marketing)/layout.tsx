import Link from "next/link"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#fafafa]">
      {/* Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-widest uppercase text-white hover:opacity-80 transition-opacity text-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            AI Gateway
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/docs/introduction" className="text-[#a3a3a3] hover:text-white transition-colors">Docs</Link>
            <Link href="/pricing" className="text-[#a3a3a3] hover:text-white transition-colors">Pricing</Link>
            <a href="https://github.com/pankajkumardev/ai-Proxy" target="_blank" className="text-[#a3a3a3] hover:text-white transition-colors">GitHub</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#000000] pt-16 pb-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-widest uppercase text-white mb-4 text-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              AI Gateway
            </Link>
            <p className="text-sm text-[#888888] leading-relaxed max-w-xs">
              Enterprise LLM routing, minus the enterprise subscription. Deploy caching and fallback strategies directly to your own infrastructure.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/pricing" className="text-[#888888] hover:text-white transition-colors">Pricing</Link></li>
              <li><a href="http://github.com/pankajkumardev/ai-Proxy" className="text-[#888888] hover:text-white transition-colors" target="_blank">Open Source</a></li>
              <li><Link href="/docs/introduction" className="text-[#888888] hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/docs/introduction" className="text-[#888888] hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/docs/quick-start" className="text-[#888888] hover:text-white transition-colors">Quick Start</Link></li>
              <li><a href="https://railway.app" className="text-[#888888] hover:text-white transition-colors">Deploy to Railway</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="https://twitter.com/pankajkumar_dev" className="text-[#888888] hover:text-white transition-colors" target="_blank">Twitter / X</a></li>
              <li><a href="mailto:pankajams1234@gmail.com" className="text-[#888888] hover:text-white transition-colors" target="_blank">Contact</a></li>
              <li><a href="https://github.com/pankajkumardev/ai-Proxy/blob/main/LICENSE" className="text-[#888888] hover:text-white transition-colors" target="_blank">License</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[#555555]">
            © {new Date().getFullYear()} AI Gateway - MIT Licensed Project
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#27c93f]"></span>
            <span className="text-xs font-medium text-[#888888] uppercase tracking-wider">All Systems Normal</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
