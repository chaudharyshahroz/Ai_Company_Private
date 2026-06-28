import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Footer } from "@/components/marketing/Footer";
import { MOCK_BLOG_POSTS } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";

interface Params {
  params: { slug: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return MOCK_BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: Params) {
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <>
      <Section className="!pt-32">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              <ArrowLeft size={14} />
              Back to blog
            </Link>

            <article className="mt-8">
              <div className="mb-6 flex items-center gap-3 text-xs text-text-tertiary">
                <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                <span>·</span>
                <span>{post.readingMinutes} min read</span>
                <span>·</span>
                <span>By {post.author}</span>
              </div>
              <h1 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-text-secondary">{post.excerpt}</p>

              <GlassCard className="mt-10 p-8">
                <div className="prose prose-invert max-w-none text-base leading-relaxed text-text-primary">
                  {post.content.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-5">
                      {para}
                    </p>
                  ))}
                </div>
              </GlassCard>

              {post.tags && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}