import * as React from "react";
import Link from "next/link";
import { Plus, Search, Settings as SettingsIcon, Pause, UserX } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { getCurrentUser, listEnrichedHiredAgents, listAgentTemplates } from "@/lib/data";
import { formatRelativeTime } from "@/lib/format";
import { formatUsd, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const user = await getCurrentUser();
  const hired = await listEnrichedHiredAgents(user.id);
  const allTemplates = await listAgentTemplates({ active: true });
  const hiredSlugs = new Set(hired.map((h) => h.template?.slug));
  const available = allTemplates.filter((t) => !hiredSlugs.has(t.slug));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">My team</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {hired.length} of {Math.max(hired.length, available.length) + hired.length} agents
            hired. Manage your AI company.
          </p>
        </div>
        <GlowButton asChild>
          <Link href="#marketplace">
            <Plus size={14} />
            Hire more agents
          </Link>
        </GlowButton>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-tertiary">
        <Search size={14} />
        <input
          placeholder="Search your team..."
          className="flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-tertiary"
        />
      </div>

      {/* My agents */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          My hired agents
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hired.map((a) => (
            <GlassCard key={a.id} hoverable className="p-5">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-md",
                    a.template?.avatarColor ?? "from-primary to-accent-warm",
                  )}
                >
                  {a.template?.avatarEmoji}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-2 hover:text-text-primary"
                    title="Configure"
                  >
                    <SettingsIcon size={14} />
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-2 hover:text-text-primary"
                    title="Pause"
                  >
                    <Pause size={14} />
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary hover:bg-accent-warm/10 hover:text-accent-warm"
                    title="Fire"
                  >
                    <UserX size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-semibold text-text-primary">
                  {a.customName ?? a.template?.name}
                </div>
                <div className="text-xs text-text-tertiary">{a.template?.role}</div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-text-tertiary">
                <span>Last active {formatRelativeTime(a.lastActiveAt)}</span>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
                  Active
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Marketplace — hire more
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((t) => (
            <GlassCard key={t.id} hoverable className="flex h-full flex-col p-5">
              <div
                className={cn(
                  "mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-md",
                  t.avatarColor,
                )}
              >
                {t.avatarEmoji}
              </div>
              <div className="text-sm font-semibold text-text-primary">{t.name}</div>
              <div className="text-xs text-text-tertiary">{t.role}</div>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t.description}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
                <span className="text-xs text-text-tertiary">
                  {formatUsd(t.monthlyPriceUsd ?? "0")}/mo
                </span>
                <button className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light transition-colors hover:bg-primary/20">
                  Hire
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}