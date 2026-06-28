import * as React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Plug, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const integrations = [
  { id: "gmail", name: "Gmail", desc: "Send and receive email from your agents.", connected: true, emoji: "📧" },
  { id: "slack", name: "Slack", desc: "Push agent alerts to your team channels.", connected: false, emoji: "💬" },
  { id: "notion", name: "Notion", desc: "Sync your docs and databases.", connected: false, emoji: "📝" },
  { id: "airtable", name: "Airtable", desc: "Read and write to your bases.", connected: false, emoji: "📊" },
  { id: "shopify", name: "Shopify", desc: "Sync products, orders, and customers.", connected: false, emoji: "🛒" },
  { id: "hubspot", name: "HubSpot CRM", desc: "Push leads and contact updates.", connected: false, emoji: "🎯" },
  { id: "zapier", name: "Zapier", desc: "Connect to 5,000+ apps via webhooks.", connected: false, emoji: "⚡" },
  { id: "webhook", name: "Custom Webhook", desc: "Send events to your own endpoint.", connected: false, emoji: "🪝" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Connect the tools your business already runs on.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((i) => (
          <GlassCard key={i.id} hoverable className="flex h-full flex-col p-6">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 text-2xl shadow-md">
                {i.emoji}
              </div>
              {i.connected && (
                <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                  <Check size={10} />
                  Connected
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-text-primary">{i.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">{i.desc}</p>
            <div className="mt-auto pt-4">
              <button
                className={cn(
                  "w-full rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  i.connected
                    ? "border-border bg-surface text-text-secondary hover:text-accent-warm"
                    : "border-primary/40 bg-primary/10 text-primary-light hover:bg-primary/20",
                )}
              >
                {i.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}