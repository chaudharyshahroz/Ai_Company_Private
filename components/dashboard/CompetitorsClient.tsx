"use client";

import * as React from "react";
import {
  Plus,
  X,
  Trash2,
  ExternalLink,
  Check,
  XCircle,
  Sparkles,
  Swords,
  Copy,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface CompetitorView {
  id: string;
  name: string;
  website: string;
  positioning: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  gap: string;
  howToBeat: string;
  copiedMoves: string[];
  doBetter: string[];
  status: "watching" | "beating" | "lost-to" | "won-against";
  createdAt: string;
}

const statusMeta: Record<CompetitorView["status"], { label: string; tone: string }> = {
  watching: { label: "Watching", tone: "text-muted-text border-border bg-surface-2" },
  beating: { label: "Beating", tone: "text-success border-success/30 bg-success/10" },
  "lost-to": { label: "Lost to", tone: "text-danger border-danger/30 bg-danger/10" },
  "won-against": { label: "Won against", tone: "text-accent border-accent/30 bg-accent/10" },
};

const emptyForm = {
  name: "",
  website: "",
  positioning: "",
  pricing: "",
  strengths: "",
  weaknesses: "",
  gap: "",
  howToBeat: "",
};

export function CompetitorsClient({ initial }: { initial: CompetitorView[] }) {
  const toast = useToast();
  const [comps, setComps] = React.useState<CompetitorView[]>(initial);
  const [showAdd, setShowAdd] = React.useState(false);
  const [active, setActive] = React.useState<string | null>(initial[0]?.id ?? null);
  const [form, setForm] = React.useState(emptyForm);
  const [view, setView] = React.useState<"cards" | "compare">("cards");

  const activeComp = comps.find((c) => c.id === active);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const strengths = form.strengths.split("\n").map((s) => s.trim()).filter(Boolean);
    const weaknesses = form.weaknesses.split("\n").map((s) => s.trim()).filter(Boolean);
    const comp: CompetitorView = {
      id: `comp-new-${Date.now()}`,
      name: form.name.trim(),
      website: form.website.trim(),
      positioning: form.positioning.trim(),
      pricing: form.pricing.trim() || "Unknown",
      strengths,
      weaknesses,
      gap: form.gap.trim(),
      howToBeat: form.howToBeat.trim(),
      copiedMoves: [],
      doBetter: [],
      status: "watching",
      createdAt: new Date().toISOString(),
    };
    setComps((prev) => [...prev, comp]);
    setForm(emptyForm);
    setShowAdd(false);
    setActive(comp.id);
    toast.push({
      tone: "success",
      title: "Competitor added",
      description: `${comp.name} is now being watched. AI will draft a "how to beat" playbook.`,
    });
  };

  const remove = (id: string) => {
    const c = comps.find((x) => x.id === id);
    if (!c) return;
    setComps((prev) => prev.filter((x) => x.id !== id));
    if (active === id) setActive(comps.find((x) => x.id !== id)?.id ?? null);
    toast.push({ tone: "info", title: `${c.name} removed` });
  };

  const aiResearch = (id: string) => {
    const c = comps.find((x) => x.id === id);
    if (!c) return;
    toast.push({
      tone: "info",
      title: "AI Research Agent scanning…",
      description: `Nova is gathering the latest public info on ${c.name} — pricing, features, reviews, news. You'll get a fresh playbook in 30 seconds.`,
    });
  };

  const copyPlaybook = (c: CompetitorView) => {
    const text = `HOW TO BEAT ${c.name.toUpperCase()}\n\nGap: ${c.gap}\n\nPlaybook:\n${c.howToBeat}\n\nWhat to copy: ${c.copiedMoves.join(", ")}\nWhat to do better: ${c.doBetter.join(", ")}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.push({ tone: "success", title: "Playbook copied to clipboard" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-md border border-border bg-surface-1 p-0.5">
          <button
            onClick={() => setView("cards")}
            className={cn(
              "rounded px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
              view === "cards" ? "bg-surface-2 text-text" : "text-muted-text hover:text-text",
            )}
          >
            Cards
          </button>
          <button
            onClick={() => setView("compare")}
            className={cn(
              "rounded px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
              view === "compare" ? "bg-surface-2 text-text" : "text-muted-text hover:text-text",
            )}
          >
            Side-by-side
          </button>
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              toast.push({
                tone: "info",
                title: "AI scanning the market",
                description: "Research Agent is finding 3 new competitors in your space. Approve to add them.",
              })
            }
          >
            <Sparkles size={13} />
            AI find competitors
          </Button>
          <Button size="md" onClick={() => setShowAdd(true)}>
            <Plus size={13} /> Add competitor
          </Button>
        </div>
      </div>

      {comps.length === 0 ? (
        <EmptyState
          title="No competitors yet"
          description="Add 3-5 competitors and AI will generate a 'how to beat' playbook for each."
          action={
            <Button size="md" onClick={() => setShowAdd(true)}>
              <Plus size={13} /> Add competitor
            </Button>
          }
        />
      ) : view === "cards" ? (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* List */}
          <div className="space-y-2">
            {comps.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "block w-full rounded-md border border-border bg-surface-1 p-3 text-left transition-colors",
                  active === c.id && "border-accent/40 bg-surface-2",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate font-medium text-text">{c.name}</div>
                  <div className={cn("rounded border px-1.5 py-0.5 text-[9px] font-medium uppercase", statusMeta[c.status].tone)}>
                    {statusMeta[c.status].label}
                  </div>
                </div>
                <div className="mt-0.5 truncate text-[11px] text-muted-text">{c.website || "—"}</div>
                <div className="mt-1 line-clamp-1 text-[11px] text-secondary">{c.positioning}</div>
              </button>
            ))}
          </div>

          {/* Detail */}
          {activeComp ? (
            <div className="space-y-4">
              <Panel className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Swords size={14} className="text-accent" />
                      <h2 className="text-[20px] font-semibold text-text">{activeComp.name}</h2>
                      <div className={cn("rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase", statusMeta[activeComp.status].tone)}>
                        {statusMeta[activeComp.status].label}
                      </div>
                    </div>
                    {activeComp.website && (
                      <a
                        href={`https://${activeComp.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-[12px] text-accent hover:underline"
                      >
                        {activeComp.website}
                        <ExternalLink size={10} />
                      </a>
                    )}
                    <p className="mt-3 text-[13px] text-secondary">{activeComp.positioning}</p>
                    <div className="mt-2 inline-flex rounded border border-border bg-surface-2 px-2 py-1 text-[12px] text-text">
                      <span className="text-muted-text">Pricing:</span>&nbsp;{activeComp.pricing}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="secondary" size="sm" onClick={() => aiResearch(activeComp.id)}>
                      <Sparkles size={12} /> AI research
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => copyPlaybook(activeComp)}>
                      <Copy size={12} /> Copy playbook
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(activeComp.id)}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </Panel>

              <div className="grid gap-4 md:grid-cols-2">
                <Panel className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-success">
                    <Check size={11} />
                    Strengths ({activeComp.strengths.length})
                  </div>
                  <ul className="space-y-1.5">
                    {activeComp.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-secondary">
                        <Check size={11} className="mt-0.5 shrink-0 text-success" />
                        <span>{s}</span>
                      </li>
                    ))}
                    {activeComp.strengths.length === 0 && <li className="text-[12px] text-muted-text">None identified yet.</li>}
                  </ul>
                </Panel>
                <Panel className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-danger">
                    <XCircle size={11} />
                    Weaknesses ({activeComp.weaknesses.length})
                  </div>
                  <ul className="space-y-1.5">
                    {activeComp.weaknesses.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-secondary">
                        <XCircle size={11} className="mt-0.5 shrink-0 text-danger" />
                        <span>{s}</span>
                      </li>
                    ))}
                    {activeComp.weaknesses.length === 0 && <li className="text-[12px] text-muted-text">None identified yet.</li>}
                  </ul>
                </Panel>
              </div>

              <Panel className="border-accent/30 bg-accent/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  <Sparkles size={11} />
                  The gap you can exploit
                </div>
                <p className="text-[14px] font-medium text-text">{activeComp.gap}</p>
              </Panel>

              <Panel className="p-5">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  <Swords size={11} />
                  How to beat {activeComp.name}
                </div>
                <p className="text-[13px] leading-relaxed text-secondary">{activeComp.howToBeat}</p>

                <div className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-success">What to copy</div>
                    <ul className="space-y-1">
                      {activeComp.copiedMoves.map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[12px] text-secondary">
                          <Check size={10} className="mt-0.5 text-success" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent">What to do better</div>
                    <ul className="space-y-1">
                      {activeComp.doBetter.map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[12px] text-secondary">
                          <Sparkles size={10} className="mt-0.5 text-accent" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Panel>
            </div>
          ) : null}
        </div>
      ) : (
        <CompareTable comps={comps} />
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAdd(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
            <Panel className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">Add Competitor</div>
                  <h3 className="mt-1 text-[16px] font-medium text-text">Track a new competitor</h3>
                </div>
                <button onClick={() => setShowAdd(false)} className="rounded-md p-1 text-muted-text hover:text-text" aria-label="Close">
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
                      placeholder="e.g. Notion AI"
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    />
                  </Field>
                  <Field label="Website">
                    <input
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="notion.so"
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    />
                  </Field>
                </div>
                <Field label="Positioning (one line)">
                  <input
                    value={form.positioning}
                    onChange={(e) => setForm({ ...form, positioning: e.target.value })}
                    placeholder="AI inside docs. Q&A, summaries, content."
                    className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                  />
                </Field>
                <Field label="Pricing">
                  <input
                    value={form.pricing}
                    onChange={(e) => setForm({ ...form, pricing: e.target.value })}
                    placeholder="$10/user/mo"
                    className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Strengths (one per line)">
                    <textarea
                      value={form.strengths}
                      onChange={(e) => setForm({ ...form, strengths: e.target.value })}
                      rows={3}
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    />
                  </Field>
                  <Field label="Weaknesses (one per line)">
                    <textarea
                      value={form.weaknesses}
                      onChange={(e) => setForm({ ...form, weaknesses: e.target.value })}
                      rows={3}
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    />
                  </Field>
                </div>
                <Field label="The gap you can exploit">
                  <input
                    value={form.gap}
                    onChange={(e) => setForm({ ...form, gap: e.target.value })}
                    placeholder="What they don't do that customers want."
                    className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                  />
                </Field>
                <Field label="How to beat them (your playbook)">
                  <textarea
                    value={form.howToBeat}
                    onChange={(e) => setForm({ ...form, howToBeat: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                  />
                </Field>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="md" className="flex-1">
                    <Plus size={13} /> Add & analyze
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

function CompareTable({ comps }: { comps: CompetitorView[] }) {
  if (comps.length === 0) return null;
  return (
    <Panel className="overflow-x-auto p-0">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-border bg-surface-1/50">
            <th className="sticky left-0 z-10 min-w-[140px] bg-surface-1/50 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-text">Attribute</th>
            {comps.map((c) => (
              <th key={c.id} className="min-w-[200px] px-3 py-2 text-left text-[11px] font-medium text-text">
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { key: "website", label: "Website" },
            { key: "positioning", label: "Positioning" },
            { key: "pricing", label: "Pricing" },
            { key: "gap", label: "Gap you can exploit" },
          ].map((row) => (
            <tr key={row.key} className="border-b border-border last:border-0">
              <td className="sticky left-0 z-10 bg-surface-1 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-text">
                {row.label}
              </td>
              {comps.map((c) => (
                <td key={c.id} className="px-3 py-2 text-[12px] text-secondary">
                  {String((c as unknown as Record<string, string>)[row.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-b border-border">
            <td className="sticky left-0 z-10 bg-surface-1 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-text">Strengths</td>
            {comps.map((c) => (
              <td key={c.id} className="px-3 py-2 text-[12px] text-secondary">
                {c.strengths.length > 0 ? c.strengths.join(" · ") : "—"}
              </td>
            ))}
          </tr>
          <tr>
            <td className="sticky left-0 z-10 bg-surface-1 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-text">Weaknesses</td>
            {comps.map((c) => (
              <td key={c.id} className="px-3 py-2 text-[12px] text-secondary">
                {c.weaknesses.length > 0 ? c.weaknesses.join(" · ") : "—"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Panel>
  );
}
