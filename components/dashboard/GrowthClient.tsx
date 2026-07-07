"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Compass,
  FlaskConical,
  Megaphone,
  Mail,
  Linkedin,
  Globe,
  Search,
  Users2,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface GrowthMetricView {
  id: string;
  date: string;
  mrr: number;
  newCustomers: number;
  churned: number;
  newLeads: number;
  trials: number;
  paid: number;
}

export interface GrowthChannelView {
  id: string;
  name: string;
  spend: number;
  leads: number;
  customers: number;
  revenue: number;
  trend: number;
}

export interface GrowthExperimentView {
  id: string;
  name: string;
  hypothesis: string;
  status: "running" | "won" | "lost" | "draft";
  startedAt: string;
  metric: string;
  baseline: number;
  current: number;
  lift: number;
}

export interface GrowthCommentaryView {
  id: string;
  weekStart: string;
  headline: string;
  body: string;
  wins: string[];
  risks: string[];
  nextWeek: string[];
  createdAt: string;
}

const channelIcon: Record<string, React.ElementType> = {
  "Cold email": Mail,
  "LinkedIn outbound": Linkedin,
  "SEO / content": Search,
  Referrals: Users2,
  "Paid ads (Meta)": Megaphone,
};

const expStatusMeta: Record<GrowthExperimentView["status"], { label: string; tone: string }> = {
  running: { label: "Running", tone: "text-accent border-accent/30 bg-accent/10" },
  won: { label: "Won", tone: "text-success border-success/30 bg-success/10" },
  lost: { label: "Lost", tone: "text-muted-text border-border bg-surface-2" },
  draft: { label: "Draft", tone: "text-muted-text border-border bg-surface-2" },
};

function Sparkline({ data }: { data: number[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const step = w / Math.max(1, data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="text-accent">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function GrowthClient({
  metrics,
  channels,
  experiments,
  commentary,
}: {
  metrics: GrowthMetricView[];
  channels: GrowthChannelView[];
  experiments: GrowthExperimentView[];
  commentary: GrowthCommentaryView | null;
}) {
  const toast = useToast();

  const totals = React.useMemo(() => {
    const mrrNow = metrics[metrics.length - 1]?.mrr ?? 0;
    const mrrPrev = metrics[0]?.mrr ?? mrrNow;
    const mrrDelta = mrrNow - mrrPrev;
    const mrrDeltaPct = mrrPrev > 0 ? (mrrDelta / mrrPrev) * 100 : 0;

    const newLeadsWeek = metrics.reduce((s, m) => s + m.newLeads, 0);
    const newCustomersWeek = metrics.reduce((s, m) => s + m.newCustomers, 0);
    const churnedWeek = metrics.reduce((s, m) => s + m.churned, 0);
    const netNew = newCustomersWeek - churnedWeek;
    const cac = channels.reduce((s, c) => s + c.spend, 0) / Math.max(1, newCustomersWeek);
    const ltv = 79 * 12; // mock — would compute from cohort
    const ltvCac = cac > 0 ? ltv / cac : 0;
    const trialConv = metrics.reduce((s, m) => s + m.paid, 0) / Math.max(1, metrics.reduce((s, m) => s + m.trials, 0)) * 100;

    return { mrrNow, mrrDelta, mrrDeltaPct, newLeadsWeek, newCustomersWeek, churnedWeek, netNew, cac, ltvCac, trialConv };
  }, [metrics, channels]);

  const mrrSeries = metrics.map((m) => m.mrr);
  const leadsSeries = metrics.map((m) => m.newLeads);

  return (
    <div className="space-y-6">
      {/* Top metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <BigMetric
          label="MRR"
          value={`$${totals.mrrNow.toLocaleString()}`}
          delta={totals.mrrDeltaPct}
          sparkline={<Sparkline data={mrrSeries} />}
        />
        <BigMetric
          label="New leads (7d)"
          value={totals.newLeadsWeek.toLocaleString()}
          delta={12}
          sparkline={<Sparkline data={leadsSeries} />}
        />
        <BigMetric
          label="New customers (7d)"
          value={totals.newCustomersWeek.toString()}
          delta={18}
          sub={`Net new: ${totals.netNew >= 0 ? "+" : ""}${totals.netNew}`}
        />
        <BigMetric
          label="Trial → paid"
          value={`${totals.trialConv.toFixed(1)}%`}
          delta={4}
          sub={`LTV:CAC ${totals.ltvCac.toFixed(1)}x`}
        />
      </div>

      {/* AI CEO commentary */}
      {commentary && (
        <Panel className="border-accent/30 bg-accent/5 p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
            <Sparkles size={11} />
            AI CEO commentary — week of {commentary.weekStart}
          </div>
          <h2 className="mt-2 text-[18px] font-medium text-text">{commentary.headline}</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-secondary">{commentary.body}</p>
          <div className="mt-4 grid gap-4 border-t border-border pt-4 md:grid-cols-3">
            <Block title="Wins" icon={CheckCircle2} tone="text-success">
              <ul className="space-y-1.5">
                {commentary.wins.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[12px] text-secondary">
                    <CheckCircle2 size={11} className="mt-0.5 shrink-0 text-success" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Risks" icon={AlertTriangle} tone="text-warning">
              <ul className="space-y-1.5">
                {commentary.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[12px] text-secondary">
                    <AlertTriangle size={11} className="mt-0.5 shrink-0 text-warning" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Next week" icon={Compass} tone="text-accent">
              <ul className="space-y-1.5">
                {commentary.nextWeek.map((n, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[12px] text-secondary">
                    <ArrowUpRight size={11} className="mt-0.5 shrink-0 text-accent" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </Block>
          </div>
        </Panel>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Channel ROI */}
        <Panel className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text">
              <Megaphone size={11} className="text-accent" />
              Channel-by-channel ROI
            </div>
            <div className="text-[10px] text-muted-text">Last 30 days</div>
          </div>
          <div className="space-y-2">
            {channels.map((c) => {
              const Icon = channelIcon[c.name] ?? Megaphone;
              const roi = c.spend > 0 ? c.revenue / c.spend : c.revenue > 0 ? Infinity : 0;
              const isPositive = c.trend >= 0;
              return (
                <div key={c.id} className="rounded-md border border-border bg-surface-1 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon size={13} className="text-accent" />
                      <div className="text-[13px] font-medium text-text">{c.name}</div>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-medium",
                        isPositive
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-danger/30 bg-danger/10 text-danger",
                      )}
                    >
                      {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {Math.abs(c.trend)}%
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-2 text-[11px]">
                    <Cell label="Spend" value={c.spend > 0 ? `$${c.spend}` : "$0"} />
                    <Cell label="Leads" value={c.leads.toString()} />
                    <Cell label="Customers" value={c.customers.toString()} />
                    <Cell label="Revenue" value={`$${c.revenue.toLocaleString()}`} />
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[11px]">
                    <span className="text-muted-text">ROI</span>
                    <span
                      className={cn(
                        "font-mono font-medium",
                        roi >= 3 ? "text-success" : roi >= 1 ? "text-accent" : "text-danger",
                      )}
                    >
                      {roi === Infinity ? "∞" : `${roi.toFixed(1)}x`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Experiments */}
        <Panel className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text">
              <FlaskConical size={11} className="text-accent" />
              Active experiments
            </div>
            <Button variant="secondary" size="sm">
              <Sparkles size={12} /> New experiment
            </Button>
          </div>
          <div className="space-y-2">
            {experiments.map((e) => (
              <div key={e.id} className="rounded-md border border-border bg-surface-1 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-text">{e.name}</div>
                    <div className="mt-0.5 text-[11px] text-muted-text">{e.hypothesis}</div>
                  </div>
                  <div className={cn("shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium", expStatusMeta[e.status].tone)}>
                    {expStatusMeta[e.status].label}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                  <Cell label="Metric" value={e.metric} />
                  <Cell label="Baseline" value={String(e.baseline)} />
                  <Cell label="Current" value={String(e.current)} />
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[11px]">
                  <span className="text-muted-text">Started {e.startedAt}</span>
                  <span
                    className={cn(
                      "font-mono font-medium",
                      e.lift > 0 ? "text-success" : e.lift < 0 ? "text-danger" : "text-muted-text",
                    )}
                  >
                    {e.lift > 0 ? "+" : ""}
                    {e.lift}% lift
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="md"
          onClick={() => toast.push({ tone: "info", title: "Full report queued", description: "Growth report will appear in your Work Inbox." })}
        >
          <Sparkles size={13} /> Generate full growth report
        </Button>
        <a
          href="/analytics"
          className="inline-flex items-center gap-1 text-[12px] text-accent hover:underline"
        >
          Open Analytics
          <ArrowUpRight size={11} />
        </a>
      </div>
    </div>
  );
}

function BigMetric({
  label,
  value,
  delta,
  sparkline,
  sub,
}: {
  label: string;
  value: string;
  delta: number;
  sparkline?: React.ReactNode;
  sub?: string;
}) {
  const isPositive = delta >= 0;
  return (
    <Panel className="p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">{label}</div>
      <div className="mt-1 font-mono text-[24px] font-semibold leading-tight text-text">{value}</div>
      <div className="mt-1 flex items-center gap-1.5">
        <span
          className={cn(
            "flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium",
            isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
          )}
        >
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {isPositive ? "+" : ""}
          {delta.toFixed(1)}%
        </span>
        {sub && <span className="text-[10px] text-muted-text">{sub}</span>}
        {sparkline && <div className="ml-auto">{sparkline}</div>}
      </div>
    </Panel>
  );
}

function Block({
  title,
  icon: Icon,
  tone,
  children,
}: {
  title: string;
  icon: React.ElementType;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className={cn("mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider", tone)}>
        <Icon size={10} />
        {title}
      </div>
      {children}
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-text">{label}</div>
      <div className="mt-0.5 font-mono text-[12px] text-text">{value}</div>
    </div>
  );
}
