# HOSTING.md — Free-tier hosting plan for KCD Gujarat 2026

This document is the operational plan for deploying and running `kcdgujarat.com` at **$0/month** through the conference cycle. It pairs with `CLAUDE.md` (which describes the codebase) and should be updated whenever the infrastructure changes.

## 1. Goal and constraints

- **Total recurring cost: $0.** No paid tiers, no metered services with surprise bills.
- One production deployment plus PR previews.
- The Payload admin and the public site live in the same Next.js app, so they deploy together.
- Domain `kcdgujarat.com` is already owned; we only need DNS.

## 2. Service map (all free tier)

| Layer        | Service                          | Free-tier headroom (as of 2026‑05) | Why we chose it                                      |
|--------------|----------------------------------|--------------------------------------|------------------------------------------------------|
| App + admin  | **Vercel Hobby**                 | 100 GB bandwidth/mo, unlimited deploys, ISR, Edge Network | Native Next.js host; preview deploys per PR.          |
| Database     | **Vercel Postgres** (Neon-backed)| ~256 MB storage, 60 compute‑hours/mo | One-click integration, branching for previews.        |
| Media        | **Vercel Blob**                  | ~1 GB storage, ~10 GB bandwidth/mo   | Tight integration with Next.js + Payload upload adapter. |
| DNS          | Existing registrar (apex)        | n/a                                  | Domain already owned.                                |
| Email (txn)  | **Resend** free tier             | 3 000 emails/mo, 100/day             | Only used for Payload admin password resets.         |
| Analytics    | **Vercel Web Analytics** (basic) | Free on Hobby                        | Privacy-friendly, no cookie banner overhead.         |
| Uptime check | **UptimeRobot** free             | 50 monitors, 5‑min interval          | Pings `/`, `/admin`, `/api/health`.                  |

> **License note — read before launch.** Vercel's Hobby plan terms prohibit "commercial use." A CNCF-backed, community-run KCD with sponsor logos is generally accepted as non-commercial (no paid product, no ads, no sales funnel), but if we ever sell tickets through the site itself, run paid ads, or operate a for-profit storefront, we **must** upgrade to Pro. Confirm in writing with the lead organizer before launch.

## 3. Architecture diagram

```
                             ┌────────────────────────────┐
            kcdgujarat.com → │  Vercel Edge / CDN          │
                             │  (ISR + static assets)      │
                             └──────────────┬──────────────┘
                                            │
                             ┌──────────────▼──────────────┐
                             │ Next.js app (App Router)    │
                             │ ├─ Public marketing pages   │
                             │ ├─ /admin (Payload CMS)     │
                             │ └─ /api/* (revalidate, og)  │
                             └─────┬───────────────┬───────┘
                                   │               │
                       ┌───────────▼──┐    ┌───────▼─────────┐
                       │ Vercel       │    │ Vercel Blob     │
                       │ Postgres     │    │ (speaker photos,│
                       │ (Payload DB) │    │  sponsor logos) │
                       └──────────────┘    └─────────────────┘
```

## 4. One-time setup (do these in order)

### 4.1 Vercel project

1. Push the repo to GitHub (`kcdgujarat/kcdgujarat.com` or similar).
2. In Vercel → **Add New… → Project → Import** from GitHub.
3. Framework preset: **Next.js**. Root directory: repo root.
4. **Skip** environment variables for now — we'll wire them after creating the DB and Blob store so Vercel's "Connect store" flow auto‑injects the right names.

### 4.2 Database — Vercel Postgres (Neon)

1. Project → **Storage → Create Database → Postgres → Hobby (Free)**.
2. Region: **`bom1` (Mumbai)** to keep latency low for organizers and IST attendees.
3. Click **Connect Project**. Vercel injects `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE` into all environments.
4. In our code, alias for Payload:
   ```ts
   // payload.config.ts
   db: postgresAdapter({
     pool: { connectionString: process.env.POSTGRES_URL_NON_POOLING },
   }),
   ```
   Use the **non-pooling** URL for Payload migrations and admin work; use the pooled URL for runtime queries.
5. Free-tier reality: ~256 MB storage and ~60 compute‑hours/month. A KCD-sized CMS (a few hundred speakers/sessions/sponsors + media records) is well under both. The DB sleeps when idle and wakes on first query (~300 ms cold start) — acceptable for an admin-only workload.

### 4.3 Media — Vercel Blob

1. Project → **Storage → Create Store → Blob → Hobby (Free)**.
2. Click **Connect Project**. Vercel injects `BLOB_READ_WRITE_TOKEN`.
3. Wire Payload's blob adapter:
   ```ts
   // payload.config.ts
   import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';

   plugins: [
     vercelBlobStorage({
       collections: { media: true },
       token: process.env.BLOB_READ_WRITE_TOKEN!,
     }),
   ],
   ```
4. Configure `next.config.mjs` to allow Blob as a remote image source:
   ```js
   images: {
     remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
   }
   ```
5. Discipline rules to stay inside 1 GB: SVG for all sponsor logos; speaker photos compressed to ≤ 200 KB each (square JPEG/AVIF); no raw PNGs over 500 KB; no video.

### 4.4 Application secrets

Add these manually in **Project → Settings → Environment Variables** (separately for Production, Preview, Development):

| Variable                      | Value                                                |
|-------------------------------|------------------------------------------------------|
| `PAYLOAD_SECRET`              | 64‑char random string (`openssl rand -hex 32`)       |
| `PAYLOAD_PUBLIC_SERVER_URL`   | `https://kcdgujarat.com` (prod) / `$VERCEL_URL` (preview) |
| `REVALIDATE_SECRET`           | 32‑char random string                                |
| `NEXT_PUBLIC_SITE_URL`        | `https://kcdgujarat.com`                             |
| `NEXT_PUBLIC_REGISTRATION_URL`| from ticketing provider                              |
| `NEXT_PUBLIC_CFP_URL`         | from Sessionize                                      |
| `RESEND_API_KEY`              | from Resend dashboard                                |

Postgres + Blob env vars are auto-injected by their integrations — do not paste them by hand.

### 4.5 Domain

1. Project → **Settings → Domains → Add** `kcdgujarat.com` and `www.kcdgujarat.com`.
2. Vercel will show two DNS records to add at the registrar:
   - Apex `kcdgujarat.com` → `A` record `76.76.21.21` *(or use Vercel's `ALIAS`/`ANAME` if the registrar supports it).*
   - `www.kcdgujarat.com` → `CNAME` `cname.vercel-dns.com`.
3. In Vercel, set the **primary** domain to the apex; `www` will 308 redirect to it automatically.
4. SSL certificates issue automatically via Let's Encrypt within ~1 minute.
5. Add `kcdgujarat.com` to `next.config.mjs` `images.remotePatterns` only if we ever serve images from it directly (we don't today; Blob covers it).

### 4.6 Email (transactional)

Used only for Payload admin password resets and the eventual contact form.

1. Sign up for **Resend** free tier.
2. Add `kcdgujarat.com` as a sending domain → add the DKIM/SPF/DMARC records the dashboard prints out at the registrar.
3. Set Payload's email config:
   ```ts
   email: nodemailerAdapter({
     defaultFromAddress: 'no-reply@kcdgujarat.com',
     defaultFromName: 'KCD Gujarat',
     transportOptions: { /* SMTP creds from Resend */ },
   }),
   ```

### 4.7 Analytics + uptime

- **Vercel Web Analytics**: Project → **Analytics → Enable**. Add `<Analytics />` in `app/layout.tsx`.
- **UptimeRobot**: create three HTTPS keyword monitors at 5‑minute intervals — `/`, `/speakers`, `/api/health` (a tiny route handler that returns `{ ok: true }`). Email alerts to the organizer mailing list.

## 5. Environments and branching

| Environment | Trigger             | Database                            | Blob          | Domain                                |
|-------------|---------------------|-------------------------------------|---------------|---------------------------------------|
| Production  | push to `main`      | `kcdgujarat-db` (prod branch)       | Prod store    | `kcdgujarat.com`                      |
| Preview     | every PR            | **Neon DB branch** auto-created     | Prod store *  | `kcd-gujarat-com-pr-<n>.vercel.app`   |
| Development | `pnpm dev` locally  | Local Docker Postgres               | Local mock    | `http://localhost:3000`               |

\* Free tier doesn't give us per-preview Blob isolation. PRs read/write the prod Blob store; this is acceptable because uploads happen only via the admin UI, not from preview builds. If a PR needs to test uploads, do it on `main` after merge or in local dev.

**Free-tier preview DB caveat:** the free Vercel/Neon tier does not include database branching. Until we upgrade, all previews share the production DB. This is fine for content/UI changes (the only writes are organizer-driven via the admin UI), but **do not run destructive migrations on preview branches** — see §7.

## 6. Caching and revalidation strategy

- All public pages use ISR with `export const revalidate = 3600` (1 hour). Cheap and bounded.
- Payload `afterChange` hooks call `POST /api/revalidate?secret=$REVALIDATE_SECRET` with the affected paths so content edits go live within seconds without burning compute.
- Static assets (`/_next/static/*`, `/images/*`) are CDN-cached by Vercel for a year (`immutable`).
- OG images (`/api/og/*`) are dynamic but cached at the edge with `Cache-Control: public, max-age=86400`.

This keeps us well inside Hobby's bandwidth budget even if a CNCF retweet spikes traffic to ~50 k visits in a day.

## 7. Migrations and content workflow

- Schema migrations live in `migrations/` and run on first boot via Payload's auto-migrate. For destructive changes (drops, renames), open a PR, run the migration locally against a dump of prod, and merge during a low-traffic window.
- Markdown content (`/content/**`) ships with the build — no DB write needed. Editing a speaker = a content PR = a Vercel preview = merge to ship.
- Payload admin edits (settings, media uploads) write straight to the prod DB. The nightly sync script (`scripts/sync-payload-to-markdown.ts`) opens a PR back into Git so we keep a durable record. Run it as a Vercel Cron at `0 19 * * *` UTC (00:30 IST).

## 8. Backups and disaster recovery

Free tier doesn't include managed backups, so we roll our own:

- **Daily DB dump** via Vercel Cron at `0 18 * * *` UTC: `scripts/backup-db.ts` runs `pg_dump`, compresses, and uploads the file to a private GitHub release on `kcdgujarat/backups`. Retain 14 days.
- **Blob inventory** weekly: a small script lists all blobs and commits the manifest (URLs + checksums) to the same `backups` repo so we can re-upload from local copies if a blob is deleted.
- **Restore drill**: rehearse once before the event. Spin up a fresh Vercel Postgres on a throwaway project, `psql < dump.sql`, point a preview deploy at it, confirm `/admin` works.

## 9. Free-tier limits — what we monitor

| Limit                              | Our expected usage     | Alert threshold |
|------------------------------------|------------------------|-----------------|
| Vercel bandwidth (100 GB/mo)       | < 5 GB/mo before event, ~20 GB peak event week | 60 GB/mo         |
| Vercel Postgres storage (256 MB)   | < 50 MB                | 200 MB           |
| Vercel Postgres compute (60 hrs/mo)| Admin + previews only  | 40 hrs           |
| Vercel Blob storage (~1 GB)        | < 200 MB (SVG-first)   | 700 MB           |
| Vercel Blob bandwidth (~10 GB/mo)  | depends on photo size  | 6 GB             |
| Resend (3 000 emails/mo)           | < 50/mo                | 1 000            |

Add a weekly Vercel Cron job that pulls these counters via the Vercel API and posts a summary to the organizer Slack/Discord. If any threshold trips, switch on the escape hatch in §10.

## 10. Escape hatches if we hit a limit

These are pre-decided so we never panic-deploy under load:

1. **Bandwidth blowing up** → enable Cloudflare in front of Vercel (free) and proxy `kcdgujarat.com`. Cloudflare absorbs the static traffic and we stay under Vercel's meter.
2. **Blob over quota** → flip to Cloudflare R2 (10 GB free, no egress). The Payload Blob adapter swap is a 20-line change.
3. **DB compute exhausted** → Neon direct free tier is more generous than Vercel Postgres free tier; export and re-import to a Neon project, swap the connection string. No code change.
4. **Hobby commercial-use challenge from Vercel** → upgrade to Pro for the event month only ($20), then downgrade.

## 11. Security checklist before going live

- `PAYLOAD_SECRET` and `REVALIDATE_SECRET` are 32+ bytes of randomness, set per environment, never committed.
- Payload `Users` collection has `auth: { maxLoginAttempts: 5, lockTime: 600_000 }` and email verification enabled.
- `/admin` is rate-limited via Vercel's built-in firewall rules (free tier includes basic rules).
- HTTPS only, HSTS preload header set in `next.config.mjs`.
- `Content-Security-Policy` set in middleware allowing only our own domain, Vercel Blob hostname, Resend (for tracking pixels if used), and the embedded map provider.
- Two organizers hold Vercel Owner access; one holds the GitHub admin role; rotate at the end of the event.
- `.env.local` is in `.gitignore`; `.env.example` is the only env file in the repo.

## 12. Pre-launch runbook

T‑14 days:
- Final content freeze for speakers/sessions in Markdown.
- Run Lighthouse on `/`, `/speakers`, `/schedule`, `/sponsors`, `/venue`. SEO and Best Practices ≥ 95.
- Run `pnpm test:a11y` — zero serious/critical violations.
- Restore drill (§8).

T‑3 days:
- Switch Vercel project from "Hobby" deploy protection to **"Standard Protection"** so previews aren't crawled.
- Verify `sitemap.xml` and `robots.txt` at `kcdgujarat.com`.
- Submit sitemap to Google Search Console and Bing Webmaster.

T‑0 (event day):
- Disable destructive migrations.
- Watch Vercel Analytics + UptimeRobot dashboards.
- Have the §10 escape hatches one click away.

---

_Last updated: 2026‑05‑10. Update this file in the same PR as any change that contradicts it._
