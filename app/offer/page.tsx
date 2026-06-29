import * as React from "react";
import {
  Package,
  Sparkles,
  CheckCircle2,
  Copy,
  MessageCircle,
  Mail,
  ArrowRight,
  Star,
  RefreshCw,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, getActiveOffer } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function CopyBlock({ label, content }: { label: string; content: string }) {
  return (
    <Panel className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-text">
          {label === "Cold DM" ? (
            <MessageCircle size={12} className="text-accent" />
          ) : label === "Email" ? (
            <Mail size={12} className="text-accent" />
          ) : label === "WhatsApp" ? (
            <MessageCircle size={12} className="text-success" />
          ) : (
            <Sparkles size={12} className="text-accent" />
          )}
          {label}
        </div>
        <button
          className="flex items-center gap-1 text-[11px] text-muted-text transition-colors hover:text-text"
          aria-label={`Copy ${label}`}
        >
          <Copy size={11} />
          Copy
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-secondary">
        {content}
      </pre>
    </Panel>
  );
}

export default async function OfferBuilderPage() {
  const user = await getCurrentUser();
  const offer = await getActiveOffer(user.id);

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />

        <main className="flex-1 px-8 py-8">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs">
                  <Package size={12} className="text-accent" />
                  <span className="font-semibold uppercase tracking-wider text-accent">
                    Offer Builder
                  </span>
                  {offer.isActive && (
                    <span className="ml-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                      Active
                    </span>
                  )}
                </div>
                <h1 className="text-page text-text">{offer.offerName}</h1>
                <p className="mt-3 max-w-2xl text-body text-secondary">
                  Most businesses fail because their offer is weak. Your AI Marketing Strategist built
                  this from your Business DNA — refine it, ship it.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" size="md">
                  <RefreshCw size={13} />
                  Improve Offer
                </Button>
                <Button size="md">
                  <Sparkles size={13} />
                  Generate 3 Alternatives
                </Button>
              </div>
            </div>

            {/* Promise */}
            <Panel className="mb-8 p-6">
              <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                <Star size={11} />
                Core Promise
              </div>
              <p className="text-[20px] font-medium leading-snug text-text">{offer.promise}</p>
              <div className="mt-5 grid gap-4 border-t border-border pt-5 text-[13px] md:grid-cols-2">
                <div>
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                    Target Customer
                  </div>
                  <p className="text-secondary">{offer.targetCustomer}</p>
                </div>
                <div>
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                    Landing Headline
                  </div>
                  <p className="font-medium text-text">{offer.landingHeadline}</p>
                </div>
              </div>
            </Panel>

            {/* Packages */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Layers size={14} className="text-accent" />
                <h2 className="text-[13px] font-semibold uppercase tracking-wider text-text">
                  Three-Tier Packages
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {offer.packages.map((p, idx) => {
                  const isMiddle = idx === 1;
                  return (
                    <Panel
                      key={p.name}
                      className={cn(
                        "relative flex flex-col p-6",
                        isMiddle && "border-accent/40 shadow-[0_0_0_1px_rgba(94,106,210,0.15)]",
                      )}
                    >
                      {isMiddle && (
                        <div className="absolute -top-2.5 left-6 rounded-full border border-accent/40 bg-bg px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                          Most Popular
                        </div>
                      )}
                      <div className="mb-4">
                        <div className="text-[12px] font-medium uppercase tracking-wider text-muted-text">
                          {p.name}
                        </div>
                        <div className="mt-1.5 font-mono text-[20px] font-semibold text-text">
                          {p.price}
                        </div>
                        <div className="mt-1 text-[12px] text-secondary">{p.bestFor}</div>
                      </div>

                      <ul className="mb-5 space-y-2">
                        {p.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-secondary">
                            <CheckCircle2
                              size={12}
                              className={cn(
                                "mt-0.5 shrink-0",
                                isMiddle ? "text-accent" : "text-success",
                              )}
                            />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mb-5 rounded-md border border-border bg-bg/40 p-3">
                        <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-text">
                          Expected Outcome
                        </div>
                        <p className="text-[12px] leading-relaxed text-text">{p.outcome}</p>
                      </div>

                      <div className="mt-auto">
                        <Button
                          size="sm"
                          variant={isMiddle ? "primary" : "secondary"}
                          className="w-full"
                        >
                          {p.cta}
                          <ArrowRight size={12} />
                        </Button>
                      </div>
                    </Panel>
                  );
                })}
              </div>
            </div>

            {/* Guarantee + Bonuses */}
            <div className="mb-8 grid gap-5 md:grid-cols-2">
              {offer.guarantee && (
                <Panel className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-success">
                    <ShieldCheck size={12} />
                    Guarantee
                  </div>
                  <p className="text-[14px] leading-relaxed text-text">{offer.guarantee}</p>
                </Panel>
              )}
              {offer.bonuses && offer.bonuses.length > 0 && (
                <Panel className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    <Sparkles size={12} />
                    Bonuses
                  </div>
                  <ul className="space-y-2">
                    {offer.bonuses.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-secondary">
                        <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}
            </div>

            {/* Sales scripts */}
            <div className="mb-4">
              <div className="mb-4 flex items-center gap-2">
                <MessageCircle size={14} className="text-accent" />
                <h2 className="text-[13px] font-semibold uppercase tracking-wider text-text">
                  Sales Scripts
                </h2>
                <span className="text-[12px] text-muted-text">
                  Generated from your offer and target customer.
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {offer.salesPitch && <CopyBlock label="Sales Pitch" content={offer.salesPitch} />}
                {offer.coldDmScript && <CopyBlock label="Cold DM" content={offer.coldDmScript} />}
                {offer.whatsappPitch && <CopyBlock label="WhatsApp" content={offer.whatsappPitch} />}
                {offer.emailPitch && <CopyBlock label="Email" content={offer.emailPitch} />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
