import * as React from "react";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { getCurrentUser, getBusinessBrain } from "@/lib/data";
import { MOCK_BUSINESS_BRAIN } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const sections = [
  { id: "products", label: "Products & Services", emoji: "📦" },
  { id: "audience", label: "Your Audience", emoji: "🎯" },
  { id: "competitors", label: "Competitors", emoji: "🥊" },
  { id: "voice", label: "Brand Voice", emoji: "🎙️" },
  { id: "context", label: "Key Context", emoji: "📝" },
  { id: "keywords", label: "Keywords & SEO", emoji: "🔑" },
];

export default async function BrainPage() {
  const user = await getCurrentUser();
  const brain = (await getBusinessBrain(user.id)) ?? MOCK_BUSINESS_BRAIN;

  const filledSections = sections.filter((s) => {
    if (s.id === "products") return brain.products.length > 0;
    if (s.id === "audience") return !!brain.customContext;
    if (s.id === "competitors") return brain.competitors.length > 0;
    if (s.id === "voice") return brain.toneExamples.length > 0;
    if (s.id === "context") return !!brain.usp;
    if (s.id === "keywords") return brain.targetKeywords.length > 0;
    return false;
  });

  const completeness = Math.round((filledSections.length / sections.length) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Business Brain</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Everything your agents know about you. The more you add, the smarter they get.
        </p>
      </div>

      {/* Completeness */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-text-tertiary">
              Brain completeness
            </div>
            <div className="mt-1 font-display text-3xl font-bold text-text-primary">
              {completeness}%
            </div>
          </div>
          <div className="text-right text-sm text-text-secondary">
            {filledSections.length} of {sections.length} sections filled
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
          <Sparkles size={13} className="text-accent" />
          <span>
            Tip: filling the remaining sections unlocks delegation — your CEO agent will
            start briefing the right specialists automatically.
          </span>
        </div>
      </GlassCard>

      {/* Sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((s) => (
          <GlassCard key={s.id} hoverable className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-xl">
                  {s.emoji}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">{s.label}</h3>
                  <p className="text-xs text-text-tertiary">
                    {s.id === "products" && `${brain.products.length} items`}
                    {s.id === "competitors" && `${brain.competitors.length} tracked`}
                    {s.id === "keywords" && `${brain.targetKeywords.length} keywords`}
                  </p>
                </div>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-2 hover:text-text-primary">
                <Plus size={14} />
              </button>
            </div>

            {/* Section preview */}
            <div className="rounded-lg border border-border/60 bg-surface/40 p-3">
              {s.id === "products" && (
                <ul className="space-y-1.5 text-sm">
                  {brain.products.slice(0, 3).map((p) => (
                    <li key={p.name} className="flex items-center justify-between gap-2">
                      <span className="text-text-primary">{p.name}</span>
                      <span className="font-mono text-xs text-text-tertiary">{p.price}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.id === "competitors" && (
                <ul className="space-y-1.5 text-sm">
                  {brain.competitors.map((c) => (
                    <li key={c.url} className="flex items-center gap-2">
                      <span className="text-text-primary">{c.name}</span>
                      <span className="font-mono text-xs text-text-tertiary">{c.url}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.id === "keywords" && (
                <div className="flex flex-wrap gap-1.5">
                  {brain.targetKeywords.slice(0, 6).map((k) => (
                    <span
                      key={k}
                      className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs text-text-secondary"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              )}
              {s.id === "voice" && (
                <ul className="space-y-1.5 text-xs italic text-text-secondary">
                  {brain.toneExamples.map((t) => (
                    <li key={t}>&ldquo;{t}&rdquo;</li>
                  ))}
                </ul>
              )}
              {s.id === "context" && (
                <p className="text-xs leading-relaxed text-text-secondary">{brain.usp}</p>
              )}
              {s.id === "audience" && (
                <p className="text-xs leading-relaxed text-text-secondary">
                  {brain.customContext}
                </p>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}