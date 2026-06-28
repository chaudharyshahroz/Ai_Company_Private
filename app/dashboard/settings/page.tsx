import * as React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getCurrentUser } from "@/lib/data";

export const dynamic = "force-dynamic";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "business", label: "Business" },
  { id: "notifications", label: "Notifications" },
  { id: "api", label: "API" },
  { id: "security", label: "Security" },
];

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Profile, business, notifications, API, security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              i === 0 ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.label}
            {i === 0 && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      <GlassCard className="space-y-6 p-7">
        <Row label="Name" value={user.name ?? "—"} />
        <Row label="Email" value={user.email} />
        <Row label="Avatar" value="Upload a profile image" />
        <Row label="Timezone" value={user.timezone ?? "America/Los_Angeles"} />
        <Row label="Language" value="English" />
      </GlassCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-4 last:border-b-0 last:pb-0">
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
          {label}
        </div>
        <div className="mt-1 text-sm text-text-primary">{value}</div>
      </div>
      <button className="rounded-lg border border-border bg-surface px-3 py-1 text-xs text-text-secondary hover:text-text-primary">
        Edit
      </button>
    </div>
  );
}