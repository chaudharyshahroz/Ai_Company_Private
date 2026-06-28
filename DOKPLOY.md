# Deploying Reklu on Hostinger VPS + Dokploy + GitHub

This guide walks you through taking the Reklu codebase from `localhost` to a
live production deployment, end-to-end, using:

- **GitHub** as the source of truth + CI runner
- **Hostinger VPS** (Ubuntu 22.04 or 24.04) as the host
- **Dokploy** as the deployment platform (Docker + Traefik + auto-SSL + rollback)
- **Neon / Supabase / bundled Postgres** for the database

Estimated time: ~45 minutes for a first-time setup, ~5 minutes per deploy after.

---

## 0. Prerequisites

Before you start, make sure you have:

- [ ] A **GitHub** account
- [ ] A **Hostinger VPS** (KVM 2 or higher recommended — needs ~2 GB RAM for Next.js + Postgres)
  - Ubuntu 22.04 or 24.04, fresh install
  - Root or sudo access
- [ ] A **domain** pointed at the VPS (`reklu.yourdomain.com` or similar)
- [ ] All third-party API keys (Clerk, OpenRouter, Paddle, Resend, R2, Inngest) ready
- [ ] SSH access to the VPS from your local machine

---

## 1. Get the code into GitHub

### 1.1 — Initialize the repo locally

From the project root:

```bash
cd "/path/to/Reklu AI Compny Empoly"

# Init git
git init
git branch -M main

# Add everything (.gitignore already excludes node_modules, .next, .env, etc.)
git add .
git commit -m "feat: initial commit — dashboard redesign + Dokploy-ready"
```

### 1.2 — Create the GitHub repo

Two options:

**Option A — GitHub CLI (faster):**
```bash
gh repo create reklu --private --source=. --remote=origin --push
```

**Option B — Web UI:**
1. Go to https://github.com/new
2. Name: `reklu` (or whatever you like)
3. Visibility: **Private**
4. **Do NOT** initialize with README, .gitignore, or license — we already have those
5. Click "Create repository"
6. Then locally:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/reklu.git
   git push -u origin main
   ```

---

## 2. Install Dokploy on the VPS

SSH into your Hostinger VPS:

```bash
ssh root@YOUR_VPS_IP
```

Then install Dokploy (one command — see https://docs.dokploy.com for the latest):

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

This installs Docker, Dokploy, and Traefik (reverse proxy with auto-SSL via Let's Encrypt).

Once installed, Dokploy is reachable on port **80** by default — visit `http://YOUR_VPS_IP:80` and complete the setup wizard (it asks you to create an admin account).

> **Tip:** Hostinger's firewall sometimes blocks port 80 on fresh VPSes. If Dokploy's UI isn't reachable, open the port in Hostinger's control panel → Firewall.

---

## 3. Configure the VPS

### 3.1 — Point your domain at the VPS

In your DNS provider (Cloudflare, Hostinger DNS, etc.), add an **A record**:

| Type | Name | Value       | TTL  |
|------|------|-------------|------|
| A    | reklu | YOUR_VPS_IP | 300  |

(Substitute `reklu` for whatever subdomain you want. For the apex `yourdomain.com`, leave Name blank.)

### 3.2 — Set up the GitHub SSH key on the VPS

Dokploy pulls from GitHub over SSH. Generate a deploy key on the VPS:

```bash
ssh-keygen -t ed25519 -C "dokploy-reklu" -f ~/.ssh/dokploy_github -N ""
cat ~/.ssh/dokploy_github.pub
```

Copy the public key. Then on GitHub:

1. Go to `https://github.com/YOUR_USERNAME/reklu/settings/keys`
2. Click **"Add deploy key"**
3. Title: `dokploy-vps`
4. Paste the public key
5. ✅ Check **"Allow write access"** (only if you also want Dokploy to trigger webhooks back; otherwise leave unchecked for read-only)
6. Click **Add key**

---

## 4. Create the Dokploy app

In the Dokploy dashboard:

1. Click **"Create Project"** → name it `reklu-prod`
2. Inside the project, click **"Create Service"** → **"App"**
3. Choose source: **GitHub**
4. **Connect GitHub** (OAuth flow — authorizes Dokploy to access your repos)
5. Select repository: `YOUR_USERNAME/reklu`
6. Branch: `main`
7. Build type: **Dockerfile** (Dokploy auto-detects the `Dockerfile` at the repo root)
8. **Port**: `3000`
9. Click **Deploy** (this triggers the first build — it will fail until we add env vars, that's fine)

---

## 5. Configure environment variables

In the Dokploy dashboard for your new app → **Environment** tab, add:

### Required

| Variable                                | Where to get it                                     |
|-----------------------------------------|-----------------------------------------------------|
| `NODE_ENV`                               | Set to `production` (Dokploy does this automatically if you check the box) |
| `NEXT_PUBLIC_APP_URL`                    | `https://reklu.yourdomain.com`                       |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`      | Clerk dashboard → API Keys                           |
| `CLERK_SECRET_KEY`                       | Clerk dashboard → API Keys                           |
| `CLERK_WEBHOOK_SECRET`                   | Clerk dashboard → Webhooks                          |
| `DATABASE_URL`                           | Neon / Supabase connection string, **or** use the bundled Postgres (see below) |
| `OPENROUTER_API_KEY`                     | https://openrouter.ai/keys                           |
| `PADDLE_API_KEY`                         | Paddle dashboard                                     |
| `PADDLE_WEBHOOK_SECRET`                  | Paddle dashboard → Webhooks                          |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`         | Paddle dashboard (client-side token)                 |
| `NEXT_PUBLIC_PADDLE_ENVIRONMENT`          | `sandbox` or `production`                            |
| `RESEND_API_KEY`                         | https://resend.com/api-keys                          |
| `EMAIL_FROM`                              | `hello@yourdomain.com`                              |
| `CLOUDFLARE_R2_ACCESS_KEY`               | Cloudflare R2 dashboard                              |
| `CLOUDFLARE_R2_SECRET_KEY`                | Cloudflare R2 dashboard                              |
| `CLOUDFLARE_R2_BUCKET`                   | your R2 bucket name                                  |
| `CLOUDFLARE_R2_ENDPOINT`                  | `https://<accountid>.r2.cloudflarestorage.com`      |
| `CLOUDFLARE_R2_PUBLIC_URL`                | `https://files.yourdomain.com`                      |
| `INNGEST_EVENT_KEY`                      | Inngest dashboard                                    |
| `INNGEST_SIGNING_KEY`                    | Inngest dashboard                                    |
| `ADMIN_USER_IDS`                         | (optional) comma-separated Clerk user IDs for admin  |

Click **Save**.

---

## 6. Choose your database strategy

You have two options:

### Option A — Managed Postgres (recommended for production)

Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or any other
managed Postgres. Pros: automatic backups, branching, point-in-time recovery,
no-ops.

1. Create a project on Neon (free tier works fine to start)
2. Copy the **pooled** connection string (looks like `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/reklu?sslmode=require`)
3. Paste it into the `DATABASE_URL` env var in Dokploy
4. **Skip the bundled Postgres service** (don't create one)

### Option B — Bundled Postgres on the same VPS (simpler, single server)

Use the Postgres service from `docker-compose.yml`:

1. In Dokploy → **Create Service** → **"Database"** → **Postgres**
2. Name: `reklu-db`
3. Image: `postgres:16-alpine`
4. Set env: `POSTGRES_USER=reklu`, `POSTGRES_PASSWORD=<generate-a-strong-one>`, `POSTGRES_DB=reklu`
5. Add a **persistent volume** mounted at `/var/lib/postgresql/data`
6. In your **app service** → Environment, set:
   ```
   DATABASE_URL=postgresql://reklu:<password>@reklu-db:5432/reklu
   ```
   (Dokploy's internal Docker network makes `reklu-db` resolvable as a hostname.)
7. In your app service's **Dependencies** tab, add `reklu-db` so the app waits for the database to be healthy before starting.

Either way works. Managed is safer for production; bundled is fine for a single VPS where you control everything.

---

## 7. Run database migrations

After the first successful deploy, you need to push the Drizzle schema to the database.

**Easiest path: do it from your local machine, pointing at the production DB:**

```bash
# Set DATABASE_URL to the production one temporarily
export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Push the schema
npm run db:push

# (Optional) Seed demo data
npm run db:seed
```

**Or: run it from inside the running container via Dokploy's "Execute Command" feature:**

```bash
# In Dokploy → your app → "Execute Command"
npx drizzle-kit push
```

---

## 8. Configure the domain + SSL

In Dokploy → your app → **Domains** tab:

1. Add your domain: `reklu.yourdomain.com`
2. ✅ Enable **"Generate SSL"** (Traefik auto-provisions a Let's Encrypt cert)
3. Wait ~30 seconds — Dokploy will hit Let's Encrypt and provision the cert
4. Visit `https://reklu.yourdomain.com` — you should see Reklu!

If SSL fails, common causes:
- DNS not propagated yet (check with `dig reklu.yourdomain.com`)
- Port 80 / 443 blocked on the VPS firewall

---

## 9. Configure Clerk webhooks (optional but recommended)

For Clerk auth events to flow into your app (user created, etc.):

1. In Clerk dashboard → **Webhooks** → **Add endpoint**
2. URL: `https://reklu.yourdomain.com/api/auth/webhook`
3. Events: `user.created`, `user.updated`, `user.deleted`
4. Copy the **Signing Secret** → paste into `CLERK_WEBHOOK_SECRET` env var in Dokploy
5. **Redeploy** the app for the new env to take effect

---

## 10. Continuous deployment workflow

The happy path from here on:

```
You make a change locally
        │
        ▼
git add . && git commit -m "feat: …"
        │
        ▼
git push origin main
        │
        ▼
GitHub Actions runs CI (lint + typecheck + build)  ──► fails? fix it.
        │ passes
        ▼
Dokploy sees the push (via GitHub webhook) and rebuilds the Docker image
        │
        ▼
New container rolls out, old one is kept for ~30s for zero-downtime swap
        │
        ▼
Live at https://reklu.yourdomain.com in ~2-3 minutes
```

### Rolling back

If a deploy breaks something:

1. Dokploy dashboard → your app → **Deployments** tab
2. Find the last working build → click **"Redeploy"**
3. Takes ~1 minute

---

## 11. Observability

Dokploy's UI gives you:
- **Logs** — live tail of stdout/stderr from the container
- **Metrics** — CPU, RAM, network per container
- **Terminal** — `exec` into the running container (great for debugging `psql` connectivity)

For production-grade observability, point your logs to an external service:
- **Better Stack** / **Logtail** / **Axiom** — Dokploy supports log shipping via Fluent Bit
- **Sentry** — for client + server error tracking; install `@sentry/nextjs` and add `SENTRY_DSN` to env

---

## 12. Backups

### Database
- **Managed (Neon/Supabase)**: automatic, point-in-time recovery included.
- **Bundled Postgres**: add a Dokploy cron job:
  ```bash
  pg_dump -U reklu -h reklu-db reklu | gzip > /backups/reklu-$(date +%Y%m%d).sql.gz
  ```
  Then back up `/backups/` to S3/R2 with `rclone cron`.

### App data
- R2 (object storage) is already durable and replicated.
- Source code lives in GitHub — that's your recovery for the app itself.

---

## 13. Troubleshooting

### "Build failed at `npm ci`"
The `package-lock.json` is out of sync with `package.json`. Run `npm install` locally and commit the updated lockfile.

### "Container exits immediately"
Check **Logs** in Dokploy. Most common causes:
- Missing required env var (Drizzle will crash on first DB query, Clerk will throw at boot)
- `NEXT_PUBLIC_APP_URL` doesn't match the actual URL → causes redirect loops

### "502 Bad Gateway"
App container crashed or hasn't finished starting. Check logs; the Dockerfile's `HEALTHCHECK` will report back to Traefik.

### "Database connection refused" on bundled Postgres
- Confirm the `depends_on` dependency is set in Dokploy (app depends on db)
- Make sure `DATABASE_URL` uses the Docker-internal hostname (`reklu-db`), not `localhost`
- Check the `db` service logs in Dokploy — was the volume initialized correctly?

### "Hydration mismatch" warnings in browser console
Already locked to `en-US` locale in `lib/format.ts`. If you see new ones, check any new code that calls `toLocaleString()` without a locale arg.

---

## 14. Cost summary

For a small Reklu deployment on Hostinger:

| Item                    | Approx. monthly cost           |
|-------------------------|--------------------------------|
| Hostinger VPS (KVM 2)   | $5–10                          |
| Domain                  | $10–15 / year                  |
| Neon Postgres (free)    | $0 to start, ~$20 at scale     |
| Clerk (free)            | $0 to 10k MAU                  |
| OpenRouter               | Pay-as-you-go (a few $ at low volume) |
| Cloudflare R2 (free)    | $0 to 10 GB stored             |
| Resend (free)           | $0 to 3k emails/mo             |
| Paddle (sandbox)        | $0                             |
| Inngest (free)          | $0 to 50k events/mo            |
| **Total to start**      | **~$7-12/month**               |

---

You're done. 🎉

Push a small UI tweak and watch it land live in 2 minutes — that's the magic of this setup.