"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Inbox,
  ListChecks,
  Target,
  GraduationCap,
  LineChart,
  MessageSquare,
  Megaphone,
  Plug,
  Globe,
  CreditCard,
  Settings,
  Briefcase,
  LifeBuoy,
  Search,
  Wrench,
  Folder,
  Scale,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

interface HqSidebarProps {
  collapsed?: boolean;
}

// All sidebar items are visible by default — every module is active.
// The Advanced/Simple Mode toggle in Settings now controls display density
// elsewhere (e.g. compact metrics on Reports), not whether items appear.
const groups: Array<{
  title?: string;
  items: Array<{ href: string; label: string; icon: React.ElementType; exact?: boolean }>;
}> = [
  {
    items: [
      { href: "/hq", label: "Home", icon: Home, exact: true },
      { href: "/employees", label: "AI Employees", icon: Users },
      { href: "/hq/work-inbox", label: "Work Review", icon: Inbox },
      { href: "/hq/tasks", label: "Tasks", icon: ListChecks },
      { href: "/hq/goals", label: "Company Goals", icon: Target },
      { href: "/hq/briefing", label: "CEO Briefing", icon: Sparkles },
      { href: "/leads", label: "Leads", icon: Target },
      { href: "/knowledge-base", label: "Knowledge Base", icon: GraduationCap },
      { href: "/reports", label: "Reports", icon: LineChart },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Departments",
    items: [
      { href: "/departments/executive", label: "Executive", icon: Sparkles },
      { href: "/departments/sales", label: "Sales", icon: Briefcase },
      { href: "/departments/support", label: "Customer Support", icon: LifeBuoy },
      { href: "/departments/marketing", label: "Marketing", icon: Megaphone },
      { href: "/departments/research", label: "Research", icon: Search },
      { href: "/departments/finance", label: "Finance", icon: LineChart },
      { href: "/departments/operations", label: "Operations", icon: Wrench },
      { href: "/departments/product-website", label: "Product & Website", icon: Globe },
      { href: "/departments/admin", label: "Admin", icon: Folder },
      { href: "/departments/legal", label: "Legal & Compliance", icon: Scale },
    ],
  },
  {
    title: "Business",
    items: [
      { href: "/conversations", label: "Conversations", icon: MessageSquare },
      { href: "/campaigns", label: "Campaigns", icon: Megaphone },
      { href: "/widget", label: "Website Widget", icon: Globe },
      { href: "/integrations", label: "Integrations", icon: Plug },
      { href: "/team", label: "Team", icon: Users },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/billing", label: "Billing", icon: CreditCard },
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
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
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