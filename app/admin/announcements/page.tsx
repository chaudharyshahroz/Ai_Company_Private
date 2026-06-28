import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Megaphone } from "lucide-react";

export const dynamic = "force-dynamic";

const active = [
  { msg: "🎉 We're hiring: founding engineer to build the agent brain", type: "info", target: "All users", ends: "2026-07-01" },
];

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Banners and notifications shown across the platform.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">New announcement</h2>
          <div className="space-y-3">
            <input
              placeholder="Announcement message..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary"
            />
            <div className="grid grid-cols-2 gap-2">
              <select className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary">
                <option>Info</option>
                <option>Warning</option>
                <option>Success</option>
                <option>Promo</option>
              </select>
              <select className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary">
                <option>All users</option>
                <option>Free only</option>
                <option>Paid only</option>
              </select>
            </div>
            <div className="flex justify-end">
              <GlowButton size="sm">
                <Megaphone size={12} />
                Publish
              </GlowButton>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">Active</h2>
          <ul className="space-y-3">
            {active.map((a, i) => (
              <li key={i} className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <div className="text-sm text-text-primary">{a.msg}</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-text-tertiary">
                  <span>{a.type}</span>
                  <span>·</span>
                  <span>{a.target}</span>
                  <span>·</span>
                  <span>ends {a.ends}</span>
                </div>
              </li>
            ))}
            {active.length === 0 && (
              <li className="text-sm text-text-tertiary">No active announcements.</li>
            )}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}