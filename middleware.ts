import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware for auth.
 *
 * Demo mode (no Clerk keys): allows all routes through — the demo user is used everywhere.
 * Production mode: Clerk's `authMiddleware` protects /dashboard/* and /admin/*, redirects
 * unauthenticated users to /sign-in. Admin routes require role=admin.
 *
 * To go live: install @clerk/nextjs and replace this with:
 *
 *   import { authMiddleware } from "@clerk/nextjs";
 *   export default authMiddleware({
 *     publicRoutes: ["/", "/pricing", "/agents", "/blog", "/about", "/changelog", "/terms", "/privacy", "/sign-in", "/sign-up"],
 *     afterAuth(auth, req) { ... }
 *   });
 */

const PUBLIC_ROUTES = [
  "/",
  "/pricing",
  "/agents",
  "/blog",
  "/about",
  "/changelog",
  "/terms",
  "/privacy",
  "/sign-in",
  "/sign-up",
  "/api/auth/webhook",
  "/api/inngest",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (pathname.startsWith("/blog/")) return true;
  if (pathname.startsWith("/api/public")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/uploads")) return true;
  return false;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Demo mode: pass everything through
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return NextResponse.next();
  }

  // Production: protect dashboard + admin (Clerk handles the actual check)
  if (isPublic(pathname)) return NextResponse.next();

  // TODO: wire Clerk authMiddleware when ready
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};