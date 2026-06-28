import { GlassCard } from "@/components/ui/GlassCard";

export const dynamic = "force-dynamic";

export default function AdminPlatformPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Platform</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Global settings, AI defaults, feature flags, alerts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SettingCard title="Signups" status="Open">
          <p className="text-xs text-text-secondary">Anyone can sign up. Toggle to waitlist to slow growth.</p>
        </SettingCard>

        <SettingCard title="Maintenance mode" status="Off">
          <p className="text-xs text-text-secondary">Show a banner to all users. Use during deployments.</p>
        </SettingCard>

        <SettingCard title="Free tier limits" status="1 agent · 50 tasks/mo">
          <p className="text-xs text-text-secondary">New users start here. Adjust to shape acquisition.</p>
        </SettingCard>

        <SettingCard title="Default AI model" status="claude-3.5-sonnet">
          <p className="text-xs text-text-secondary">Used when an agent template doesn't override.</p>
        </SettingCard>

        <SettingCard title="Max tokens / task" status="1500">
          <p className="text-xs text-text-secondary">Cap output to control cost. Raise for premium plans.</p>
        </SettingCard>

        <SettingCard title="OpenRouter" status="OK">
          <p className="text-xs text-text-secondary">API key valid. Routing through GPT-4o + Claude + Gemini.</p>
        </SettingCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Feature flags</h2>
        <ul className="divide-y divide-border/40">
          {[
            { name: "Agent-to-agent delegation", state: "on" },
            { name: "Weekly board reports (auto)", state: "on" },
            { name: "Proactive research scans", state: "on" },
            { name: "Custom agent creation", state: "company-only" },
            { name: "API access", state: "growth+up" },
          ].map((f) => (
            <li key={f.name} className="flex items-center justify-between py-3 text-sm">
              <span className="text-text-primary">{f.name}</span>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-light">
                {f.state}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

function SettingCard({
  title,
  status,
  children,
}: {
  title: string;
  status: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
          {status}
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </GlassCard>
  );
}