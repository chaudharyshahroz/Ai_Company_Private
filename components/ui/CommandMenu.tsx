"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserPlus,
  Target,
  Inbox,
  Sparkles,
  ListChecks,
  Briefcase,
  Megaphone,
  BarChart3,
  BookOpen,
  Compass,
  Building2,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandAction {
  id: string;
  label: string;
  hint?: string;
  shortcut?: string;
  icon: React.ReactNode;
  group: string;
  action: () => void;
}

export interface CommandMenuProps {
  /** Pass the actions to show. If omitted, uses the default OS actions. */
  actions?: CommandAction[];
}

/**
 * Linear-style command palette (⌘K / Ctrl+K).
 *  - Full-screen overlay with backdrop blur.
 *  - Centered panel, max 640px.
 *  - Search + grouped results + keyboard navigation.
 */
export function CommandMenu({ actions: customActions }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Default OS actions — pure navigation, no business logic
  const defaultActions: CommandAction[] = React.useMemo(
    () => [
      { id: "hq", label: "Open Company HQ", group: "Navigate", icon: <Building2 size={14} />, action: () => router.push("/hq") },
      { id: "briefing", label: "Open CEO Briefing", group: "Navigate", icon: <Sparkles size={14} />, action: () => router.push("/hq/briefing") },
      { id: "inbox", label: "Open Work Inbox", group: "Navigate", icon: <Inbox size={14} />, action: () => router.push("/hq/work-inbox") },
      { id: "goals", label: "Open Goals", group: "Navigate", icon: <Target size={14} />, action: () => router.push("/hq/goals") },
      { id: "tasks", label: "Open Task Board", group: "Navigate", icon: <ListChecks size={14} />, action: () => router.push("/hq/tasks") },
      { id: "depts", label: "Open Departments", group: "Navigate", icon: <Compass size={14} />, action: () => router.push("/departments") },
      { id: "marketplace", label: "Hire AI Employee", group: "Create", shortcut: "H", icon: <UserPlus size={14} />, action: () => router.push("/employees") },
      { id: "goal-new", label: "Assign New Goal", group: "Create", shortcut: "G", icon: <Target size={14} />, action: () => router.push("/hq/goals") },
      { id: "ask-ceo", label: "Ask AI CEO", group: "Create", icon: <Sparkles size={14} />, action: () => router.push("/hq/briefing") },
      { id: "review", label: "Review Pending Work", group: "Action", icon: <Inbox size={14} />, action: () => router.push("/hq/work-inbox") },
      { id: "sales", label: "Open Sales Department", group: "Departments", icon: <Briefcase size={14} />, action: () => router.push("/departments/sales") },
      { id: "marketing", label: "Open Marketing Department", group: "Departments", icon: <Megaphone size={14} />, action: () => router.push("/departments/marketing") },
      { id: "kb", label: "Open Knowledge Base", group: "Workspace", icon: <BookOpen size={14} />, action: () => router.push("/knowledge-base") },
      { id: "reports", label: "Open Reports", group: "Workspace", icon: <BarChart3 size={14} />, action: () => router.push("/reports") },
      { id: "training", label: "Train an Employee", group: "Workspace", icon: <GraduationCap size={14} />, action: () => router.push("/employees") },
    ],
    [router],
  );

  const actions = customActions ?? defaultActions;
  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q) ||
        (a.hint ?? "").toLowerCase().includes(q),
    );
  }, [actions, query]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, CommandAction[]>();
    for (const a of filtered) {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group)!.push(a);
    }
    return Array.from(map.entries());
  }, [filtered]);

  // Open on ⌘K / Ctrl+K
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  React.useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const runAction = (a: CommandAction) => {
    setOpen(false);
    a.action();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const a = filtered[activeIdx];
      if (a) runAction(a);
    }
  };

  // Global trigger button (used by HqHeader)
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-command-trigger]")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  let flatIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-[640px] -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-lg border border-border-strong bg-surface shadow-2xl">
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search size={16} className="text-secondary" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search commands, employees, departments..."
                  className="flex-1 bg-transparent py-4 text-base text-text outline-none placeholder:text-muted-text"
                />
                <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] text-secondary">
                  Esc
                </kbd>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-12 text-center text-sm text-secondary">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  grouped.map(([group, items]) => (
                    <div key={group} className="mb-2">
                      <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-text">
                        {group}
                      </div>
                      {items.map((a) => {
                        const idx = flatIdx++;
                        const active = idx === activeIdx;
                        return (
                          <button
                            key={a.id}
                            onMouseEnter={() => setActiveIdx(idx)}
                            onClick={() => runAction(a)}
                            className={cn(
                              "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                              active ? "bg-accent/12 text-text" : "text-text",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-secondary">{a.icon}</span>
                              <span>{a.label}</span>
                            </div>
                            {a.shortcut && (
                              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-secondary">
                                {a.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-text">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <kbd>↑</kbd>
                    <kbd>↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd>↵</kbd>
                    select
                  </span>
                </div>
                <span>Reklu OS</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}