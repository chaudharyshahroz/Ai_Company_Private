/**
 * Quality evaluator — runs after every important AI employee output.
 *
 * Checks (per spec):
 *   - relevance to the task
 *   - specificity to the company (did it use memory?)
 *   - actionability
 *   - safety (no risky claims, no PII leaks)
 *   - role adherence
 *   - hallucination risk
 *   - generic-ness
 *   - need for sources
 *
 * In demo mode, this is a heuristic over the output text. With a real LLM
 * hooked up, swap `evaluateWithLLM` for an actual evaluator agent call.
 *
 * Flow:
 *   Employee generates → evaluator scores → if poor → regenerate once
 *   → if still poor → send to Work Review with a warning
 */

import type { EvaluatorVerdict, MemoryHit } from "./types";

export interface EvaluateInput {
  output: string;
  taskDescription: string;
  employeeRole: string;
  /** Memory items retrieved for this task — used as a "did we use memory" check. */
  memoryHits: MemoryHit[];
  /** Whether the user explicitly approved similar previous outputs. */
  previouslyApprovedCount?: number;
}

const GENERIC_PHRASES = [
  "in today's fast-paced world",
  "in conclusion",
  "hope this helps",
  "feel free to",
  "as an ai",
  "i'm just an ai",
  "i cannot",
  "as a large language model",
];

const RISKY_CLAIMS = [
  /guaranteed results?/i,
  /100% guaranteed/i,
  /no risk/i,
  /get rich/i,
  /cure[s]? cancer/i,
  /always works/i,
  /never fails/i,
];

const LEGAL_PATTERNS = [
  /\b(terms of service|privacy policy|refund policy)\b/i,
];

export function evaluateOutput(input: EvaluateInput): EvaluatorVerdict {
  const { output, taskDescription, employeeRole, memoryHits } = input;
  const out = output ?? "";
  const task = taskDescription ?? "";

  // ── Quality: length + structure heuristics
  const wordCount = out.split(/\s+/).filter(Boolean).length;
  let quality = 50;
  if (wordCount >= 50 && wordCount <= 2500) quality += 20;
  if (wordCount > 2500) quality += 10; // long but might be padding
  if (out.includes("\n## ") || out.includes("\n### ")) quality += 8; // structured
  if (out.match(/\n[-*]\s+/g)) quality += 4; // has lists

  // ── Relevance: keyword overlap with task description
  const taskTokens = tokenize(task);
  const outTokens = new Set(tokenize(out));
  const overlap = taskTokens.filter((t) => outTokens.has(t)).length;
  const relevanceScore =
    taskTokens.length > 0
      ? Math.min(100, Math.round((overlap / Math.min(taskTokens.length, 30)) * 100))
      : 50;
  if (relevanceScore < 25) quality -= 15;

  // ── Specificity: did it cite / reference memory?
  let specificity = 30;
  if (memoryHits.length > 0) {
    let citedCount = 0;
    for (const hit of memoryHits) {
      const snippetTokens = tokenize(hit.snippet).slice(0, 5);
      if (snippetTokens.some((t) => outTokens.has(t))) citedCount += 1;
    }
    if (citedCount > 0) specificity += 40;
    else specificity += 10;
  }
  if (out.match(/{?(business|company|product)\b/gi)) specificity += 8;
  // Penalty for excessive generic phrases.
  const genericHits = GENERIC_PHRASES.filter((p) => out.toLowerCase().includes(p)).length;
  if (genericHits > 0) {
    quality -= genericHits * 8;
    specificity -= genericHits * 5;
  }

  // ── Safety: risky claims + legal/finance disclaimers
  let safety = 95;
  const risky = RISKY_CLAIMS.filter((rx) => rx.test(out)).length;
  if (risky > 0) safety -= risky * 25;
  const mentionsLegal = LEGAL_PATTERNS.some((rx) => rx.test(out));
  if (
    (employeeRole.toLowerCase().includes("legal") ||
      task.toLowerCase().includes("legal") ||
      task.toLowerCase().includes("terms") ||
      task.toLowerCase().includes("policy")) &&
    !/not legal advice|review with (a|your) (qualified )?lawyer|consult.*lawyer/i.test(out)
  ) {
    safety -= 30;
  }
  if (
    (employeeRole.toLowerCase().includes("finance") ||
      employeeRole.toLowerCase().includes("cfo") ||
      task.toLowerCase().includes("finance") ||
      task.toLowerCase().includes("pricing")) &&
    !/not financial advice|consult.*professional|review with.*accountant/i.test(out)
  ) {
    safety -= 25;
  }

  // ── Confidence: role adherence + presence of "I don't know" markers
  let confidence = 75;
  if (/i (don't|do not) know|cannot determine|insufficient information/i.test(out)) {
    confidence -= 30;
  }
  if (out.match(/{[^}]+}/g)?.length ?? 0 > 0) {
    confidence -= 15; // unfilled placeholders = bad signal
  }

  // ── Sources needed?
  const looksLikeResearch =
    /competitor|market|industry|trend|benchmark/i.test(task) ||
    /competitor|market|industry|trend|benchmark/i.test(employeeRole);
  const hasSources =
    /\bsource[s]?:\s/i.test(out) ||
    /\baccording to\b/i.test(out) ||
    /https?:\/\//.test(out);
  if (looksLikeResearch && !hasSources) {
    confidence -= 10;
    quality -= 5;
  }

  // ── Finalize
  const finalQuality = clamp(quality, 0, 100);
  const finalRelevance = clamp(relevanceScore, 0, 100);
  const finalSafety = clamp(safety, 0, 100);
  const finalConfidence = clamp(confidence, 0, 100);

  const avg = (finalQuality + finalRelevance + finalSafety + finalConfidence) / 4;
  const passed = avg >= 60 && finalSafety >= 70 && finalRelevance >= 30;

  const notes: string[] = [];
  if (genericHits > 0) notes.push(`Output contains ${genericHits} generic phrase(s) — tighten voice.`);
  if (risky > 0) notes.push(`Output makes ${risky} potentially risky claim(s).`);
  if (memoryHits.length > 0 && specificity < 50)
    notes.push("Output does not appear to reference retrieved business memory.");
  if (mentionsLegal && safety < 70) notes.push("Legal output is missing a 'not legal advice' disclaimer.");
  if (looksLikeResearch && !hasSources) notes.push("Research output is missing source citations.");
  if (wordCount < 30) notes.push("Output is very short — may be insufficient.");

  const regenerateReason = !passed
    ? notes[0] ?? `Average score ${avg.toFixed(0)} below threshold of 60.`
    : undefined;

  return {
    qualityScore: finalQuality,
    relevanceScore: finalRelevance,
    safetyScore: finalSafety,
    confidenceScore: finalConfidence,
    passed,
    notes: notes.join(" "),
    regenerateReason,
  };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);
}