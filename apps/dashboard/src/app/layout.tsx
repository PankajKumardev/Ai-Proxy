import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
