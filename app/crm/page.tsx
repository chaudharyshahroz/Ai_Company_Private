import { Briefcase } from "lucide-react";
import { ComingSoonPage } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";

export default function CrmPage() {
  return ComingSoonPage({
    badge: "CRM",
    title: "Every lead, every conversation, one pipeline.",
    description:
      "Pipeline view with New → Contacted → Interested → Meeting Booked → Won / Lost. AI lead scoring, follow-up reminders, call notes, and next-best-action.",
    icon: Briefcase,
    capabilities: [
      "Kanban pipeline with all stages",
      "AI lead scoring (0-100)",
      "Source attribution & interest level",
      "Last contact & next action",
      "Call notes & call summaries",
      "Auto-generated follow-up messages",
    ],
    primaryCta: { label: "Open Lead System", href: "/leads" },
    secondaryCta: { label: "View Offer Builder", href: "/offer" },
  });
}
