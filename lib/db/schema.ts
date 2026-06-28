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