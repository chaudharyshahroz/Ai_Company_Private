# REKLU — AI Company Platform
## Complete Full-Stack Build Prompt

---

## PROJECT OVERVIEW

Build **Reklu** — an AI-powered company platform where business owners and startups "hire" AI agents that work 24/7 like real employees. The platform has three distinct layers:

1. **Marketing Website** — a stunning, animated public-facing site that converts visitors
2. **User Dashboard** — where business owners manage their AI company, agents, and results
3. **Admin Panel** — full platform control for the Reklu owner (you)

This is a production-ready SaaS product. Build everything with clean architecture, proper auth, and scalable patterns.

---

## TECH STACK

```
Frontend:        Next.js 14+ (App Router) + TypeScript
Styling:         Tailwind CSS + Framer Motion (animations) + custom SVG
Database:        Neon PostgreSQL + Drizzle ORM
Auth:            Clerk (user auth + admin roles)
AI:              OpenRouter (multi-model: GPT-4o, Claude 3.5, Gemini as fallback)
Payments:        Paddle (Merchant of Record — handles tax globally)
Email:           Resend + React Email templates
File Storage:    Cloudflare R2
Background Jobs: Inngest (for scheduled agent tasks)
Deployment:      Vercel (frontend) + Neon (DB)
UI Components:   shadcn/ui + Radix primitives
Icons:           Lucide React
Charts:          Recharts
```

---

## BRAND & DESIGN SYSTEM

### Identity
- **Product name:** Reklu
- **Tagline:** "Your AI Company. Always Working."
- **Sub-tagline:** "Hire AI agents that research, write, sell, and manage — 24/7, no salary."
- **Voice:** Bold, modern, empowering. Not corporate. Not chatbot-y. Think "your startup just got a team."

### Color Palette
```css
--background:     #0A0A0F    /* near-black background */
--surface:        #111118    /* card surfaces */
--surface-2:      #1A1A26    /* elevated surfaces */
--border:         #2A2A3E    /* subtle borders */
--primary:        #7C5CFC    /* electric purple — main brand */
--primary-light:  #A78BFA    /* lighter purple for hover/glow */
--primary-glow:   rgba(124, 92, 252, 0.25)   /* glow effects */
--accent:         #06D6A0    /* teal/mint — success, highlights */
--accent-warm:    #F72585    /* hot pink — alerts, urgency */
--text-primary:   #F0EEFF    /* near-white */
--text-secondary: #8B8BA8    /* muted text */
--text-tertiary:  #4A4A65    /* very muted */
--gradient-hero:  linear-gradient(135deg, #7C5CFC 0%, #F72585 50%, #06D6A0 100%)
--gradient-card:  linear-gradient(145deg, #1A1A26, #111118)
```

### Typography
```
Headings:   'Cal Sans' or 'Clash Display' (heavy, impactful)
Body:       'Inter' (clean, readable)
Mono/Code:  'JetBrains Mono' (for agent outputs, logs)
```

### Design Principles
- Dark theme only (premium feel)
- Heavy use of glassmorphism for cards (`backdrop-filter: blur(12px)`)
- Subtle purple glow on interactive elements
- Animated gradient borders on featured cards
- Particle/mesh background on hero sections
- All animations via Framer Motion — smooth, 60fps
- Mobile-first responsive

---

## PART 1: DATABASE SCHEMA

```typescript
// schema.ts — Drizzle ORM

// Users (synced from Clerk)
users: {
  id: uuid PRIMARY KEY
  clerk_id: text UNIQUE
  email: text UNIQUE
  name: text
  avatar_url: text
  plan: enum('free', 'starter', 'growth', 'company')
  plan_paddle_subscription_id: text
  plan_status: enum('active', 'paused', 'cancelled', 'trialing')
  business_name: text
  business_type: text  // e-commerce, saas, agency, restaurant, other
  business_description: text
  business_website: text
  industry: text
  target_audience: text
  brand_voice: text    // formal, casual, bold, friendly, professional
  timezone: text
  tasks_used_this_month: integer DEFAULT 0
  tasks_limit: integer DEFAULT 50
  created_at: timestamp
  updated_at: timestamp
}

// Agent Templates (pre-built by admin)
agent_templates: {
  id: uuid PRIMARY KEY
  name: text                  // "Aria — Content Writer"
  slug: text UNIQUE
  role: text                  // "Content Writer"
  department: enum('executive', 'marketing', 'sales', 'operations', 'support', 'finance', 'research')
  tier: enum('executive', 'manager', 'employee')
  avatar_emoji: text          // "✍️"
  avatar_color: text          // gradient string
  description: text
  capabilities: jsonb         // array of capability strings
  system_prompt: text         // the actual AI system prompt for this agent
  model: text                 // default model
  is_active: boolean DEFAULT true
  is_featured: boolean DEFAULT false
  monthly_price_usd: decimal  // pricing per agent (for display)
  sort_order: integer
  created_at: timestamp
}

// User's Hired Agents
hired_agents: {
  id: uuid PRIMARY KEY
  user_id: uuid FK → users
  template_id: uuid FK → agent_templates
  custom_name: text           // user can rename their agent
  custom_instructions: text   // user-specific override instructions
  is_active: boolean DEFAULT true
  hired_at: timestamp
  last_active_at: timestamp
}

// Business Brain (company memory)
business_brain: {
  id: uuid PRIMARY KEY
  user_id: uuid FK → users UNIQUE
  products: jsonb             // array: {name, description, price, url}
  competitors: jsonb          // array: {name, url, notes}
  target_keywords: text[]
  usp: text                   // unique selling proposition
  tone_examples: text[]       // sample copy the AI should match
  key_milestones: jsonb       // array: {date, event}
  custom_context: text        // freeform additional context
  updated_at: timestamp
}

// Agent Tasks
tasks: {
  id: uuid PRIMARY KEY
  user_id: uuid FK → users
  hired_agent_id: uuid FK → hired_agents
  title: text
  description: text
  status: enum('queued', 'running', 'completed', 'failed', 'cancelled')
  priority: enum('low', 'normal', 'high', 'urgent')
  input: jsonb                // user's input/parameters
  output: text                // agent's response
  output_metadata: jsonb      // word count, model used, tokens, etc.
  model_used: text
  tokens_used: integer
  duration_ms: integer
  error_message: text
  scheduled_at: timestamp     // for scheduled tasks
  started_at: timestamp
  completed_at: timestamp
  created_at: timestamp
}

// Agent-to-Agent Delegations
delegations: {
  id: uuid PRIMARY KEY
  user_id: uuid FK → users
  from_agent_id: uuid FK → hired_agents
  to_agent_id: uuid FK → hired_agents
  parent_task_id: uuid FK → tasks
  child_task_id: uuid FK → tasks
  reason: text
  created_at: timestamp
}

// Weekly Board Reports
board_reports: {
  id: uuid PRIMARY KEY
  user_id: uuid FK → users
  week_start: date
  week_end: date
  summary: text               // AI-generated executive summary
  tasks_completed: integer
  tasks_failed: integer
  top_outputs: jsonb          // array of highlight task IDs
  agent_performance: jsonb    // per-agent stats
  recommendations: text[]     // AI recommendations for next week
  status: enum('generating', 'ready', 'sent')
  sent_at: timestamp
  created_at: timestamp
}

// Notifications
notifications: {
  id: uuid PRIMARY KEY
  user_id: uuid FK → users
  type: enum('task_complete', 'task_failed', 'agent_alert', 'board_report', 'billing', 'system')
  title: text
  message: text
  is_read: boolean DEFAULT false
  action_url: text
  created_at: timestamp
}

// Platform Stats (admin)
platform_stats: {
  id: uuid PRIMARY KEY
  date: date UNIQUE
  new_users: integer
  active_users: integer
  tasks_run: integer
  tokens_used: bigint
  revenue_usd: decimal
  churn_count: integer
}
```

---

## PART 2: MARKETING WEBSITE

### File: `app/(marketing)/page.tsx` and related pages

Build a world-class marketing website with these pages and sections:

---

### 2.1 — NAVBAR

```
Component: <Navbar />
- Fixed, glassmorphism: backdrop-blur(16px) + dark semi-transparent bg
- Logo: "Reklu" wordmark + animated spark SVG icon (purple glow)
- Nav links: Features, Agents, Pricing, Blog (smooth scroll or page nav)
- CTA: "Start Free" button — filled purple with glow on hover
- On scroll: subtle border-bottom appears
- Mobile: hamburger → full-screen slide-down menu
- Framer Motion: fade-in on load + stagger nav items
```

---

### 2.2 — HERO SECTION

```
Component: <HeroSection />

Visual:
- Full viewport height
- Background: Animated mesh/particle network SVG (dark, purple nodes connecting)
  Use a canvas or SVG with 60+ floating dots connected by faint lines, slow drift
  animation — like neurons firing. The particle closest to cursor gets a purple glow.
- Large floating orbs: blurred purple and pink gradient circles, slow float animation
  (CSS keyframes, translateY ±30px, 8s ease-in-out infinite)

Content (centered):
- Small badge above headline: 
  ✦ "Now in Beta — Join 500+ founders"
  (pill badge, border glow animation, slow gradient sweep)
  
- Main headline (two lines, massive — 72px desktop):
  "Your AI Company."
  "Always Working." 
  (gradient text: purple → pink → teal, animate gradient position on load)
  
- Sub-headline (20px, text-secondary):
  "Hire AI agents that research markets, write content, chase leads,
   and manage operations — 24/7, without salaries, sick days, or Slack."

- Two CTA buttons:
  Primary: "Build Your AI Company →" (large, filled purple, pulse glow animation)
  Secondary: "Watch 90-sec demo" (ghost border, play icon)

- Social proof row below buttons:
  [Avatar stack of 5 faces] "Join 500+ founders already using Reklu"
  ★★★★★ "4.9/5 from early users"
  
- Hero visual (below or beside content):
  Animated mockup of the dashboard — floating card showing agents working
  3D-tilted screenshot with Framer Motion scroll-driven tilt
  Show 3 agent cards with "status: running" green pulse indicators

Animation sequence:
  1. Badge fades in (delay 0s)
  2. Headline words slide up staggered (delay 0.2s each word)
  3. Sub-headline fades in (delay 0.6s)
  4. Buttons scale in (delay 0.8s)
  5. Social proof slides up (delay 1.0s)
  6. Hero mockup floats in from right (delay 0.4s)
```

---

### 2.3 — SOCIAL PROOF BAR

```
Component: <SocialProofBar />
- Full-width section, subtle top/bottom border
- "Trusted by founders from" + scrolling logo marquee animation
- Infinite horizontal scroll of company/tool logos (Shopify, Webflow, Stripe, 
  Notion, Figma, etc. as SVG icons) — CSS marquee animation, dual-direction
- Framer Motion fade-in on scroll entry
```

---

### 2.4 — PROBLEM SECTION

```
Component: <ProblemSection />
- Headline: "Running a business alone is exhausting."
- Three pain-point cards with animations:
  
  Card 1: "You wear every hat"
  Icon: Animated SVG of multiple hats spinning
  "You're the marketer, researcher, writer, salesperson, and support team. 
   All at once. It never stops."
   
  Card 2: "Tools don't talk to each other"  
  Icon: Animated disconnected nodes SVG
  "You use 12 different tools that don't coordinate. 
   Every task starts from scratch."
  
  Card 3: "You can't afford a full team"
  Icon: Animated dollar sign dissolving
  "A content writer costs $3k/mo. A researcher $4k. A sales rep $5k. 
   That's $12k/mo before you're profitable."

- Transition: "There's a better way →" with glowing arrow
- Cards use scroll-triggered slide-in from alternating sides
```

---

### 2.5 — SOLUTION / HOW IT WORKS

```
Component: <HowItWorksSection />
- Headline: "Your AI company. Built in 5 minutes."
- Three-step animated flow:

Step 1 — "Describe your business"
  Animated: typing effect in a textarea mockup
  "Tell Reklu about your business, products, and goals.
   Your AI company learns who you are."
  
Step 2 — "Hire your agents"  
  Animated: agent cards sliding onto a "company board"
  "Browse the agent marketplace. Hire a researcher, writer, 
   sales agent, and more. Each one knows your business."
   
Step 3 — "Watch them work"
  Animated: task cards appearing with status indicators ticking
  "Your agents run 24/7. They produce work, alert you to opportunities,
   and report every Monday."

- Large animated connection diagram:
  SVG showing CEO agent in center, connected to 6 agents around it
  Animated data-flow lines between nodes (dashed lines with moving dots)
  On hover, each agent card expands with a tooltip
```

---

### 2.6 — AGENT SHOWCASE

```
Component: <AgentShowcaseSection />
- Headline: "Meet your new team"
- Sub: "Each agent is trained on your business and works with the others."

- Interactive agent grid (3x3 or 4x2):
  Each agent is a card with:
  - Animated avatar (gradient circle + emoji/icon)
  - Name ("Aria — Content Writer")
  - Department badge
  - 3 key capabilities
  - "Hire" button (links to signup)
  - Hover: card lifts with glow, shows example output preview

- Agents to show:
  🎯 CEO Agent — "Sets weekly priorities, delegates to your team"
  📣 CMO Agent — "Plans campaigns, briefs your marketing team"  
  ✍️ Content Writer — "Blogs, emails, social posts, ad copy"
  🔍 Research Analyst — "Competitors, market trends, reports"
  💼 Sales Agent — "Lead outreach, follow-ups, sequences"
  💬 Support Agent — "Customer tickets, FAQs, escalations"
  💰 CFO Agent — "Budget tracking, forecasts, financial summaries"
  🤝 HR Agent — "Job descriptions, onboarding, policy drafts"

- Below grid: "Agent collaboration" explainer
  Animated diagram: CEO delegates → CMO briefs → Writer produces
  Show a mini task flow with agent avatars + arrows + output preview
```

---

### 2.7 — LIVE DEMO / OUTPUT PREVIEW

```
Component: <LiveDemoSection />
- Headline: "See what your agents produce"
- Interactive tabbed demo:
  
  Tabs: Content | Research | Sales | Support
  
  "Content" tab example:
    Input side (left): 
      "Write a LinkedIn post about our new product launch for SaaS founders"
      [Business context loaded from "Brain AI"]
    Output side (right):
      Typewriter animation showing a full LinkedIn post appearing
      Below: "Generated by Aria (Content Writer) in 4.2 seconds"
      
  "Research" tab:
    Input: "Research our top 3 competitors and find their weaknesses"
    Output: Animated table appearing with competitor analysis
    
  Each tab has a smooth transition and the output types character by character
  
- CTA below: "This could be YOUR business context. Try it free →"
```

---

### 2.8 — FEATURES DEEP DIVE

```
Component: <FeaturesSection />
- Bento grid layout (asymmetric cards, 2-3 per row, varying sizes)
- Each feature card has an animated illustration/icon

Feature cards:
1. LARGE: "Business Brain" 
   Animated: A brain SVG with neural connections lighting up
   "Your agents share a persistent memory of your business.
    The longer you use Reklu, the smarter your company gets."

2. MEDIUM: "Agents talk to each other"
   Animated: Network graph with message bubbles flowing between nodes
   "CEO delegates to CMO. CMO briefs the Writer. 
    Your agents coordinate without you."

3. MEDIUM: "Weekly Board Meeting"
   Animated: A report card with metrics counting up
   "Every Monday, your AI company sends a full report:
    what was done, what's next, KPIs, and recommendations."

4. SMALL: "Proactive Alerts"
   "Your agents don't wait. They find opportunities and tell you."

5. SMALL: "50+ Integrations"
   "Connect your CRM, email, Notion, Slack, and more."

6. SMALL: "Hire & Fire"
   "Build the exact team you need. Change it anytime."

7. LARGE: "Multi-model AI"
   Animated: Different AI model logos routing to tasks
   "We route each task to the best AI model — GPT-4o for writing,
    Claude for analysis, Gemini for research. You get the best output."
```

---

### 2.9 — PRICING SECTION

```
Component: <PricingSection />
- Headline: "Pricing that makes sense for solo founders"
- Toggle: Monthly / Annual (Annual = 2 months free)

Three tiers:

STARTER — $29/mo
  - 3 AI agents
  - 500 tasks/month  
  - Business Brain (basic)
  - Email support
  [Hire 3 agents →]

GROWTH — $79/mo (MOST POPULAR badge)
  - 8 AI agents
  - Unlimited tasks
  - Business Brain (full)
  - Agent-to-agent workflows
  - Weekly board report
  - Priority support
  [Build Your Team →]

COMPANY — $149/mo
  - Unlimited agents
  - Unlimited tasks
  - Full Business Brain
  - Custom agent creation
  - White-label option
  - Dedicated onboarding
  [Go Full Company →]

FREE tier note: "Start free with 1 agent, 50 tasks/month. No credit card."

- Each card: glassmorphism, hover glow
- Growth card: animated gradient border
- Feature comparison table below (collapsible)
- "Enterprise? Let's talk." link
```

---

### 2.10 — TESTIMONIALS

```
Component: <TestimonialsSection />
- Headline: "Founders who got their time back"
- Masonry/staggered grid of testimonial cards
- Each card: photo, name, role, company, star rating, quote
- Scroll-triggered staggered fade-in
- Animated quote marks (large, decorative, purple)
- Include 6-8 testimonials (write compelling fictional ones for launch,
  clearly labeled to be replaced)
```

---

### 2.11 — FAQ SECTION

```
Component: <FAQSection />
- Accordion style, animated expand/collapse
- Questions:
  - "Is this just a chatbot?"
  - "How is this different from ChatGPT?"
  - "Can agents actually take actions, or just write?"
  - "What happens if an agent makes a mistake?"
  - "How does the Business Brain work?"
  - "Can I customize agents?"
  - "Is my data secure?"
  - "Can I cancel anytime?"
- Clean, minimal design with animated chevrons
```

---

### 2.12 — FINAL CTA SECTION

```
Component: <FinalCTASection />
- Full-width dark section with large animated gradient background
- Massive headline: "Stop running your business alone."
- Sub: "Your AI company is ready. It just needs a founder."
- Single large CTA button: "Build My AI Company — It's Free"
- Small text: "No credit card. No setup fees. Cancel anytime."
- Animated floating agent avatars in background
```

---

### 2.13 — FOOTER

```
Component: <Footer />
- Logo + tagline
- Link columns: Product, Company, Resources, Legal
- Social links: X/Twitter, LinkedIn, GitHub
- "Built with love for solo founders everywhere"
- Copyright
- Subtle animated gradient divider at top
```

---

### ADDITIONAL MARKETING PAGES

```
/pricing          Full pricing page with comparison table
/agents           Agent catalog — all available agents with details
/blog             Blog listing (MDX-based, admin can publish posts)
/blog/[slug]      Individual blog posts
/about            Team + mission page
/changelog        Product updates timeline
/terms            Terms of service
/privacy          Privacy policy
```

---

## PART 3: USER DASHBOARD

### Route: `/dashboard`
### Auth: Clerk — all dashboard routes protected

---

### 3.1 — ONBOARDING FLOW

```
Route: /dashboard/onboarding
Multi-step wizard (4 steps), full-screen, animated transitions

Step 1: "Tell us about your business"
Fields:
  - Business name
  - Business type (dropdown: SaaS, E-commerce, Agency, Consulting, 
    Restaurant, Real Estate, Other)
  - What do you sell? (textarea)
  - Your website (optional)
Progress: 1/4 | "This helps your agents work smarter for you"

Step 2: "Who are your customers?"
Fields:
  - Target audience description
  - Primary goal (dropdown: More sales, More content, Better support,
    Market research, All of the above)
  - Monthly revenue range (optional)

Step 3: "How should your agents sound?"
  - Brand voice selector: 5 options with preview examples
    Professional | Friendly | Bold | Casual | Expert
  - Upload 1-2 example pieces of content (optional)
  - Competitors (add up to 3 competitor URLs)

Step 4: "Hire your first team"
  - Show recommended agents based on their business type
  - Pre-selected: CEO + 2 relevant agents
  - User can swap any
  - "Your first agent is free. Upgrade anytime."
  - [Launch My AI Company] button

Completion: 
  - Confetti animation
  - "Your AI company is live!"  
  - Redirect to main dashboard
  - Auto-trigger first CEO agent task: "Create my first week plan"
```

---

### 3.2 — MAIN DASHBOARD

```
Route: /dashboard
Layout: Left sidebar + main content area

SIDEBAR:
  - Logo/brand
  - User's business name + plan badge
  - Nav items (with Lucide icons):
    ⊞ Dashboard (home)
    👥 My Team (agents)
    ✅ Tasks
    🧠 Business Brain
    📊 Reports
    🔔 Notifications (badge count)
    🔗 Integrations
    💳 Billing
    ⚙️ Settings
  - Bottom: user avatar + name + "Upgrade" CTA

MAIN DASHBOARD:
  
  Header:
    "Good morning, [Name] 👋"
    "Your AI company has completed [X] tasks this week"
  
  Stats row (4 metric cards):
    - Tasks completed this week: [N] (↑ 12% vs last week)
    - Active agents: [N]
    - Tasks in queue: [N]  
    - Words generated: [N]
    Animated: numbers count up on load
  
  "Your Company" section:
    Grid of agent cards (your hired agents)
    Each card: avatar, name, role, status indicator (idle/working/alert)
    "working" agents have a subtle pulse animation
    Click → opens agent detail panel
  
  "Recent Work" feed:
    Timeline of completed tasks, newest first
    Each item: agent avatar, task title, timestamp, "View Output" button
    Expandable inline to show output preview
    Lazy-loaded, infinite scroll
  
  "Opportunities" sidebar card:
    Proactive alerts from Research Agent
    "⚡ Competitor [X] just launched a new feature"
    "📈 High search volume for '[keyword]' this week"
    Each with action button
  
  "This Week's Focus" card:
    Latest CEO agent recommendation
    3-5 bullet points of strategic priorities
    "Generated by your CEO Agent, Monday [date]"
```

---

### 3.3 — MY TEAM (AGENTS)

```
Route: /dashboard/team

"My Hired Agents" — grid of current agents
Each agent card:
  - Animated avatar (gradient + emoji)
  - Name (custom or default)
  - Role badge
  - Department
  - "Last active: 2h ago"
  - Task count this month
  - Status: Active / Paused
  - Actions: Configure | Pause | Fire

"Hire More Agents" button → opens Agent Marketplace modal

AGENT MARKETPLACE MODAL:
  - Search + filter by department
  - Grid of all available agents
  - Each card: avatar, name, capabilities, "Hire This Agent" button
  - Already-hired agents shown as "✓ Hired"
  - Locked agents (beyond plan limit) shown with "Upgrade to hire"

AGENT DETAIL PANEL (slide-in from right):
  - Full agent profile
  - Custom name field (user can rename)
  - Custom instructions (override system prompt additions)
  - Task history for this agent
  - Performance stats
  - "Give a task" quick action
```

---

### 3.4 — TASKS

```
Route: /dashboard/tasks

Tab: All | Queued | Running | Completed | Failed

"New Task" button → opens task creation modal

TASK CREATION MODAL:
  - Select agent (dropdown with agent avatars)
  - Task title (text)
  - Task description / instructions (rich textarea)
  - Priority: Low / Normal / High / Urgent
  - Schedule: Run now | Schedule for later (datetime picker)
  - Attach context: checkboxes for relevant Business Brain sections
  - [Run Task] button

TASK LIST:
  Each row: 
    - Agent avatar + name
    - Task title
    - Status badge (with animation for "running")
    - Created time
    - Duration
    - Actions: View | Cancel | Re-run

TASK DETAIL MODAL:
  - Full task info
  - Agent output rendered as markdown (with syntax highlighting)
  - Copy to clipboard button
  - Download as .md / .txt / .docx
  - "Run similar task" shortcut
  - Token/model usage metadata
  - If delegated: shows delegation chain visualization

RUNNING STATE:
  - Animated progress indicator
  - Real-time streaming of agent output (SSE)
  - "Cancel" button
```

---

### 3.5 — BUSINESS BRAIN

```
Route: /dashboard/brain

Headline: "Your Business Brain"
Sub: "Everything your agents know about you. The more you add, the smarter they get."

Sections (tabs or expandable cards):

1. Products & Services
   - Add products/services table (name, description, price, URL)
   - Quick-add form

2. Your Audience  
   - Target customer persona (textarea, AI can help generate)
   - Demographics, pain points, goals

3. Competitors
   - Add competitor table (name, URL, notes)
   - "Research this competitor" quick action → creates research task

4. Brand Voice
   - Tone selector (visual)
   - Example phrases "you would say" / "you would never say"
   - Upload sample content

5. Key Context
   - Business description
   - Unique selling proposition
   - Key milestones (timeline)
   - Custom context (freeform)

6. Keywords & SEO
   - Add target keywords (tags input)
   - Primary topics/categories

UI: Each section is a card with edit/save. Auto-save on blur.
"Brain completeness" progress bar — gamifies filling it out
"💡 AI suggests:" assistant fills gaps based on your website URL
```

---

### 3.6 — REPORTS

```
Route: /dashboard/reports

WEEKLY BOARD REPORTS:
  - List of all weekly reports (most recent first)
  - Each report: week range, completion rate, highlights
  - Click → full report view

FULL REPORT VIEW:
  - Executive summary paragraph (AI-generated)
  - Agent performance cards (tasks completed per agent, success rate)
  - Top 3 outputs of the week (highlighted tasks)
  - KPIs (tasks run, words produced, time saved estimate)
  - AI recommendations for next week (bulleted)
  - "Share report" → generates a shareable PDF
  - Beautiful print-ready layout

ANALYTICS:
  - Charts (Recharts):
    - Tasks completed over time (line chart)
    - Tasks by agent (bar chart)  
    - Task types distribution (pie chart)
    - Tasks by day of week (heatmap-style)
  - Date range picker
  - Export to CSV
```

---

### 3.7 — NOTIFICATIONS

```
Route: /dashboard/notifications

Notification bell in header with unread count badge (animated)
Full notifications page with:
  - Filter: All | Tasks | Agents | Billing | System
  - Mark all as read
  - Each notification: icon, title, message, time, action link
  - Real-time: new notifications pop up as toast + bell badge increments
  - Notification types:
    ✅ Task completed
    ❌ Task failed  
    ⚡ Agent alert (proactive finding)
    📊 Board report ready
    💳 Billing event
    🎉 Milestone (first 10 tasks, first 100, etc.)
```

---

### 3.8 — INTEGRATIONS

```
Route: /dashboard/integrations

Integration cards (connect/disconnect):
  - Gmail / Google Workspace
  - Slack
  - Notion
  - Airtable
  - Shopify
  - HubSpot CRM
  - Zapier (webhook)
  - Custom webhook

Each card: logo, name, description of what Reklu can do with it,
connect button → OAuth flow.
Connected state: green badge, disconnect option, permission summary.
```

---

### 3.9 — BILLING

```
Route: /dashboard/billing

Current plan card:
  - Plan name + price
  - Renewal date
  - Tasks used / limit (progress bar)
  - [Upgrade Plan] or [Manage Plan] → Paddle customer portal

Plan comparison cards (upgrade CTA)
Invoice history table
Payment method display
Cancellation flow (with save offer)
```

---

### 3.10 — SETTINGS

```
Route: /dashboard/settings

Tabs:

Profile:
  - Name, email (from Clerk)
  - Avatar upload
  - Timezone
  - Language

Business:
  - Business name
  - Business type
  - Website
  - (overlaps with Brain — link to Brain for deep edits)

Notifications:
  - Toggle: Email notifications
  - Toggle: Browser notifications  
  - Toggle: Weekly board report email
  - Toggle: Agent alerts
  - Notification frequency preferences

API:
  - API key for Reklu (generate/revoke)
  - Webhook URL
  - API documentation link

Security:
  - Connected accounts (via Clerk)
  - Active sessions
  - Delete account (with confirmation)
```

---

## PART 4: ADMIN PANEL

### Route: `/admin`
### Auth: Clerk — role = "admin" only (set via Clerk metadata)
### Redirect non-admins to /dashboard

---

### 4.1 — ADMIN SIDEBAR & LAYOUT

```
Sidebar nav:
  📊 Overview
  👥 Users
  🤖 Agents
  ✅ Tasks
  💰 Revenue
  📧 Emails
  🔧 Platform
  📝 Blog
  🔔 Announcements
  ⚙️ Settings

Top bar:
  - "Admin Panel" label
  - Quick search (search users by email/name)
  - Notification bell (system alerts)
  - Your admin avatar
```

---

### 4.2 — ADMIN OVERVIEW

```
Route: /admin

Real-time stats cards:
  - Total users (+ today's signups)
  - Active subscribers (paying users)
  - Tasks run today / this month
  - Monthly recurring revenue (MRR)
  - Monthly active users (MAU)
  - Churn this month
  - Average tasks per user
  - Total tokens used

Charts:
  - User growth over time (30/90/365 day view)
  - Revenue over time (MRR trend)
  - Tasks per day (bar chart)
  - Plan distribution (pie chart: free/starter/growth/company)
  - Top agents by usage

Recent signups feed (last 10, live updating)
Recent tasks feed (last 20, live)
System health: API latency, error rate, DB status (green/yellow/red)
```

---

### 4.3 — USER MANAGEMENT

```
Route: /admin/users

Table columns:
  Name | Email | Plan | Tasks Used | Joined | Last Active | Status | Actions

Filters:
  - Plan (free/starter/growth/company)
  - Status (active/inactive/churned)
  - Date range joined
  - Search by name or email

Row actions:
  - View full profile
  - Impersonate user (opens their dashboard as them) ← CRITICAL FEATURE
  - Change plan manually
  - Add bonus tasks
  - Suspend account
  - Delete account

USER DETAIL PAGE (/admin/users/[id]):
  - Full user profile
  - Business Brain summary
  - All hired agents
  - Task history (full)
  - Billing history
  - Activity log
  - Admin notes (add internal notes)
  - Manual plan override
  - "Send email" button
```

---

### 4.4 — AGENT MANAGEMENT

```
Route: /admin/agents

AGENT TEMPLATES LIST:
  Table: Name | Department | Tier | Uses | Active | Actions
  
CREATE / EDIT AGENT:
  - Name
  - Role
  - Department
  - Tier (executive/manager/employee)
  - Description
  - Capabilities (tag input)
  - Avatar emoji + gradient color
  - System prompt (large textarea with AI assistant)
  - Default AI model selector
  - Monthly display price
  - Active toggle
  - Featured toggle (shows in highlights)
  - Sort order
  
SYSTEM PROMPT BUILDER:
  Rich textarea with:
  - Variable helpers: {{business_name}}, {{business_description}}, 
    {{brand_voice}}, {{target_audience}}, {{products}}, {{competitors}}
  - "Test this prompt" button → runs a test task with sample data
  - Version history of prompt edits
  - "AI enhance this prompt" button
```

---

### 4.5 — TASK MONITOR

```
Route: /admin/tasks

Live view of ALL tasks across all users

Table: User | Agent | Task | Status | Model | Tokens | Duration | Time

Filters:
  - Status (running/completed/failed)
  - Agent type
  - Model used
  - Date range
  - User

Stats at top:
  - Tasks running right now: [N] (live)
  - Tasks failed today: [N] (red if > threshold)
  - Average task duration
  - Token usage today

TASK DETAIL:
  - Full input/output
  - Error messages for failed tasks
  - Model, tokens, duration
  - User info
  - Option to mark failed tasks for review
  - Option to refund task (add +1 to user's count)
```

---

### 4.6 — REVENUE DASHBOARD

```
Route: /admin/revenue

Metrics:
  - MRR (Monthly Recurring Revenue)
  - ARR (Annual Run Rate)
  - New MRR this month
  - Churned MRR this month
  - Net New MRR
  - Average Revenue Per User (ARPU)
  - Lifetime Value estimate

Charts:
  - MRR over time
  - Revenue by plan tier
  - New vs churned revenue
  - Daily revenue (bar)

Subscription table:
  User | Plan | Amount | Start Date | Status | Next Billing

Export to CSV button
Paddle webhook log (last 100 events)
```

---

### 4.7 — EMAIL CENTER

```
Route: /admin/emails

SEND BROADCAST:
  - Subject
  - Email body (rich text editor)
  - Target segment: All users | Free users | Paid users | By plan
  - Preview email
  - Schedule or send now
  - Sent via Resend API

EMAIL TEMPLATES:
  - Welcome email
  - First task complete
  - Weekly board report email
  - Plan upgrade confirmation
  - Plan cancellation + save offer
  - Re-engagement (inactive 14 days)
  - Each template editable with live preview

EMAIL LOGS:
  - Table of sent emails: recipient, template, sent time, open/click status
```

---

### 4.8 — PLATFORM SETTINGS

```
Route: /admin/platform

GLOBAL SETTINGS:
  - Maintenance mode toggle (shows banner to users)
  - New user signups: Open | Waitlist | Closed
  - Free tier: tasks limit, agents limit
  - Plan limits override (tasks per plan)
  
AI SETTINGS:
  - Default model per agent department
  - Fallback model
  - Max tokens per task
  - OpenRouter API key status
  - Model cost tracking

FEATURE FLAGS:
  - Toggle features on/off globally
  - Per-plan feature access matrix
  
SYSTEM ALERTS:
  - Set alert thresholds (error rate, task failure rate)
  - Alert notification email
```

---

### 4.9 — BLOG MANAGEMENT

```
Route: /admin/blog

POST LIST:
  Table: Title | Status | Published Date | Author | Views | Actions

CREATE / EDIT POST:
  - Title
  - Slug (auto-generated, editable)
  - Content (MDX rich editor with preview)
  - Cover image (upload to R2)
  - Author
  - Tags / categories
  - SEO: meta title, meta description, OG image
  - Status: Draft | Published | Scheduled
  - Schedule publish datetime

POST ANALYTICS:
  - Views, reads, avg time on page (if analytics integrated)
```

---

### 4.10 — ANNOUNCEMENTS

```
Route: /admin/announcements

Create banner/notification for all users:
  - Message text
  - Type: Info | Warning | Success | Promo
  - Link (optional)
  - Target: All users | Free only | Paid only
  - Start/end date
  - Preview how it looks in dashboard
  - Active toggle

Shows as a dismissable banner at top of user dashboard
```

---

## PART 5: BACKEND / API ROUTES

```
Build all API routes as Next.js Route Handlers under /app/api/

AUTH:
POST   /api/auth/webhook          — Clerk webhook (sync user to DB)

USERS:
GET    /api/user/me               — current user profile
PATCH  /api/user/me               — update profile
GET    /api/user/me/stats         — usage stats

BRAIN:
GET    /api/brain                 — get user's business brain
PATCH  /api/brain                 — update any brain section
POST   /api/brain/enrich          — AI auto-fill brain from website URL

AGENTS:
GET    /api/agents/templates      — all available agent templates
GET    /api/agents/hired          — user's hired agents
POST   /api/agents/hire           — hire an agent
PATCH  /api/agents/[id]           — update hired agent settings
DELETE /api/agents/[id]           — fire (remove) an agent

TASKS:
GET    /api/tasks                 — user's tasks (with filters)
POST   /api/tasks                 — create new task
GET    /api/tasks/[id]            — single task
DELETE /api/tasks/[id]            — cancel task
POST   /api/tasks/[id]/rerun      — re-run a task
GET    /api/tasks/[id]/stream     — SSE stream for live output

REPORTS:
GET    /api/reports               — list board reports
GET    /api/reports/[id]          — single report
POST   /api/reports/generate      — trigger manual report generation

NOTIFICATIONS:
GET    /api/notifications         — user notifications
PATCH  /api/notifications/read    — mark as read
PATCH  /api/notifications/[id]    — mark single as read

BILLING:
GET    /api/billing/plans         — available plans
POST   /api/billing/checkout      — create Paddle checkout session
POST   /api/billing/portal        — open Paddle customer portal
POST   /api/billing/webhook       — Paddle webhook handler

ADMIN:
GET    /api/admin/stats           — platform overview stats
GET    /api/admin/users           — all users (with filters, pagination)
GET    /api/admin/users/[id]      — single user detail
PATCH  /api/admin/users/[id]      — admin update user
DELETE /api/admin/users/[id]      — delete user
POST   /api/admin/users/[id]/impersonate — impersonate user
POST   /api/admin/tasks/refund    — refund task to user
GET    /api/admin/tasks           — all tasks platform-wide
PATCH  /api/admin/agents/[id]     — update agent template
POST   /api/admin/agents          — create agent template
DELETE /api/admin/agents/[id]     — delete agent template
GET    /api/admin/revenue         — revenue stats
POST   /api/admin/emails/broadcast — send email to segment
GET    /api/admin/emails/logs     — email logs
```

---

## PART 6: AI AGENT ENGINE

```typescript
// lib/agent-engine.ts

/*
This is the core engine that runs agent tasks.

FLOW:
1. Task created (POST /api/tasks)
2. Inngest job queued
3. Job runs:
   a. Load agent template (system prompt)
   b. Load user's business brain (context injection)
   c. Build final prompt with brain variables injected
   d. Call OpenRouter API with selected model
   e. Stream response back via SSE
   f. Save output to DB
   g. Update task status
   h. Trigger any follow-up actions (notifications, delegations)
4. If agent-to-agent delegation:
   - Orchestrating agent's output becomes input for next agent
   - New task created automatically
   - Delegation record created linking tasks

BRAIN INJECTION:
Every task prompt gets these variables replaced:
{{business_name}}        → users.business_name
{{business_type}}        → users.business_type  
{{brand_voice}}          → users.brand_voice
{{business_description}} → brain.business_description
{{target_audience}}      → brain.target_audience
{{usp}}                  → brain.usp
{{products}}             → brain.products (formatted list)
{{competitors}}          → brain.competitors (formatted list)
{{keywords}}             → brain.target_keywords (comma list)

CEO AGENT WEEKLY ORCHESTRATION (Inngest cron, runs every Monday 8am):
1. CEO agent runs: "Based on this business context, what are the top 5 
   priorities for this week?"
2. CEO output is parsed for delegations
3. Sub-tasks created for relevant agents
4. Board report generated

PROACTIVE RESEARCH (runs every 48h):
1. Research agent queries for competitor news
2. Research agent checks target keywords trends
3. Findings stored as notifications/alerts
4. User notified if actionable findings

MODEL ROUTING:
- Content creation → claude-3-5-sonnet or gpt-4o
- Research/analysis → claude-3-5-sonnet
- Quick tasks (summaries, etc.) → gpt-4o-mini
- CEO/strategic → claude-3-5-sonnet
- Support drafts → gpt-4o-mini
*/
```

---

## PART 7: KEY COMPONENTS TO BUILD

```
Reusable components (put in /components/):

UI Components:
  <AnimatedCounter value={n} />           — count-up number animation
  <StatusBadge status="running" />        — colored badge with pulse for running
  <AgentAvatar agent={agent} size="md" /> — gradient circle + emoji
  <TaskCard task={task} />                — task summary card
  <AgentCard agent={agent} />             — agent display card
  <GlowButton variant="primary">          — button with purple glow effect
  <GlassCard>                             — glassmorphism card wrapper
  <AnimatedGradientBorder>                — card with animated gradient border
  <StreamingText text={text} />           — typewriter/streaming text effect
  <BrainCompleteness percent={n} />       — animated progress ring
  <PlanBadge plan="growth" />             — colored plan indicator
  
Marketing-specific:
  <ParticleBackground />                  — animated particle mesh (canvas)
  <FloatingOrbs />                        — blurred gradient orb animation
  <HeroMockup />                          — 3D-tilted dashboard preview
  <AgentFlowDiagram />                    — SVG agent network visualization
  <TypewriterOutput text={text} />        — demo output typewriter effect
  
Dashboard-specific:
  <DashboardLayout />                     — sidebar + main wrapper
  <Sidebar />                             — nav sidebar
  <AgentStatusCard agent={agent} />       — agent with live status
  <TaskFeed tasks={tasks} />              — animated task timeline
  <MetricCard label title value trend />  — stat card with trend indicator
  <WeeklyReport report={report} />        — formatted board report
  <BrainSection title>                    — collapsible brain edit section
```

---

## PART 8: ANIMATIONS & MICRO-INTERACTIONS

```
Use Framer Motion throughout. Key animations:

Page transitions:
  - All page routes: fade + slight upward slide (0.3s)

Component mount:
  - Cards: fade in + scale from 0.95
  - Lists: stagger children 0.05s apart
  - Stats: count up from 0 on first view

Scroll-triggered (use Framer Motion useInView):
  - All sections animate in on scroll entry
  - "Once" mode — don't re-trigger

Hero:
  - Headline words: staggered fade up
  - Particle mesh: continuous slow drift
  - Floating orbs: CSS keyframe float

Dashboard:
  - Task running: subtle pulse on status badge
  - New task arrives: slide in from top of feed
  - Agent working: breathing animation on avatar border
  - Notification badge: bounce on new notification

Interactions:
  - All buttons: scale(0.97) on click
  - Cards: slight lift (translateY -2px) + box-shadow increase on hover
  - Sidebar nav item: active state slides in from left
  - Modal/sheet: slide in from right (drawer) or scale in (dialog)

Loading states:
  - Skeleton screens (not spinners) for all data loading
  - Streaming task output: cursor blink at end of text
  - Page loading: top progress bar (NProgress style)
```

---

## PART 9: FILE STRUCTURE

```
reklu/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              — home
│   │   ├── pricing/page.tsx
│   │   ├── agents/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx
│   │   └── layout.tsx
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx            — dashboard shell (sidebar etc)
│   │   ├── page.tsx              — main dashboard
│   │   ├── onboarding/page.tsx
│   │   ├── team/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── brain/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── integrations/page.tsx
│   │   ├── billing/page.tsx
│   │   └── settings/page.tsx
│   ├── admin/
│   │   ├── layout.tsx            — admin shell
│   │   ├── page.tsx              — overview
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── agents/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── revenue/page.tsx
│   │   ├── emails/page.tsx
│   │   ├── platform/page.tsx
│   │   ├── blog/page.tsx
│   │   └── announcements/page.tsx
│   └── api/
│       ├── auth/webhook/route.ts
│       ├── user/[...routes]/route.ts
│       ├── brain/route.ts
│       ├── agents/[...routes]/route.ts
│       ├── tasks/[...routes]/route.ts
│       ├── reports/[...routes]/route.ts
│       ├── notifications/[...routes]/route.ts
│       ├── billing/[...routes]/route.ts
│       └── admin/[...routes]/route.ts
├── components/
│   ├── marketing/
│   ├── dashboard/
│   ├── admin/
│   └── ui/                       — shadcn + custom
├── lib/
│   ├── db/
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── agent-engine.ts
│   ├── openrouter.ts
│   ├── paddle.ts
│   ├── resend.ts
│   └── utils.ts
├── inngest/
│   ├── client.ts
│   ├── weekly-report.ts
│   ├── proactive-research.ts
│   └── task-runner.ts
└── middleware.ts                  — Clerk auth middleware
```

---

## PART 10: ENVIRONMENT VARIABLES

```env
# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Database
DATABASE_URL=                      # Neon PostgreSQL

# AI
OPENROUTER_API_KEY=

# Payments
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=

# Email
RESEND_API_KEY=
EMAIL_FROM=hello@reklu.app

# Storage
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_ENDPOINT=

# Background Jobs
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# App
NEXT_PUBLIC_APP_URL=https://reklu.app
ADMIN_USER_IDS=                    # comma-separated Clerk user IDs for admin access
```

---

## PART 11: SEED DATA

```
Seed the database with:

1. 8 default agent templates (as described in Agent Showcase above)
   — CEO, CMO, Content Writer, Research Analyst, Sales Agent, 
     Support Agent, CFO Agent, HR Agent
   Each with full system prompts using {{brain_variables}}

2. 3 industry starter kits:
   - "SaaS Startup Pack": CEO + CMO + Content Writer + Research Analyst
   - "E-commerce Pack": CEO + Content Writer + Sales Agent + Support Agent  
   - "Agency Pack": CEO + Content Writer + Research Analyst + HR Agent

3. Sample blog posts (3, marked as published)

4. Platform settings defaults
```

---

## FINAL INSTRUCTIONS

1. **Start with the database schema** — run migrations first
2. **Build auth** — Clerk integration + webhook to sync users
3. **Build core API routes** — especially tasks and agents
4. **Build the agent engine** — the AI task runner is the product's heart
5. **Build the dashboard** — user-facing value delivery
6. **Build the marketing site** — conversion layer
7. **Build admin panel** — your control center
8. **Add Inngest jobs** — weekly reports, proactive research
9. **Add Paddle billing** — monetization
10. **Polish animations** — Framer Motion pass across all UI

**Code quality requirements:**
- TypeScript strict mode everywhere
- All API routes validate input with Zod
- Error boundaries on all async components
- Loading skeletons for all data-fetching components
- Proper error messages (no raw error objects to users)
- Responsive mobile layout for dashboard (collapsible sidebar)
- SEO: metadata API for all marketing pages, sitemap.xml, robots.txt
- Performance: Image optimization, dynamic imports for heavy components
- Security: All admin routes check admin role server-side, never trust client

**The product essence:** A solo founder opens Reklu, describes their business in 5 minutes, and immediately has a team of AI agents working for them. By morning, their company has produced content, researched competitors, drafted outreach, and sent them a report. That's the experience to build toward.

---

*End of Reklu Build Prompt — Version 1.0*
