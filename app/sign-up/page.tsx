import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, Check } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <GlassCard className="p-8">
          <h1 className="text-center font-display text-2xl font-bold tracking-tight">
            Build your AI company
          </h1>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Free to start. No credit card.
          </p>

          <div className="mt-6 space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
            {["1 agent free forever", "50 tasks/month", "Business Brain included", "Cancel anytime"].map((p) => (
              <div key={p} className="flex items-center gap-2 text-xs text-text-secondary">
                <Check size={12} className="text-accent" />
                {p}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40">
              Sign up with Google
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40">
              Sign up with GitHub
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-text-tertiary">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent-warm py-2.5 text-sm font-semibold text-white shadow-glow-sm transition-shadow hover:shadow-glow"
          >
            <Sparkles size={14} />
            Start free — skip signup
          </Link>

          <p className="mt-6 text-center text-xs text-text-tertiary">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary-light hover:underline">
              Sign in
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}