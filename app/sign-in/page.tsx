import Link from "next/link";
import { Container, Section } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Logo } from "@/components/ui/Logo";
import { Sparkles } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <GlassCard className="p-8">
          <h1 className="text-center font-display text-2xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Sign in to your AI company.
          </p>

          <div className="mt-8 space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40">
              <span>Continue with Google</span>
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40">
              <span>Continue with GitHub</span>
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-primary/40">
              <span>Continue with email</span>
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
            Continue as demo user
          </Link>

          <p className="mt-6 text-center text-xs text-text-tertiary">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary-light hover:underline">
              Sign up
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}