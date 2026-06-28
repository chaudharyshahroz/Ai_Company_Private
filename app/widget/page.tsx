import * as React from "react";
import { MessageCircle, Copy, Code2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function WidgetPage() {
  const user = await getCurrentUser();
  const embed = `<script src="https://reklu.app/widget.js" data-company="acme-studios" async></script>`;

  return (
    <div className="flex min-h-screen bg-background">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={3} />
        <main className="flex-1 px-6 py-8 md:px-8">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold tracking-tight">Website Widget</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Capture leads and answer questions 24/7. Embed on any website.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard className="p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Preview
              </h2>
              {/* Mini chat widget preview */}
              <div className="rounded-xl border border-border bg-surface-2 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-xs">🤖</div>
                  <div>
                    <div className="text-xs font-semibold text-text-primary">Acme Studios</div>
                    <div className="text-[10px] text-accent">● Online</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="ml-auto max-w-[80%] rounded-lg bg-primary/15 px-3 py-2 text-xs text-text-primary">
                    Hi! How can I help you today?
                  </div>
                  <div className="max-w-[80%] rounded-lg bg-surface px-3 py-2 text-xs text-text-secondary">
                    What does your Pro plan include?
                  </div>
                </div>
                <input
                  className="mt-3 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary"
                  placeholder="Type a message..."
                />
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Embed code
              </h2>
              <p className="text-xs text-text-secondary">
                Drop this snippet before <code className="rounded bg-surface-2 px-1">&lt;/body&gt;</code> on your site.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface-2 p-4 font-mono text-xs text-text-primary">
                {embed}
              </pre>
              <div className="mt-3 flex gap-2">
                <button className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary-light">
                  <Copy size={12} />
                  Copy code
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <Setting label="Welcome message" value="Hi! How can we help?" />
                <Setting label="Brand color" value="#7C5CFC" />
                <Setting label="Capture leads" value="Enabled" />
                <Setting label="Human handoff" value="After 3 unanswered questions" />
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-mono text-xs text-text-primary">{value}</span>
    </div>
  );
}