# AI Gateway

> Open-source LLM proxy with caching, fallback routing, and usage analytics.

```
Your App → AI Gateway → OpenAI / Gemini / Anthropic
```

Save up to 40% on AI API costs. Zero code changes to your existing app.

## Architecture

```
        ┌─────────────┐
        │  Your App   │
        └──────┬──────┘
               │ POST /v1/chat/completions
               ▼
        ┌─────────────────────────┐
        │       AI Gateway        │
        │                         │
        │  Auth → Quota → Cache   │
        │  Rate Limit → Router    │
        │  Logger → Cost Track    │
        └──────┬──────────────────┘
               │
   ┌───────────┼───────────┐
   ▼           ▼           ▼
OpenAI      Gemini    Anthropic
```

## ⚡ Quick Start (under 5 minutes)

```bash
git clone https://github.com/you/ai-gateway
cd ai-gateway
cp .env.example .env
# add your keys to .env
docker compose up
```

## 💻 Drop-in replacement for the OpenAI SDK

```javascript
import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://your-gateway.railway.app/v1",
  apiKey: "sk-gw-xxxx",   // your gateway key, not your OpenAI key
})

// Any supported model — OpenAI, Gemini, Anthropic ↓
const response = await openai.chat.completions.create({
  model: "gpt-5.2",         // or: gemini-2.5-flash, claude-sonnet-4-6, gpt-5-nano...
  messages: [{ role: "user", content: "Hello!" }],
})
```

## 📊 What you get

- **Response caching** — SHA-256 exact match, save up to 40% on API costs
- **Automatic fallback** — if OpenAI goes down, Gemini picks up instantly
- **Smart routing** — `cheap` / `balanced` / `quality` modes per request
- **Token + cost dashboard** — know exactly what you're spending
- **Per-key rate limiting** — 100 req/min default, configurable
- **Self-hosted** — your data stays yours, MIT license

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Proxy | Hono 4.12 + Node.js |
| Database | Neon (Postgres) + Prisma 7 |
| Cache | Upstash Redis |
| Dashboard | Next.js 16 App Router |
| Auth | NextAuth v4 + bcrypt |

## 🔧 Configuration

Copy `.env.example` to `.env` and fill in:

```env
# Required
DATABASE_URL=postgresql://...         # Neon pooled connection string
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
OPENAI_KEYS=sk-key1,sk-key2          # comma-separated for rotation
NEXTAUTH_SECRET=your-secret

# Optional — fallback providers
GEMINI_KEYS=key1,key2
ANTHROPIC_KEYS=sk-ant-key1
```

> ⚠️ **Neon users:** Always use the **pooled** connection string (contains `pooler.neon.tech`). The direct connection will exhaust your connection pool under any real load.

## 🗺 Smart Routing

Send a header to choose your routing strategy per-request:

```
X-AI-Gateway-Mode: cheap      # cheapest provider first (Gemini Flash)
X-AI-Gateway-Mode: balanced   # fastest responding (default)
X-AI-Gateway-Mode: quality    # highest tier first (GPT-4o)
```

Pro-only feature. Free tier always uses OpenAI.

## 🔒 Security

- API keys stored as SHA-256 hashes — never plaintext
- Rate limiting per key via Upstash (100 req/min)
- CORS restricted to dashboard origin only
- Provider keys never exposed in responses
- Authorization header stripped before forwarding

## 📦 Monorepo Structure

```
ai-gateway/
├── apps/
│   ├── proxy/           # Hono proxy server (port 3000)
│   └── dashboard/       # Next.js app (marketing + docs + dashboard)
├── packages/
│   ├── cache/           # Upstash Redis wrappers
│   ├── providers/       # OpenAI, Gemini, Anthropic clients
│   └── logger/          # Async fire-and-forget logger
└── prisma/schema.prisma
```

## 🚀 Deployment

| Service | Platform |
|---|---|
| Proxy | Railway (Dockerfile deploy) |
| Dashboard | Vercel (connect GitHub) |
| Database | Neon (free tier) |
| Cache | Upstash (free tier) |

## 🤖 Supported Models (March 2026)

| Model | Provider | Input $/1M | Output $/1M |
|---|---|---|---|
| `gpt-5.4` | OpenAI | $2.50 | $15.00 |
| `gpt-5.2` | OpenAI | $1.75 | $14.00 |
| `gpt-5-mini` | OpenAI | $0.25 | $2.00 |
| `gpt-5-nano` | OpenAI | $0.05 | $0.40 |
| `gpt-4o` | OpenAI | $2.50 | $10.00 |
| `gpt-4o-mini` | OpenAI | $0.15 | $0.60 |
| `o3-mini` | OpenAI | $1.10 | $4.40 |
| `gemini-3.1-pro` | Gemini | $2.00 | $12.00 |
| `gemini-2.5-pro` | Gemini | $1.25 | $10.00 |
| `gemini-2.5-flash` | Gemini | $0.30 | $2.50 |
| `gemini-2.5-flash-lite` | Gemini | $0.10 | $0.40 |
| `claude-opus-4-6` | Anthropic | $5.00 | $25.00 |
| `claude-sonnet-4-6` | Anthropic | $3.00 | $15.00 |
| `claude-haiku-4-5` | Anthropic | $1.00 | $5.00 |

## 📄 License

MIT — free to use, self-host, and modify.
