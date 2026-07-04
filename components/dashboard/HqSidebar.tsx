"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  // HQ
  Home,
  Sparkles,
  Inbox,
  ListChecks,
  Target,
  Clock,
  // Business Builder
  Dna,
  Gauge,
  Search,
  Swords,
  Package,
  Globe,
  Rocket,
  // Growth
  Megaphone,
  TrendingUp,
  Users,
  CalendarCheck,
  // Departments
  Briefcase,
  LifeBuoy,
  LineChart,
  Wrench,
  Folder,
  Scale,
  // Company
  GraduationCap,
  MessageSquare,
  Plug,
  BarChart3,
  // System
  CreditCard,
  Settings,
  Compass,
  Building2,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

interface HqSidebarProps {
  collapsed?: boolean;
}

// New IA — Business Growth OS + AI Company Team
// Aligned with the new positioning: HQ / Business Builder / Growth / Departments / Company / System
const groups: Array<{
  title?: string;
  items: Array<{ href: string; label: string; icon: React.ElementType; exact?: boolean; badge?: string }>;
}> = [
  {
    title: "HQ",
    items: [
      { href: "/hq", label: "Company HQ", icon: Home, exact: true },
      { href: "/hq/briefing", label: "CEO Briefing", icon: Sparkles },
      { href: "/growth", label: "Growth Command Center", icon: Compass },
      { href: "/work-review", label: "Work Review", icon: Inbox },
      { href: "/scheduled-work", label: "Scheduled Work", icon: Clock },
      { href: "/hq/goals", label: "Goals", icon: Target },
      { href: "/hq/tasks", label: "Task Board", icon: ListChecks },
    ],
  },
  {
    title: "Business Builder",
    items: [
      { href: "/business-dna", label: "Business DNA", icon: Dna },
      { href: "/business-score", label: "Business Score", icon: Gauge },
      { href: "/market-research", label: "Market Research", icon: Search, badge: "Soon" },
      { href: "/competitors", label: "Competitor Analysis", icon: Swords, badge: "Soon" },
      { href: "/offer", label: "Offer Builder", icon: Package },
      { href: "/website", label: "Website Builder", icon: Globe, badge: "Soon" },
      { href: "/launch", label: "Launch Plan", icon: Rocket },
    ],
  },
  {
    title: "Growth",
    items: [
      { href: "/ads", label: "Ads & Content", icon: Megaphone, badge: "Soon" },
      { href: "/campaigns", label: "Campaigns", icon: Megaphone },
      { href: "/leads", label: "Lead System", icon: Users },
      { href: "/crm", label: "CRM", icon: Briefcase, badge: "Soon" },
      { href: "/roadmap", label: "Growth Roadmap", icon: TrendingUp },
      { href: "/weekly-tasks", label: "Weekly Tasks", icon: CalendarCheck, badge: "Soon" },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Departments",
    items: [
      { href: "/departments/executive", label: "Executive", icon: Sparkles },
      { href: "/departments/sales", label: "Sales", icon: Briefcase },
      { href: "/departments/marketing", label: "Marketing", icon: Megaphone },
      { href: "/departments/support", label: "Support", icon: LifeBuoy },
      { href: "/departments/research", label: "Research", icon: Search },
      { href: "/departments/finance", label: "Finance", icon: LineChart },
      { href: "/departments/operations", label: "Operations", icon: Wrench },
      { href: "/departments/product-website", label: "Product & Website", icon: Globe },
      { href: "/departments/admin", label: "Admin", icon: Folder },
      { href: "/departments/legal", label: "Legal", icon: Scale },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/employees", label: "AI Employees", icon: Users },
      { href: "/knowledge-base", label: "Knowledge Base", icon: GraduationCap },
      { href: "/customers", label: "Customers", icon: Building2 },
      { href: "/conversations", label: "Conversations", icon: MessageSquare },
      { href: "/reports", label: "Reports", icon: BarChart3 },
      { href: "/integrations", label: "Integrations", icon: Plug },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/billing", label: "Billing", icon: CreditCard },
      { href: "/team", label: "Team", icon: Users },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function HqSidebar({ collapsed }: HqSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 overflow-y-auto border-r border-border bg-surface",
        collapsed ? "w-16" : "w-[248px]",
        "lg:block",
      )}
    >
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/hq" className="flex items-center">
          <Logo size="md" showWordmark={!collapsed} />
        </Link>
      </div>

      <nav className="px-3 py-5">
        {groups.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && "mt-5 pt-5 border-t border-border")}>
            {group.title && !collapsed && (
              <div className="mb-2 px-2 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-text">
                {group.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md px-2.5 py-1.5 text-[13px] font-normal transition-colors",
                        active
                          ? "bg-accent/12 text-text"
                          : "text-secondary hover:bg-hover hover:text-text",
                        collapsed && "justify-center",
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-accent" />
                      )}
                      <Icon
                        size={15}
                        className={cn(active && "text-accent")}
                        strokeWidth={active ? 2 : 1.7}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-full border border-border bg-bg/60 px-1.5 py-0 text-[9.5px] font-medium uppercase tracking-wide text-muted-text">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
