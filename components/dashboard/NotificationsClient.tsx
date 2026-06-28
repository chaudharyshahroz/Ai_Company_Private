"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Check,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "work" | "lead" | "alert" | "info";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  href?: string;
}

const initial: Notification[] = [
  {
    id: "n-1",
    type: "work",
    title: "5 work items need your approval",
    description: "Aria, Echo, and 2 others submitted work to your inbox.",
    time: "2 min ago",
    isRead: false,
    href: "/hq/work-inbox",
  },
  {
    id: "n-2",
    type: "lead",
    title: "New qualified lead: Maya Chen",
    description: "Tidepool · Asked about pricing twice. Ready for a call.",
    time: "12 min ago",
    isRead: false,
    href: "/leads",
  },
  {
    id: "n-3",
    type: "alert",
    title: "2 overdue tasks in Support",
    description: "Robin is waiting on your approval for refund replies.",
    time: "1 hr ago",
    isRead: false,
  },
  {
    id: "n-4",
    type: "info",
    title: "Weekly CEO report is ready",
    description: "Last week: 142 tasks completed, 88% performance score.",
    time: "4 hr ago",
    isRead: true,
    href: "/reports",
  },
  {
    id: "n-5",
    type: "work",
    title: "Competitor scan complete",
    description: "Rival found 3 updates from Linear, Notion AI, ClickUp.",
    time: "1 day ago",
    isRead: true,
    href: "/hq/work-inbox",
  },
];

const iconFor = (type: Notification["type"]) => {
  switch (type) {
    case "work":
      return CheckCircle2;
    case "lead":
      return MessageSquare;
    case "alert":
      return AlertCircle;
    default:
      return Sparkles;
  }
};

export function NotificationsClient() {
  const toast = useToast();
  const [items, setItems] = React.useState(initial);

  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.push({ tone: "success", title: "All caught up", description: "Notifications marked as read." });
  };

  const unread = items.filter((n) => !n.isRead).length;

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="page-title">Notifications</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-secondary">
            Everything that needs your attention, all in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <Button variant="secondary" onClick={markAllRead}>
              <Check size={12} />
              Mark all read
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() =>
              toast.push({
                tone: "info",
                title: "Notification preferences",
                description: "Configure in Settings → Notifications.",
                action: { label: "Open settings", href: "/settings" },
              })
            }
          >
            <Bell size={12} />
            Preferences
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <Panel className="px-6 py-16">
          <EmptyState
            icon={<Bell size={20} />}
            title="No notifications yet"
            description="When your AI team needs you, you'll see it here."
          />
        </Panel>
      ) : (
        <Panel className="p-0">
          <ul className="divide-y divide-border">
            {items.map((n) => {
              const Icon = iconFor(n.type);
              const tone =
                n.type === "alert"
                  ? "text-warning"
                  : n.type === "lead"
                    ? "text-accent"
                    : n.type === "work"
                      ? "text-success"
                      : "text-secondary";
              return (
                <li key={n.id}>
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-hover md:px-6",
                        !n.isRead && "bg-accent/5",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2",
                          tone,
                        )}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "text-[14.5px]",
                              n.isRead ? "font-medium text-secondary" : "font-semibold text-text",
                            )}
                          >
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          )}
                        </div>
                        <p className="mt-0.5 text-[13px] text-secondary">{n.description}</p>
                        <p className="mt-1 text-[11.5px] text-muted-text">{n.time}</p>
                      </div>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "group flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-hover md:px-6",
                        !n.isRead && "bg-accent/5",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2",
                          tone,
                        )}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "text-[14.5px]",
                              n.isRead ? "font-medium text-secondary" : "font-semibold text-text",
                            )}
                          >
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          )}
                        </div>
                        <p className="mt-0.5 text-[13px] text-secondary">{n.description}</p>
                        <p className="mt-1 text-[11.5px] text-muted-text">{n.time}</p>
                      </div>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </>
  );
}