import { NextResponse } from "next/server";
import { getCurrentUser, listTasks, createTask } from "@/lib/data";
import { runAgentTask } from "@/lib/agent-engine";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as any;
  const tasks = await listTasks(user.id, status ? { status } : undefined);
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const body = await req.json();
  const task = await createTask({
    userId: user.id,
    hiredAgentId: body.hiredAgentId,
    title: body.title,
    description: body.description ?? "",
    input: body.input ?? null,
  });

  // Fire-and-forget execution (in production: queue via Inngest)
  if (process.env.NODE_ENV !== "production") {
    runAgentTask(task.id).catch(console.error);
  }

  return NextResponse.json({ task });
}