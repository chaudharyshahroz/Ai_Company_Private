import * as React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getCurrentUser, listNotifications } from "@/lib/data";
import { formatRelativeTime } from "@/lib/format";
import { CheckCircle2, AlertCircle, Zap, BarChart3, CreditCard, Bell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const iconMap = {
  task_complete: { icon: CheckCircle2, color: "text-accent" },
  task_failed: { icon: AlertCircle, color: "text-accent-warm" },
  agent_alert: { icon: Zap, color: "text-primary-light" },
  board_report: { icon: BarChart3, color: "text-primary-light" },
  billing: { icon: CreditCard, color: "text-accent-warm" },
  system: { icon: Bell, color: "text-text-secondary" },
};

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  const notifications = await listNotifications(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {notifications.filter((n) => !n.isRead).length} unread ·{" "}
            {notifications.length} total
          </p>
        </div>
        <button className="text-xs text-text-secondary hover:text-text-primary">
          Mark all as read
        </button>
      </div>

      <GlassCard className="divide-y divide-border/60 p-0">
        {notifications.map((n) => {
          const cfg = iconMap[n.type] ?? iconMap.system!;
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-4 p-5 transition-colors hover:bg-surface-2/40",
                !n.isRead && "bg-primary/[0.03]",
              )}
            >
              <div className={cn("mt-0.5", cfg.color)}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{n.title}</span>
                  {!n.isRead && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{n.message}</p>
                <p className="mt-1 text-xs text-text-tertiary">{formatRelativeTime(n.createdAt)}</p>
              </div>
              <ChevronRight size={14} className="mt-1 text-text-tertiary" />
            </div>
          );
        })}
      </GlassCard>
    </div>
  );
}