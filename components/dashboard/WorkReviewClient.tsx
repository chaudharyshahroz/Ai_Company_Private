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
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface WorkItem {
  id: string;
  employeeName: string;
  department: string;
  type:
    | "ready_to_publish"
    | "ready_to_send"
    | "customer_reply"
    | "research_report"
    | "growth_suggestion";
  title: string;
  output: string;
  preview?: string;
  credits: number;
  createdAt: string;
  status: "needs_approval" | "approved" | "rejected" | "in_progress" | "completed";
}

type TabId = "all" | "needs_approval" | "ready_to_publish" | "ready_to_send" | "reports" | "completed";

const tabs: { id: TabId; label: string }[] = [
  { id: "needs_approval", label: "Needs Approval" },
  { id: "ready_to_publish", label: "Ready to Publish" },
  { id: "ready_to_send", label: "Ready to Send" },
  { id: "reports", label: "Reports" },
  { id: "completed", label: "Completed" },
];

const typeLabels: Record<
  WorkItem["type"],
  { label: string; tone: "accent" | "success" | "warning" | "muted"; primaryAction: string }
> = {
  ready_to_publish: { label: "Ready to publish", tone: "accent", primaryAction: "Publish" },
  ready_to_send: { label: "Ready to send", tone: "accent", primaryAction: "Send" },
  customer_reply: { label: "Customer reply", tone: "warning", primaryAction: "Send Reply" },
  research_report: { label: "Report", tone: "muted", primaryAction: "Mark Read" },
  growth_suggestion: { label: "Suggestion", tone: "success", primaryAction: "Approve Plan" },
};

export function WorkReviewClient({ initialItems }: { initialItems: WorkItem[] }) {
  const toast = useToast();
  const [items, setItems] = React.useState<WorkItem[]>(initialItems);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState<TabId>("needs_approval");
  const [regenerating, setRegenerating] = React.useState<Record<string, boolean>>({});

  const updateItem = (id: string, patch: Partial<WorkItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const handleApprove = (item: WorkItem) => {
    const action = typeLabels[item.type].primaryAction;
    updateItem(item.id, { status: "completed" });
    toast.push({
      tone: "success",
      title: `${action} ✓`,
      description: `“${item.title}” approved and sent to ${item.employeeName}.`,
    });
  };

  const handleReject = (item: WorkItem) => {
    updateItem(item.id, { status: "rejected" });
    toast.push({
      tone: "warning",
      title: "Work rejected",
      description: `${item.employeeName} will be notified to revise.`,
    });
  };

  const handleEditStart = (item: WorkItem) => {
    setEditingId(item.id);
    setEditDraft(item.output);
  };

  const handleEditSave = (item: WorkItem) => {
    updateItem(item.id, { output: editDraft, status: "completed" });
    setEditingId(null);
    toast.push({
      tone: "success",
      title: "Edits saved",
      description: `Your changes are now live.`,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const handleRegenerate = async (item: WorkItem) => {
    setRegenerating((r) => ({ ...r, [item.id]: true }));
    // Simulate regeneration (real version would call the API)
    await new Promise((res) => setTimeout(res, 1400));
    const regenerated = `${item.output}\n\n— v2 regenerated just now by ${item.employeeName}.`;
    updateItem(item.id, { output: regenerated, status: "needs_approval" });
    setRegenerating((r) => ({ ...r, [item.id]: false }));
    toast.push({
      tone: "info",
      title: "Regenerated",
      description: `${item.employeeName} produced a new version. Ready for review.`,
    });
  };

  const counts: Record<TabId, number> = React.useMemo(
    () => ({
      all: items.length,
      needs_approval: items.filter((i) => i.status === "needs_approval").length,
      ready_to_publish: items.filter((i) => i.type === "ready_to_publish" && i.status !== "completed" && i.status !== "rejected").length,
      ready_to_send: items.filter((i) => i.type === "ready_to_send" && i.status !== "completed" && i.status !== "rejected").length,
      reports: items.filter((i) => i.type === "research_report").length,
      completed: items.filter((i) => i.status === "completed").length,
    }),
    [items],
  );

  const filtered = React.useMemo(() => {
    if (activeTab === "all") return items.filter((i) => i.status !== "rejected");
    if (activeTab === "needs_approval") return items.filter((i) => i.status === "needs_approval");
    if (activeTab === "completed") return items.filter((i) => i.status === "completed");
    if (activeTab === "reports") return items.filter((i) => i.type === "research_report");
    if (activeTab === "ready_to_publish") return items.filter((i) => i.type === "ready_to_publish");
    if (activeTab === "ready_to_send") return items.filter((i) => i.type === "ready_to_send");
    return items;
  }, [items, activeTab]);

  // Group by employee for the All view
  const grouped = filtered.reduce<Record<string, WorkItem[]>>((acc, item) => {
    const key = item.employeeName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Header */}
      <div className="mb-7 max-w-3xl">
        <h1 className="page-title">Work Review</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-secondary">
          Every AI employee submits work here. Approve, edit, regenerate, or reject. The number tells you how much is waiting on you.
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
            title={activeTab === "completed" ? "No completed work yet" : "Nothing to review"}
            description={
              activeTab === "completed"
                ? "Approved work shows up here once your AI employees finish publishing or sending."
                : "Your AI employees have no work in this view. Assign a task to get started."
            }
            action={
              <a
                href="/hq/tasks/new"
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#FFFFFF] px-3 text-[13px] font-medium text-[#0A0B0C] shadow-button hover:bg-white"
              >
                <Sparkles size={12} />
                Assign a task
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
                  const t = typeLabels[item.type];
                  const isEditing = editingId === item.id;
                  const isRegenerating = !!regenerating[item.id];
                  const isCompleted = item.status === "completed";
                  const isRejected = item.status === "rejected";
                  return (
                    <Panel key={item.id} className={cn("p-0 transition-opacity", isRejected && "opacity-50")}>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-2 px-5 py-3.5">
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-semibold text-text">{item.title}</p>
                          <p className="mt-0.5 text-[12.5px] text-muted-text">
                            {new Date(item.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}{" "}
                            · {item.credits} credits
                          </p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                            isCompleted
                              ? "border-success/40 bg-success/10 text-success"
                              : isRejected
                                ? "border-danger/40 bg-danger/10 text-danger"
                                : t.tone === "warning"
                                  ? "border-warning/40 bg-warning/10 text-warning"
                                  : t.tone === "accent"
                                    ? "border-accent/40 bg-accent/10 text-accent-hover"
                                    : t.tone === "success"
                                      ? "border-success/40 bg-success/10 text-success"
                                      : "border-border bg-muted text-secondary",
                          )}
                        >
                          {isCompleted ? "Completed" : isRejected ? "Rejected" : t.label}
                        </span>
                      </div>

                      <div className="px-5 py-5 md:px-6">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                          {isCompleted ? "Approved content" : isRejected ? "Rejected content" : "Summary"}
                        </p>
                        {isEditing ? (
                          <textarea
                            value={editDraft}
                            onChange={(e) => setEditDraft(e.target.value)}
                            rows={Math.max(6, editDraft.split("\n").length + 1)}
                            className="w-full resize-y rounded-md border border-border bg-surface-2 p-3 text-[14px] leading-relaxed text-text outline-none focus:border-accent"
                          />
                        ) : (
                          <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-text">
                            {item.output}
                          </p>
                        )}
                      </div>

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
                              disabled={isRegenerating || isCompleted}
                            >
                              <RefreshCw
                                size={12}
                                className={cn(isRegenerating && "animate-spin")}
                              />
                              {isRegenerating ? "Regenerating…" : "Regenerate"}
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleReject(item)}
                              disabled={isCompleted || isRejected}
                            >
                              <X size={12} />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(item)}
                              disabled={isCompleted || isRejected}
                            >
                              {t.primaryAction}
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