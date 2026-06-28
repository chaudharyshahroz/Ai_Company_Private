import { NextResponse } from "next/server";
import { listAgentTemplates } from "@/lib/data";

export async function GET() {
  const templates = await listAgentTemplates({ active: true });
  return NextResponse.json({ templates });
}