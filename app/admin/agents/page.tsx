import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { listAgentTemplates } from "@/lib/data";
import { formatUsd } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminAgentsPage() {
  const templates = await listAgentTemplates();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Agent templates</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {templates.length} templates · shown in the user marketplace
          </p>
        </div>
        <GlowButton asChild>
          <Link href="/admin/agents/new">
            <Plus size={14} />
            New agent
          </Link>
        </GlowButton>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2/40">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Agent</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Department</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Tier</th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-tertiary">Price</th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-tertiary">Active</th>
              <th className="w-32" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {templates.map((t) => (
              <tr key={t.id} className="hover:bg-surface-2/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${t.avatarColor} text-lg`}>
                      {t.avatarEmoji}
                    </div>
                    <div>
                      <div className="text-text-primary">{t.name}</div>
                      <div className="text-xs text-text-tertiary">{t.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 capitalize text-text-secondary">{t.department}</td>
                <td className="px-5 py-3 capitalize text-text-secondary">{t.tier}</td>
                <td className="px-5 py-3 text-right text-text-primary">{formatUsd(t.monthlyPriceUsd ?? "0")}</td>
                <td className="px-5 py-3 text-right">
                  <span className={`inline-flex h-1.5 w-1.5 rounded-full ${t.isActive ? "bg-accent" : "bg-text-tertiary"}`} />
                </td>
                <td className="px-5 py-3">
                  <button className="rounded-md px-2 py-1 text-xs text-primary-light hover:bg-surface">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}