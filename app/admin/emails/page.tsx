import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Send } from "lucide-react";

export const dynamic = "force-dynamic";

const templates = [
  { id: "welcome", name: "Welcome email", uses: 524, status: "active" },
  { id: "first-task", name: "First task complete", uses: 487, status: "active" },
  { id: "weekly-report", name: "Weekly board report", uses: 312, status: "active" },
  { id: "upgrade", name: "Plan upgrade confirmation", uses: 198, status: "active" },
  { id: "cancel", name: "Cancellation + save offer", uses: 12, status: "active" },
  { id: "reengage", name: "Re-engagement (14d inactive)", uses: 24, status: "active" },
];

const recentEmails = [
  { to: "maya@tidepool.app", subject: "Your weekly board report is ready", sent: "2026-06-23 09:00", opened: true },
  { to: "jordan@loophole.dev", subject: "Welcome to Reklu 🚀", sent: "2026-06-23 08:42", opened: true },
  { to: "lena@lucent.co", subject: "Your weekly board report is ready", sent: "2026-06-23 09:00", opened: true },
  { to: "sam@quiver.io", subject: "Quick check-in: how's Reklu treating you?", sent: "2026-06-22 14:18", opened: false },
  { to: "all@reklu.app", subject: "New: Agent-to-agent delegation", sent: "2026-06-20 10:00", opened: true },
];

export default function AdminEmailsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Email center</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Templates, broadcasts, and send logs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Send broadcast</h2>
          </div>
          <div className="space-y-3">
            <input
              placeholder="Subject line..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary"
            />
            <textarea
              rows={5}
              placeholder="Email body..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary resize-none"
            />
            <div className="flex items-center justify-between text-xs">
              <select className="rounded-md border border-border bg-surface px-2 py-1 text-text-secondary">
                <option>All users</option>
                <option>Free</option>
                <option>Paid</option>
                <option>By plan</option>
              </select>
              <GlowButton size="sm">
                <Send size={12} />
                Send now
              </GlowButton>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">Templates</h2>
          <ul className="space-y-2">
            {templates.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-border/40 bg-surface/40 px-3 py-2 text-sm"
              >
                <div>
                  <div className="text-text-primary">{t.name}</div>
                  <div className="text-xs text-text-tertiary">{t.uses} sends</div>
                </div>
                <button className="text-xs text-primary-light hover:underline">Edit</button>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-border bg-surface-2/40 px-5 py-3 text-xs font-medium uppercase tracking-wider text-text-tertiary">
          Recent emails
        </div>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border/60">
            {recentEmails.map((e, i) => (
              <tr key={i}>
                <td className="px-5 py-3 text-text-primary">{e.subject}</td>
                <td className="px-5 py-3 text-text-secondary">{e.to}</td>
                <td className="px-5 py-3 text-xs text-text-tertiary">{e.sent}</td>
                <td className="px-5 py-3 text-right">
                  {e.opened ? (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                      Opened
                    </span>
                  ) : (
                    <span className="text-xs text-text-tertiary">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}