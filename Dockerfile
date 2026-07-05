# syntax=docker/dockerfile:1.7

# ─── Stage 1: install deps with the lockfile ──────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only manifests first for a cache-friendly install.
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ─── Stage 2: build the Next.js app ───────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects telemetry by default; disable for the build.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build-time placeholders so `next build` doesn't crash on missing env.
# Real values come from Dokploy's runtime env vars — never baked into the image.
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
ENV NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
ENV NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=placeholder

RUN npm run build

# ─── Stage 3: minimal runtime image ───────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user for runtime — Dokploy/Traefik-friendly.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy only what's needed to run:
#  - public/        — static assets
#  - .next/standalone — the standalone Next.js server (includes node_modules pruned to deps)
#  - .next/static   — compiled static assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Optional but recommended: run database migrations on container start
# (only if DATABASE_URL is set). Skip if you run migrations separately.
# COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
# COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./drizzle.config.ts

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
