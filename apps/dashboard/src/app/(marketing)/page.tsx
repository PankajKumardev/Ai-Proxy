import type { Metadata } from "next";
import { ClientPage } from "./animated-marketing";

export const metadata: Metadata = {
  title: "AI Gateway — Open-source LLM Proxy with Caching & Fallback Routing",
  description:
    "Stop paying for duplicate AI API calls. AI Gateway adds caching, fallback routing, and usage analytics between your app and OpenAI, Gemini, or Anthropic.",
};

export default function HomePage() {
  return <ClientPage />;
}
