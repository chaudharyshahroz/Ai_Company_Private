# Deploy Reklu on Hostinger VPS + Dokploy — Step-by-step

This is the **Hostinger-specific** walkthrough. The generic Dokploy guide
(`DOKPLOY.md`) covers Dokploy's UI in depth — this one focuses on the parts
that are unique to Hostinger: buying the VPS, opening firewall ports, setting
DNS in hPanel, and SSH access.

**End state:** `https://reklu.yourdomain.com` running live, auto-deploying
from GitHub on every push to `main`.

---

## What you need before you start

- [ ] A Hostinger account (https://www.hostinger.com)
- [ ] A domain you control (you can buy one on Hostinger too — easier to keep DNS in one place)
- [ ] A GitHub account
- [ ] About **45 minutes** for the first setup
- [ ] **~$8–12/month** running cost (VPS KVM 2 + domain)

> **Tip:** I recommend buying the domain on Hostinger if you don't have one
> yet. DNS in hPanel is one-click and gets propagated in 5–15 min. If you use
> Cloudflare, you'll need to add the records manually (also fine, just slower).

---

## Step 1 — Buy the Hostinger VPS

1. Go to https://www.hostinger.com/vps-hosting
2. Pick a plan:
   - **KVM 1** (~$5/mo, 2 GB RAM) — works for `demo mode` + small traffic
   - **KVM 2** (~$10/mo, 4 GB RAM) — **recommended** — Next.js + Postgres + Dokploy all fit comfortably
   - **KVM 4** (~$20/mo, 8 GB RAM) — if you expect real traffic on day 1
3. Choose **Ubuntu 22.04** or **24.04** (Dokploy works best on Ubuntu)
4. Pick a server location closest to your users (Germany / US / Asia)
5. Complete checkout — Hostinger emails you the **root password** and the **server IP**
6. Note down:
   - **VPS IP** (looks like `185.185.185.185`)
   - **root password** (from the email — you'll change it on first SSH)

---

## Step 2 — SSH into the VPS

From your local Mac terminal:

```bash
ssh root@YOUR_VPS_IP
```

It'll ask for the password from the email. Type it (won't show as you type — normal).

**First-thing-first housekeeping on the server:**

```bash
# Update packages
apt update && apt upgrade -y

# Set timezone (Pakistan is Asia/Karachi)
timedatectl set-timezone Asia/Karachi

# Change the root password to something you'll remember
passwd

# Optional but recommended: create a non-root user with sudo
adduser reklu
usermod -aG sudo reklu
# Now you can `ssh reklu@YOUR_VPS_IP` and `sudo` when needed
```

---

## Step 3 — Point your domain at the VPS

### Option A — Domain bought on Hostinger (easiest)

1. hPanel → **Domains** → click your domain → **DNS / Nameservers**
2. Hostinger DNS is auto-configured — just add an **A record**:
   - **Type:** A
   - **Name:** `reklu` (or `@` for the apex domain)
   - **Points to:** your VPS IP
   - **TTL:** 300
3. Save. Propagation usually takes **5–15 minutes**.

### Option B — Domain on Cloudflare / Namecheap / etc.

1. Go to your DNS provider
2. Add an **A record**: `reklu` → your VPS IP, TTL 300
3. If on Cloudflare, set proxy to **DNS only** (grey cloud) for now — Dokploy
   will handle SSL, not Cloudflare. Once everything works you can switch to
   proxied (orange cloud) later.

Verify DNS is live from your local machine:

```bash
dig reklu.yourdomain.com
# or
nslookup reklu.yourdomain.com
```

You should see your VPS IP. If not, wait a few more minutes.

---

## Step 4 — Open the firewall

Hostinger's VPS comes with **UFW (Uncomplicated Firewall)** and a Hostinger
control panel firewall. Both need to allow 80/443 for Dokploy to serve HTTPS.

### Via hPanel (easiest)

1. hPanel → **VPS** → click your server → **Firewall**
2. Add inbound rules:
   - **Port 22** (SSH) — already open, leave alone
   - **Port 80** (HTTP) — open
   - **Port 443** (HTTPS) — open
   - **Port 3000** (app, optional) — open for direct debugging
3. Save

### Via SSH (alternative)

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw enable
ufw status
```

> **Common mistake:** Dokploy install fails silently if 80 is blocked. If you
> can't reach the Dokploy UI at `http://YOUR_VPS_IP` after install, this is
> the first thing to check.

---

## Step 5 — Install Dokploy

SSH back into the VPS (still as root) and run:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

This installs:
- **Docker** + Docker Compose
- **Dokploy** (web UI on port 80)
- **Traefik** (reverse proxy with auto-SSL via Let's Encrypt)

Install takes ~3–5 minutes. When it finishes, you'll see a success message with
the Dokploy URL.

Open it in your browser:

```
http://YOUR_VPS_IP
```

The setup wizard asks you to **create an admin account**. Use a strong password
— this is the only thing standing between the public internet and your
deployment panel.

---

## Step 6 — Push your code to GitHub

The repo isn't on GitHub yet. Let's get it there.

### Option A — Web UI (no CLI needed, works on any machine)

1. Go to https://github.com/new
2. **Repository name:** `reklu`
3. **Visibility:** Private
4. ⚠️ **Do NOT** check "Add README", "Add .gitignore", or "Choose a license" — we already have these
5. Click **Create repository**
6. GitHub shows you the "push an existing repository" instructions. Copy them
   and run from your local project folder:

```bash
cd "/Users/chaudharyshahroz/Documents/Reklu AI Compny Empoly"

# Add the GitHub remote
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/reklu.git

# Push
git push -u origin main
```

> **Note:** `git@github.com:...` uses SSH. If you don't have an SSH key on
> GitHub yet, swap to HTTPS:
> `git remote add origin https://github.com/YOUR_GITHUB_USERNAME/reklu.git`
> GitHub will ask for your username + a Personal Access Token (not your
> password — create one at https://github.com/settings/tokens with `repo`
> scope).

### Option B — Install gh CLI and let me do it for you

If you want a one-shot CLI push, install GitHub CLI on your Mac:

```bash
# Install Xcode Command Line Tools if you don't have them
xcode-select --install

# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install gh
brew install gh

# Login
gh auth login
# → Choose GitHub.com → HTTPS → Login with web browser → copy the code → paste in browser

# Then I'll run:
gh repo create reklu --private --source=. --remote=origin --push
```

After the push, verify on github.com — you should see all your files.

---

## Step 7 — Connect GitHub to Dokploy

Back in Dokploy (at `http://YOUR_VPS_IP`):

1. Click **Create Project** → name: `reklu-prod`
2. Inside the project, click **Create Service** → **App**
3. **Source:** GitHub
4. Click **Connect GitHub** — this opens an OAuth flow
5. Authorize Dokploy to access your repos (you can scope it to just `reklu`)
6. Back in Dokploy:
   - **Repository:** `YOUR_USERNAME/reklu`
   - **Branch:** `main`
   - **Build type:** Dockerfile (Dokploy auto-detects)
   - **Port:** `3000`
7. Click **Deploy** — first build will fail (no env vars yet), that's OK

---

## Step 8 — Add environment variables

In Dokploy → your app → **Environment** tab, paste these (one per line, or use
the bulk-add UI). Replace the placeholders with real values:

```bash
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_APP_URL=https://reklu.yourdomain.com

# Auth — Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxx

# Database
DATABASE_URL=postgresql://reklu:STRONG_PASSWORD@reklu-db:5432/reklu

# AI
OPENROUTER_API_KEY=sk-or-xxxxxxxx

# Payments
PADDLE_API_KEY=xxxxxxxx
PADDLE_WEBHOOK_SECRET=xxxxxxxx
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=xxxxxxxx
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production

# Email
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=hello@reklu.app

# Storage (R2)
CLOUDFLARE_R2_ACCESS_KEY=xxxxxxxx
CLOUDFLARE_R2_SECRET_KEY=xxxxxxxx
CLOUDFLARE_R2_BUCKET=reklu-uploads
CLOUDFLARE_R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://files.reklu.app

# Background jobs
INNGEST_EVENT_KEY=xxxxxxxx
INNGEST_SIGNING_KEY=signkey-xxxxxxxx

# Misc
ADMIN_USER_IDS=
```

> **Missing some keys?** You can deploy with empty values and the app will run
> in **demo mode** (everything shows mock data). Fill them in later as you
> sign up for each service.

Click **Save**, then **Redeploy**.

---

## Step 9 — Add the Postgres database

In the same Dokploy project:

1. **Create Service** → **Database** → **Postgres**
2. Configure:
   - **Name:** `reklu-db`
   - **Image:** `postgres:16-alpine`
   - **User:** `reklu`
   - **Password:** *(click the dice icon to generate a strong one — copy it!)*
   - **Database:** `reklu`
   - **Persistent volume:** mount at `/var/lib/postgresql/data`
3. **Save** and let it start
4. Go back to your app service → **Dependencies** tab → add `reklu-db` so the
   app waits for the DB before starting
5. Set the app's `DATABASE_URL` env var:
   ```
   DATABASE_URL=postgresql://reklu:THE_PASSWORD_YOU_COPIED@reklu-db:5432/reklu
   ```
6. **Redeploy** the app

> **Alternative — managed Postgres (Neon):** Easier to operate, free tier
> works fine for a while. Create a project at https://neon.tech, copy the
> pooled connection string, paste it into `DATABASE_URL`, and skip this step.
> Recommended if you want automatic backups and don't want to think about it.

---

## Step 10 — Run database migrations

The schema is Drizzle ORM. Push it to the production DB.

**Easiest:** from your local machine, temporarily point at the production DB:

```bash
cd "/Users/chaudharyshahroz/Documents/Reklu AI Compny Empoly"

# Get the connection string from Dokploy (or Neon)
export DATABASE_URL="postgresql://reklu:PASSWORD@YOUR_VPS_IP:5432/reklu"

# Push schema
npm run db:push

# Seed demo data (optional)
npm run db:seed
```

> **VPS IP vs internal hostname?** Use `YOUR_VPS_IP` (the public one) when
> running from your local machine. Dokploy exposes the Postgres port
> automatically. When the *app* in Dokploy connects, use `reklu-db` (the
> internal Docker network hostname).

---

## Step 11 — Configure domain + SSL

In Dokploy → your app → **Domains** tab:

1. **Host:** `reklu.yourdomain.com`
2. ✅ **Generate SSL** (Let's Encrypt via Traefik)
3. Save. Wait ~30 seconds — Traefik hits Let's Encrypt and provisions the cert.

Open `https://reklu.yourdomain.com` in your browser.

**If you see "connection refused" or "this site can't be reached":**
- DNS not propagated yet? `dig reklu.yourdomain.com` from your local machine
- Firewall? Re-check Step 4
- Traefik logs: Dokploy → your app → **Logs** tab → look at the `traefik` service

---

## Step 12 — Continuous deployment

Once everything is working, you don't touch Dokploy for normal deploys:

```bash
# Make a change locally
# ... edit code ...

git add .
git commit -m "feat: new thing"
git push origin main
```

What happens automatically:

1. **GitHub Actions** runs lint + typecheck + build → fails? fix and re-push
2. **Dokploy** sees the webhook from GitHub → rebuilds the Docker image
3. **Traefik** swaps the new container in (zero-downtime)
4. **Live in ~2-3 minutes** at `https://reklu.yourdomain.com`

### Webhook setup (usually automatic)

Dokploy should set the webhook up automatically when you connect GitHub. If
auto-deploys stop working:

1. Dokploy → your app → **Git** tab
2. Copy the **Webhook URL**
3. GitHub → your repo → **Settings** → **Webhooks** → **Add webhook**
4. **Payload URL:** paste the Dokploy URL
5. **Content type:** `application/json`
6. **Events:** Just the push event
7. Save

### Rolling back

If a deploy breaks something:

1. Dokploy → your app → **Deployments** tab
2. Find the last working build → click **Redeploy**
3. ~1 minute to roll back

---

## Quick reference — what to do when

| You want to… | Do this |
|---|---|
| Update env vars | Dokploy → app → Environment → edit → Redeploy |
| See live logs | Dokploy → app → Logs tab |
| Open a shell in the container | Dokploy → app → Terminal tab |
| Connect to Postgres directly | Dokploy → db service → Terminal → `psql -U reklu reklu` |
| Back up Postgres | See backup section below |
| Upgrade the VPS | hPanel → VPS → upgrade plan (Dokploy stays installed) |
| Move to a bigger server | Snapshot disk → spin up new VPS → restore snapshot → update DNS |

---

## Backups

### Database (bundled Postgres on the same VPS)

Add a Dokploy **Cron Job** (in your project → Schedules):

```bash
pg_dump -U reklu -h reklu-db reklu | gzip > /backups/reklu-$(date +\%Y\%m\%d-\%H\%M).sql.gz
```

Then back up `/backups/` to R2 / S3 with a second cron:

```bash
# Install rclone first
curl https://rclone.org/install.sh | sudo bash

# Configure once
rclone config
# → name: r2, type: s3, provider: Cloudflare, account/secret/key

# Then the cron:
rclone sync /backups r2:reklu-backups/backups --log-file=/var/log/rclone.log
```

### Database (managed Neon/Supabase)

Already backed up automatically with point-in-time recovery. Nothing to do.

### App source code

Already on GitHub. Your recovery for the app itself.

---

## Troubleshooting

### Dokploy UI not reachable after install
- Open ports 80/443 (Step 4)
- Verify with: `curl -I http://YOUR_VPS_IP` from your local machine

### Build fails with "Lockfile out of sync"
The `package-lock.json` drifted. From your local machine:
```bash
cd "/Users/chaudharyshahroz/Documents/Reklu AI Compny Empoly"
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "chore: refresh lockfile"
git push
```

### Container keeps restarting
- Check **Logs** in Dokploy — usually a missing env var
- Verify all `NEXT_PUBLIC_*` vars are set (Next.js bakes these at build time)
- Verify `DATABASE_URL` is reachable from the app container

### "502 Bad Gateway"
- App crashed or hasn't finished starting
- Dokploy → app → **Logs** shows the real reason
- Healthcheck returns 200 only when `/api/health` responds — make sure that
  route is healthy

### SSL fails to provision
- DNS must point to the VPS IP *before* requesting the cert
- Let's Encrypt has rate limits — wait an hour and try again
- Dokploy → Domains → remove + re-add the domain to retry

### Out of memory (KVM 1 with 2 GB RAM)
- KVM 2 is more comfortable. Upgrade from hPanel → VPS → Upgrade.
- Or: switch to a managed Postgres (Neon free tier) to free up ~300 MB of RAM

---

## Cost summary

| Item | Cost |
|---|---|
| Hostinger VPS KVM 2 (4 GB) | ~$10/month |
| Domain (Hostinger) | ~$12/year |
| Postgres (bundled on VPS) | $0 |
| Or Postgres (Neon free) | $0 to start |
| Cloudflare R2 (10 GB) | $0 |
| Resend (3k emails/mo) | $0 |
| OpenRouter | pay-as-you-go, ~$1–5 at low volume |
| Clerk (free, 10k MAU) | $0 |
| Inngest (free, 50k events) | $0 |
| **Total to start** | **~$11/month** |

---

## What you've built

After following this guide:

- ✅ A production-deployed Reklu at `https://reklu.yourdomain.com`
- ✅ Auto-SSL via Let's Encrypt (no manual cert management)
- ✅ Auto-deploys on every push to `main`
- ✅ One-command rollback if something breaks
- ✅ Live logs + terminal into any container from Dokploy's UI
- ✅ Backups scheduled for the database
- ✅ Zero-downtime restarts when you redeploy

Push a small UI tweak and watch it land live in 2 minutes. That's the magic.