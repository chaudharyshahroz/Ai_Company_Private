import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  bigint,
  boolean,
  date,
  decimal,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────
//  Enums
// ─────────────────────────────────────────────────────────────

export const planEnum = pgEnum("plan", ["free", "starter", "growth", "company"]);
export const planStatusEnum = pgEnum("plan_status", [
  "active",
  "paused",
  "cancelled",
  "trialing",
]);

export const departmentEnum = pgEnum("department", [
  "executive",
  "marketing",
  "sales",
  "operations",
  "support",
  "finance",
  "research",
  "product-website",
  "admin",
  "legal",
]);
export const tierEnum = pgEnum("tier", ["executive", "manager", "employee"]);

export const taskStatusEnum = pgEnum("task_status", [
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
]);
export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "normal",
  "high",
  "urgent",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "generating",
  "ready",
  "sent",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "task_complete",
  "task_failed",
  "agent_alert",
  "board_report",
  "billing",
  "system",
]);

export const userRoleEnum = pgEnum("user_role", ["member", "admin"]);

// ─────────────────────────────────────────────────────────────
//  Users  (synced from Clerk via webhook)
// ─────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique(),
    email: text("email").notNull().unique(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").notNull().default("member"),

    // Subscription
    plan: planEnum("plan").notNull().default("free"),
    planPaddleSubscriptionId: text("plan_paddle_subscription_id"),
    planStatus: planStatusEnum("plan_status").notNull().default("trialing"),

    // Business profile (filled during onboarding)
    businessName: text("business_name"),
    businessType: text("business_type"), // e-commerce, saas, agency, restaurant, other
    businessDescription: text("business_description"),
    businessWebsite: text("business_website"),
    industry: text("industry"),
    targetAudience: text("target_audience"),
    brandVoice: text("brand_voice"), // formal, casual, bold, friendly, professional
    timezone: text("timezone"),

    // Usage
    tasksUsedThisMonth: integer("tasks_used_this_month").notNull().default(0),
    tasksLimit: integer("tasks_limit").notNull().default(50),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    clerkIdx: uniqueIndex("users_clerk_idx").on(t.clerkId),
    planIdx: index("users_plan_idx").on(t.plan),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Agent Templates  (pre-built by admin, shown in marketplace)
// ─────────────────────────────────────────────────────────────

export const agentTemplates = pgTable(
  "agent_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // "Aria — Content Writer"
    slug: text("slug").notNull().unique(),
    role: text("role").notNull(), // "Content Writer"
    department: departmentEnum("department").notNull(),
    tier: tierEnum("tier").notNull(),
    avatarEmoji: text("avatar_emoji"), // "✍️"
    avatarColor: text("avatar_color"), // gradient string
    description: text("description").notNull(),
    capabilities: jsonb("capabilities").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    systemPrompt: text("system_prompt").notNull(), // the actual AI system prompt
    model: text("model").notNull().default("anthropic/claude-3.5-sonnet"),
    isActive: boolean("is_active").notNull().default(true),
    isFeatured: boolean("is_featured").notNull().default(false),
    monthlyPriceUsd: decimal("monthly_price_usd", { precision: 8, scale: 2 }),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("agent_templates_slug_idx").on(t.slug),
    departmentIdx: index("agent_templates_department_idx").on(t.department),
    activeIdx: index("agent_templates_active_idx").on(t.isActive),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Hired Agents  (a user has hired this template)
// ─────────────────────────────────────────────────────────────

export const hiredAgents = pgTable(
  "hired_agents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    templateId: uuid("template_id")
      .notNull()
      .references(() => agentTemplates.id, { onDelete: "restrict" }),
    customName: text("custom_name"),
    customInstructions: text("custom_instructions"),
    isActive: boolean("is_active").notNull().default(true),
    hiredAt: timestamp("hired_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true, mode: "string" }),
  },
  (t) => ({
    userIdx: index("hired_agents_user_idx").on(t.userId),
    userTemplateIdx: uniqueIndex("hired_agents_user_template_idx").on(
      t.userId,
      t.templateId,
    ),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Business Brain  (company memory; one per user)
// ─────────────────────────────────────────────────────────────

export const businessBrain = pgTable("business_brain", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  products: jsonb("products")
    .$type<Array<{ name: string; description: string; price?: string; url?: string }>>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  competitors: jsonb("competitors")
    .$type<Array<{ name: string; url: string; notes?: string }>>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  targetKeywords: text("target_keywords")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  usp: text("usp"),
  toneExamples: text("tone_examples")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  keyMilestones: jsonb("key_milestones")
    .$type<Array<{ date: string; event: string }>>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  customContext: text("custom_context"),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────
//  Tasks  (the unit of work — agent runs a task)
// ─────────────────────────────────────────────────────────────

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hiredAgentId: uuid("hired_agent_id")
      .notNull()
      .references(() => hiredAgents.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default("queued"),
    priority: taskPriorityEnum("priority").notNull().default("normal"),

    input: jsonb("input").$type<Record<string, unknown>>(),
    output: text("output"),
    outputMetadata: jsonb("output_metadata").$type<{
      wordCount?: number;
      modelUsed?: string;
      tokens?: { input: number; output: number };
      durationMs?: number;
    }>(),

    modelUsed: text("model_used"),
    tokensUsed: integer("tokens_used"),
    durationMs: integer("duration_ms"),
    errorMessage: text("error_message"),

    scheduledAt: timestamp("scheduled_at", { withTimezone: true, mode: "string" }),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "string" }),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("tasks_user_idx").on(t.userId),
    statusIdx: index("tasks_status_idx").on(t.status),
    hiredAgentIdx: index("tasks_hired_agent_idx").on(t.hiredAgentId),
    createdIdx: index("tasks_created_idx").on(t.createdAt),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Delegations  (agent-to-agent handoffs)
// ─────────────────────────────────────────────────────────────

export const delegations = pgTable("delegations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fromAgentId: uuid("from_agent_id")
    .notNull()
    .references(() => hiredAgents.id, { onDelete: "cascade" }),
  toAgentId: uuid("to_agent_id")
    .notNull()
    .references(() => hiredAgents.id, { onDelete: "cascade" }),
  parentTaskId: uuid("parent_task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  childTaskId: uuid("child_task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────
//  Board Reports  (weekly AI-generated executive summaries)
// ─────────────────────────────────────────────────────────────

export const boardReports = pgTable(
  "board_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    weekStart: date("week_start").notNull(),
    weekEnd: date("week_end").notNull(),
    summary: text("summary").notNull(),
    tasksCompleted: integer("tasks_completed").notNull().default(0),
    tasksFailed: integer("tasks_failed").notNull().default(0),
    topOutputs: jsonb("top_outputs")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    agentPerformance: jsonb("agent_performance")
      .$type<Record<string, { completed: number; failed: number; avgDurationMs: number }>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    recommendations: text("recommendations")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    status: reportStatusEnum("status").notNull().default("generating"),
    sentAt: timestamp("sent_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (t) => ({
    userWeekIdx: uniqueIndex("board_reports_user_week_idx").on(t.userId, t.weekStart),
    userCreatedIdx: index("board_reports_user_created_idx").on(t.userId, t.createdAt),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Notifications
// ─────────────────────────────────────────────────────────────

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    actionUrl: text("action_url"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("notifications_user_idx").on(t.userId),
    userUnreadIdx: index("notifications_user_unread_idx").on(t.userId, t.isRead),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Platform Stats  (admin — daily aggregates)
// ─────────────────────────────────────────────────────────────

export const platformStats = pgTable("platform_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull().unique(),
  newUsers: integer("new_users").notNull().default(0),
  activeUsers: integer("active_users").notNull().default(0),
  tasksRun: integer("tasks_run").notNull().default(0),
  tokensUsed: bigint("tokens_used", { mode: "number" }).notNull().default(0),
  revenueUsd: decimal("revenue_usd", { precision: 12, scale: 2 }).notNull().default("0"),
  churnCount: integer("churn_count").notNull().default(0),
});

// ─────────────────────────────────────────────────────────────
//  Relations  (typed joins for Drizzle's relational queries)
// ─────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  brain: one(businessBrain, {
    fields: [users.id],
    references: [businessBrain.userId],
  }),
  hiredAgents: many(hiredAgents),
  tasks: many(tasks),
  notifications: many(notifications),
  boardReports: many(boardReports),
}));

export const hiredAgentsRelations = relations(hiredAgents, ({ one, many }) => ({
  user: one(users, { fields: [hiredAgents.userId], references: [users.id] }),
  template: one(agentTemplates, {
    fields: [hiredAgents.templateId],
    references: [agentTemplates.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  hiredAgent: one(hiredAgents, {
    fields: [tasks.hiredAgentId],
    references: [hiredAgents.id],
  }),
  delegationsFrom: many(delegations, { relationName: "delegationsFrom" }),
  delegationsTo: many(delegations, { relationName: "delegationsTo" }),
}));

export const delegationsRelations = relations(delegations, ({ one }) => ({
  fromAgent: one(hiredAgents, {
    fields: [delegations.fromAgentId],
    references: [hiredAgents.id],
    relationName: "delegationsFrom",
  }),
  toAgent: one(hiredAgents, {
    fields: [delegations.toAgentId],
    references: [hiredAgents.id],
    relationName: "delegationsTo",
  }),
  parentTask: one(tasks, {
    fields: [delegations.parentTaskId],
    references: [tasks.id],
  }),
  childTask: one(tasks, {
    fields: [delegations.childTaskId],
    references: [tasks.id],
  }),
}));

// ─────────────────────────────────────────────────────────────
//  Inferred types  (use these in your app code)
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
//  Business DNA  (the foundation of every AI output)
//  One per user. Stored structured so prompts can reference it.
// ─────────────────────────────────────────────────────────────

export const businessStageEnum = pgEnum("business_stage", [
  "idea",
  "validating",
  "launching",
  "growing",
  "scaling",
]);

export const businessDna = pgTable(
  "business_dna",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),

    // Source mode (how this DNA was created)
    sourceMode: text("source_mode").notNull().default("start_new"), // start_new | grow_existing | hire_ai_company

    // Overview
    businessName: text("business_name"),
    tagline: text("tagline"),
    businessIdea: text("business_idea"),
    industry: text("industry"),
    businessType: text("business_type"), // online | physical | hybrid
    country: text("country"),
    city: text("city"),
    market: text("market"), // local | regional | national | global
    stage: businessStageEnum("stage").notNull().default("idea"),

    // Customer
    targetCustomer: text("target_customer"),
    customerPainPoints: jsonb("customer_pain_points")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    customerDemographics: text("customer_demographics"),

    // Offer
    mainOffer: text("main_offer"),
    priceRange: text("price_range"), // e.g. "$500-$2000"
    revenueTarget: text("revenue_target"),

    // Brand
    brandTone: text("brand_tone"), // bold | calm | playful | premium | friendly
    brandVoiceNotes: text("brand_voice_notes"),

    // Assets
    websiteUrl: text("website_url"),
    socialLinks: jsonb("social_links")
      .$type<Record<string, string>>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    // Competitors
    competitors: jsonb("competitors")
      .$type<Array<{ name: string; url?: string; notes?: string }>>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    // Goals & problems
    mainGoal: text("main_goal"),
    currentProblems: jsonb("current_problems")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    budget: text("budget"),
    timeline: text("timeline"),
    skillLevel: text("skill_level"), // beginner | intermediate | advanced
    preferredChannels: jsonb("preferred_channels")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    // AI-generated fields (populated by OpenRouter when user runs "Improve DNA")
    aiSummary: text("ai_summary"),
    aiRecommendedNiche: text("ai_recommended_niche"),
    aiRecommendedPositioning: text("ai_recommended_positioning"),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: uniqueIndex("business_dna_user_idx").on(t.userId),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Business Score  (0-100 score across 7 dimensions)
// ─────────────────────────────────────────────────────────────

export const scoreVerdictEnum = pgEnum("score_verdict", [
  "strong_opportunity",
  "good_needs_positioning",
  "difficult_market",
  "too_generic",
  "needs_niche_focus",
]);

export const businessScores = pgTable(
  "business_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Sub-scores (0-100)
    overall: integer("overall").notNull(),
    demand: integer("demand").notNull(),
    competition: integer("competition").notNull(), // higher = less competition
    differentiation: integer("differentiation").notNull(),
    profitPotential: integer("profit_potential").notNull(),
    launchDifficulty: integer("launch_difficulty").notNull(), // higher = easier
    growthPotential: integer("growth_potential").notNull(),
    riskScore: integer("risk_score").notNull(), // higher = lower risk

    verdict: scoreVerdictEnum("verdict").notNull(),
    canIWinAnswer: text("can_i_win_answer").notNull(), // AI-generated honest assessment

    breakdown: jsonb("breakdown")
      .$type<Array<{ dimension: string; score: number; note: string }>>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("business_scores_user_idx").on(t.userId),
    userCreatedIdx: index("business_scores_user_created_idx").on(t.userId, t.createdAt),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Offers  (generated by Offer Builder)
// ─────────────────────────────────────────────────────────────

export const offers = pgTable(
  "offers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    offerName: text("offer_name").notNull(),
    promise: text("promise"),
    targetCustomer: text("target_customer"),

    // Tiered packages
    packages: jsonb("packages")
      .$type<
        Array<{
          name: string; // Starter / Growth / Premium
          price: string;
          bestFor: string;
          features: string[];
          outcome: string;
          cta: string;
        }>
      >()
      .notNull()
      .default(sql`'[]'::jsonb`),

    salesPitch: text("sales_pitch"),
    coldDmScript: text("cold_dm_script"),
    whatsappPitch: text("whatsapp_pitch"),
    emailPitch: text("email_pitch"),
    landingHeadline: text("landing_headline"),
    guarantee: text("guarantee"),
    bonuses: jsonb("bonuses")
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("offers_user_idx").on(t.userId),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Growth Roadmap  (7 / 30 / 90-day plans)
// ─────────────────────────────────────────────────────────────

export const roadmapKindEnum = pgEnum("roadmap_kind", ["launch_7", "growth_30", "scaling_90"]);

export const growthRoadmaps = pgTable(
  "growth_roadmaps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    kind: roadmapKindEnum("kind").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),

    items: jsonb("items")
      .$type<
        Array<{
          day: number;
          task: string;
          objective: string;
          whyItMatters: string;
          department: string;
          employee: string;
          difficulty: "easy" | "medium" | "hard";
          expectedResult: string;
          status: "todo" | "in_progress" | "done";
        }>
      >()
      .notNull()
      .default(sql`'[]'::jsonb`),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("growth_roadmaps_user_idx").on(t.userId),
    userKindIdx: index("growth_roadmaps_user_kind_idx").on(t.userId, t.kind),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Weekly Tasks  (the AI CEO's "next best actions")
// ─────────────────────────────────────────────────────────────

export const weeklyTasks = pgTable(
  "weekly_tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    weekStart: date("week_start").notNull(),
    task: text("task").notNull(),
    reason: text("reason").notNull(),
    expectedResult: text("expected_result").notNull(),
    assignedDepartment: text("assigned_department").notNull(),
    dueDate: date("due_date"),
    status: text("status").notNull().default("todo"), // todo | in_progress | done | skipped
    oneClickAction: text("one_click_action"), // route to deep-link
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("weekly_tasks_user_idx").on(t.userId),
    userWeekIdx: index("weekly_tasks_user_week_idx").on(t.userId, t.weekStart),
  }),
);

// ─────────────────────────────────────────────────────────────
//  Relations — extend usersRelations to include new tables
// ─────────────────────────────────────────────────────────────

export const businessDnaRelations = relations(businessDna, ({ one }) => ({
  user: one(users, { fields: [businessDna.userId], references: [users.id] }),
}));

export const businessScoresRelations = relations(businessScores, ({ one }) => ({
  user: one(users, { fields: [businessScores.userId], references: [users.id] }),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  user: one(users, { fields: [offers.userId], references: [users.id] }),
}));

export const growthRoadmapsRelations = relations(growthRoadmaps, ({ one }) => ({
  user: one(users, { fields: [growthRoadmaps.userId], references: [users.id] }),
}));

export const weeklyTasksRelations = relations(weeklyTasks, ({ one }) => ({
  user: one(users, { fields: [weeklyTasks.userId], references: [users.id] }),
}));

// ─────────────────────────────────────────────────────────────
//  Inferred types  (use these in your app code)
// ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AgentTemplate = typeof agentTemplates.$inferSelect;
export type NewAgentTemplate = typeof agentTemplates.$inferInsert;
export type HiredAgent = typeof hiredAgents.$inferSelect;
export type NewHiredAgent = typeof hiredAgents.$inferInsert;
export type BusinessBrain = typeof businessBrain.$inferSelect;
export type NewBusinessBrain = typeof businessBrain.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Delegation = typeof delegations.$inferSelect;
export type BoardReport = typeof boardReports.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type PlatformStat = typeof platformStats.$inferSelect;
export type BusinessDna = typeof businessDna.$inferSelect;
export type NewBusinessDna = typeof businessDna.$inferInsert;
export type BusinessScore = typeof businessScores.$inferSelect;
export type NewBusinessScore = typeof businessScores.$inferInsert;
export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
export type GrowthRoadmap = typeof growthRoadmaps.$inferSelect;
export type NewGrowthRoadmap = typeof growthRoadmaps.$inferInsert;
export type WeeklyTask = typeof weeklyTasks.$inferSelect;
export type NewWeeklyTask = typeof weeklyTasks.$inferInsert;

// ─────────────────────────────────────────────────────────────
//  Phase 3 — AI Company Engine
//  Mission → Goal → Department Goal → Task → Work Review → Approval
// ─────────────────────────────────────────────────────────────

// ─── Enums ───────────────────────────────────────────────────

export const missionCadenceEnum = pgEnum("mission_cadence", [
  "ongoing",
  "quarterly",
  "monthly",
  "yearly",
]);

export const goalStatusEnum = pgEnum("goal_status", [
  "draft",
  "planning",
  "active",
  "in_progress",
  "completed",
  "paused",
  "archived",
]);

export const goalHorizonEnum = pgEnum("goal_horizon", [
  "30_day",
  "90_day",
  "annual",
]);

export const workReviewStatusEnum = pgEnum("work_review_status", [
  "needs_approval",
  "ready_to_send",
  "ready_to_publish",
  "ready_to_save",
  "completed",
  "rejected",
  "regenerating",
]);

export const workReviewKindEnum = pgEnum("work_review_kind", [
  "draft",
  "research",
  "outreach",
  "content",
  "analysis",
  "reply",
  "report",
  "plan",
  "campaign",
  "legal_draft",
  "finance_draft",
]);

export const approvalActionEnum = pgEnum("approval_action", [
  "approve",
  "reject",
  "edit",
  "regenerate",
  "save_to_kb",
  "send",
  "publish",
  "assign_to_other",
]);

export const agentRunStatusEnum = pgEnum("agent_run_status", [
  "queued",
  "running",
  "evaluating",
  "completed",
  "failed",
  "cancelled",
  "needs_approval",
  "rejected",
]);

export const knowledgeSourceEnum = pgEnum("knowledge_source", [
  "user_added",
  "ai_generated",
  "document",
  "approved_work",
  "url",
  "crm",
  "conversation",
]);

export const scheduledWorkFrequencyEnum = pgEnum("scheduled_work_frequency", [
  "hourly",
  "daily",
  "weekly",
  "biweekly",
  "monthly",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "company_created",
  "company_updated",
  "mission_set",
  "goal_created",
  "goal_archived",
  "plan_generated",
  "plan_approved",
  "plan_rejected",
  "task_created",
  "task_assigned",
  "task_run",
  "task_completed",
  "task_failed",
  "work_review_created",
  "work_review_approved",
  "work_review_rejected",
  "work_review_regenerated",
  "work_review_saved_to_kb",
  "work_review_sent",
  "work_review_published",
  "employee_hired",
  "employee_paused",
  "employee_deleted",
  "employee_permission_changed",
  "employee_budget_changed",
  "scheduled_work_enabled",
  "scheduled_work_disabled",
  "scheduled_work_executed",
  "credits_used",
  "credits_budget_reached",
  "integration_connected",
  "integration_disconnected",
  "billing_changed",
  "plan_changed",
  "knowledge_item_added",
  "knowledge_item_deleted",
]);

// ─── Company Missions ────────────────────────────────────────

export const companyMissions = pgTable(
  "company_missions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),

    mission: text("mission").notNull(), // "Get 50 qualified leads per month"
    vision: text("vision"), // longer narrative
    cadence: missionCadenceEnum("cadence").notNull().default("ongoing"),
    northStarMetric: text("north_star_metric"), // e.g. "qualified_leads_per_month"
    northStarTarget: text("north_star_target"),

    values: jsonb("values").$type<string[]>().notNull().default(sql`'[]'::jsonb`),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: uniqueIndex("company_missions_user_idx").on(t.userId),
  }),
);

// ─── Company Goals ───────────────────────────────────────────

export const companyGoals = pgTable(
  "company_goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    missionId: uuid("mission_id").references(() => companyMissions.id, {
      onDelete: "set null",
    }),

    title: text("title").notNull(),
    description: text("description"),
    horizon: goalHorizonEnum("horizon").notNull().default("30_day"),
    status: goalStatusEnum("status").notNull().default("draft"),

    successMetric: text("success_metric"), // "qualified leads"
    successTarget: text("success_target"), // "100"

    // Progress (0-100)
    progressPct: integer("progress_pct").notNull().default(0),

    // The CEO-generated plan, stored as JSON
    ceoPlan: jsonb("ceo_plan")
      .$type<{
        rationale: string;
        risks: string[];
        departmentBreakdown: Array<{
          department: string;
          tasks: Array<{
            title: string;
            objective: string;
            suggestedEmployeeSlug: string;
            suggestedSkill: string;
            estimatedCredits: number;
            requiresApproval: boolean;
            scheduledWithinDays: number;
          }>;
        }>;
      }>()
      .default(sql`'{}'::jsonb`),

    planApprovedAt: timestamp("plan_approved_at", { withTimezone: true, mode: "string" }),
    planApprovedBy: text("plan_approved_by"), // "user" | "auto"

    dueDate: date("due_date"),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: "string" }),
    archivedAt: timestamp("archived_at", { withTimezone: true, mode: "string" }),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("company_goals_user_idx").on(t.userId),
    userStatusIdx: index("company_goals_user_status_idx").on(t.userId, t.status),
  }),
);

// ─── Department Goals ────────────────────────────────────────

export const departmentGoals = pgTable(
  "department_goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyGoalId: uuid("company_goal_id")
      .notNull()
      .references(() => companyGoals.id, { onDelete: "cascade" }),
    department: departmentEnum("department").notNull(),

    objective: text("objective").notNull(),
    metric: text("metric"),
    targetValue: text("target_value"),

    progressPct: integer("progress_pct").notNull().default(0),
    status: goalStatusEnum("status").notNull().default("active"),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    goalIdx: index("department_goals_goal_idx").on(t.companyGoalId),
    userDeptIdx: index("department_goals_user_dept_idx").on(t.userId, t.department),
  }),
);

// ─── Work Review Items (the approval queue) ──────────────────

export const workReviewItems = pgTable(
  "work_review_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Links
    taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
    goalId: uuid("goal_id").references(() => companyGoals.id, { onDelete: "set null" }),
    departmentGoalId: uuid("department_goal_id").references(() => departmentGoals.id, {
      onDelete: "set null",
    }),
    agentRunId: uuid("agent_run_id"), // self-ref after AgentRun created
    hiredAgentId: uuid("hired_agent_id").references(() => hiredAgents.id, {
      onDelete: "set null",
    }),

    // Identifiers for human display
    title: text("title").notNull(),
    summary: text("summary").notNull(), // 1-2 sentence summary
    body: text("body").notNull(), // full structured output (markdown)
    bodyStructured: jsonb("body_structured")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`),

    kind: workReviewKindEnum("kind").notNull().default("draft"),
    status: workReviewStatusEnum("status").notNull().default("needs_approval"),
    priority: taskPriorityEnum("priority").notNull().default("normal"),

    employeeName: text("employee_name").notNull(), // "Aria — Content Writer"
    employeeSlug: text("employee_slug").notNull(),
    department: departmentEnum("department").notNull(),

    // Evaluation
    qualityScore: integer("quality_score"), // 0-100
    relevanceScore: integer("relevance_score"),
    safetyScore: integer("safety_score"),
    confidenceScore: integer("confidence_score"),
    evaluatorNotes: text("evaluator_notes"),
    regenerationCount: integer("regeneration_count").notNull().default(0),

    // Cost & approval gating
    creditsEstimated: integer("credits_estimated").notNull().default(0),
    requiresApproval: boolean("requires_approval").notNull().default(true),
    approvalReason: text("approval_reason"),

    suggestedNextAction: text("suggested_next_action"),

    approvedAt: timestamp("approved_at", { withTimezone: true, mode: "string" }),
    rejectedAt: timestamp("rejected_at", { withTimezone: true, mode: "string" }),
    publishedAt: timestamp("published_at", { withTimezone: true, mode: "string" }),
    sentAt: timestamp("sent_at", { withTimezone: true, mode: "string" }),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userStatusIdx: index("work_review_user_status_idx").on(t.userId, t.status),
    userCreatedIdx: index("work_review_user_created_idx").on(t.userId, t.createdAt),
    goalIdx: index("work_review_goal_idx").on(t.goalId),
    taskIdx: index("work_review_task_idx").on(t.taskId),
  }),
);

// ─── Approvals (action history on a review item) ─────────────

export const approvals = pgTable(
  "approvals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workReviewItemId: uuid("work_review_item_id")
      .notNull()
      .references(() => workReviewItems.id, { onDelete: "cascade" }),

    action: approvalActionEnum("action").notNull(),
    actor: text("actor").notNull().default("user"), // user | ai | system
    note: text("note"),

    // For "edit" actions
    editedTitle: text("edited_title"),
    editedBody: text("edited_body"),

    // For "regenerate" — which employee
    regenerateWithEmployeeSlug: text("regenerate_with_employee_slug"),
    regenerateWithInstructions: text("regenerate_with_instructions"),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    itemIdx: index("approvals_item_idx").on(t.workReviewItemId),
    userIdx: index("approvals_user_idx").on(t.userId),
  }),
);

// ─── Agent Runs (every AI invocation) ────────────────────────

export const agentRuns = pgTable(
  "agent_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyId: uuid("company_id"), // nullable until missions are migrated
    hiredAgentId: uuid("hired_agent_id").references(() => hiredAgents.id, {
      onDelete: "set null",
    }),
    taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
    goalId: uuid("goal_id").references(() => companyGoals.id, { onDelete: "set null" }),
    workReviewItemId: uuid("work_review_item_id").references(() => workReviewItems.id, {
      onDelete: "set null",
    }),
    scheduledWorkId: uuid("scheduled_work_id"), // self-ref

    employeeSlug: text("employee_slug").notNull(),
    employeeName: text("employee_name").notNull(),
    department: text("department").notNull(),

    modelProvider: text("model_provider").notNull().default("openrouter"),
    modelName: text("model_name").notNull(),
    promptVersion: text("prompt_version").notNull().default("v1"),

    input: jsonb("input").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
    memoryUsed: jsonb("memory_used")
      .$type<Array<{ source: string; title: string; snippet: string }>>()
      .default(sql`'[]'::jsonb`),
    toolsUsed: jsonb("tools_used")
      .$type<Array<{ tool: string; result?: unknown }>>()
      .default(sql`'[]'::jsonb`),
    output: text("output"),
    outputStructured: jsonb("output_structured").$type<Record<string, unknown>>(),

    evaluatorResult: jsonb("evaluator_result")
      .$type<{
        qualityScore?: number;
        relevanceScore?: number;
        safetyScore?: number;
        confidenceScore?: number;
        notes?: string;
        passed?: boolean;
      }>()
      .default(sql`'{}'::jsonb`),

    creditsEstimated: integer("credits_estimated").notNull().default(0),
    creditsActual: integer("credits_actual").notNull().default(0),

    durationMs: integer("duration_ms").notNull().default(0),
    status: agentRunStatusEnum("status").notNull().default("queued"),
    errorMessage: text("error_message"),
    errorStack: text("error_stack"),

    startedAt: timestamp("started_at", { withTimezone: true, mode: "string" }),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: "string" }),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("agent_runs_user_idx").on(t.userId),
    userStatusIdx: index("agent_runs_user_status_idx").on(t.userId, t.status),
    employeeIdx: index("agent_runs_employee_idx").on(t.employeeSlug),
    createdIdx: index("agent_runs_created_idx").on(t.createdAt),
  }),
);

// ─── Agent Run Steps (step-by-step trace) ────────────────────

export const agentRunSteps = pgTable(
  "agent_run_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    agentRunId: uuid("agent_run_id")
      .notNull()
      .references(() => agentRuns.id, { onDelete: "cascade" }),

    stepIndex: integer("step_index").notNull(),
    stepName: text("step_name").notNull(), // "memory_retrieval" | "planner" | "tool_call" | "evaluator"
    startedAt: timestamp("started_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: "string" }),
    durationMs: integer("duration_ms").notNull().default(0),

    input: jsonb("input").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
    output: jsonb("output").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),

    status: text("status").notNull().default("running"), // running | completed | failed
    errorMessage: text("error_message"),
  },
  (t) => ({
    runIdx: index("agent_run_steps_run_idx").on(t.agentRunId, t.stepIndex),
  }),
);

// ─── Knowledge Base Items (real semantic memory) ─────────────

export const knowledgeBaseItems = pgTable(
  "knowledge_base_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    content: text("content").notNull(),
    source: knowledgeSourceEnum("source").notNull().default("user_added"),
    sourceRef: text("source_ref"), // doc id, url, workReviewItemId, etc.

    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    scope: text("scope").notNull().default("all"), // all | sales | support | marketing | ...

    // For semantic search — JSON-stored embedding (vector type added in pg migration).
    // In demo mode we use keyword-overlap scoring.
    embedding: jsonb("embedding").$type<number[]>(),

    trainingWeight: integer("training_weight").notNull().default(50), // 0-100, higher = employee values this more
    confidence: integer("confidence").notNull().default(80),

    createdBy: text("created_by").notNull().default("user"), // user | ai
    lastUsedAt: timestamp("last_used_at", { withTimezone: true, mode: "string" }),
    useCount: integer("use_count").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("kb_user_idx").on(t.userId),
    userScopeIdx: index("kb_user_scope_idx").on(t.userId, t.scope),
  }),
);

// ─── Scheduled Work (heartbeats) ─────────────────────────────

export const scheduledWork = pgTable(
  "scheduled_work",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hiredAgentId: uuid("hired_agent_id").references(() => hiredAgents.id, {
      onDelete: "cascade",
    }),
    employeeSlug: text("employee_slug").notNull(),
    employeeName: text("employee_name").notNull(),

    title: text("title").notNull(),
    description: text("description"),

    frequency: scheduledWorkFrequencyEnum("frequency").notNull().default("daily"),
    timeOfDay: text("time_of_day").notNull().default("09:00"), // HH:mm
    dayOfWeek: integer("day_of_week"), // 0-6 for weekly
    dayOfMonth: integer("day_of_month"), // 1-31 for monthly
    timezone: text("timezone").notNull().default("UTC"),

    taskTemplate: jsonb("task_template")
      .$type<{
        title: string;
        description: string;
        input?: Record<string, unknown>;
      }>()
      .notNull(),

    isEnabled: boolean("is_enabled").notNull().default(true),
    requiresApproval: boolean("requires_approval").notNull().default(true),
    budgetPerRun: integer("budget_per_run").notNull().default(100), // credits

    lastRunAt: timestamp("last_run_at", { withTimezone: true, mode: "string" }),
    lastRunStatus: text("last_run_status"),
    nextRunAt: timestamp("next_run_at", { withTimezone: true, mode: "string" }),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("scheduled_work_user_idx").on(t.userId),
    userEnabledIdx: index("scheduled_work_user_enabled_idx").on(t.userId, t.isEnabled),
  }),
);

// ─── Credit Balances ─────────────────────────────────────────

export const creditBalances = pgTable(
  "credit_balances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),

    monthlyAllowance: integer("monthly_allowance").notNull().default(10000),
    monthlyUsed: integer("monthly_used").notNull().default(0),
    rollover: integer("rollover").notNull().default(0),

    planTier: text("plan_tier").notNull().default("growth"),
    periodStart: date("period_start").notNull(),
    periodEnd: date("period_end").notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: uniqueIndex("credit_balances_user_idx").on(t.userId),
  }),
);

// ─── Credit Usage Log ────────────────────────────────────────

export const creditUsageLog = pgTable(
  "credit_usage_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    agentRunId: uuid("agent_run_id").references(() => agentRuns.id, {
      onDelete: "set null",
    }),
    employeeSlug: text("employee_slug").notNull(),
    department: text("department"),

    credits: integer("credits").notNull(),
    purpose: text("purpose").notNull(), // "task_run" | "evaluation" | "memory_retrieval"

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("credit_usage_user_idx").on(t.userId),
    createdIdx: index("credit_usage_created_idx").on(t.userId, t.createdAt),
  }),
);

// ─── Audit Logs ──────────────────────────────────────────────

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    actor: text("actor").notNull().default("user"), // user | ai | system
    action: auditActionEnum("action").notNull(),

    targetType: text("target_type"), // "company_goal" | "task" | "work_review" | "employee" | ...
    targetId: text("target_id"),

    metadata: jsonb("metadata").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
    note: text("note"),
    ipAddress: text("ip_address"),

    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("audit_logs_user_idx").on(t.userId),
    actionIdx: index("audit_logs_action_idx").on(t.action),
    createdIdx: index("audit_logs_created_idx").on(t.createdAt),
  }),
);

// ─── Relations ───────────────────────────────────────────────

export const companyMissionsRelations = relations(companyMissions, ({ one, many }) => ({
  user: one(users, { fields: [companyMissions.userId], references: [users.id] }),
  goals: many(companyGoals),
}));

export const companyGoalsRelations = relations(companyGoals, ({ one, many }) => ({
  user: one(users, { fields: [companyGoals.userId], references: [users.id] }),
  mission: one(companyMissions, {
    fields: [companyGoals.missionId],
    references: [companyMissions.id],
  }),
  departmentGoals: many(departmentGoals),
  workReviewItems: many(workReviewItems),
  agentRuns: many(agentRuns),
}));

export const departmentGoalsRelations = relations(departmentGoals, ({ one }) => ({
  user: one(users, { fields: [departmentGoals.userId], references: [users.id] }),
  companyGoal: one(companyGoals, {
    fields: [departmentGoals.companyGoalId],
    references: [companyGoals.id],
  }),
}));

export const workReviewItemsRelations = relations(workReviewItems, ({ one, many }) => ({
  user: one(users, { fields: [workReviewItems.userId], references: [users.id] }),
  task: one(tasks, { fields: [workReviewItems.taskId], references: [tasks.id] }),
  goal: one(companyGoals, {
    fields: [workReviewItems.goalId],
    references: [companyGoals.id],
  }),
  departmentGoal: one(departmentGoals, {
    fields: [workReviewItems.departmentGoalId],
    references: [departmentGoals.id],
  }),
  agentRun: one(agentRuns, {
    fields: [workReviewItems.agentRunId],
    references: [agentRuns.id],
  }),
  hiredAgent: one(hiredAgents, {
    fields: [workReviewItems.hiredAgentId],
    references: [hiredAgents.id],
  }),
  approvals: many(approvals),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  user: one(users, { fields: [approvals.userId], references: [users.id] }),
  workReviewItem: one(workReviewItems, {
    fields: [approvals.workReviewItemId],
    references: [workReviewItems.id],
  }),
}));

export const agentRunsRelations = relations(agentRuns, ({ one, many }) => ({
  user: one(users, { fields: [agentRuns.userId], references: [users.id] }),
  hiredAgent: one(hiredAgents, {
    fields: [agentRuns.hiredAgentId],
    references: [hiredAgents.id],
  }),
  task: one(tasks, { fields: [agentRuns.taskId], references: [tasks.id] }),
  goal: one(companyGoals, {
    fields: [agentRuns.goalId],
    references: [companyGoals.id],
  }),
  workReviewItem: one(workReviewItems, {
    fields: [agentRuns.workReviewItemId],
    references: [workReviewItems.id],
  }),
  steps: many(agentRunSteps),
}));

export const agentRunStepsRelations = relations(agentRunSteps, ({ one }) => ({
  agentRun: one(agentRuns, {
    fields: [agentRunSteps.agentRunId],
    references: [agentRuns.id],
  }),
}));

export const knowledgeBaseItemsRelations = relations(knowledgeBaseItems, ({ one }) => ({
  user: one(users, { fields: [knowledgeBaseItems.userId], references: [users.id] }),
}));

export const scheduledWorkRelations = relations(scheduledWork, ({ one }) => ({
  user: one(users, { fields: [scheduledWork.userId], references: [users.id] }),
  hiredAgent: one(hiredAgents, {
    fields: [scheduledWork.hiredAgentId],
    references: [hiredAgents.id],
  }),
}));

export const creditBalancesRelations = relations(creditBalances, ({ one }) => ({
  user: one(users, { fields: [creditBalances.userId], references: [users.id] }),
}));

export const creditUsageLogRelations = relations(creditUsageLog, ({ one }) => ({
  user: one(users, { fields: [creditUsageLog.userId], references: [users.id] }),
  agentRun: one(agentRuns, {
    fields: [creditUsageLog.agentRunId],
    references: [agentRuns.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));

// ─── Inferred types (Phase 3) ────────────────────────────────

export type CompanyMission = typeof companyMissions.$inferSelect;
export type NewCompanyMission = typeof companyMissions.$inferInsert;
export type CompanyGoal = typeof companyGoals.$inferSelect;
export type NewCompanyGoal = typeof companyGoals.$inferInsert;
export type DepartmentGoal = typeof departmentGoals.$inferSelect;
export type NewDepartmentGoal = typeof departmentGoals.$inferInsert;
export type WorkReviewItem = typeof workReviewItems.$inferSelect;
export type NewWorkReviewItem = typeof workReviewItems.$inferInsert;
export type Approval = typeof approvals.$inferSelect;
export type NewApproval = typeof approvals.$inferInsert;
export type AgentRun = typeof agentRuns.$inferSelect;
export type NewAgentRun = typeof agentRuns.$inferInsert;
export type AgentRunStep = typeof agentRunSteps.$inferSelect;
export type NewAgentRunStep = typeof agentRunSteps.$inferInsert;
export type KnowledgeBaseItem = typeof knowledgeBaseItems.$inferSelect;
export type NewKnowledgeBaseItem = typeof knowledgeBaseItems.$inferInsert;
export type ScheduledWork = typeof scheduledWork.$inferSelect;
export type NewScheduledWork = typeof scheduledWork.$inferInsert;
export type CreditBalance = typeof creditBalances.$inferSelect;
export type NewCreditBalance = typeof creditBalances.$inferInsert;
export type CreditUsageLog = typeof creditUsageLog.$inferSelect;
export type NewCreditUsageLog = typeof creditUsageLog.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;