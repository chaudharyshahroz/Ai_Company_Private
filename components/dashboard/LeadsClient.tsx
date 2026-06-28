"use client";

import * as React from "react";
import {
  Plus,
  ArrowRight,
  Mail,
  X,
  CheckCircle2,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  status: "new" | "qualified" | "follow-up" | "won" | "lost";
  interest: string;
}

const columns: { id: Lead["status"]; label: string; tone: string }[] = [
  { id: "new", label: "New", tone: "text-muted-text" },
  { id: "qualified", label: "Qualified", tone: "text-accent" },
  { id: "follow-up", label: "Follow-Up", tone: "text-warning" },
  { id: "won", label: "Won", tone: "text-success" },
  { id: "lost", label: "Lost", tone: "text-muted-text" },
];

export function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const toast = useToast();
  const [leads, setLeads] = React.useState<Lead[]>(initialLeads);
  const [showAdd, setShowAdd] = React.useState(false);

  // Form state for adding a lead
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    company: "",
    source: "Website",
    interest: "",
  });

  const buckets = React.useMemo(() => {
    const acc: Record<Lead["status"], Lead[]> = {
      new: [],
      qualified: [],
      "follow-up": [],
      won: [],
      lost: [],
    };
    for (const l of leads) acc[l.status].push(l);
    return acc;
  }, [leads]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const next: Lead = {
      id: `l-new-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || "—",
      source: form.source,
      status: "new",
      interest: form.interest.trim() || "General inquiry",
    };
    setLeads((prev) => [next, ...prev]);
    setForm({ name: "", email: "", company: "", source: "Website", interest: "" });
    setShowAdd(false);
    toast.push({
      tone: "success",
      title: "Lead added",
      description: `${next.name} is in the New column. Your Sales Employee will reach out.`,
    });
  };

  const handleAskSales = () => {
    const followUps = buckets["follow-up"].length;
    toast.push({
      tone: "info",
      title: "Sales Employee notified",
      description: followUps > 0
        ? `Will reach out to all ${followUps} follow-ups + any new leads today.`
        : "Will reach out to all new leads today.",
      action: { label: "View employees", href: "/employees" },
    });
  };

  const moveLead = (id: string, to: Lead["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: to } : l)));
    const lead = leads.find((l) => l.id === id);
    if (lead) {
      toast.push({
        tone: to === "won" ? "success" : "info",
        title: `Moved to ${columns.find((c) => c.id === to)?.label}`,
        description: `${lead.name} updated.`,
      });
    }
  };

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="page-title">Leads</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-secondary">
            Every lead captured by your Sales Department. Move them through your pipeline with one click.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleAskSales}>
            <ArrowRight size={13} />
            Ask Sales to Follow Up
          </Button>
          <Button onClick={() => setShowAdd(true)} size="lg">
            <Plus size={13} />
            Add Lead
          </Button>
        </div>
      </div>

      {showAdd && (
        <Panel className="mb-6 border-accent/30 p-6">
          <form onSubmit={handleAdd}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[14.5px] font-semibold text-text">Add a new lead</p>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-md p-1 text-muted-text hover:bg-hover hover:text-text"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="reklu-input"
                  placeholder="Jane Doe"
                  required
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="reklu-input"
                  placeholder="jane@example.com"
                  required
                />
              </Field>
              <Field label="Company">
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="reklu-input"
                  placeholder="Acme Co"
                />
              </Field>
              <Field label="Source">
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="reklu-input"
                >
                  <option>Website</option>
                  <option>Widget</option>
                  <option>LinkedIn</option>
                  <option>Cold email</option>
                  <option>Referral</option>
                  <option>Demo request</option>
                </select>
              </Field>
              <Field label="Interest" full>
                <input
                  type="text"
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="reklu-input"
                  placeholder="What are they interested in?"
                />
              </Field>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <CheckCircle2 size={12} />
                Add lead
              </Button>
            </div>
          </form>
        </Panel>
      )}

      {leads.length === 0 ? (
        <Panel className="px-6 py-16">
          <EmptyState
            title="No leads yet"
            description="Your Sales Employee hasn't found any leads yet. Add one manually or assign a task."
            action={
              <Button onClick={() => setShowAdd(true)}>
                <Plus size={13} />
                Add first lead
              </Button>
            }
          />
        </Panel>
      ) : (
        <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-4 md:grid md:grid-cols-5 md:overflow-visible">
          {columns.map((col) => (
            <div key={col.id} className="min-w-[260px] snap-start md:min-w-0">
              <div className="mb-3 flex items-center justify-between">
                <h2 className={cn("text-[12.5px] font-semibold uppercase tracking-[0.04em]", col.tone)}>
                  {col.label}
                </h2>
                <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-muted-text">
                  {buckets[col.id].length}
                </span>
              </div>

              <div className="space-y-2">
                {buckets[col.id].length === 0 ? (
                  <Panel className="px-3 py-6 text-center text-[12.5px] text-muted-text">
                    Nothing here
                  </Panel>
                ) : (
                  buckets[col.id].map((lead) => (
                    <Panel key={lead.id} hoverable className="p-3.5">
                      <p className="text-[14px] font-semibold text-text">{lead.name}</p>
                      <p className="mt-0.5 text-[12.5px] text-muted-text">{lead.company}</p>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-secondary">
                        {lead.interest}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[12px]">
                        <span className="flex items-center gap-1 truncate text-muted-text">
                          <Mail size={11} />
                          <span className="truncate">{lead.email}</span>
                        </span>
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-secondary">
                          {lead.source}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-1">
                        {columns
                          .filter((c) => c.id !== lead.status)
                          .map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => moveLead(lead.id, c.id)}
                              className="flex-1 rounded-md border border-border bg-surface px-1.5 py-1 text-[10.5px] uppercase tracking-wider text-secondary transition-colors hover:border-border-strong hover:text-text"
                              title={`Move to ${c.label}`}
                            >
                              {c.label}
                            </button>
                          ))}
                      </div>
                    </Panel>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
  required,
  full,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="mb-1.5 block text-[12.5px] font-medium text-muted-text">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}