import { Megaphone } from "lucide-react";
import { ComingSoonPage } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";

export default function AdsPage() {
  return ComingSoonPage({
    badge: "Ads & Content",
    title: "Campaigns, not random posts.",
    description:
      "Generate complete campaigns — 7-day launches, 14-day lead gen, 30-day calendars, Facebook ads, Instagram reels, LinkedIn, X, email, WhatsApp. Every campaign has a goal, audience, offer, channel, hooks, captions, CTA, schedule, and expected outcome.",
    icon: Megaphone,
    capabilities: [
      "7-day launch campaign",
      "14-day lead generation campaign",
      "30-day content calendar",
      "Facebook / Instagram / LinkedIn / X / TikTok / YouTube Shorts scripts",
      "Email sequences & WhatsApp broadcasts",
      "Ad creative prompts for image generation",
      "Approval workflow inside Work Inbox",
    ],
    primaryCta: { label: "Open Offer Builder", href: "/offer" },
    secondaryCta: { label: "View Lead System", href: "/leads" },
  });
}
