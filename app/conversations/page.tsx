import * as React from "react";
import { Inbox, MessageSquare, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, listConversations } from "@/lib/data";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const statusMap = {
  open: "border-primary/40 bg-primary/10 text-primary-light",
  pending: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  closed: "border-text-tertiary/40 bg-surface-2 text-text-tertiary",
};

export default async function ConversationsPage() {
  const user = await getCurrentUser();
  const conversations = await listConversations();

  return (
    <div className="flex min-h-screen bg-background">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={3} />
        <main className="flex-1 px-6 py-8 md:px-8">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold tracking-tight">Conversations</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Customer conversations from your widget, email, and sales replies. AI drafts responses for you.
            </p>
          </div>

          <GlassCard className="overflow-hidden p-0">
            {conversations.map((c, i) => (
              <div
                key={c.id}
                className={cn(
                  "flex items-start gap-4 p-5 transition-colors hover:bg-surface-2/40",
                  i !== 0 && "border-t border-border/60",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-sm font-semibold text-white">
                  {c.customer[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-text-primary">{c.customer}</span>
                    <span className="text-xs text-text-tertiary">·</span>
                    <span className="text-xs text-text-tertiary">{c.source}</span>
                    <span className={cn(
                      "ml-auto rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      statusMap[c.status as keyof typeof statusMap],
                    )}>
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-text-primary">{c.subject}</div>
                  <p className="mt-1 text-sm text-text-secondary">{c.lastMessage}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-text-tertiary">
                    <span>{c.assignedDept}</span>
                    {c.suggestedBy && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/5 px-1.5 py-0.5 text-[10px] text-accent">
                          <Sparkles size={9} /> {c.suggestedBy} suggested reply
                        </span>
                      </>
                    )}
                    <span>·</span>
                    <span>{formatRelativeTime(c.updatedAt)}</span>
                  </div>
                </div>
                <button className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary-light">
                  Open
                </button>
              </div>
            ))}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}

// Inline lucide icon to avoid extra import
function Sparkles({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}