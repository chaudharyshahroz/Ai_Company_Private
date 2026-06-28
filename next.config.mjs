/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output produces a minimal server in `.next/standalone` that
  // the Dockerfile copies into the runtime image — keeps it small (~150MB)
  // instead of shipping node_modules + .next (~500MB).
  output: "standalone",

  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // Trust the proxy Dokploy/Traefik puts in front of the app so that
  // `request.headers.get("x-forwarded-proto")` returns "https" and
  // Next.js generates correct absolute URLs in server actions / OG.
  poweredByHeader: false,
};

export default nextConfig;