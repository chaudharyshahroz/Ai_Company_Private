import * as React from "react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { TeamClient, type Member } from "@/components/dashboard/TeamClient";
import { getCurrentUser, listTeamMembers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const user = await getCurrentUser();
  const teamData = await listTeamMembers();

  const members: Member[] = teamData.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: (m.role === "admin" ? "admin" : "member") as "admin" | "member",
    joinedAt: m.joinedAt,
    lastActive: m.lastActive,
  }));

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <TeamClient initialMembers={members} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}