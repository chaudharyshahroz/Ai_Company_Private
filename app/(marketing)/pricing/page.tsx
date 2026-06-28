import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/layout";
import { PricingSection } from "@/components/marketing/PricingSection";
import { Footer } from "@/components/marketing/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Reklu pricing — start free, scale your AI company.",
};

const comparisonFeatures = [
  { name: "AI agents", starter: "3", growth: "8", company: "Unlimited" },
  { name: "Monthly tasks", starter: "500", growth: "Unlimited", company: "Unlimited" },
  { name: "Business Brain", starter: "Basic", growth: "Full", company: "Full" },
  { name: "Agent-to-agent delegation", starter: "—", growth: "✓", company: "✓" },
  { name: "Weekly board report", starter: "—", growth: "✓", company: "✓" },
  { name: "Custom agent creation", starter: "—", growth: "—", company: "✓" },
  { name: "White-label option", starter: "—", growth: "—", company: "✓" },
  { name: "Dedicated onboarding", starter: "—", growth: "—", company: "✓" },
  { name: "Email support", starter: "✓", growth: "✓", company: "✓" },
  { name: "Priority support", starter: "—", growth: "✓", company: "✓" },
  { name: "API access", starter: "—", growth: "✓", company: "✓" },
];

export default function PricingPage() {
  return (
    <>
      <PricingSection />

      <Section className="!py-12">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
              Compare plans
            </h2>
            <GlassCard className="mt-10 overflow-hidden p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-2/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-text-secondary">
                      Starter
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-primary-light">
                      Growth
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-text-secondary">
                      Company
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {comparisonFeatures.map((row) => (
                    <tr key={row.name} className="text-sm">
                      <td className="px-6 py-4 text-text-primary">{row.name}</td>
                      <td className="px-6 py-4 text-center">
                        <CellValue value={row.starter} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <CellValue value={row.growth} highlight />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <CellValue value={row.company} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}

function CellValue({ value, highlight }: { value: string; highlight?: boolean }) {
  if (value === "✓") return <Check size={16} className="mx-auto text-accent" />;
  if (value === "—") return <X size={14} className="mx-auto text-text-tertiary" />;
  return (
    <span className={highlight ? "font-medium text-text-primary" : "text-text-secondary"}>
      {value}
    </span>
  );
}