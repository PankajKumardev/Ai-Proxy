/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ai-gateway/providers", "@ai-gateway/cache", "@ai-gateway/logger"],
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
}

export default nextConfig
