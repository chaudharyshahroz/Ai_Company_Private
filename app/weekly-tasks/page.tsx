import { CalendarCheck } from "lucide-react";
import { ComingSoonPage } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";

export default function WeeklyTasksPage() {
  return ComingSoonPage({
    badge: "Weekly Tasks",
    title: "3-5 next-best-actions, every week.",
    description:
      "Your AI CEO generates 3-5 high-leverage tasks each week, with reason, expected result, owner, and one-click output generation. Skip the noise.",
    icon: CalendarCheck,
    capabilities: [
      "Auto-generated weekly priority list",
      "Why-it-matters context per task",
      "Expected result per task",
      "Department & due date",
      "One-click generate output",
      "Mark done / skip / regenerate",
    ],
    primaryCta: { label: "Open Company HQ", href: "/hq" },
    secondaryCta: { label: "View Growth Roadmap", href: "/roadmap" },
  });
}
