import { Search } from "lucide-react";
import { ComingSoonPage } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";

export default function MarketResearchPage() {
  return ComingSoonPage({
    badge: "Market Research",
    title: "Know your market before you spend a dollar.",
    description:
      "Deep-dive reports on demand, trends, customer segments, and gaps — generated from your Business DNA in under 60 seconds.",
    icon: Search,
    capabilities: [
      "Market overview & trend report",
      "Best target audience breakdown",
      "Customer demand signals",
      "Market gap analysis",
      "Recommended niche & positioning",
      "Risk assessment & 'what to do better' steps",
    ],
    primaryCta: { label: "Set up via Business DNA", href: "/business-dna" },
    secondaryCta: { label: "View Competitor Analysis", href: "/competitors" },
  });
}
