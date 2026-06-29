import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser } from "@/lib/data";

export const dynamic = "force-dynamic";

export interface ComingSoonProps {
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
  capabilities: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

/**
 * Reusable "Coming Soon" shell used by Phase 2 modules so the
 * sidebar navigation doesn't 404 and the product feels coherent.
 */
export function ComingSoon({
  badge,
  title,
  description,
  icon: Icon,
  capabilities,
  primaryCta,
  secondaryCta,
}: ComingSoonProps) {
  // We can't call getCurrentUser from the static shell, so pages should wrap us.
  // To keep the shell simple, we don't render the chrome here.
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex items-center gap-2 text-xs">
        <Icon size={12} className="text-accent" />
        <span className="font-semibold uppercase tracking-wider text-accent">{badge}</span>
        <span className="ml-1 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-text">
          Coming Soon
        </span>
      </div>
      <h1 className="text-page text-text">{title}</h1>
      <p className="mt-3 max-w-2xl text-body text-secondary">{description}</p>

      <Panel className="mt-8 p-7">
        <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
          <Sparkles size={11} />
          What you'll be able to do
        </div>
        <ul className="grid gap-2 md:grid-cols-2">
          {capabilities.map((c) => (
            <li
              key={c}
              className="flex items-start gap-2 text-[13.5px] text-secondary"
            >
              <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span>{c}</span>
            </li>
          ))}
        </ul>

        {(primaryCta || secondaryCta) && (
          <div className="mt-7 flex flex-wrap gap-2 border-t border-border pt-5">
            {primaryCta && (
              <Button asChild size="md">
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight size={13} />
                </Link>
              </Button>
            )}
            {secondaryCta && (
              <Button asChild size="md" variant="secondary">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        )}
      </Panel>

      <p className="mt-6 text-[12px] text-muted-text">
        This module is part of the next phase of the Reklu upgrade. The sidebar and information
        architecture are wired so you can already navigate to it.
      </p>
    </div>
  );
}

/**
 * Page wrapper that renders ComingSoon inside the standard HQ shell.
 * Use this from app/<route>/page.tsx when a module isn't built yet.
 */
export async function ComingSoonPage(props: ComingSoonProps) {
  const user = await getCurrentUser();
  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-8 py-8">
          <ComingSoon {...props} />
        </main>
      </div>
    </div>
  );
}
