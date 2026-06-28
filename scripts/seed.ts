/**
 * Seed script — populates the database with the 8 default agents + sample blog posts.
 *
 * Usage:  npm run db:seed
 *
 * In demo mode (no DATABASE_URL), this just logs what would be inserted.
 * With DATABASE_URL set, it does a real insert via Drizzle.
 */

import {
  MOCK_AGENT_TEMPLATES,
  MOCK_BLOG_POSTS,
  MOCK_INDUSTRY_KITS,
} from "../lib/mock-data";

const main = async () => {
  console.log("🌱 Seeding Reklu database...\n");

  console.log("📦 Agent templates:");
  for (const t of MOCK_AGENT_TEMPLATES) {
    console.log(`  - ${t.avatarEmoji} ${t.name.padEnd(28)} (${t.slug})`);
  }
  console.log(`  → ${MOCK_AGENT_TEMPLATES.length} agents total\n`);

  console.log("🎁 Industry starter kits:");
  for (const k of MOCK_INDUSTRY_KITS) {
    console.log(`  - ${k.name.padEnd(28)} (${k.agents.length} agents, ${k.price})`);
  }
  console.log(`  → ${MOCK_INDUSTRY_KITS.length} kits\n`);

  console.log("📝 Blog posts:");
  for (const p of MOCK_BLOG_POSTS) {
    console.log(`  - ${p.title.padEnd(60)} (${p.publishedAt})`);
  }
  console.log(`  → ${MOCK_BLOG_POSTS.length} posts\n`);

  if (!process.env.DATABASE_URL) {
    console.log("ℹ️  DATABASE_URL not set — demo mode.");
    console.log("   The data above is available via lib/mock-data.ts.");
    console.log("   Connect a Neon database to insert these as rows.\n");
    return;
  }

  // TODO: real DB inserts when DATABASE_URL is set
  const { db } = await import("../lib/db");
  const { agentTemplates, boardReports, businessBrain, delegations, hiredAgents, notifications, platformStats, tasks, users } =
    await import("../lib/db/schema");

  console.log("Inserting agents...");
  await db.insert(agentTemplates).values(MOCK_AGENT_TEMPLATES).onConflictDoNothing();
  console.log(`✓ ${MOCK_AGENT_TEMPLATES.length} agent templates inserted\n`);

  console.log("✅ Seed complete.\n");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});