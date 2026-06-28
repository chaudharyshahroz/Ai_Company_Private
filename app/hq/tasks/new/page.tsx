import * as React from "react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { CreateTaskForm, type EmployeeOption } from "@/components/dashboard/CreateTaskForm";
import { getCurrentUser, listEnrichedHiredAgents } from "@/lib/data";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { for?: string };
}

export default async function NewTaskPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const agents = await listEnrichedHiredAgents(user.id);

  // Build employee options — prefer hired agents; fall back to a small set of templates.
  const hired: EmployeeOption[] = agents.map((a) => ({
    id: a.id,
    name: a.template?.name ?? "AI Employee",
    role: a.template?.role ?? "AI",
    emoji: a.template?.avatarEmoji ?? "🤖",
  }));

  const fallback: EmployeeOption[] = [
    { id: "h-aria", name: "Aria — Content Writer", role: "Content Writer", emoji: "✍️" },
    { id: "h-echo", name: "Echo — Outreach Specialist", role: "Outreach", emoji: "📨" },
    { id: "h-robin", name: "Robin — Support Specialist", role: "Support", emoji: "💬" },
    { id: "h-rival", name: "Rival — Competitor Researcher", role: "Research", emoji: "🔍" },
    { id: "h-sterling", name: "Sterling — CFO", role: "Finance", emoji: "💰" },
    { id: "h-pixel", name: "Pixel — Website Builder", role: "Website", emoji: "🎨" },
  ];

  const employees = hired.length > 0 ? hired : fallback;
  const presetEmployeeId = searchParams.for ?? employees[0]?.id ?? "";

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <CreateTaskForm employees={employees} presetEmployeeId={presetEmployeeId} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}