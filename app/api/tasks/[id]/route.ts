import { NextResponse } from "next/server";
import { getTask } from "@/lib/data";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const task = await getTask(params.id);
  if (!task) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ task });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  // TODO: real DB cancel
  return NextResponse.json({ ok: true });
}