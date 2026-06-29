import * as React from "react";
import Link from "next/link";
import {
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, getBusinessScore, getBusinessScoreHistory } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const verdictCopy: Record<string, { label: string; description: string; tone: string }> = {
  strong_opportunity: {
    label: "Strong opportunity",
    description: "Your business is in a strong position. The market is favorable and your positioning is differentiated.",
    tone: "border-success/40 bg-success/5",
  },
  good_needs_positioning: {
    label: "Good but needs positioning",
    description: "There's real potential, but a tighter niche and sharper positioning will dramatically improve your odds.",
    tone: "border-accent/40 bg-accent/5",
  },
  difficult_market: {
    label: "Difficult market",
    description: "The market is crowded or has structural headwinds. Consider a narrower angle or a different entry point.",
    tone: "border-warning/40 bg-warning/5",
  },
  too_generic: {
    label: "Too generic",
    description: "Your current positioning is too broad. A specific niche will 3-5x your conversion rate.",
    tone: "border-warning/40 bg-warning/5",
  },
  needs_niche_focus: {
    label: "Needs niche focus",
    description: "Picking one specific customer and one specific problem will unlock everything else.",
    tone: "border-accent/40 bg-accent/5",
  },
};

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const tone =
    score >= 80 ? "text-success" : score >= 65 ? "text-accent" : score >= 50 ? "text-warning" : "text-danger";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          className="text-border/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(tone, "transition-all duration-700")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-5xl font-semibold tabular-nums text-text">{score}</span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-text">
          out of 100
        </span>
      </div>
    </div>
  );
}

function ScoreBar({ score, label, note }: { score: number; label: string; note: string }) {
  const tone =
    score >= 80 ? "bg-success" : score >= 65 ? "bg-accent" : score >= 50 ? "bg-warning" : "bg-danger";
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-medium text-text">{label}</span>
        <span className="font-mono text-[14px] font-semibold tabular-nums text-text">{score}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
        <div
          className={cn("h-full transition-all duration-700", tone)}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-1.5 text-[12px] text-muted-text">{note}</p>
    </div>
  );
}

export default async function BusinessScorePage() {
  const user = await getCurrentUser();
  const score = await getBusinessScore(user.id);
  const history = await getBusinessScoreHistory(user.id);

  const vc = verdictCopy[score.verdict];
  const firstScore = history[0]?.overall ?? score.overall;
  const delta = score.overall - firstScore;

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />

        <main className="flex-1 px-8 py-8">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs">
                  <Gauge size={12} className="text-accent" />
                  <span className="font-semibold uppercase tracking-wider text-accent">
                    Business Score
                  </span>
                </div>
                <h1 className="text-page text-text">How strong is your business, really?</h1>
                <p className="mt-3 max-w-2xl text-body text-secondary">
                  A 0–100 score across seven dimensions, with an honest verdict from your AI CEO.
                </p>
              </div>
              <Button size="md">
                <Sparkles size={13} />
                Recalculate
              </Button>
            </div>

            {/* Hero score */}
            <div className="mb-8 grid gap-6 md:grid-cols-[auto_1fr]">
              <Panel className="flex flex-col items-center justify-center p-8">
                <ScoreRing score={score.overall} />
                <div className="mt-4 flex items-center gap-2 text-[13px]">
                  {delta > 0 ? (
                    <TrendingUp size={14} className="text-success" />
                  ) : delta < 0 ? (
                    <TrendingDown size={14} className="text-danger" />
                  ) : (
                    <Minus size={14} className="text-muted-text" />
                  )}
                  <span
                    className={cn(
                      "font-medium",
                      delta > 0 ? "text-success" : delta < 0 ? "text-danger" : "text-muted-text",
                    )}
                  >
                    {delta > 0 ? "+" : ""}
                    {delta} points since first score
                  </span>
                </div>
              </Panel>

              <Panel className="p-8">
                <div className="mb-4 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                  AI CEO Verdict
                </div>
                <div
                  className={cn(
                    "mb-4 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[13px] font-medium",
                    vc.tone,
                  )}
                >
                  {score.verdict === "strong_opportunity" || score.verdict === "good_needs_positioning" ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <AlertTriangle size={13} />
                  )}
                  {vc.label}
                </div>
                <p className="mb-6 text-[14px] leading-relaxed text-secondary">{vc.description}</p>

                <div className="rounded-md border border-border bg-bg/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    <Sparkles size={11} />
                    Can I win?
                  </div>
                  <p className="text-[14px] leading-relaxed text-text">{score.canIWinAnswer}</p>
                </div>
              </Panel>
            </div>

            {/* Breakdown */}
            <Panel className="mb-8 p-6">
              <h2 className="mb-6 text-[13px] font-semibold uppercase tracking-wider text-text">
                Score Breakdown
              </h2>
              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                {score.breakdown.map((b) => (
                  <ScoreBar key={b.dimension} score={b.score} label={b.dimension} note={b.note} />
                ))}
              </div>
            </Panel>

            {/* History */}
            <Panel className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[13px] font-semibold uppercase tracking-wider text-text">
                  Score History
                </h2>
                <span className="text-[12px] text-muted-text">Last {history.length} recalculations</span>
              </div>
              <div className="flex h-32 items-end gap-2">
                {history.map((h, i) => (
                  <div key={i} className="group flex flex-1 flex-col items-center gap-1.5">
                    <span className="font-mono text-[12px] font-medium text-text opacity-0 transition-opacity group-hover:opacity-100">
                      {h.overall}
                    </span>
                    <div
                      className="w-full rounded-t bg-accent/60 transition-all group-hover:bg-accent"
                      style={{ height: `${h.overall}%` }}
                    />
                    <span className="text-[10px] text-muted-text">
                      {new Date(h.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-4 text-[13px] text-secondary">
                <p>
                  Recalculate your score whenever you update Business DNA, finish a major milestone,
                  or pivot your positioning. The trend line tells you if you're compounding.
                </p>
                <Link
                  href="/business-dna"
                  className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline"
                >
                  Edit Business DNA
                  <ArrowRight size={11} />
                </Link>
              </div>
            </Panel>
          </div>
        </main>
      </div>
    </div>
  );
}
