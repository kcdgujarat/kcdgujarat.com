# Handoff — KCD Gujarat 2026

> **READ THIS FIRST.** Every Claude Code session begins here. Update this file at end of every meaningful change so the next session boots with current context. CLAUDE.md is canonical for conventions; this file is canonical for *active work*.

_Last updated: 2026-05-27 (end of day — logo, coming-soon, proxy fix)_

## 1. Goal

Ship the public marketing/event site for **KCD Gujarat 2026** — a CNCF-backed, community-organized Kubernetes conference. All long-lived content lives in markdown under `content/`; Payload CMS is a fallback. See CLAUDE.md §2–§5 for the locked stack and content rules.

## 2. Current state of files

### Layout + chrome

- `app/layout.tsx` — loads **Plus Jakarta Sans** (display) + **Inter** (body) + **Noto Sans Gujarati** via `next/font/google`. Reads `NEXT_PUBLIC_COMING_SOON`; when `true`, passes `comingSoon` to Header and **hides Footer**. Fetches settings + CFP + registration config in parallel.
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
- `/team`, `/speakers`, `/schedule`, `/sponsors`, `/venue`, `/cfp`, `/register`, `/faq`, `/code-of-conduct`, `/sponsorship`, `/admin` — all return **404** when coming-soon mode is on (via `proxy.ts`).
- `/speakers`, `/schedule` and sub-routes also gated on `showSpeakers: true` in content (nav visibility, not 404).
- `/register` — coming-soon copy when `registration.open: false`.
- Removed: `/blog`, `/team/[group]`.

### Content flags (`content/pages/`)

- `event.md` — headline, dates, city, venue, DayAtGlance timeline.
- `cfp.md` — `open`, `deadline`, `url`, **`showSpeakers`** (independent of CFP open state).
- `registration.md` — `open`, `url`.
- `key-dates.md` — KeyDatesSection on homepage.

### Env vars (see `.env.example`)

- `NEXT_PUBLIC_COMING_SOON=false` — set to `true` to launch coming-soon-only site. Requires restart/redeploy.

## 3. Files in flight (modified, not yet committed)

Working tree is **clean** as of end of session. Local branch `v1-website` was **behind `origin/v1-website` by 2 commits** — run `git pull` before starting next session.

Do NOT commit without: `pnpm typecheck && pnpm content:validate && pnpm build`.

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

## 5. Failed attempts

- **Figma WebFetch / MCP** — blocked or empty; used screenshot instead.
- **`pnpm dev` HTTP 500** — first-compile latency, not a real failure.
- **Postgres connection refused** — Payload init fails; site runs markdown-only.
- **`middleware.ts` + `proxy.ts` together** — Next.js 16 build error: *"Both middleware file and proxy file are detected"*. Fix: delete `middleware.ts`, keep all logic in `proxy.ts`.

## 6. Single next thing to try

**Verify production with coming-soon mode.** Pull latest (`git pull`), confirm Vercel deploy succeeds after the `proxy.ts` fix, set `NEXT_PUBLIC_COMING_SOON=true` on Vercel, and smoke-test: `/` shows ComingSoon; direct hits to `/speakers`, `/team`, `/admin` return 404. Then flip to `false` when ready for full launch.

After that: add real speaker/team photos under `public/images/` and wire `photo:` / `logo:` in markdown frontmatter (no code change needed).

---

## How to keep this file fresh

At the end of any session that changed code, content, or plans:

1. Bump `_Last updated:_` to today's absolute date (YYYY-MM-DD).
2. Update §2 (current state) — only when files materially change shape, not on every typo edit.
3. Append to §4 (changes) and prune anything older than ~30 days that's now obvious from the repo.
4. Add any newly-tried-and-failed approach to §5, with the *symptom* and the *reason it was abandoned*. Don't list ideas that were merely considered.
5. Rewrite §6 (next thing) to the single most valuable next move — never a list.

CLAUDE.md §0 references this file; session start auto-loads CLAUDE.md, which steers the assistant here.
