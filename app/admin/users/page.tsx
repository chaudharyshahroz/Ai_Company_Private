import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { PlanBadge } from "@/components/dashboard/PlanBadge";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

const users = [
  { id: "u-1", name: "Maya Chen", email: "maya@tidepool.app", plan: "growth", used: 412, joined: "2025-12-01", lastActive: "4m ago" },
  { id: "u-2", name: "Jordan Patel", email: "jordan@loophole.dev", plan: "starter", used: 88, joined: "2026-01-12", lastActive: "22m ago" },
  { id: "u-3", name: "Sam Rivera", email: "sam@quiver.io", plan: "free", used: 12, joined: "2026-04-18", lastActive: "38m ago" },
  { id: "u-4", name: "Lena Park", email: "lena@lucent.co", plan: "company", used: 1820, joined: "2025-11-08", lastActive: "51m ago" },
  { id: "u-5", name: "Tom Wright", email: "tom@bootscats.com", plan: "growth", used: 287, joined: "2026-02-22", lastActive: "1h ago" },
  { id: "u-6", name: "Alex Founder", email: "demo@reklu.app", plan: "growth", used: 142, joined: "2025-09-01", lastActive: "now" },
  { id: "u-7", name: "Aisha Patel", email: "aisha@stitchwork.dev", plan: "starter", used: 124, joined: "2026-03-15", lastActive: "2h ago" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {users.length} users shown · 524 total platform-wide
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          <Search size={14} className="text-text-tertiary" />
          <input
            placeholder="Search by name or email..."
            className="flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-tertiary"
          />
        </div>
        <select className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary">
          <option>All plans</option>
          <option>Free</option>
          <option>Starter</option>
          <option>Growth</option>
          <option>Company</option>
        </select>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2/40">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Name</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Email</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Plan</th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-tertiary">Tasks used</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Joined</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Last active</th>
              <th className="w-32" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-surface-2/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-xs font-semibold text-white">
                      {u.name[0]}
                    </div>
                    <span className="text-text-primary">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-text-secondary">{u.email}</td>
                <td className="px-5 py-3"><PlanBadge plan={u.plan} /></td>
                <td className="px-5 py-3 text-right font-mono text-text-primary">{u.used.toLocaleString()}</td>
                <td className="px-5 py-3 text-text-tertiary">{u.joined}</td>
                <td className="px-5 py-3 text-text-tertiary">{u.lastActive}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button className="rounded-md px-2 py-1 text-xs text-text-secondary hover:bg-surface hover:text-text-primary">
                      View
                    </button>
                    <button className="rounded-md px-2 py-1 text-xs text-secondary hover:bg-surface hover:text-accent-warm" style={{ color: "#a78bfa" }}>
                      Impersonate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}