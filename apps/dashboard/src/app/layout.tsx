import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "AI Gateway", template: "%s | AI Gateway" },
  description:
    "Open-source LLM proxy with caching, fallback routing, and usage analytics. Save up to 40% on AI API costs with zero code changes.",
  keywords: ["AI Gateway", "LLM proxy", "OpenAI", "Gemini", "Anthropic", "API caching"],
  openGraph: {
    title: "AI Gateway — Open-source LLM Proxy",
    description: "Caching, fallback routing, and usage analytics for your AI apps.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
