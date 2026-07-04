"use client";

import * as React from "react";
import {
  Check,
  X,
  Edit3,
  RefreshCw,
  Send,
  Inbox,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Award,
  Gauge,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface WorkItemV2 {
  id: string;
  title: string;
  summary: string;
  body: string;
  kind:
    | "draft"
    | "research"
    | "outreach"
    | "content"
    | "analysis"
    | "reply"
    | "report"
    | "plan"
    | "campaign"
    | "legal_draft"
    | "finance_draft";
  status:
    | "needs_approval"
    | "ready_to_send"
    | "ready_to_publish"
    | "ready_to_save"
    | "completed"
    | "rejected"
    | "regenerating";
  priority: "low" | "normal" | "high" | "urgent";
  employeeName: string;
  employeeSlug: string;
  department: string;
  qualityScore: number | null;
  relevanceScore: number | null;
  safetyScore: number | null;
  confidenceScore: number | null;
  evaluatorNotes: string | null;
  creditsEstimated: number;
  requiresApproval: boolean;
  approvalReason: string | null;
  suggestedNextAction: string | null;
  regenerationCount: number;
  createdAt: string;
  goalTitle?: string;
}

type TabId = "all" | "needs_approval" | "approved" | "rejected";

const tabs: { id: TabId; label: string }[] = [
  { id: "needs_approval", label: "Needs Approval" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

const kindLabel: Record<WorkItemV2["kind"], string> = {
  draft: "Draft",
  research: "Research",
  outreach: "Outreach",
  content: "Content",
  analysis: "Analysis",
  reply: "Customer Reply",
  report: "Report",
  plan: "Plan",
  campaign: "Campaign",
  legal_draft: "Legal Draft",
  finance_draft: "Finance Draft",
};

const kindTone: Record<WorkItemV2["kind"], string> = {
  draft: "border-border bg-muted text-secondary",
  research: "border-accent/40 bg-accent/10 text-accent-hover",
  outreach: "border-warning/40 bg-warning/10 text-warning",
  content: "border-accent-warm/40 bg-accent-warm/10 text-accent-warm",
  analysis: "border-primary/40 bg-primary/10 text-primary",
  reply: "border-warning/40 bg-warning/10 text-warning",
  report: "border-border bg-muted text-secondary",
  plan: "border-primary/40 bg-primary/10 text-primary",
  campaign: "border-accent-warm/40 bg-accent-warm/10 text-accent-warm",
  legal_draft: "border-danger/40 bg-danger/10 text-danger",
  finance_draft: "border-warning/40 bg-warning/10 text-warning",
};

function QualityBar({ label, score }: { label: string; score: number | null }) {
  if (score === null) return null;
  const pct = Math.max(0, Math.min(100, score));
  const color =
    pct >= 80 ? "bg-success" : pct >= 60 ? "bg-warning" : "bg-danger";
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-20 text-muted-text">{label}</span>
      <div className="h-1.5 w-20 rounded-full bg-muted">
        <div className={cn("h-1.5 rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono tabular-nums text-text">{pct}</span>
    </div>
  );
}

function StatusPill({ status }: { status: WorkItemV2["status"] }) {
  if (status === "completed") {
    return (
      <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-success">
        Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="rounded-full border border-danger/40 bg-danger/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-danger">
        Rejected
      </span>
    );
  }
  if (status === "regenerating") {
    return (
      <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-warning">
        Regenerating
      </span>
    );
  }
  return (
    <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-warning">
      Needs approval
    </span>
  );
}

export function WorkReviewClientV2({
  initialItems,
  goalsById,
}: {
  initialItems: WorkItemV2[];
  goalsById: Record<string, string>;
}) {
  const toast = useToast();
  const [items, setItems] = React.useState<WorkItemV2[]>(initialItems);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState<TabId>("needs_approval");
  const [busy, setBusy] = React.useState<Record<string, boolean>>({});

  const updateItem = (id: string, patch: Partial<WorkItemV2>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const call = async (id: string, action: string, body?: unknown) => {
    setBusy((b) => ({ ...b, [id]: true }));
    try {
      const res = await fetch(`/api/work-review/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Request failed");
      return data;
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  };

  const handleApprove = async (item: WorkItemV2) => {
    await call(item.id, "approve");
    updateItem(item.id, { status: "completed" });
    toast.push({
      tone: "success",
      title: "Approved",
      description: `${item.employeeName}'s work is approved.`,
    });
  };

  const handleReject = async (item: WorkItemV2) => {
    await call(item.id, "reject", { note: "Needs changes" });
    updateItem(item.id, { status: "rejected" });
    toast.push({
      tone: "warning",
      title: "Rejected",
      description: `${item.employeeName} will be notified.`,
    });
  };

  const handleEditStart = (item: WorkItemV2) => {
    setEditingId(item.id);
    setEditDraft(item.body);
  };

  const handleEditSave = (item: WorkItemV2) => {
    // Optimistic; in real mode, call an edit API. For demo: approve the edited version.
    updateItem(item.id, { body: editDraft, status: "completed" });
    setEditingId(null);
    toast.push({
      tone: "success",
      title: "Edits saved",
      description: `Your changes are now approved.`,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const handleRegenerate = async (item: WorkItemV2) => {
    updateItem(item.id, { status: "regenerating" });
    try {
      const data = await call(item.id, "regenerate");
      const newBody = data?.output ?? item.body;
      updateItem(item.id, {
        body: newBody,
        status: "needs_approval",
        regenerationCount: item.regenerationCount + 1,
      });
      toast.push({
        tone: "info",
        title: "Regenerated",
        description: `${item.employeeName} produced a new version.`,
      });
    } catch (err) {
      updateItem(item.id, { status: "needs_approval" });
      toast.push({
        tone: "warning",
        title: "Regenerate failed",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleSaveToKb = async (item: WorkItemV2) => {
    await call(item.id, "save-to-kb");
    updateItem(item.id, { status: "completed" });
    toast.push({
      tone: "success",
      title: "Saved to Knowledge Base",
      description: `${item.employeeName}'s work will train the team.`,
    });
  };

  const counts: Record<TabId, number> = React.useMemo(
    () => ({
      all: items.length,
      needs_approval: items.filter((i) => i.status === "needs_approval").length,
      approved: items.filter((i) => i.status === "completed").length,
      rejected: items.filter((i) => i.status === "rejected").length,
    }),
    [items],
  );

  const filtered = React.useMemo(() => {
    if (activeTab === "needs_approval")
      return items.filter((i) => i.status === "needs_approval");
    if (activeTab === "approved") return items.filter((i) => i.status === "completed");
    if (activeTab === "rejected") return items.filter((i) => i.status === "rejected");
    return items;
  }, [items, activeTab]);

  const grouped = filtered.reduce<Record<string, WorkItemV2[]>>((acc, item) => {
    const key = item.employeeName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      <div className="mb-7 max-w-3xl">
        <h1 className="page-title">Work Review</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-secondary">
          Every AI employee submits work here. Approve, edit, regenerate, or save to Knowledge Base.
          Your team learns from what you approve.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 -mx-1 flex flex-wrap items-center gap-1.5 overflow-x-auto px-1 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors",
              activeTab === tab.id
                ? "border-border bg-surface-2 text-text"
                : "border-transparent bg-transparent text-secondary hover:text-text",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 font-mono text-[11px] tabular-nums",
                activeTab === tab.id
                  ? tab.id === "needs_approval"
                    ? "bg-warning/15 text-warning"
                    : "bg-accent/15 text-accent-hover"
                  : "bg-muted text-muted-text",
              )}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Panel className="px-6 py-16">
          <EmptyState
            icon={<Inbox size={20} />}
            title={activeTab === "approved" ? "No approved work yet" : "Nothing to review"}
            description={
              activeTab === "approved"
                ? "Approve a work item and it will land here."
                : "Your AI employees have nothing pending. Schedule work or hire an employee to get started."
            }
            action={
              <a
                href="/employees"
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#FFFFFF] px-3 text-[13px] font-medium text-[#0A0B0C] shadow-button hover:bg-white"
              >
                <Sparkles size={12} />
                Hire an employee
              </a>
            }
          />
        </Panel>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([employee, empItems]) => (
            <div key={employee}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                  From {employee}
                </h2>
                <span className="text-[12px] text-muted-text">
                  {empItems.length} {empItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="space-y-3">
                {empItems.map((item) => {
                  const isEditing = editingId === item.id;
                  const isBusy = !!busy[item.id];
                  const isCompleted = item.status === "completed";
                  const isRejected = item.status === "rejected";
                  const isRegenerating = item.status === "regenerating";
                  const goalTitle =
                    item.goalTitle ?? (item as unknown as { goalId?: string }).goalId;
                  return (
                    <Panel
                      key={item.id}
                      className={cn(
                        "p-0 transition-opacity",
                        isRejected && "opacity-60",
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-2 px-5 py-3.5">
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-semibold text-text">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-[12.5px] text-muted-text">
                            {new Date(item.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}{" "}
                            · {item.creditsEstimated} credits
                            {goalTitle ? ` · goal: ${goalTitle}` : ""}
                            {item.regenerationCount > 0
                              ? ` · regenerated ${item.regenerationCount}×`
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                              kindTone[item.kind],
                            )}
                          >
                            {kindLabel[item.kind]}
                          </span>
                          <StatusPill status={item.status} />
                        </div>
                      </div>

                      {/* Quality block */}
                      <div className="grid grid-cols-1 gap-x-8 gap-y-3 border-b border-border px-5 py-4 md:grid-cols-2 md:px-6">
                        <div>
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                            Summary
                          </p>
                          <p className="text-[14px] leading-relaxed text-text">
                            {item.summary}
                          </p>
                          {item.approvalReason ? (
                            <p className="mt-2 flex items-start gap-1.5 text-[12px] text-secondary">
                              <AlertTriangle size={12} className="mt-0.5 shrink-0 text-warning" />
                              <span>{item.approvalReason}</span>
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                            <Gauge size={11} />
                            Quality
                          </p>
                          <div className="space-y-1.5">
                            <QualityBar label="Quality" score={item.qualityScore} />
                            <QualityBar label="Relevance" score={item.relevanceScore} />
                            <QualityBar label="Safety" score={item.safetyScore} />
                            <QualityBar label="Confidence" score={item.confidenceScore} />
                          </div>
                          {item.evaluatorNotes ? (
                            <p className="mt-2 text-[11.5px] italic text-muted-text">
                              {item.evaluatorNotes}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="px-5 py-5 md:px-6">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                          Output
                        </p>
                        {isEditing ? (
                          <textarea
                            value={editDraft}
                            onChange={(e) => setEditDraft(e.target.value)}
                            rows={Math.max(6, editDraft.split("\n").length + 1)}
                            className="w-full resize-y rounded-md border border-border bg-surface-2 p-3 text-[14px] leading-relaxed text-text outline-none focus:border-accent"
                          />
                        ) : (
                          <div className="whitespace-pre-wrap rounded-md bg-surface-2 p-4 text-[14px] leading-relaxed text-text">
                            {item.body}
                          </div>
                        )}
                        {item.suggestedNextAction && !isEditing ? (
                          <p className="mt-3 flex items-start gap-1.5 text-[12.5px] text-secondary">
                            <Award size={12} className="mt-0.5 shrink-0 text-accent" />
                            <span>
                              <strong className="font-semibold text-text">
                                Suggested next action:
                              </strong>{" "}
                              {item.suggestedNextAction}
                            </span>
                          </p>
                        ) : null}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3">
                        {isEditing ? (
                          <>
                            <Button variant="secondary" size="sm" onClick={handleEditCancel}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={() => handleEditSave(item)}>
                              <Check size={12} />
                              Save & Approve
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEditStart(item)}
                              disabled={isCompleted || isRejected}
                            >
                              <Edit3 size={12} />
                              Edit
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleRegenerate(item)}
                              disabled={isBusy || isCompleted || isRegenerating}
                            >
                              <RefreshCw
                                size={12}
                                className={cn(isRegenerating && "animate-spin")}
                              />
                              {isRegenerating ? "Regenerating…" : "Regenerate"}
                            </Button>
                            {item.kind === "research" || item.kind === "report" || item.kind === "analysis" ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSaveToKb(item)}
                                disabled={isBusy || isCompleted || isRejected}
                              >
                                <BookOpen size={12} />
                                Save to KB
                              </Button>
                            ) : null}
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleReject(item)}
                              disabled={isBusy || isCompleted || isRejected}
                            >
                              <X size={12} />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(item)}
                              disabled={isBusy || isCompleted || isRejected}
                            >
                              <Check size={12} />
                              Approve
                              <Send size={12} />
                            </Button>
                          </>
                        )}
                      </div>
                    </Panel>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}