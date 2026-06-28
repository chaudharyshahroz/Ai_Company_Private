"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface Props {
  headline: string;
  detail: string;
  ctaLabel: string;
  ctaHref?: string;
}

export function RecommendationCard({ headline, detail, ctaLabel, ctaHref }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = React.useState(false);

  const handleAccept = async () => {
    if (ctaHref) {
      router.push(ctaHref);
      return;
    }
    setBusy(true);
    try {
      // Try to create the task via API for the follow-up sequence
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hiredAgentId: "h-aria", // fallback employee id
          title: headline,
          description: detail,
        }),
      });
    } catch {
      // ignore — toast below covers the UX
    } finally {
      setBusy(false);
    }
    toast.push({
      tone: "success",
      title: "Task queued",
      description: "Your AI team will get on it shortly.",
      action: { label: "View task", href: "/hq/tasks" },
    });
    router.push("/hq/tasks");
  };

  return (
    <Panel className="overflow-hidden p-0">
      <div className="flex flex-col gap-5 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-accent">
              Recommended next step
            </p>
            <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-text">
              {detail}
            </p>
          </div>
        </div>
        <Button onClick={handleAccept} disabled={busy} size="lg" className="shrink-0">
          {ctaLabel}
          <ArrowRight size={14} />
        </Button>
      </div>
    </Panel>
  );
}