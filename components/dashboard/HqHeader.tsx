"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, CreditCard, LogOut, Settings, User, ChevronDown, Sparkles } from "lucide-react";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface HqHeaderProps {
  user: { name?: string | null; email: string; plan?: string; businessName?: string | null };
  unreadCount?: number;
}

export function HqHeader({ user, unreadCount = 0 }: HqHeaderProps) {
  const toast = useToast();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [companyOpen, setCompanyOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const companyRef = React.useRef<HTMLDivElement>(null);

  // Close menus on outside click
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) setCompanyOpen(false);
    };
    if (menuOpen || companyOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen, companyOpen]);

  const handleHireClick = () => {
    toast.push({
      tone: "info",
      title: "Browse AI employees",
      description: "Pick the role that fits your work.",
    });
  };

  const handleCreditsClick = () => {
    toast.push({
      tone: "info",
      title: "8,547 credits remaining",
      description: "Credits renew on the 1st of each month.",
      action: { label: "Buy more credits", href: "/billing" },
    });
  };

  return (
    <>
      <CommandMenu />
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-bg/80 px-5 backdrop-blur-md md:px-7">
        {/* Left: company switcher */}
        <div ref={companyRef} className="relative">
          <button
            type="button"
            onClick={() => setCompanyOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-[13.5px] transition-colors hover:border-border-strong"
          >
            <span className="text-sm leading-none">🏢</span>
            <span className="truncate font-medium text-text">
              {user.businessName ?? "Your Company"}
            </span>
            <ChevronDown size={12} className="text-muted-text" />
          </button>
          {companyOpen && (
            <div className="absolute left-0 top-full z-40 mt-1.5 w-72 rounded-md border border-border bg-surface p-1.5 shadow-panel animate-fade-in">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                Switch business
              </div>
              <button
                type="button"
                onClick={() => {
                  setCompanyOpen(false);
                  toast.push({ tone: "info", title: "Acme Studios selected", description: "You're back to the main workspace." });
                }}
                className="flex w-full items-center gap-3 rounded-md bg-accent/8 px-3 py-2 text-left"
              >
                <span className="text-base">🏢</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-text">Acme Studios</p>
                  <p className="text-[11.5px] text-muted-text">Growth · 8,547 credits</p>
                </div>
                <Sparkles size={12} className="text-accent" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCompanyOpen(false);
                  toast.push({
                    tone: "info",
                    title: "Create new business",
                    description: "Multi-business support coming soon.",
                  });
                }}
                className="mt-1 flex w-full items-center gap-3 rounded-md border border-dashed border-border px-3 py-2 text-left text-secondary transition-colors hover:border-border-strong hover:text-text"
              >
                <Plus size={14} />
                <span className="text-[13px]">Create new business</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: search, credits, hire, profile */}
        <div className="flex items-center gap-2">
          <button
            data-command-trigger
            type="button"
            className="hidden h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-[13px] text-muted-text transition-colors hover:border-border-strong md:flex"
          >
            <Search size={13} />
            <span>Search…</span>
            <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0 text-[10px] text-secondary">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={handleCreditsClick}
            className="hidden h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12.5px] transition-colors hover:border-border-strong md:flex"
          >
            <CreditCard size={12} className="text-secondary" />
            <span className="text-muted-text">Credits</span>
            <span className="font-mono font-medium text-text tabular-nums">8,547</span>
          </button>

          <Link
            href="/employees"
            onClick={handleHireClick}
            className="flex h-9 items-center gap-1.5 rounded-md bg-[#FFFFFF] px-3.5 text-[13px] font-medium text-[#0A0B0C] shadow-button transition-all hover:bg-white hover:shadow-button-hover"
          >
            <Plus size={13} strokeWidth={2.2} />
            Hire Employee
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-[13px] font-semibold text-text transition-colors hover:bg-surface-2"
              aria-label="Open profile menu"
            >
              {user.name?.[0] ?? user.email[0]}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-40 mt-1.5 w-60 rounded-md border border-border bg-surface p-1.5 shadow-panel animate-fade-in">
                <div className="px-3 py-2">
                  <p className="truncate text-[13px] font-semibold text-text">
                    {user.name ?? "You"}
                  </p>
                  <p className="truncate text-[12px] text-muted-text">{user.email}</p>
                </div>
                <div className="my-1 h-px bg-border" />
                <MenuLink href="/settings" icon={<User size={13} />} label="Profile" onClick={() => setMenuOpen(false)} />
                <MenuLink href="/settings" icon={<Settings size={13} />} label="Settings" onClick={() => setMenuOpen(false)} />
                <MenuLink href="/billing" icon={<CreditCard size={13} />} label="Billing" onClick={() => setMenuOpen(false)} />
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    toast.push({ tone: "info", title: "Signed out", description: "Auth coming soon." });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-secondary transition-colors hover:bg-hover hover:text-text"
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

function MenuLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-secondary transition-colors hover:bg-hover hover:text-text",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}