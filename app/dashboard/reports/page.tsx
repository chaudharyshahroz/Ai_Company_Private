import * as React from "react";
import Link from "next/link";
import { ChevronRight, Download, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { getCurrentUser, listBoardReports } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const reports = await listBoardReports(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Weekly board reports from your CEO agent.
          </p>
        </div>
        <GlowButton size="sm">
          <Sparkles size={13} />
          Generate now
        </GlowButton>
      </div>

      {reports.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-sm text-text-tertiary">
            Your first weekly report will appear here next Monday.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <Link key={r.id} href={`/dashboard/reports/${r.id}`}>
              <GlassCard hoverable className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 text-xs text-text-tertiary">
                      <span>
                        Week of {formatDate(r.weekStart)} – {formatDate(r.weekEnd)}
                      </span>
                      <span
                        className={
                          r.status === "ready"
                            ? "rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent"
                            : "rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-tertiary"
                        }
                      >
                        {r.status}
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-semibold text-text-primary">
                      {r.tasksCompleted} tasks completed · {r.tasksFailed} failed
                    </h2>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                      {r.summary}
                    </p>
                  </div>
                  <ChevronRight size={16} className="mt-2 text-text-tertiary" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}