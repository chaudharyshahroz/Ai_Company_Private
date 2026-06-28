"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, X, Check, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export function TaskActions({ taskId, status }: { taskId: string; status: string }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = React.useState<string | null>(null);

  const run = async (kind: "rerun" | "cancel" | "complete") => {
    setBusy(kind);
    try {
      if (kind === "rerun") {
        await fetch(`/api/tasks/${taskId}/rerun`, { method: "POST" });
        toast.push({ tone: "info", title: "Task re-queued", description: "Your AI employee is on it." });
      } else if (kind === "cancel") {
        await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
        toast.push({ tone: "warning", title: "Task cancelled", description: "It won't be picked up again." });
      } else {
        toast.push({ tone: "success", title: "Marked complete", description: "Nice — closing this out." });
      }
      router.refresh();
    } catch {
      toast.push({ tone: "error", title: "Something went wrong", description: "Try again in a moment." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(status === "failed" || status === "completed") && (
        <Button onClick={() => run("rerun")} disabled={busy !== null} size="lg">
          <Play size={13} />
          Run again
        </Button>
      )}
      {(status === "queued" || status === "running") && (
        <Button onClick={() => run("rerun")} variant="secondary" disabled={busy !== null}>
          <RefreshCw size={12} className={cn(busy === "rerun" && "animate-spin")} />
          {busy === "rerun" ? "Re-queueing…" : "Re-run"}
        </Button>
      )}
      {status === "queued" && (
        <Button
          variant="secondary"
          onClick={() => run("cancel")}
          disabled={busy !== null}
        >
          <X size={12} />
          Cancel
        </Button>
      )}
      {status === "running" && (
        <Button onClick={() => run("complete")} disabled={busy !== null}>
          <Check size={12} />
          Mark complete
        </Button>
      )}
    </div>
  );
}