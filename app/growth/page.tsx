import { Compass } from "lucide-react";
import { ComingSoonPage } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";

export default function GrowthCommandCenterPage() {
  return ComingSoonPage({
    badge: "Growth Command Center",
    title: "The single screen for growing your business.",
    description:
      "All growth metrics, experiments, channels, and opportunities in one mission-control view. See what's working, what's not, and what to do next.",
    icon: Compass,
    capabilities: [
      "Live growth dashboard",
      "Channel-by-channel ROI",
      "Active experiments with results",
      "Top-of-funnel vs. bottom-of-funnel",
      "Cohort retention view",
      "Weekly AI CEO commentary",
    ],
    primaryCta: { label: "Open Company HQ", href: "/hq" },
    secondaryCta: { label: "View Analytics", href: "/analytics" },
  });
}
