# Handoff — KCD Gujarat 2026

> **READ THIS FIRST.** Every Claude Code session begins here. Update this file at end of every meaningful change so the next session boots with current context. CLAUDE.md is canonical for conventions; this file is canonical for *active work*.

_Last updated: 2026-07-28 (Key Dates header nav)_

## 1. Goal

Ship the public marketing/event site for **KCD Gujarat 2026** — a CNCF-backed, community-organized Kubernetes conference. All content lives in markdown under `content/`; **no CMS or database**. See CLAUDE.md §2–§5 for conventions (note: CLAUDE.md still mentions Payload — update in a follow-up PR).

## 2. Current state of files

### Layout + chrome

- `app/layout.tsx` — fonts + Header/Footer. Loads `getEventConfig()` (contact email), `getSocialLinks()` (footer icons), CFP + registration config for nav CTAs. No database.
- `components/site/Header.tsx` — sticky liquid-glass pill nav. Team link → `/#team`; Key Dates → `/#key-dates`. Nav/CTA gated on `comingSoon`, `cfpOpen`, `showSpeakers`, registration phase.
- `components/site/Footer.tsx` — dark navy 4-column grid. Social icons via `<SocialLinks variant="footer" />` under logo **and** in copyright bar.
- `components/site/SocialLinks.tsx` — shared X / LinkedIn / Instagram / GitHub / YouTube icon row. Used in footer, coming-soon, `/cfp` and `/register` “opens soon” cards.
- `lib/site-social.ts` — `SiteSocialLinks` type + `normalizeSiteSocialLinks()` (maps legacy `twitter` → `x`).
- `lib/content.ts` — `getSocialLinks()` reads `content/pages/social.md`; throws on invalid YAML (no silent `{}`).
- `proxy.ts` — CSP + coming-soon gating. Do **not** add `middleware.ts` (Next.js 16 conflict).

### Sponsors (logo wall)

- Markdown under `content/sponsors/*.md`. Tier enum: `platinum | gold | silver | community | diversity | media`.
- Rendered by `SponsorTier` (centered flex wrap, fixed card size `h-28 w-44` → `md:h-36 md:w-56`) on homepage `SponsorStrip` and `/sponsors`. Logo height still scales by tier.
- `render: false` hides a sponsor (e.g. `sample-sponsor.md`).
- Current published: Valkey (gold), SUSE (diversity) — SUSE logo path is `/images/sponsors/suse.svg` (asset may still need adding).

### Social links (`content/pages/social.md`)

Edit this file to change official profiles — **not** `event.md`:

```yaml
x: "https://x.com/kcdgujarat"
linkedin: "https://www.linkedin.com/company/kcd-gujarat"
instagram: "https://www.instagram.com/kcdgujarat"
```

Rendered in: footer, coming-soon page, `/cfp` + `/register` when phase is `upcoming`. Leave a field blank to hide that icon.

### Content flags (`content/pages/`)

- `event.md` — headline, dates, city, venue, timeline, `contactEmail` (no social links here).
- `cfp.md` — `startDate` / `endDate` + optional `startTime` / `endTime` (`HH:mm`, 24h, Asia/Kolkata) → auto `open` + `phase`; `showSpeakers`, `url`; `homeSection` for homepage `/#cfp` cards.
- `registration.md` — `startDate` / optional `endDate` + optional `startTime` / `endTime` (`HH:mm`, 24h) → auto `open` + `phase`; `url`.
- `sponsorship.md` — tiers, `contactEmail`, prospectus via `static/prospectus.pdf`.
- `key-dates.md` — homepage KeyDatesSection.

### Routing / gating

- `/speakers`, `/schedule` (+ slug pages) → **404** when `showSpeakers: false` or phase is `upcoming`/`open`.
- `/admin` → gone (Payload removed).
- Coming-soon mode (`NEXT_PUBLIC_COMING_SOON=true`) → only `/` served; footer hidden; social icons on `<ComingSoon />`.

### Env vars (see `.env.example`)

- `NEXT_PUBLIC_COMING_SOON`, `NEXT_PUBLIC_REGISTRATION_URL`, `NEXT_PUBLIC_CFP_URL`, `REVALIDATE_SECRET`
- **No** `DATABASE_URL` / Payload vars needed.

### Deployments (Vercel Git + promote on approve)

- **main** — every push triggers a Vercel build on `main` (staged if auto-assign production domains is off).
- **Production** — `deploy-production.yml` (`workflow_dispatch` + `environment: production` approval) calls Vercel API to **promote the latest READY `main` deployment** — no `production` git branch.
- **Secrets:** `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID` (team only). Sync IDs: `./scripts/sync-vercel-github-secrets.sh`
- **One-time setup:** `./scripts/setup-vercel-ci.sh` — Production Branch = `main`, disable auto-assign production domains.

## 3. Files in flight

Untracked / local sponsor content: `content/sponsors/suse.md`, `content/sponsors/valkey.md`, `public/images/sponsors/valkey.svg`. Missing: `public/images/sponsors/suse.svg`.

After pull: `pnpm install && pnpm typecheck && pnpm content:validate && pnpm build`.

Dev: use `pnpm dev` (runs content watcher + Next). Restart after killing stale `next` processes.

## 4. Recent changes (2026-07-28)

37. **Key Dates header nav + fluid header** — Key Dates → `/#key-dates`. Fluid pill `max-w-[100rem]`. Inline nav only at `xl` (1280px+); iPad Pro / tablets use hamburger + Register so brand/links/CTA never overlap.

## 4b. Earlier changes (2026-07-24)

35. **FAQ page rebuilt with sections** — `FaqFrontmatter` gained `section` (string, default `General`) + `featured` (bool). `getFaqSections()` in `lib/content.ts` groups FAQs by section; section order follows the lowest `order` in each group. `/faq` (`app/faq/page.tsx`) now renders one `<h2>` card per section under a page `<h1>`. Homepage `/#faq` shows only `featured: true` FAQs (falls back to all if none) — see `homeFaqs` in `app/page.tsx`. FAQ markdown under `content/faq/` (General/Registration/CFP/Sponsors/Community/Event/Contact); General 4 are `featured`. Old `what-is-kcd.md` + `who-should-attend.md` samples removed.
36. **Registration FAQs** — tickets are transferable (`can-i-transfer-my-ticket.md`); GST + PG fees borne by KCD Gujarat (`are-gst-and-pg-fees-included.md`).

## 4b. Earlier changes (2026-07-23)

33. **Sponsor logo-wall tiers** — schema + `SponsorTier` + homepage/sponsors page lists now include `community` and `diversity` (plus existing platinum/gold/silver/media). Centered flex layout for sparse tiers. Fixes typecheck break from `/sponsors` listing `diversity` before the enum existed.
34. **Uniform sponsor cards** — all logo-wall boxes share one fixed width/height; tier prominence is logo height only.

## 5. Failed attempts

- **Postgres / Payload** — removed entirely; was optional fallback, caused empty settings.
- **Social icons in `event.md`** — moved to dedicated `social.md`.
- **Silent `getSocialLinks()` catch** — replaced with `safeParse` + throw on invalid frontmatter.
- **`middleware.ts` + `proxy.ts`** — Next.js 16 rejects both; keep `proxy.ts` only.
- **`pnpm dev` content-watch EMFILE** — watcher can crash on macOS file limits; use plain `next dev` as fallback or raise `ulimit`.

## 6. Single next thing to try

**Add `public/images/sponsors/suse.svg`** so the Diversity sponsor logo renders (markdown already points at that path). Then commit sponsor content + tier support together. (FAQ page + content is done and building; commit it too.)

---

## How to keep this file fresh

At the end of any session that changed code, content, or plans:

1. Bump `_Last updated:_` to today's absolute date (YYYY-MM-DD).
2. Update §2 (current state) — only when files materially change shape, not on every typo edit.
3. Append to §4 (changes) and prune anything older than ~30 days that's now obvious from the repo.
4. Add any newly-tried-and-failed approach to §5, with the *symptom* and the *reason it was abandoned*.
5. Rewrite §6 (next thing) to the single most valuable next move — never a list.

CLAUDE.md §0 references this file; session start auto-loads CLAUDE.md, which steers the assistant here.
