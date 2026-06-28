"use client";

import * as React from "react";
import { Plug, Plus, Check, ExternalLink, Settings } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  emoji: string;
}

const initialIntegrations: Integration[] = [
  { id: "gmail", name: "Gmail", description: "Read and send emails from your team inbox.", connected: true, emoji: "✉️" },
  { id: "calendar", name: "Google Calendar", description: "See events, book meetings, send invites.", connected: true, emoji: "📅" },
  { id: "stripe", name: "Stripe", description: "Track revenue, refunds, and customer payments.", connected: false, emoji: "💳" },
  { id: "slack", name: "Slack", description: "Get notifications and chat with your AI team.", connected: false, emoji: "💬" },
  { id: "hubspot", name: "HubSpot", description: "Sync contacts and deals with your CRM.", connected: false, emoji: "🟠" },
  { id: "shopify", name: "Shopify", description: "Sync orders, products, and customers.", connected: false, emoji: "🛍️" },
  { id: "zapier", name: "Zapier", description: "Connect to 5,000+ apps without code.", connected: false, emoji: "⚡" },
  { id: "twilio", name: "Twilio", description: "Send and receive SMS from your AI employees.", connected: false, emoji: "📱" },
];

export function IntegrationsClient() {
  const toast = useToast();
  const [items, setItems] = React.useState(initialIntegrations);

  const toggle = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = !item.connected;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: next } : i)),
    );
    toast.push({
      tone: next ? "success" : "info",
      title: next ? `${item.name} connected` : `${item.name} disconnected`,
      description: next
        ? "Your AI team can now use it."
        : "It won't be used by AI employees until you reconnect.",
    });
  };

  return (
    <>
      <div className="mb-8 max-w-3xl">
        <h1 className="page-title">Integrations</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-secondary">
          Connect the tools your business already uses. Your AI team will start using them automatically.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Panel key={i.id} className="flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 text-2xl">
                {i.emoji}
              </div>
              {i.connected ? (
                <span className="flex items-center gap-1.5 rounded-md border border-success/40 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                  <Check size={10} />
                  Connected
                </span>
              ) : (
                <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-text">
                  Available
                </span>
              )}
            </div>
            <div className="min-h-[3.5rem]">
              <p className="text-[15px] font-semibold text-text">{i.name}</p>
              <p className="mt-1 text-[13px] leading-snug text-secondary">{i.description}</p>
            </div>
            <div className="mt-auto flex items-center gap-2">
              <Button
                variant={i.connected ? "secondary" : "primary"}
                size="sm"
                className="flex-1"
                onClick={() => toggle(i.id)}
              >
                {i.connected ? "Disconnect" : "Connect"}
              </Button>
              {i.connected && (
                <button
                  type="button"
                  onClick={() =>
                    toast.push({
                      tone: "info",
                      title: `${i.name} settings`,
                      description: "Advanced settings coming soon.",
                    })
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-secondary hover:border-border-strong hover:text-text"
                  title="Settings"
                >
                  <Settings size={12} />
                </button>
              )}
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="mt-8 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 text-secondary">
            <Plus size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[14.5px] font-semibold text-text">Don't see what you need?</p>
            <p className="mt-1 text-[13.5px] text-secondary">
              Use our API or Zapier to connect to anything else.
            </p>
          </div>
          <Button variant="secondary" size="sm">
            <ExternalLink size={12} />
            API docs
          </Button>
        </div>
      </Panel>
    </>
  );
}