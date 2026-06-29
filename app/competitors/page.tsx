import { Swords } from "lucide-react";
import { ComingSoonPage } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";

export default function CompetitorsPage() {
  return ComingSoonPage({
    badge: "Competitor Analysis",
    title: "See exactly how to beat every competitor.",
    description:
      "For each competitor: positioning, pricing, strengths, weaknesses, and the gap you can exploit. Plus a 'how to beat them' playbook.",
    icon: Swords,
    capabilities: [
      "Competitor card per business (positioning, pricing, gaps)",
      "Side-by-side comparison table",
      "Strengths & weaknesses analysis",
      "Missing opportunities",
      "Counter-positioning recommendations",
      "Ethical 'what to copy, what to do better' checklist",
    ],
    primaryCta: { label: "Add competitors in Business DNA", href: "/business-dna" },
    secondaryCta: { label: "View Offer Builder", href: "/offer" },
  });
}
