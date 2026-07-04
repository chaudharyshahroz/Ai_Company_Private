/**
 * Memory retriever — pulls relevant company memory for a task.
 *
 * The user-facing name is "Train Your AI Team". This module is what the AI
 * employees call when they need context about the business.
 *
 * Strategy:
 *  1. Scope filtering — only the current user's items, filtered to relevant scopes
 *     based on the requesting employee's department.
 *  2. Keyword overlap scoring — tokenize the query and the item content,
 *     compute TF-style overlap. (Real embedding-based cosine similarity can plug
 *     in later by populating `embedding` with a real vector.)
 *  3. Confidence-weighted ranking — items with higher confidence + higher use
 *     count surface first.
 *
 * When `DATABASE_URL` is set, this reads from the real `knowledge_base_items` table.
 * In demo mode, it reads from the in-memory mock store.
 */

import { isDemoMode } from "@/lib/demo";
import type { KnowledgeBaseItem } from "@/lib/db/schema";
import type { Department, MemoryHit } from "./types";

/** Build the per-employee memory scope — what they can see. */
export function buildMemoryScope(department: Department): string[] {
  // Everyone can see "all" scope + their own department + adjacent ones.
  const base = ["all", department];

  // Adjacencies: what each department typically needs from others.
  const adjacency: Record<Department, string[]> = {
    executive: ["all"],
    sales: ["marketing", "research", "support", "product-website"],
    support: ["sales", "product-website", "marketing"],
    marketing: ["research", "product-website", "sales"],
    research: ["marketing", "sales", "product-website"],
    finance: ["executive", "sales", "operations"],
    operations: ["executive", "sales", "support"],
    "product-website": ["marketing", "support", "research"],
    admin: ["executive", "operations"],
    legal: ["executive", "operations", "finance", "support"],
  };

  return [...base, ...(adjacency[department] ?? [])];
}

/** Tokenize text — lowercase, strip punctuation, drop stop words. */
function tokenize(text: string): string[] {
  const stop = new Set([
    "the","a","an","and","or","of","to","in","for","on","with","at","by","from","as","is","are","be","was","were","this","that","it","its","we","our","you","your","i","my","me","they","them","their","he","she","his","her","but","if","so","not","no","do","does","did","have","has","had","will","would","can","could","should","may","might","must"
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !stop.has(w));
}

/** Score a single item against a query — keyword overlap + confidence boost. */
function scoreItem(item: KnowledgeBaseItem, queryTokens: string[]): number {
  const contentTokens = tokenize(`${item.title} ${item.content} ${item.tags.join(" ")}`);
  if (contentTokens.length === 0 || queryTokens.length === 0) return 0;

  const contentSet = new Set(contentTokens);
  let overlap = 0;
  for (const q of queryTokens) if (contentSet.has(q)) overlap += 1;
  // Normalize by query length so longer queries don't get penalized.
  const overlapScore = overlap / queryTokens.length;

  // Boost for title hits.
  const titleTokens = tokenize(item.title);
  const titleSet = new Set(titleTokens);
  let titleHits = 0;
  for (const q of queryTokens) if (titleSet.has(q)) titleHits += 1;
  const titleBoost = titleHits * 0.25;

  // Confidence + popularity boost.
  const confidenceBoost = (item.confidence / 100) * 0.2;
  const popularityBoost = Math.min(item.useCount, 50) / 500; // cap at 50 uses → 0.1

  return overlapScore + titleBoost + confidenceBoost + popularityBoost;
}

/** Build a short snippet from content around the first query hit. */
function buildSnippet(content: string, queryTokens: string[]): string {
  const lower = content.toLowerCase();
  let hitIdx = -1;
  for (const q of queryTokens) {
    const idx = lower.indexOf(q);
    if (idx >= 0 && (hitIdx < 0 || idx < hitIdx)) hitIdx = idx;
  }
  if (hitIdx < 0) return content.slice(0, 240);
  const start = Math.max(0, hitIdx - 80);
  const end = Math.min(content.length, hitIdx + 200);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  return prefix + content.slice(start, end) + suffix;
}

/**
 * Retrieve memory items relevant to a query.
 *
 * @param opts.items — full set of available items (caller filters by userId + scope)
 * @param opts.query — natural-language task description
 * @param opts.limit — max hits to return (default 6)
 * @param opts.minScore — drop items below this score (default 0.05)
 */
export function retrieveMemory(opts: {
  items: KnowledgeBaseItem[];
  query: string;
  limit?: number;
  minScore?: number;
}): MemoryHit[] {
  const { items, query, limit = 6, minScore = 0.05 } = opts;
  if (items.length === 0) return [];

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const scored = items
    .map((item) => ({ item, score: scoreItem(item, queryTokens) }))
    .filter((x) => x.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ item, score }) => ({
    id: item.id,
    title: item.title,
    snippet: buildSnippet(item.content, queryTokens),
    source: item.source,
    scope: item.scope,
    confidence: item.confidence,
    score: Math.min(1, score),
  }));
}

/** Filter items by an allowed scope list. */
export function filterByScope(
  items: KnowledgeBaseItem[],
  allowedScopes: string[],
): KnowledgeBaseItem[] {
  return items.filter((it) => allowedScopes.includes(it.scope) || it.scope === "all");
}

/**
 * Main entry — given a user's full KB items, an employee's department, and a
 * task description, return the top relevant memory hits.
 *
 * In demo mode, callers should pass `MOCK_KNOWLEDGE_BASE` (or a user-filtered slice).
 * With a real DB, pass `db.select().from(knowledgeBaseItems).where(eq(userId, ...))`.
 */
export function retrieveMemoryForTask(opts: {
  allItems: KnowledgeBaseItem[];
  department: Department;
  query: string;
  limit?: number;
}): MemoryHit[] {
  const allowedScopes = buildMemoryScope(opts.department);
  const scoped = filterByScope(opts.allItems, allowedScopes);
  return retrieveMemory({
    items: scoped,
    query: opts.query,
    limit: opts.limit,
  });
}

/**
 * Format memory hits as a context block the LLM can use.
 * Prepended to the system prompt when running an employee.
 */
export function formatMemoryForPrompt(hits: MemoryHit[]): string {
  if (hits.length === 0) return "";
  const lines = hits.map(
    (h) =>
      `- [${h.source}/${h.scope}] ${h.title} (confidence ${h.confidence}%): ${h.snippet}`,
  );
  return `\n\n## Business Memory (relevant context)\n${lines.join("\n")}\n\nUse this context to make your output specific to the user's business. Cite the memory items you used when relevant.`;
}

/** Mark a memory item as recently used (bump useCount + lastUsedAt). */
export function recordMemoryUsage(item: KnowledgeBaseItem): Partial<KnowledgeBaseItem> {
  return {
    useCount: item.useCount + 1,
    lastUsedAt: new Date().toISOString(),
  };
}

/** Whether the memory system is available (always true; just signals demo). */
export function isMemoryReady(): boolean {
  return isDemoMode() || true;
}