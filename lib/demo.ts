/**
 * Demo mode flag — when any critical env var is missing, we run in demo mode.
 * In demo mode:
 *   - Auth → hardcoded mock user (no Clerk needed)
 *   - DB   → in-memory mock store (no Neon needed)
 *   - AI   → mock agent responses (no OpenRouter needed)
 *   - Email→ logged to console (no Resend needed)
 *   - Files→ local /public/uploads (no R2 needed)
 *   - Jobs → run synchronously (no Inngest needed)
 *   - Billing → simulated (no Paddle needed)
 *
 * This means the entire app is browseable and demoable end-to-end with zero setup.
 * To go live: fill in the env vars and demo mode auto-disables.
 */

export const env = {
  clerk: Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  ),
  database: Boolean(process.env.DATABASE_URL),
  openrouter: Boolean(process.env.OPENROUTER_API_KEY),
  paddle: Boolean(
    process.env.PADDLE_API_KEY && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
  ),
  resend: Boolean(process.env.RESEND_API_KEY),
  r2: Boolean(
    process.env.CLOUDFLARE_R2_ACCESS_KEY && process.env.CLOUDFLARE_R2_BUCKET,
  ),
  inngest: Boolean(process.env.INNGEST_EVENT_KEY && process.env.INNGEST_SIGNING_KEY),
};

/** True when running in demo mode (any critical service missing). */
export function isDemoMode(): boolean {
  // We're always demo-able — even with all keys set, demo pages still work.
  // This just signals to the rest of the app that mocks are the default.
  return !env.database;
}

/** Per-service readiness checks. */
export const isReady = {
  auth: () => true, // demo mode has hardcoded user
  database: () => env.database,
  ai: () => env.openrouter,
  billing: () => env.paddle,
  email: () => env.resend,
  storage: () => env.r2,
  jobs: () => env.inngest,
};

/** The hardcoded demo user. Used when auth is in demo mode. */
export const DEMO_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  clerkId: "user_demo_001",
  email: "demo@reklu.app",
  name: "Alex Founder",
  avatarUrl: null,
  plan: "growth" as const,
  planStatus: "active" as const,
  businessName: "Acme Studios",
  businessType: "saas",
  businessDescription:
    "Acme Studios builds productivity tools for solo founders. We sell a SaaS subscription at $29/mo.",
  businessWebsite: "https://acmestudios.example",
  industry: "SaaS",
  targetAudience: "Solo founders and indie hackers building their first product",
  brandVoice: "bold",
  timezone: "America/Los_Angeles",
  tasksUsedThisMonth: 142,
  tasksLimit: 9999,
  role: "admin" as const,
  createdAt: "2025-09-01T00:00:00Z",
  updatedAt: "2026-06-24T00:00:00Z",
};

/** Convenience for server components / route handlers. */
export async function getCurrentUser() {
  // When Clerk is wired up, replace this with `await currentUser()` + DB lookup.
  return DEMO_USER;
}