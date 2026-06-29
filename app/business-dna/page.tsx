import * as React from "react";
import Link from "next/link";
import {
  Dna,
  Building2,
  Users,
  Package,
  MapPin,
  Swords,
  Mic,
  Target,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, getBusinessDna, getBusinessScore } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const stageColor: Record<string, string> = {
  idea: "bg-secondary/10 text-secondary border-secondary/30",
  validating: "bg-warning/10 text-warning border-warning/30",
  launching: "bg-accent/10 text-accent border-accent/30",
  growing: "bg-success/10 text-success border-success/30",
  scaling: "bg-primary/10 text-primary border-primary/30",
};

const stageLabel: Record<string, string> = {
  idea: "Idea",
  validating: "Validating",
  launching: "Launching",
  growing: "Growing",
  scaling: "Scaling",
};

export default async function BusinessDnaPage() {
  const user = await getCurrentUser();
  const dna = await getBusinessDna(user.id);
  const score = await getBusinessScore(user.id);

  const sections: Array<{
    key: string;
    title: string;
    icon: React.ElementType;
    body?: string | null;
    rows?: Array<{ label: string; value: string | null; chip?: string }>;
    bullets?: string[];
    items?: Array<{ name: string; url?: string; notes?: string }>;
  }> = [
    {
      key: "overview",
      title: "Business Overview",
      icon: Building2,
      rows: [
        { label: "Business name", value: dna.businessName },
        { label: "Tagline", value: dna.tagline },
        { label: "Industry", value: dna.industry },
        { label: "Type", value: dna.businessType },
        { label: "Stage", value: stageLabel[dna.stage], chip: stageColor[dna.stage] },
      ],
      body: dna.businessIdea,
    },
    {
      key: "customer",
      title: "Target Customer",
      icon: Users,
      body: dna.targetCustomer,
      rows: [
        { label: "Demographics", value: dna.customerDemographics },
      ],
      bullets: dna.customerPainPoints,
    },
    {
      key: "offer",
      title: "Offer",
      icon: Package,
      body: dna.mainOffer,
      rows: [
        { label: "Price range", value: dna.priceRange },
        { label: "Revenue target", value: dna.revenueTarget },
      ],
    },
    {
      key: "market",
      title: "Market",
      icon: MapPin,
      rows: [
        { label: "Country", value: dna.country },
        { label: "City", value: dna.city },
        { label: "Market scope", value: dna.market },
      ],
    },
    {
      key: "competitors",
      title: "Competitors",
      icon: Swords,
      items: dna.competitors,
    },
    {
      key: "brand",
      title: "Brand",
      icon: Mic,
      rows: [{ label: "Tone", value: dna.brandTone, chip: "bg-accent/10 text-accent border-accent/30" }],
      body: dna.brandVoiceNotes,
    },
    {
      key: "goals",
      title: "Goals",
      icon: Target,
      body: dna.mainGoal,
      rows: [
        { label: "Timeline", value: dna.timeline },
        { label: "Budget", value: dna.budget },
        { label: "Skill level", value: dna.skillLevel },
      ],
      bullets: dna.currentProblems,
    },
  ];

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
                  <Dna size={12} className="text-accent" />
                  <span className="font-semibold uppercase tracking-wider text-accent">
                    Business DNA
                  </span>
                  {dna.stage && (
                    <span
                      className={cn(
                        "ml-2 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        stageColor[dna.stage],
                      )}
                    >
                      {stageLabel[dna.stage]}
                    </span>
                  )}
                </div>
                <h1 className="text-page text-text">The foundation of every AI output.</h1>
                <p className="mt-3 max-w-2xl text-body text-secondary">
                  Business DNA is what your AI CEO and every department uses as context. The richer
                  this is, the smarter your outputs.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" size="md">
                  <Edit3 size={13} />
                  Edit DNA
                </Button>
                <Button size="md">
                  <Sparkles size={13} />
                  Improve with AI CEO
                </Button>
              </div>
            </div>

            {/* Score banner */}
            {score && (
              <Panel className="mb-8 flex items-center justify-between gap-6 p-6">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/5 font-mono text-2xl font-semibold text-accent">
                    {score.overall}
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-text">
                      Current Business Score
                    </div>
                    <div className="mt-1 text-lg font-medium text-text">
                      Based on your DNA, your business is in a strong position.
                    </div>
                    <Link
                      href="/business-score"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                    >
                      See full breakdown
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </Panel>
            )}

            {/* AI Recommendations */}
            {(dna.aiRecommendedNiche || dna.aiRecommendedPositioning) && (
              <Panel className="mb-8 p-6">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                  <Sparkles size={12} />
                  AI CEO Recommendations
                </div>
                {dna.aiRecommendedNiche && (
                  <div className="mb-4">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-text">
                      Recommended Niche
                    </div>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-text">
                      {dna.aiRecommendedNiche}
                    </p>
                  </div>
                )}
                {dna.aiRecommendedPositioning && (
                  <div className="mb-4">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-text">
                      Recommended Positioning
                    </div>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-text">
                      {dna.aiRecommendedPositioning}
                    </p>
                  </div>
                )}
                {dna.aiSummary && (
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-text">
                      Summary
                    </div>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-secondary">
                      {dna.aiSummary}
                    </p>
                  </div>
                )}
              </Panel>
            )}

            {/* Sections grid */}
            <div className="grid gap-5 md:grid-cols-2">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <Panel key={s.key} className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Icon size={14} className="text-accent" strokeWidth={2} />
                      <h2 className="text-[13px] font-semibold uppercase tracking-wider text-text">
                        {s.title}
                      </h2>
                    </div>

                    {s.body && (
                      <p className="mb-4 text-[14px] leading-relaxed text-secondary">{s.body}</p>
                    )}

                    {s.rows && s.rows.length > 0 && (
                      <dl className="space-y-3">
                        {s.rows.map((r) => (
                          <div key={r.label} className="flex items-start justify-between gap-4">
                            <dt className="text-[12px] font-medium uppercase tracking-wider text-muted-text">
                              {r.label}
                            </dt>
                            <dd className="text-right">
                              {r.chip ? (
                                <span
                                  className={cn(
                                    "inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium",
                                    r.chip,
                                  )}
                                >
                                  {r.value}
                                </span>
                              ) : (
                                <span className="text-[13px] text-text">{r.value}</span>
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    {s.bullets && s.bullets.length > 0 && (
                      <ul className="space-y-2">
                        {s.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-secondary">
                            <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-accent" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {s.items && s.items.length > 0 && (
                      <ul className="space-y-3">
                        {s.items.map((c, i) => (
                          <li
                            key={i}
                            className="border-l-2 border-border pl-3 text-[13px] text-secondary"
                          >
                            <div className="font-medium text-text">{c.name}</div>
                            {c.notes && <div className="mt-0.5 text-[12px] text-muted-text">{c.notes}</div>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                );
              })}

              {/* Connected Assets */}
              <Panel className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Globe size={14} className="text-accent" strokeWidth={2} />
                  <h2 className="text-[13px] font-semibold uppercase tracking-wider text-text">
                    Connected Assets
                  </h2>
                </div>
                {dna.websiteUrl && (
                  <div className="mb-4">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-text">
                      Website
                    </div>
                    <a
                      href={dna.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-[13px] text-accent hover:underline"
                    >
                      {dna.websiteUrl}
                    </a>
                  </div>
                )}
                {dna.socialLinks && Object.keys(dna.socialLinks).length > 0 && (
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-text">
                      Social
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {Object.entries(dna.socialLinks).map(([k, v]) => (
                        <li key={k} className="flex items-center gap-2 text-[13px]">
                          <CheckCircle2 size={11} className="text-success" />
                          <span className="text-muted-text">{k}:</span>
                          <a
                            href={v}
                            target="_blank"
                            rel="noreferrer"
                            className="text-secondary hover:text-accent"
                          >
                            {v.replace(/^https?:\/\//, "")}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Panel>
            </div>

            {/* Channels */}
            {dna.preferredChannels && dna.preferredChannels.length > 0 && (
              <Panel className="mt-5 p-6">
                <div className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-text">
                  Preferred Marketing Channels
                </div>
                <div className="flex flex-wrap gap-2">
                  {dna.preferredChannels.map((c) => (
                    <span
                      key={c}
                      className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-[12px] text-secondary"
                    >
                      {c.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </Panel>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
