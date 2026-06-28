import * as React from "react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { LeadsClient, type Lead } from "@/components/dashboard/LeadsClient";
import { getCurrentUser, listLeads } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const user = await getCurrentUser();
  const leads = await listLeads();

  const normalized: Lead[] = leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    company: l.company,
    source: l.source,
    // The mock data uses "hot" + "contacted" + "follow-up" — normalize to our 5 columns.
    status: ((): Lead["status"] => {
      if (l.status === "hot") return "qualified";
      if (l.status === "contacted") return "follow-up";
      if (l.status === "follow-up") return "follow-up";
      if (l.status === "won") return "won";
      if (l.status === "lost") return "lost";
      if (l.status === "qualified") return "qualified";
      return "new";
    })(),
    interest: l.interest,
  }));

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <LeadsClient initialLeads={normalized} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}