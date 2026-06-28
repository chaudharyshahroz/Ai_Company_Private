import * as React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { PlanBadge } from "@/components/dashboard/PlanBadge";
import { getCurrentUser } from "@/lib/data";
import { formatUsd } from "@/lib/utils";
import { Crown, CreditCard, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

const plans = [
  { id: "starter", name: "Starter", price: 29, features: ["3 agents", "500 tasks/mo"] },
  { id: "growth", name: "Growth", price: 79, features: ["8 agents", "Unlimited tasks", "Weekly reports"] },
  { id: "company", name: "Company", price: 149, features: ["Unlimited everything", "Custom agents"] },
];

const invoices = [
  { id: "inv-2026-06", date: "2026-06-01", amount: 79, status: "paid" },
  { id: "inv-2026-05", date: "2026-05-01", amount: 79, status: "paid" },
  { id: "inv-2026-04", date: "2026-04-01", amount: 79, status: "paid" },
];

export default async function BillingPage() {
  const user = await getCurrentUser();

  const usagePct = Math.min(
    100,
    Math.round((user.tasksUsedThisMonth / user.tasksLimit) * 100),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your plan, payment method, and invoices.
        </p>
      </div>

      {/* Current plan */}
      <GlassCard className="p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold capitalize text-text-primary">
                {user.plan} plan
              </h2>
              <PlanBadge plan={user.plan} />
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              Renews on {new Date(Date.now() + 30 * 86_400_000).toLocaleDateString()}
            </p>
          </div>
          <GlowButton size="sm" variant="secondary">
            <CreditCard size={13} />
            Manage in Paddle
          </GlowButton>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Tasks used this month</span>
            <span className="font-mono text-text-primary">
              {user.tasksUsedThisMonth.toLocaleString()} / {user.tasksLimit.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Upgrade plans */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Switch plan
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => {
            const current = user.plan === p.id;
            return (
              <GlassCard
                key={p.id}
                className={`p-6 ${current ? "border-primary" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">{p.name}</h3>
                  {current && (
                    <span className="text-[10px] uppercase tracking-wider text-accent">
                      Current
                    </span>
                  )}
                </div>
                <div className="mt-3 font-display text-3xl font-bold text-text-primary">
                  {formatUsd(p.price)}
                  <span className="text-sm font-normal text-text-tertiary">/mo</span>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-text-secondary">
                  {p.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
                <div className="mt-5">
                  <GlowButton
                    asChild={!current}
                    size="sm"
                    variant={current ? "secondary" : "primary"}
                    className="w-full"
                    disabled={current}
                  >
                    {!current ? <Link href={`/dashboard/billing?upgrade=${p.id}`}>{current ? "Current" : `Switch to ${p.name}`}</Link> : "Current"}
                  </GlowButton>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Invoices */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Invoice history
        </h2>
        <GlassCard className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2/40">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  Invoice
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  Date
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  Amount
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  Status
                </th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-5 py-3 font-mono text-xs text-text-primary">{inv.id}</td>
                  <td className="px-5 py-3 text-text-secondary">{inv.date}</td>
                  <td className="px-5 py-3 text-right text-text-primary">{formatUsd(inv.amount)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-text-tertiary hover:text-text-primary">
                      <FileText size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </section>
    </div>
  );
}