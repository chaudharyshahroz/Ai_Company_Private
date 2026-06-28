import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Footer } from "@/components/marketing/Footer";
import { MOCK_BLOG_POSTS } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories from the Reklu team and the founders using it.",
};

export default function BlogPage() {
  return (
    <>
      <Section className="!pt-40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Blog</Eyebrow>
            <h1 className="text-balance font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Notes from the <span className="gradient-text">AI company</span>
            </h1>
            <p className="mt-5 text-pretty text-lg text-text-secondary">
              How we build, how founders use it, what we&apos;re learning.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {MOCK_BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <GlassCard hoverable className="h-full p-6">
                  <div className="mb-4 flex items-center gap-2 text-xs text-text-tertiary">
                    <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                    <span>·</span>
                    <span>{post.readingMinutes} min read</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary-light">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                    <span className="text-xs text-text-tertiary">By {post.author}</span>
                    <ArrowRight size={14} className="text-primary-light" />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}