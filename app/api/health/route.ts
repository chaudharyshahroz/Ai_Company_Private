import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Lightweight liveness probe for Dokploy / Traefik / Docker healthchecks.
 * Returns 200 with a tiny JSON body. Does NOT touch the database.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "reklu",
    timestamp: new Date().toISOString(),
  });
}