import * as React from "react";
import { Briefcase, Sparkles, Download } from "lucide-react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { CrmClient, type CrmLeadView } from "@/components/dashboard/CrmClient";
import { Button } from "@/components/ui/Button";
import { getCurrentUser, listCrmLeads } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const user = await getCurrentUser();
  const leads = await listCrmLeads(user.id);

  const view: CrmLeadView[] = leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    company: l.company,
    phone: l.phone,
    source: l.source,
    stage: l.stage,
    score: l.score,
    interest: l.interest,
    lastContact: l.lastContact,
    nextAction: l.nextAction,
    nextActionDate: l.nextActionDate,
    notes: l.notes,
    createdAt: l.createdAt,
  }));

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs">
                <Briefcase size={12} className="text-accent" />
                <span className="font-semibold uppercase tracking-wider text-accent">CRM</span>
                <span className="ml-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                  Live
                </span>
              </div>
              <h1 className="text-page text-text">Every lead, every conversation, one pipeline.</h1>
              <p className="mt-3 max-w-2xl text-body text-secondary">
                Pipeline view with New → Contacted → Interested → Meeting Booked → Won / Lost.
                AI lead scoring, follow-up reminders, and next-best-action — all in one place.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="md">
                <Download size={13} />
                Export CSV
              </Button>
              <Button size="md">
                <Sparkles size={13} />
                AI re-score all
              </Button>
            </div>
          </div>

          <CrmClient initialLeads={view} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
