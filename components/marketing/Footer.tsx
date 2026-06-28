import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Logo } from "@/components/ui/Logo";
import { Github, Linkedin, Twitter } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Agents", href: "/agents" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "mailto:hello@reklu.app" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", href: "#" },
      { label: "API docs", href: "#" },
      { label: "Status", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Security", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-border/60 bg-surface/30">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
          {/* Brand */}
          <div>
            <Logo size="md" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary">
              Your AI company. Always working. Built for solo founders who refuse to scale
              alone.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="https://twitter.com/reklu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:border-primary/40 hover:text-text-primary"
                aria-label="Twitter"
              >
                <Twitter size={15} />
              </Link>
              <Link
                href="https://linkedin.com/company/reklu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:border-primary/40 hover:text-text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} />
              </Link>
              <Link
                href="https://github.com/reklu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:border-primary/40 hover:text-text-primary"
                aria-label="GitHub"
              >
                <Github size={15} />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-primary">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-text-tertiary sm:flex-row">
          <p>© 2026 Reklu. Built with love for solo founders everywhere.</p>
          <p className="font-mono">v0.1.0</p>
        </div>
      </Container>
    </footer>
  );
}