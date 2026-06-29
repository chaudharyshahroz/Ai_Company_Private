import { Globe } from "lucide-react";
import { ComingSoonPage } from "@/components/dashboard/ComingSoon";

export const dynamic = "force-dynamic";

export default function WebsiteBuilderPage() {
  return ComingSoonPage({
    badge: "Website Builder",
    title: "Your landing page, generated and ready to ship.",
    description:
      "Hero, problem, solution, features, pricing, FAQ, final CTA — generated from your Business DNA and Offer Builder output. Export to HTML or Next.js.",
    icon: Globe,
    capabilities: [
      "Hero, subhead, primary CTA",
      "Problem / Solution sections",
      "Features & benefits",
      "How it works",
      "Pricing & FAQ",
      "SEO title + meta + AEO answer blocks",
      "One-click export to HTML or Next.js",
    ],
    primaryCta: { label: "Open Offer Builder", href: "/offer" },
    secondaryCta: { label: "View Business DNA", href: "/business-dna" },
  });
}
