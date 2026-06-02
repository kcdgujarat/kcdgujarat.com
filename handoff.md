# Handoff — KCD Gujarat 2026

> **READ THIS FIRST.** Every Claude Code session begins here. Update this file at end of every meaningful change so the next session boots with current context. CLAUDE.md is canonical for conventions; this file is canonical for *active work*.

_Last updated: 2026-06-02 (Payload/Postgres removed)_

## 1. Goal

Ship the public marketing/event site for **KCD Gujarat 2026** — a CNCF-backed, community-organized Kubernetes conference. All content lives in markdown under `content/`; no CMS or database required. See CLAUDE.md §2–§5 for conventions (note: CLAUDE.md still mentions Payload — update in a follow-up PR).

## 2. Current state of files

### Layout + chrome

- `app/layout.tsx` — fonts + Header/Footer. Reads `getEventConfig()` for footer contact/socials; CFP + registration config for nav CTAs. No database.
- `components/site/Header.tsx` — sticky liquid-glass pill nav. Logo: `KCDGujaratLogoSmall500x500.png` in 36px round container. Nav/CTA hidden when `comingSoon`. Nav items gated: `speakersOnly` on Speakers/Schedule (`showSpeakers`), `cfpOnly` on CFP (`cfpOpen`). Smart anchor resolution via `usePathname()`.
- `components/site/Footer.tsx` — dark navy 4-column grid. Logo: `KCDGujaratLogoSmall500x500.png` at 48×48 (full badge, **not** circular crop — earlier round crop showed only blue and looked like the old placeholder dot). Speakers/Schedule gated on `showSpeakers`; CFP link gated on `cfpOpen`.
- `lib/seo.ts` — `buildMetadata()` sets favicon via `icons.icon` + `icons.apple` → `/images/Favicon250x250.png`.
- `proxy.ts` — **single edge entry point** (Next.js 16; do **not** add `middleware.ts`). Two jobs: (1) CSP headers on non-admin/non-api routes; (2) when `NEXT_PUBLIC_COMING_SOON=true`, rewrite all disallowed paths to `/__coming_soon_not_found__` (404). Allowed during coming-soon: `/`, static assets, `robots.txt`, `sitemap.xml`, `/api/health`, `/api/revalidate`, `/api/og`.
- `app/__coming_soon_not_found__/page.tsx` — internal rewrite target; calls `notFound()` → global `app/not-found.tsx` with HTTP 404.
- `app/page.tsx` — when `NEXT_PUBLIC_COMING_SOON=true`, renders `<ComingSoon />` instead of full homepage.
- `components/sections/ComingSoon.tsx` — large hero logo uses `KCDGujaratLogo2000x2000.png` (high-res for big display).

### Brand assets (`public/images/`)

- `KCDGujaratLogoSmall500x500.png` — navbar + footer
- `KCDGujaratLogo2000x2000.png` — ComingSoon page
- `Favicon250x250.png` — site icon (via `lib/seo.ts`)
- `sardarpatel.svg` — hero illustration
- `logo.jpg` — **deleted**, no longer referenced

### Routing model

- `/` — full marketing page **or** ComingSoon (env flag).
- `/team`, `/speakers`, `/schedule`, `/sponsors`, `/venue`, `/cfp`, `/register`, `/faq`, `/code-of-conduct`, `/sponsorship` — all return **404** when coming-soon mode is on (via `proxy.ts`). `/admin` no longer exists (Payload removed).
- `/speakers`, `/schedule` and sub-routes also gated on `showSpeakers: true` in content (nav visibility, not 404).
- `/register` — coming-soon copy when `registration.open: false`.
- Removed: `/blog`, `/team/[group]`.

### Content flags (`content/pages/`)

- `event.md` — headline, dates, city, venue, DayAtGlance timeline, **`contactEmail`**, **`socialLinks`** (footer + coming-soon).
- `cfp.md` — **`startDate` / `endDate`** (auto-derives `open` via Asia/Kolkata calendar); `url`, **`showSpeakers`** (independent of CFP open state).
- `registration.md` — `open`, `url`.
- `key-dates.md` — KeyDatesSection on homepage.
- `static/prospectus.pdf` — sponsorship prospectus; served at `/static/prospectus.pdf` (see `content/pages/sponsorship.md` `prospectus` field).

### Env vars (see `.env.example`)

- `NEXT_PUBLIC_COMING_SOON=false` — set to `true` to launch coming-soon-only site. Requires restart/redeploy.
- No `DATABASE_URL` / Payload vars — site is markdown-only.

## 3. Files in flight (modified, not yet committed)

Payload + Postgres removed this session. Run `pnpm install` after pull (lockfile changed). Verify with `pnpm typecheck && pnpm content:validate && pnpm build`.

## 4. Things that have changed (2026-05-27)

### Earlier session (brand + homepage)

1. Sardar Patel SVG hero, Gujarati headline styling, brand palette/fonts.
2. `showSpeakers` + `registration.md` flags; hero/event content editable via `event.md`.
3. KeyDatesSection wired to homepage; DayAtGlance timeline from markdown.
4. Navbar anchor smart-scroll; CFP nav → `/#cfp`; CtaSection removed; team join banners removed; `/team/[group]` deleted.

### This session (logo, favicon, coming-soon)

17. **Brand logo + favicon** — new PNG assets; favicon in `lib/seo.ts`; `logo.jpg` removed.
18. **Header logo** — `KCDGujaratLogoSmall500x500.png` in round 36px container.
19. **Footer logo fix** — switched from 28px `rounded-full` crop (looked like blue dot) to 48×48 full badge with explicit `width`/`height`.
20. **Coming-soon mode hardened** — `NEXT_PUBLIC_COMING_SOON=true` now blocks **all routes except `/`** with real 404 (not just homepage swap).
21. **Coming-soon UX** — header logo-only, footer hidden, `ComingSoon` section on `/`.
22. **`proxy.ts` merge** — coming-soon gating merged into existing `proxy.ts` (CSP). Deleted standalone `middleware.ts` — Next.js 16 rejects having both files (Vercel build error).
23. **Hero parallax removed** — scroll-driven transforms in `HeroSection.tsx` dropped (janky on mobile). Component is now a server component with static layout.

### 2026-06-02 — CFP date window

24. **CFP auto open/close** — `content/pages/cfp.md` now uses `startDate` + `endDate` (YYYY-MM-DD). `lib/utils.isDateRangeActive()` computes `open` at build/request time (Asia/Kolkata). Manual `open` flag removed. CTAs, nav, hero, `/cfp` page all respect computed state. Dates align with `key-dates.md` (opens 2026-06-15, closes 2026-07-15). Today (2026-06-02) CFP is closed until start date.

### 2026-06-02 — Dev content hot reload

25. **Content edits trigger dev HMR** — `pnpm dev` now runs `scripts/dev.mjs` (content watcher + Next). Watcher bumps `lib/content-revision.ts` on any `content/**/*.md(x)` change; loaders call `ensureDevContentFresh()` (`unstable_noStore` in dev). Webpack dev also watches `content/` via `WatchContentDirPlugin` in `next.config.mjs`. Use `pnpm dev` (not bare `next dev`) for markdown hot reload.

### 2026-06-02 — Payload/Postgres removed

26. **Markdown-only site** — deleted `payload.config.ts`, `collections/`, `app/(payload)/`, `lib/payload.ts`. Content loaders in `lib/content.ts` no longer merge Payload. Site settings (contact email, social links, venue) come from `content/pages/event.md`. Registration/CFP URLs from markdown + `NEXT_PUBLIC_*` env fallbacks. Removed `@payloadcms/*` and `payload` deps; docker-compose no longer runs Postgres. `pnpm build` + production smoke test pass without any database.

## 5. Failed attempts

- **Figma WebFetch / MCP** — blocked or empty; used screenshot instead.
- **`pnpm dev` HTTP 500** — first-compile latency, not a real failure.
- **Postgres connection refused** — was Payload init failure; **fixed** by removing Payload entirely.
- **`middleware.ts` + `proxy.ts` together** — Next.js 16 build error: *"Both middleware file and proxy file are detected"*. Fix: delete `middleware.ts`, keep all logic in `proxy.ts`.

## 6. Single next thing to try

**Update CLAUDE.md** to reflect markdown-only stack (remove Payload/Postgres from locked stack, env vars, folder layout). Then pull latest, confirm Vercel deploy succeeds without `DATABASE_URL`, and smoke-test coming-soon mode on preview.

---

## How to keep this file fresh

At the end of any session that changed code, content, or plans:

1. Bump `_Last updated:_` to today's absolute date (YYYY-MM-DD).
2. Update §2 (current state) — only when files materially change shape, not on every typo edit.
3. Append to §4 (changes) and prune anything older than ~30 days that's now obvious from the repo.
4. Add any newly-tried-and-failed approach to §5, with the *symptom* and the *reason it was abandoned*. Don't list ideas that were merely considered.
5. Rewrite §6 (next thing) to the single most valuable next move — never a list.

CLAUDE.md §0 references this file; session start auto-loads CLAUDE.md, which steers the assistant here.
