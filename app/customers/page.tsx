import * as React from "react";
import { Users2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, listCustomers } from "@/lib/data";
import { formatUsd, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const user = await getCurrentUser();
  const customers = await listCustomers();
  const totalMRR = customers.reduce((s, c) => s + c.mrr, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={3} />
        <main className="flex-1 px-6 py-8 md:px-8">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold tracking-tight">Customers</h1>
            <p className="mt-1 text-sm text-text-secondary">
              {customers.length} customers · {formatUsd(totalMRR)} MRR
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((c) => (
              <GlassCard key={c.id} hoverable className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-sm font-semibold text-white">
                    {c.name[0]}
                  </div>
                  <span className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    c.health === "excellent"
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-primary/40 bg-primary/10 text-primary-light",
                  )}>
                    {c.health}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-text-primary">{c.name}</h3>
                <p className="text-sm text-text-tertiary">{c.company}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                  <span className="text-text-secondary capitalize">{c.plan} plan</span>
                  <span className="font-mono font-semibold text-text-primary">{formatUsd(c.mrr)}/mo</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}