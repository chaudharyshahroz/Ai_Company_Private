"use client";

import * as React from "react";
import {
  Plus,
  X,
  Mail,
  Phone,
  TrendingUp,
  Sparkles,
  Trash2,
  Search,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export type CrmStage = "new" | "contacted" | "interested" | "meeting" | "won" | "lost";

export interface CrmLeadView {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  source: string;
  stage: CrmStage;
  score: number;
  interest: string;
  lastContact: string;
  nextAction: string;
  nextActionDate: string;
  notes: string;
  createdAt: string;
}

const columns: { id: CrmStage; label: string; tone: string; ring: string }[] = [
  { id: "new", label: "New", tone: "text-muted-text", ring: "ring-border" },
  { id: "contacted", label: "Contacted", tone: "text-primary", ring: "ring-primary/40" },
  { id: "interested", label: "Interested", tone: "text-accent", ring: "ring-accent/40" },
  { id: "meeting", label: "Meeting Booked", tone: "text-warning", ring: "ring-warning/40" },
  { id: "won", label: "Won", tone: "text-success", ring: "ring-success/40" },
  { id: "lost", label: "Lost", tone: "text-muted-text", ring: "ring-border" },
];

function scoreTone(score: number) {
  if (score >= 80) return "text-success border-success/30 bg-success/10";
  if (score >= 60) return "text-accent border-accent/30 bg-accent/10";
  if (score >= 40) return "text-warning border-warning/30 bg-warning/10";
  return "text-muted-text border-border bg-surface-2";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Hot";
  if (score >= 60) return "Warm";
  if (score >= 40) return "Cool";
  return "Cold";
}

export function CrmClient({ initialLeads }: { initialLeads: CrmLeadView[] }) {
  const toast = useToast();
  const [leads, setLeads] = React.useState<CrmLeadView[]>(initialLeads);
  const [showAdd, setShowAdd] = React.useState(false);
  const [filterSource, setFilterSource] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [activeCard, setActiveCard] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    source: "LinkedIn",
    interest: "",
    notes: "",
  });

  const sources = React.useMemo(() => {
    const s = new Set<string>();
    leads.forEach((l) => s.add(l.source));
    return Array.from(s).sort();
  }, [leads]);

  const visible = React.useMemo(() => {
    return leads.filter((l) => {
      if (filterSource !== "all" && l.source !== filterSource) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.name.toLowerCase().includes(q) &&
          !l.company.toLowerCase().includes(q) &&
          !l.email.toLowerCase().includes(q) &&
          !l.interest.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [leads, filterSource, search]);

  const buckets = React.useMemo(() => {
    const acc: Record<CrmStage, CrmLeadView[]> = {
      new: [],
      contacted: [],
      interested: [],
      meeting: [],
      won: [],
      lost: [],
    };
    for (const l of visible) acc[l.stage].push(l);
    return acc;
  }, [visible]);

  const stats = React.useMemo(() => {
    const total = leads.length;
    const open = leads.filter((l) => l.stage !== "won" && l.stage !== "lost").length;
    const won = leads.filter((l) => l.stage === "won").length;
    const meetings = leads.filter((l) => l.stage === "meeting").length;
    const pipelineValue = leads
      .filter((l) => l.stage === "interested" || l.stage === "meeting")
      .reduce((sum, l) => sum + l.score * 10, 0);
    const winRate = total > 0 ? Math.round((won / total) * 100) : 0;
    return { total, open, won, meetings, pipelineValue, winRate };
  }, [leads]);

  const moveLead = (id: string, to: CrmStage) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage: to } : l)));
    const lead = leads.find((l) => l.id === id);
    if (lead) {
      toast.push({
        tone: to === "won" ? "success" : "info",
        title: `${lead.name} → ${columns.find((c) => c.id === to)?.label}`,
        description:
          to === "won"
            ? "Closed. Sales Employee will start onboarding flow."
            : to === "lost"
              ? "Marked as lost. Will re-engage in 90 days."
              : "Stage updated.",
      });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const score = Math.min(95, 35 + Math.floor(Math.random() * 50));
    const next: CrmLeadView = {
      id: `crm-new-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || "—",
      phone: form.phone.trim(),
      source: form.source,
      stage: "new",
      score,
      interest: form.interest.trim() || "General inquiry",
      lastContact: new Date().toISOString().slice(0, 10),
      nextAction: "Send intro + qualify",
      nextActionDate: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
      notes: form.notes.trim() || "Added via CRM",
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [next, ...prev]);
    setForm({ name: "", email: "", company: "", phone: "", source: "LinkedIn", interest: "", notes: "" });
    setShowAdd(false);
    toast.push({
      tone: "success",
      title: "Lead added to pipeline",
      description: `${next.name} is in the New column. AI score: ${score} (${scoreLabel(score)}).`,
    });
  };

  const handleDelete = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast.push({
      tone: "info",
      title: "Lead removed",
      description: `${lead.name} was removed from the pipeline.`,
    });
  };

  const handleRescore = (id: string) => {
    const newScore = Math.min(98, 30 + Math.floor(Math.random() * 70));
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, score: newScore } : l)));
    const lead = leads.find((l) => l.id === id);
    toast.push({
      tone: "info",
      title: "Score refreshed",
      description: `${lead?.name} re-scored: ${newScore} (${scoreLabel(newScore)}).`,
    });
  };

  const handleAiFollowUp = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    toast.push({
      tone: "info",
      title: "AI generating follow-up",
      description: `Sales Employee is drafting a personalized message for ${lead.name}. It will appear in your Work Inbox.`,
      action: { label: "View Work Inbox", href: "/work-review" },
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Panel className="p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Total</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-text">{stats.total}</div>
          <div className="mt-0.5 text-[11px] text-muted-text">leads in pipeline</div>
        </Panel>
        <Panel className="p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Open</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-text">{stats.open}</div>
          <div className="mt-0.5 text-[11px] text-muted-text">in active stages</div>
        </Panel>
        <Panel className="p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Meetings</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-warning">{stats.meetings}</div>
          <div className="mt-0.5 text-[11px] text-muted-text">booked this month</div>
        </Panel>
        <Panel className="p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Win rate</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-success">{stats.winRate}%</div>
          <div className="mt-0.5 text-[11px] text-muted-text">lifetime</div>
        </Panel>
        <Panel className="p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Pipeline</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-accent">${stats.pipelineValue.toLocaleString()}</div>
          <div className="mt-0.5 text-[11px] text-muted-text">weighted, est.</div>
        </Panel>
      </div>

      {/* Filters + add */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email…"
            className="w-full rounded-md border border-border bg-surface-1 py-2 pl-8 pr-3 text-[13px] text-text placeholder:text-muted-text focus:border-accent/50 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterSource("all")}
            className={cn(
              "rounded-md px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
              filterSource === "all"
                ? "bg-surface-2 text-text"
                : "text-muted-text hover:text-text",
            )}
          >
            All sources
          </button>
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setFilterSource(s)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
                filterSource === s
                  ? "bg-surface-2 text-text"
                  : "text-muted-text hover:text-text",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              toast.push({
                tone: "info",
                title: "Sales Employee notified",
                description: `Will reach out to all ${buckets.contacted.length + buckets.interested.length} warm leads today.`,
              });
            }}
          >
            <Sparkles size={13} />
            Run AI follow-up
          </Button>
          <Button size="md" onClick={() => setShowAdd(true)}>
            <Plus size={13} />
            Add lead
          </Button>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {columns.map((col) => {
          const items = buckets[col.id];
          return (
            <div key={col.id} className="flex min-h-[400px] flex-col rounded-lg border border-border bg-surface-1/40 p-2">
              <div className="mb-2 flex items-center justify-between px-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-[10px] font-semibold uppercase tracking-wider", col.tone)}>
                    {col.label}
                  </span>
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-text">
                    {items.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {items.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border/50 px-3 py-6 text-center text-[11px] text-muted-text">
                    No leads here yet
                  </div>
                ) : (
                  items.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      expanded={activeCard === lead.id}
                      onToggle={() => setActiveCard(activeCard === lead.id ? null : lead.id)}
                      onMove={(to) => moveLead(lead.id, to)}
                      onDelete={() => handleDelete(lead.id)}
                      onRescore={() => handleRescore(lead.id)}
                      onFollowUp={() => handleAiFollowUp(lead.id)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add lead modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowAdd(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <Panel className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Add Lead</div>
                  <h3 className="mt-1 text-[16px] font-medium text-text">New pipeline entry</h3>
                </div>
                <button
                  onClick={() => setShowAdd(false)}
                  className="rounded-md p-1 text-muted-text hover:text-text"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name *">
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    />
                  </Field>
                  <Field label="Email *">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Company">
                    <input
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Source">
                    <select
                      value={form.source}
                      onChange={(e) => setForm({ ...form, source: e.target.value })}
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    >
                      {["LinkedIn", "Cold email", "Referral", "Website Widget", "Demo request", "Twitter / X", "Event", "Other"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ),
                      )}
                    </select>
                  </Field>
                  <Field label="Interest">
                    <input
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      placeholder="e.g. Growth plan"
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    />
                  </Field>
                </div>
                <Field label="Notes">
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                  />
                </Field>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="md" className="flex-1">
                    <Plus size={13} /> Add to pipeline
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
      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-text">
        {label}
      </label>
      {children}
    </div>
  );
}

function LeadCard({
  lead,
  expanded,
  onToggle,
  onMove,
  onDelete,
  onRescore,
  onFollowUp,
}: {
  lead: CrmLeadView;
  expanded: boolean;
  onToggle: () => void;
  onMove: (to: CrmStage) => void;
  onDelete: () => void;
  onRescore: () => void;
  onFollowUp: () => void;
}) {
  const stageIdx = columns.findIndex((c) => c.id === lead.stage);
  const prev = columns[stageIdx - 1]?.id;
  const next = columns[stageIdx + 1]?.id;
  const nextLabel = next ? `→ ${columns[stageIdx + 1]?.label}` : null;
  const prevLabel = prev ? `← ${columns[stageIdx - 1]?.label}` : null;

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface-1 p-2.5 text-[12px] transition-all",
        expanded && "ring-1 ring-accent/40",
      )}
    >
      <button onClick={onToggle} className="block w-full text-left">
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium text-text">{lead.name}</div>
            <div className="truncate text-[11px] text-muted-text">{lead.company}</div>
          </div>
          <div
            className={cn(
              "shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold",
              scoreTone(lead.score),
            )}
            title="AI lead score"
          >
            {lead.score}
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-text">
          <span className="rounded bg-surface-2 px-1.5 py-0.5">{lead.source}</span>
          {lead.interest && <span className="truncate">{lead.interest}</span>}
        </div>
      </button>

      {expanded && (
        <div className="mt-2.5 space-y-2 border-t border-border pt-2.5">
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-muted-text">
              <Mail size={10} /> <span className="truncate">{lead.email}</span>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-1.5 text-muted-text">
                <Phone size={10} /> <span>{lead.phone}</span>
              </div>
            )}
            {lead.notes && <p className="text-secondary">{lead.notes}</p>}
          </div>
          <div className="rounded bg-surface-2 p-2 text-[11px]">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent">Next action</div>
            <div className="mt-0.5 text-text">{lead.nextAction}</div>
            <div className="mt-0.5 text-muted-text">Due {lead.nextActionDate}</div>
          </div>
          <div className="flex flex-wrap gap-1">
            {prev && (
              <button
                onClick={() => onMove(prev)}
                className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-text hover:border-border-strong hover:text-text"
              >
                {prevLabel}
              </button>
            )}
            {next && (
              <button
                onClick={() => onMove(next)}
                className="rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent hover:bg-accent/20"
              >
                {nextLabel}
              </button>
            )}
            <button
              onClick={onFollowUp}
              className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-text hover:border-accent/40 hover:text-accent"
              title="Generate AI follow-up message"
            >
              <Sparkles size={9} className="inline" /> AI DM
            </button>
            <button
              onClick={onRescore}
              className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-text hover:border-accent/40 hover:text-accent"
              title="Re-run AI lead score"
            >
              <TrendingUp size={9} className="inline" /> Re-score
            </button>
            <button
              onClick={onDelete}
              className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-text hover:border-danger/40 hover:text-danger"
              title="Remove from pipeline"
            >
              <Trash2 size={9} className="inline" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
