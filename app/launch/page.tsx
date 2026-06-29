import { Rocket } from "lucide-react";
import { ComingSoonPage } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";

export default function LaunchPage() {
  return ComingSoonPage({
    badge: "Launch Plan",
    title: "Your 7-day launch, day-by-day.",
    description:
      "Generated from your Business DNA. Every day has a clear task, owner, and expected outcome. Hit publish on day 7.",
    icon: Rocket,
    capabilities: [
      "Day-by-day plan (D1 through D7)",
      "Owner & department per task",
      "Why-it-matters context",
      "Expected outcome per day",
      "One-click generate outputs",
      "Progress tracking",
    ],
    primaryCta: { label: "Open Growth Roadmap", href: "/roadmap" },
    secondaryCta: { label: "View Business DNA", href: "/business-dna" },
  });
}
