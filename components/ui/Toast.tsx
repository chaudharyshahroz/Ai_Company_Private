"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
  action?: { label: string; href?: string; onClick?: () => void };
}

interface ToastContextValue {
  push: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    // Fallback for non-provider environments — silent no-op so we never crash.
    return {
      push: (t: Omit<Toast, "id">) => {
        if (typeof console !== "undefined") console.log("[toast]", t.title);
        return "noop";
      },
      dismiss: () => {},
    };
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = React.useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const duration = toast.duration ?? 4500;
      setToasts((prev) => [...prev, { ...toast, id }]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  dismiss,
}: {
  toasts: Toast[];
  dismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const tone = toast.tone ?? "info";
  const Icon =
    tone === "success"
      ? CheckCircle2
      : tone === "error"
        ? XCircle
        : tone === "warning"
          ? AlertTriangle
          : Info;

  const toneClass: Record<ToastTone, string> = {
    success: "border-success/30 bg-surface text-text",
    error: "border-danger/30 bg-surface text-text",
    warning: "border-warning/30 bg-surface text-text",
    info: "border-border bg-surface text-text",
  };
  const iconClass: Record<ToastTone, string> = {
    success: "text-success",
    error: "text-danger",
    warning: "text-warning",
    info: "text-accent",
  };

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-md border p-3.5 shadow-panel animate-fade-in-up",
        toneClass[tone],
      )}
    >
      <Icon size={16} className={cn("mt-0.5 shrink-0", iconClass[tone])} />
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold leading-snug">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-[12.5px] leading-snug text-secondary">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              if (toast.action?.onClick) toast.action.onClick();
              if (toast.action?.href) window.location.href = toast.action.href;
              onDismiss();
            }}
            className="mt-2 text-[12.5px] font-medium text-accent hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-text transition-colors hover:bg-hover hover:text-text"
      >
        <X size={12} />
      </button>
    </div>
  );
}