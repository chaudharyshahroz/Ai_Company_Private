import { NextResponse } from "next/server";
import { getTask } from "@/lib/data";
import { runAgentTask } from "@/lib/agent-engine";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const task = await getTask(params.id);
  if (!task) return NextResponse.json({ error: "not_found" }, { status: 404 });
  // Fire execution (in production: re-queue via Inngest)
  runAgentTask(params.id).catch(console.error);
  return NextResponse.json({ ok: true });
}