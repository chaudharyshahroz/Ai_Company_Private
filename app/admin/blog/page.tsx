import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { MOCK_BLOG_POSTS } from "@/lib/mock-data";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Blog</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {MOCK_BLOG_POSTS.length} posts · MDX-powered
          </p>
        </div>
        <GlowButton asChild>
          <Link href="/admin/blog/new">
            <Plus size={14} />
            New post
          </Link>
        </GlowButton>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2/40">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Title</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Status</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Published</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Author</th>
              <th className="w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {MOCK_BLOG_POSTS.map((p) => (
              <tr key={p.slug} className="hover:bg-surface-2/30">
                <td className="px-5 py-3 text-text-primary">{p.title}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                    Published
                  </span>
                </td>
                <td className="px-5 py-3 text-text-tertiary">{p.publishedAt}</td>
                <td className="px-5 py-3 text-text-secondary">{p.author}</td>
                <td className="px-5 py-3">
                  <button className="text-xs text-primary-light hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}