"use client";

import * as React from "react";
import {
  Plus,
  X,
  Search,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Target,
  CheckCircle2,
  BarChart3,
  Clock,
  Lightbulb,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface MarketReportView {
  id: string;
  topic: string;
  region: string;
  depth: "quick" | "standard" | "deep";
  status: "generating" | "ready" | "stale";
  generatedAt: string;
  marketSize: string;
  growthRate: string;
  trends: string[];
  segments: { name: string; share: string; note: string }[];
  demandSignals: string[];
  gaps: string[];
  recommendation: string;
  risks: { risk: string; mitigation: string }[];
}

const depthMeta: Record<MarketReportView["depth"], { label: string; tone: string; time: string }> = {
  quick: { label: "Quick", tone: "text-muted-text border-border bg-surface-2", time: "~15s" },
  standard: { label: "Standard", tone: "text-accent border-accent/30 bg-accent/10", time: "~45s" },
  deep: { label: "Deep", tone: "text-warning border-warning/30 bg-warning/10", time: "~2min" },
};

export function MarketResearchClient({ initialReports }: { initialReports: MarketReportView[] }) {
  const toast = useToast();
  const [reports, setReports] = React.useState<MarketReportView[]>(initialReports);
  const [active, setActive] = React.useState<string | null>(initialReports[0]?.id ?? null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [form, setForm] = React.useState({
    topic: "",
    region: "United States",
    depth: "standard" as MarketReportView["depth"],
  });
  const [generating, setGenerating] = React.useState(false);

  const activeReport = reports.find((r) => r.id === active);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) return;
    setGenerating(true);
    const topic = form.topic.trim();
    setShowAdd(false);
    toast.push({
      tone: "info",
      title: `Researching "${topic}"`,
      description: `Nova is gathering market data, segments, and demand signals. ETA: ${depthMeta[form.depth].time}.`,
      duration: 5000,
    });

    // Simulate a brief generation delay (real product would poll a job).
    await new Promise((res) => setTimeout(res, 1500));

    const report: MarketReportView = {
      id: `mr-new-${Date.now()}`,
      topic,
      region: form.region,
      depth: form.depth,
      status: "ready",
      generatedAt: new Date().toISOString(),
      marketSize: `$1.2B – $4.8B (estimated ${form.region} market)`,
      growthRate: "8-15% CAGR (next 3-5 years)",
      trends: [
        `AI-native ${topic.toLowerCase()} replacing legacy workflows`,
        `Buyer expectations shifting toward "always-on" experiences`,
        `Consolidation: 3-5 tool stacks merging into 1 unified platform`,
        `Vertical specialization beating horizontal breadth`,
      ],
      segments: [
        { name: "SMB (1-50 employees)", share: "52%", note: "Largest segment, price-sensitive, needs turnkey" },
        { name: "Mid-market (50-500)", share: "31%", note: "Fastest growing, willing to pay for outcomes" },
        { name: "Enterprise (500+)", share: "17%", note: "Slower adoption, high ACV" },
      ],
      demandSignals: [
        `Search volume for "${topic}" up 40-60% YoY`,
        `${Math.floor(Math.random() * 200 + 100)}+ new software products launched in this category in 2025`,
        `Average buyer reports 2.3x faster ROI than last year's tools`,
      ],
      gaps: [
        "Most solutions force buyers to bolt 3-4 tools together",
        "AI features exist as add-ons, not as the core product",
        "Onboarding and integration still take 30+ days industry-wide",
      ],
      recommendation: `Lead with the 30-day outcome guarantee. Sell the result, not the tool. Win the mid-market segment first — they have budget and they buy fast.`,
      risks: [
        { risk: "Incumbents add AI features", mitigation: "Move fast on specialization + integration depth" },
        { risk: "Buyer fatigue from AI hype", mitigation: "Lead with case studies, not features" },
      ],
    };
    setReports((prev) => [report, ...prev]);
    setActive(report.id);
    setForm({ topic: "", region: "United States", depth: "standard" });
    setGenerating(false);
    toast.push({
      tone: "success",
      title: "Report ready",
      description: `${topic}: market size, segments, and gaps are in.`,
    });
  };

  const deleteReport = (id: string) => {
    const r = reports.find((x) => x.id === id);
    if (!r) return;
    setReports((prev) => prev.filter((x) => x.id !== id));
    if (active === id) setActive(reports.find((x) => x.id !== id)?.id ?? null);
    toast.push({ tone: "info", title: "Report removed" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-[12px] text-muted-text">
          {reports.length} report{reports.length === 1 ? "" : "s"}
        </div>
        <div className="ml-auto flex gap-2">
          <Button size="md" onClick={() => setShowAdd(true)} disabled={generating}>
            {generating ? <Clock size={13} className="animate-spin" /> : <Plus size={13} />}
            New report
          </Button>
        </div>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Generate your first market research report — pick a topic, region, and depth."
          action={
            <Button size="md" onClick={() => setShowAdd(true)}>
              <Plus size={13} /> New report
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          {/* List */}
          <div className="space-y-2">
            {reports.map((r) => (
              <button
                key={r.id}
                onClick={() => setActive(r.id)}
                className={cn(
                  "block w-full rounded-md border border-border bg-surface-1 p-3 text-left transition-colors",
                  active === r.id && "border-accent/40 bg-surface-2",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-text">{r.topic}</div>
                    <div className="mt-0.5 truncate text-[11px] text-muted-text">{r.region}</div>
                  </div>
                  <div
                    className={cn(
                      "shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-medium uppercase",
                      depthMeta[r.depth].tone,
                    )}
                  >
                    {depthMeta[r.depth].label}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-text">
                  <BarChart3 size={9} className="text-accent" />
                  <span className="font-mono text-text">{r.marketSize.split("(")[0].trim()}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          {activeReport ? (
            <div className="space-y-4">
              <Panel className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                      <Search size={11} />
                      Market Research
                    </div>
                    <h2 className="mt-2 text-[20px] font-semibold text-text">{activeReport.topic}</h2>
                    <div className="mt-1 flex items-center gap-2 text-[12px] text-muted-text">
                      <span>{activeReport.region}</span>
                      <span>·</span>
                      <div className={cn("rounded border px-1.5 py-0.5 text-[10px] font-medium", depthMeta[activeReport.depth].tone)}>
                        {depthMeta[activeReport.depth].label}
                      </div>
                      <span>·</span>
                      <span>Generated {new Date(activeReport.generatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteReport(activeReport.id)}>
                    <X size={12} />
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 md:grid-cols-3">
                  <Stat label="Market size" value={activeReport.marketSize} icon={BarChart3} tone="text-accent" />
                  <Stat label="Growth rate" value={activeReport.growthRate} icon={TrendingUp} tone="text-success" />
                  <Stat label="Segments" value={`${activeReport.segments.length} mapped`} icon={Target} tone="text-warning" />
                </div>
              </Panel>

              <div className="grid gap-4 md:grid-cols-2">
                <Panel className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    <TrendingUp size={11} />
                    Trends shaping the market
                  </div>
                  <ul className="space-y-2">
                    {activeReport.trends.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-secondary">
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
                <Panel className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-success">
                    <Sparkles size={11} />
                    Demand signals
                  </div>
                  <ul className="space-y-2">
                    {activeReport.demandSignals.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-secondary">
                        <CheckCircle2 size={11} className="mt-0.5 shrink-0 text-success" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>

              <Panel className="p-5">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text">
                  <Target size={11} />
                  Customer segments
                </div>
                <div className="space-y-2">
                  {activeReport.segments.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-md border border-border bg-surface-1 p-3">
                      <div className="font-mono text-[18px] font-semibold text-accent">{s.share}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-medium text-text">{s.name}</div>
                        <div className="text-[11px] text-muted-text">{s.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="p-5">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-warning">
                  <Lightbulb size={11} />
                  Gaps you can exploit
                </div>
                <ul className="space-y-2">
                  {activeReport.gaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-secondary">
                      <Lightbulb size={11} className="mt-0.5 shrink-0 text-warning" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel className="border-accent/30 bg-accent/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  <Sparkles size={11} />
                  AI recommendation
                </div>
                <p className="text-[14px] leading-relaxed text-text">{activeReport.recommendation}</p>
              </Panel>

              <Panel className="p-5">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-danger">
                  <AlertTriangle size={11} />
                  Risks & what to do better
                </div>
                <div className="space-y-2">
                  {activeReport.risks.map((r, i) => (
                    <div key={i} className="rounded-md border border-border bg-surface-1 p-3">
                      <div className="text-[12px] font-medium text-danger">Risk: {r.risk}</div>
                      <div className="mt-0.5 text-[12px] text-secondary">Mitigation: {r.mitigation}</div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          ) : null}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAdd(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <Panel className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">New Report</div>
                  <h3 className="mt-1 text-[16px] font-medium text-text">Generate market research</h3>
                </div>
                <button onClick={() => setShowAdd(false)} className="rounded-md p-1 text-muted-text hover:text-text">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={generate} className="space-y-3">
                <Field label="Topic *">
                  <input
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    required
                    placeholder="e.g. AI sales agents for SaaS"
                    className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                  />
                </Field>
                <Field label="Region">
                  <input
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                  />
                </Field>
                <Field label="Depth">
                  <div className="grid grid-cols-3 gap-2">
                    {(["quick", "standard", "deep"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setForm({ ...form, depth: d })}
                        className={cn(
                          "rounded-md border px-2 py-2 text-left transition-colors",
                          form.depth === d
                            ? "border-accent/50 bg-accent/10"
                            : "border-border bg-surface-1 hover:border-border-strong",
                        )}
                      >
                        <div className="text-[12px] font-medium text-text">{depthMeta[d].label}</div>
                        <div className="text-[10px] text-muted-text">{depthMeta[d].time}</div>
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="md" className="flex-1">
                    <Sparkles size={13} /> Generate
                  </Button>
                  <Button type="button" variant="secondary" size="md" onClick={() => setShowAdd(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-text">{label}</label>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  tone: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-text">
        <Icon size={10} className={tone} />
        {label}
      </div>
      <div className="mt-1 text-[14px] font-medium text-text">{value}</div>
    </div>
  );
}
