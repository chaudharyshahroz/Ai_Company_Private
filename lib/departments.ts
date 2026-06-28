/**
 * Departments catalog — 10 departments per the Reklu spec.
 * Each department has a manager (the most senior employee in the dept)
 * and a list of employee slug references.
 */

export interface DepartmentDef {
  slug: string;
  name: string;
  emoji: string;
  shortDescription: string;
  description: string;
  managerSlug: string;
  employeeSlugs: string[];
  color: string;
  tasks: string[];
  defaultFor: string[]; // business types where this dept ships by default
}

export const DEPARTMENTS: DepartmentDef[] = [
  {
    slug: "executive",
    name: "Executive",
    emoji: "🎯",
    shortDescription: "AI CEO + leadership that sets strategy, breaks down goals, and runs the company.",
    description:
      "The Executive Department is the brain of your AI company. Your AI CEO understands your business, sets weekly priorities, breaks goals into tasks, and delegates to every other department.",
    managerSlug: "ceo",
    employeeSlugs: ["ceo", "coo", "chief-of-staff"],
    color: "from-primary to-accent-warm",
    tasks: ["Strategy", "Weekly priorities", "Daily briefing", "Goal breakdown", "Risk detection"],
    defaultFor: ["saas", "agency", "ecommerce", "creator"],
  },
  {
    slug: "sales",
    name: "Sales",
    emoji: "💼",
    shortDescription: "Find leads, write outreach, qualify prospects, and book meetings.",
    description:
      "Your Sales Department finds leads, researches prospects, writes personalized outreach, and prepares sales conversations. From cold email to closing scripts.",
    managerSlug: "sales-manager",
    employeeSlugs: ["sales-manager", "lead-researcher", "outreach-employee", "sales-closer", "appointment-setter"],
    color: "from-accent-warm to-accent",
    tasks: ["Lead lists", "Cold email", "Follow-ups", "Sales scripts", "Appointment booking"],
    defaultFor: ["saas", "agency", "real-estate", "ecommerce", "coaching"],
  },
  {
    slug: "support",
    name: "Customer Support",
    emoji: "💬",
    shortDescription: "Answer customer questions 24/7 with FAQ-grounded replies and smart escalations.",
    description:
      "Your Support Department handles customer questions, builds FAQs from documents, tracks feedback, and helps onboard new customers. Never miss a question again.",
    managerSlug: "support-manager",
    employeeSlugs: ["support-manager", "support-employee", "faq-builder", "feedback-analyst", "onboarding-assistant"],
    color: "from-primary to-accent",
    tasks: ["Answer tickets", "Build FAQs", "Summarize feedback", "Onboarding flows", "Escalations"],
    defaultFor: ["saas", "ecommerce", "education", "local-business"],
  },
  {
    slug: "marketing",
    name: "Marketing",
    emoji: "📣",
    shortDescription: "Plan campaigns, write content, run social, write ads, and build email sequences.",
    description:
      "Your Marketing Department plans campaigns, writes blog posts, generates social content, writes ad copy, and creates email sequences. Brand voice consistent across every channel.",
    managerSlug: "marketing-manager",
    employeeSlugs: [
      "marketing-manager",
      "content-writer",
      "social-media-manager",
      "seo-aeo-writer",
      "ad-copywriter",
      "email-marketer",
      "brand-strategist",
    ],
    color: "from-accent-warm to-primary",
    tasks: ["Blog posts", "Social content", "Email sequences", "Ad copy", "Brand voice", "SEO/AEO"],
    defaultFor: ["saas", "agency", "ecommerce", "creator", "local-business"],
  },
  {
    slug: "research",
    name: "Research",
    emoji: "🔍",
    shortDescription: "Competitor analysis, market trends, product research, and trend spotting.",
    description:
      "Your Research Department watches competitors, studies market trends, finds product opportunities, and surfaces viral content ideas before everyone else.",
    managerSlug: "research-manager",
    employeeSlugs: ["research-manager", "competitor-researcher", "market-researcher", "product-researcher", "trend-finder"],
    color: "from-accent to-primary",
    tasks: ["Competitor scans", "Market trends", "Product ideas", "Trend reports", "Opportunity briefs"],
    defaultFor: ["saas", "agency", "ecommerce", "creator"],
  },
  {
    slug: "finance",
    name: "Finance",
    emoji: "💰",
    shortDescription: "Pricing analysis, expense tracking, revenue insights, and CFO-grade reporting.",
    description:
      "Your Finance Department handles pricing, tracks expenses, forecasts revenue, and produces CFO-grade summaries. Smart pricing, smarter growth.",
    managerSlug: "cfo",
    employeeSlugs: ["cfo", "pricing-analyst", "expense-assistant", "revenue-analyst"],
    color: "from-accent to-accent-warm",
    tasks: ["Pricing strategy", "Expense review", "Revenue forecasts", "Budget planning"],
    defaultFor: ["saas", "agency", "ecommerce", "creator", "local-business"],
  },
  {
    slug: "operations",
    name: "Operations",
    emoji: "⚙️",
    shortDescription: "Project management, automation, document drafting, and workflow design.",
    description:
      "Your Operations Department manages projects, designs automations, drafts business documents, and creates SOPs. Everything runs on rails.",
    managerSlug: "operations-manager",
    employeeSlugs: ["operations-manager", "project-manager", "automation-builder", "document-assistant"],
    color: "from-primary-light to-accent",
    tasks: ["Project plans", "Automations", "Proposals", "SOPs", "Contracts"],
    defaultFor: ["saas", "agency", "ecommerce"],
  },
  {
    slug: "product-website",
    name: "Product & Website",
    emoji: "🌐",
    shortDescription: "Product roadmaps, landing pages, UX review, and conversion optimization.",
    description:
      "Your Product & Website Department plans features, builds landing pages, reviews UX, and runs conversion experiments. Your site works as hard as your sales team.",
    managerSlug: "product-manager",
    employeeSlugs: ["product-manager", "website-builder", "ux-reviewer", "conversion-optimizer"],
    color: "from-accent to-primary-light",
    tasks: ["Roadmaps", "Landing pages", "UX review", "CRO experiments"],
    defaultFor: ["saas", "ecommerce", "creator", "agency", "local-business"],
  },
  {
    slug: "admin",
    name: "Admin",
    emoji: "🗂️",
    shortDescription: "Meeting notes, inbox triage, document organization, and internal reports.",
    description:
      "Your Admin Department summarizes meetings, triages your inbox, organizes notes, and prepares internal reports. Like a Chief of Staff for your admin work.",
    managerSlug: "admin-assistant",
    employeeSlugs: ["admin-assistant", "meeting-assistant", "inbox-assistant"],
    color: "from-text-tertiary to-primary",
    tasks: ["Meeting summaries", "Inbox triage", "Internal reports"],
    defaultFor: ["saas", "agency", "creator"],
  },
  {
    slug: "legal",
    name: "Legal & Compliance",
    emoji: "⚖️",
    shortDescription: "Draft terms, privacy policies, disclaimers, and flag compliance risks. Not a lawyer.",
    description:
      "Your Legal & Compliance Department drafts terms, privacy policies, refund policies, and disclaimers. Flags risky claims. Not a substitute for a lawyer — always review with counsel.",
    managerSlug: "legal-draft",
    employeeSlugs: ["legal-draft", "compliance-assistant"],
    color: "from-accent-warm to-text-tertiary",
    tasks: ["Terms draft", "Privacy draft", "Compliance checks", "Disclaimer review"],
    defaultFor: ["saas", "ecommerce", "agency"],
  },
];

/** Get a department by slug */
export function getDepartment(slug: string) {
  return DEPARTMENTS.find((d) => d.slug === slug) ?? null;
}

/** Get all department slugs */
export function getAllDepartmentSlugs() {
  return DEPARTMENTS.map((d) => d.slug);
}