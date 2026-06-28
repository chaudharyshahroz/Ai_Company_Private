import * as React from "react";
import { Megaphone, Plus, TrendingUp, Users, DollarSign } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, listCampaigns } from "@/lib/data";
import { formatUsd, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const user = await getCurrentUser();
  const campaigns = await listCampaigns();
  return (
    <div className="flex min-h-screen bg-background">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={3} />
        <main className="flex-1 px-6 py-8 md:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">Campaigns</h1>
              <p className="mt-1 text-sm text-text-secondary">
                Marketing campaigns run by your Marketing Department.
              </p>
            </div>
            <GlowButton size="md">
              <Plus size={14} />
              New campaign
            </GlowButton>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {campaigns.map((c) => (
              <GlassCard key={c.id} hoverable className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{c.name}</h3>
                    <p className="mt-0.5 text-xs text-text-tertiary">{c.channel}</p>
                  </div>
                  <span className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    c.status === "running"
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : c.status === "draft"
                      ? "border-text-tertiary/40 bg-surface-2 text-text-secondary"
                      : "border-primary/40 bg-primary/10 text-primary-light",
                  )}>
                    {c.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <Stat label="Leads" value={c.leads.toString()} />
                  <Stat label="Conversions" value={c.conversions.toString()} />
                  <Stat label="Budget" value={formatUsd(c.budget)} />
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {c.employees.map((e) => (
                    <span key={e} className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-text-secondary">
                      {e}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-xl font-bold tabular-nums text-text-primary">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-text-tertiary">{label}</div>
    </div>
  );
}