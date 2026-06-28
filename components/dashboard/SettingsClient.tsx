"use client";

import * as React from "react";
import {
  Sparkles,
  Bell,
  Mail,
  Smartphone,
  Check,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/db/schema";

type Mode = "simple" | "advanced";
type Density = "comfortable" | "compact";

export function SettingsClient({ user }: { user: User }) {
  const toast = useToast();
  const [mode, setMode] = React.useState<Mode>("advanced");
  const [density, setDensity] = React.useState<Density>("comfortable");
  const [notifications, setNotifications] = React.useState({
    emailDigest: true,
    workReady: true,
    weeklyReport: false,
    mobilePush: false,
  });

  // Load preferences from localStorage on mount
  React.useEffect(() => {
    try {
      const m = localStorage.getItem("reklu:display-mode") as Mode | null;
      const d = localStorage.getItem("reklu:density") as Density | null;
      if (m === "simple" || m === "advanced") setMode(m);
      if (d === "comfortable" || d === "compact") setDensity(d);
      const notif = localStorage.getItem("reklu:notifications");
      if (notif) {
        try { setNotifications((n) => ({ ...n, ...JSON.parse(notif) })); } catch { /* ignore */ }
      }
    } catch {
      // ignore
    }
  }, []);

  const setModePersist = (next: Mode) => {
    setMode(next);
    try {
      localStorage.setItem("reklu:display-mode", next);
      window.dispatchEvent(new CustomEvent("reklu:mode-change", { detail: next }));
    } catch {
      /* ignore */
    }
    toast.push({
      tone: "info",
      title: `Switched to ${next === "simple" ? "Simple" : "Advanced"} mode`,
      description:
        next === "simple"
          ? "Showing only the essentials."
          : "Advanced panels and metrics are now visible.",
    });
  };

  const setDensityPersist = (next: Density) => {
    setDensity(next);
    try { localStorage.setItem("reklu:density", next); } catch { /* ignore */ }
    toast.push({
      tone: "info",
      title: `Density set to ${next}`,
    });
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((n) => {
      const next = { ...n, [key]: !n[key] };
      try { localStorage.setItem("reklu:notifications", JSON.stringify(next)); } catch { /* ignore */ }
      toast.push({
        tone: "info",
        title: next[key] ? "Notification enabled" : "Notification muted",
        description: `${notifLabels[key]} ${next[key] ? "on" : "off"}.`,
      });
      return next;
    });
  };

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Display mode */}
        <section className="lg:col-span-2">
          <Panel className="p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-2 text-secondary">
                <Sparkles size={16} />
              </div>
              <div className="flex-1">
                <h2 className="text-[16px] font-semibold text-text">Display mode</h2>
                <p className="mt-1 text-[13.5px] leading-relaxed text-secondary">
                  Simple Mode hides advanced tools so you only see what you need. Switch to Advanced when you want to fine-tune your AI team.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <ModeCard
                active={mode === "simple"}
                title="Simple Mode"
                subtitle="Recommended for most teams"
                bullets={["Essential pages only", "One recommended action at a time", "No technical jargon"]}
                onSelect={() => setModePersist("simple")}
              />
              <ModeCard
                active={mode === "advanced"}
                title="Advanced Mode"
                subtitle="All modules + power-user tools"
                bullets={["Departments, Agent settings, Analytics", "All employees and tasks in detail", "System logs and automations"]}
                onSelect={() => setModePersist("advanced")}
              />
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <h3 className="text-[13.5px] font-semibold text-text">Info density</h3>
              <div className="mt-3 flex gap-2">
                <DensityButton active={density === "comfortable"} onClick={() => setDensityPersist("comfortable")}>
                  Comfortable
                </DensityButton>
                <DensityButton active={density === "compact"} onClick={() => setDensityPersist("compact")}>
                  Compact
                </DensityButton>
              </div>
            </div>
          </Panel>
        </section>

        {/* Account */}
        <Panel className="p-6">
          <h2 className="text-[15px] font-semibold text-text">Your account</h2>
          <div className="mt-4 space-y-3 text-[14px]">
            <Row label="Name" value={user.name ?? "—"} />
            <Row label="Email" value={user.email} />
            <Row label="Plan" value={user.plan ?? "Free"} />
            <Row label="Status" value={user.planStatus ?? "active"} />
            <Row label="Credits" value="8,547" />
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="mt-5 w-full"
            onClick={() =>
              toast.push({ tone: "info", title: "Edit profile", description: "Profile editor coming soon." })
            }
          >
            Edit profile
          </Button>
        </Panel>
      </div>

      {/* Notifications */}
      <section className="mt-10">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <Bell size={16} className="text-secondary" />
          Notifications
        </h2>
        <Panel className="p-0">
          <ul className="divide-y divide-border">
            <NotifRow
              icon={<Mail size={14} />}
              label="Email digest"
              description="Daily summary of what your AI team did"
              checked={notifications.emailDigest}
              onChange={() => toggleNotif("emailDigest")}
            />
            <NotifRow
              icon={<Sparkles size={14} />}
              label="Work ready for review"
              description="Get notified the moment work lands in your inbox"
              checked={notifications.workReady}
              onChange={() => toggleNotif("workReady")}
            />
            <NotifRow
              icon={<Mail size={14} />}
              label="Weekly CEO report"
              description="Every Monday: wins, risks, recommended next actions"
              checked={notifications.weeklyReport}
              onChange={() => toggleNotif("weeklyReport")}
            />
            <NotifRow
              icon={<Smartphone size={14} />}
              label="Mobile push"
              description="Push notifications to your phone"
              checked={notifications.mobilePush}
              onChange={() => toggleNotif("mobilePush")}
            />
          </ul>
        </Panel>
      </section>
    </>
  );
}

const notifLabels: Record<string, string> = {
  emailDigest: "Email digest",
  workReady: "Work ready for review",
  weeklyReport: "Weekly CEO report",
  mobilePush: "Mobile push",
};

function ModeCard({
  active,
  title,
  subtitle,
  bullets,
  onSelect,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  bullets: string[];
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex flex-col gap-3 rounded-md border p-5 text-left transition-colors",
        active ? "border-accent/40 bg-accent/8" : "border-border bg-surface hover:border-border-strong",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] font-semibold text-text">{title}</p>
          <p className="mt-0.5 text-[12.5px] text-muted-text">{subtitle}</p>
        </div>
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border-2",
            active ? "border-accent bg-accent" : "border-border-strong",
          )}
        >
          {active && <Check size={11} className="text-white" strokeWidth={3} />}
        </span>
      </div>
      <ul className="space-y-1 text-[13px] leading-relaxed text-secondary">
        {bullets.map((b, i) => (
          <li key={i}>· {b}</li>
        ))}
      </ul>
    </button>
  );
}

function DensityButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-md border px-3 py-2 text-[13px] font-medium transition-colors",
        active
          ? "border-accent/40 bg-accent/8 text-text"
          : "border-border bg-surface text-secondary hover:text-text",
      )}
    >
      {children}
    </button>
  );
}

function NotifRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li className="flex items-center gap-4 px-5 py-4 md:px-6">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-secondary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-medium text-text">{label}</p>
        <p className="mt-0.5 text-[13px] text-secondary">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
          checked ? "border-accent bg-accent" : "border-border-strong bg-surface-2",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-6" : "translate-x-0.5",
          )}
        />
      </button>
    </li>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12.5px] uppercase tracking-[0.04em] text-muted-text">{label}</span>
      <span className="truncate text-text">{value}</span>
    </div>
  );
}