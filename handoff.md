# Handoff — KCD Gujarat 2026

> **READ THIS FIRST.** Every Claude Code session begins here. Update this file at end of every meaningful change so the next session boots with current context. CLAUDE.md is canonical for conventions; this file is canonical for *active work*.

_Last updated: 2026-05-27 (logo + favicon session)_

## 1. Goal

Ship the public marketing/event site for **KCD Gujarat 2026** — a CNCF-backed, community-organized Kubernetes conference. All long-lived content lives in markdown under `content/`; Payload CMS is a fallback. See CLAUDE.md §2–§5 for the locked stack and content rules.

## 2. Current state of files

### Layout + chrome

- `app/layout.tsx` — loads **Plus Jakarta Sans** (display, `--font-display`) + **Inter** (body, `--font-sans`) + **Noto Sans Gujarati** (`--font-gujarati`) via `next/font/google`. Fetches `getSettings()` + `getCfpConfig()` + `getRegistrationConfig()` in parallel. Passes `cfpOpen`, `cfpUrl`, `showSpeakers`, `registrationOpen`, `registrationUrl` to both Header and Footer.
- `components/site/Header.tsx` — sticky liquid-glass pill nav. Nav items flagged `speakersOnly` (Speakers, Schedule — visible only when `showSpeakers: true`) and `cfpOnly` (CFP — visible only when `cfpOpen: true`). Primary CTA: "Submit a Talk" when CFP open; "Register" when registration open; hidden when both closed. Uses `usePathname()` to resolve anchor links: on homepage → `#section` (in-page smooth scroll), on other pages → `/#section` (full navigation + anchor jump, no hero flash).
- `components/site/Footer.tsx` — dark navy 4-column grid. Speakers/Schedule links gated on `showSpeakers`. CFP "Submit a Talk" link gated on `cfpOpen`. `showSpeakers` prop passed from layout.
- `app/globals.css` — Warm Cream `#f6f4ed` body bg, `--font-sans`/`--font-display`/`--font-gujarati` CSS vars, `.kcd-glass` + `.kcd-glass-link`, universal hover transitions, `:focus-visible` outline at `#4285f4`.
- `tailwind.config.ts` — `kcd.*` palette updated to brand spec: primary `#4285F4` (Tech Blue), green `#557B3E` (Heritage Green), orange/accent `#E05F36` (Terracotta), ink `#111827`, navy `#0F172A`, bg/cream `#F6F4ED`.

### Routing model

- `/` (`app/page.tsx`) — HeroSection → AboutSection → WhatToExpect → **KeyDatesSection** → SpeakersPreview (gated on `showSpeakers`) → DayAtGlance → CfpSection (gated on `cfpOpen`) → VenueSection → TeamPreview → SponsorStrip → CommunityPartners → FaqSection. Fetches all data + `getKeyDates()` + `getEventConfig()` + `getRegistrationConfig()` in parallel.
- `/team` — full grouped roster. "See more" buttons link to `/team` (not sub-routes).
- `/team/[group]` — **deleted**. Route removed, directory removed.
- `/speakers`, `/speakers/[slug]`, `/schedule`, `/schedule/[slug]` — gated on `showSpeakers`.
- `/register` — shows "Registration opens soon" when `registration.open: false`; ticketing redirect when `open: true`.
- `/sponsors`, `/sponsorship`, `/venue`, `/cfp`, `/faq`, `/code-of-conduct`, `/api/*`, `/admin/*` — unchanged.
- Removed: `/blog`, `/blog/[slug]`.

### Sections (all under `components/sections/`)

- `HeroSection.tsx` — `'use client'`. Headline: "Kubernetes Community Days **ગુજરાત** 2026" — `ગુજરાત` in `font-gujarati text-kcd-orange`, year in bordered pill badge (always "2026"). Right-side image is `public/images/sardarpatel.svg` absolutely positioned flush to the right edge of the panel (`object-contain object-right-bottom`). Hero gradient updated to brand spec: pale yellow → soft orange → coral/pink. Buttons gated: "Submit a Talk" on `cfpOpen`; "Book Tickets" on `registrationOpen`; "View Schedule" + "Meet the speakers →" on `showSpeakers`.
- `AboutSection.tsx` — CNCF SVG fixed: `style={{ width: 'auto' }}` added to suppress Next.js aspect-ratio warning.
- `WhatToExpect.tsx` — CFP callout block (deadline + Submit-a-Talk) only rendered when `cfpOpen: true`. "CFP Closed" state removed.
- `KeyDatesSection.tsx` — now rendered on homepage after `WhatToExpect`. Uses `getKeyDates()` from `content/pages/key-dates.md`. Falls back to internal FALLBACK array.
- `DayAtGlance.tsx` — accepts `timeline?: TimelineItem[]` prop from `event.md`. Falls back to `DEFAULT_TIMELINE` if not provided.
- `CfpSection.tsx` — rendered on homepage only when `cfpOpen: true`. Nav "CFP" link points to `/#cfp` for smooth-scroll.
- `TeamPreview.tsx` — "Want to join our team?" banner removed. "See more" buttons link to `/team`.
- `CtaSection.tsx` — removed from homepage (file still exists, just not imported).

### Content (`content/pages/`)

- `event.md` — **new**. Controls: `headline`, `subheadline`, `eventDate`, `eventEndDate`, `city`, `venueName`, `venueAddress`, `mapEmbedUrl`, `timeline[]` (DayAtGlance schedule items). Markdown-first; Payload settings fill anything blank.
- `cfp.md` — `open: true|false`, `deadline`, `url`, **`showSpeakers: false|true`** (independent of CFP state; controls speaker/schedule visibility everywhere).
- `registration.md` — **new**. `open: false|true`, `url`. Gates all "Book Tickets"/"Register" buttons and the `/register` page.
- `key-dates.md` — existing. Drives `KeyDatesSection` on homepage.

### Schema + loaders (`lib/`)

- `schema.ts` — added `EventConfigFrontmatter` (headline/subheadline/eventDate/eventEndDate/city/venueName/venueAddress/mapEmbedUrl/timeline), `TimelineItem` (time/label/icon), `RegistrationConfigFrontmatter` (open/url). `CfpConfigFrontmatter` extended with `showSpeakers: boolean`.
- `content.ts` — added `getEventConfig()`, `getRegistrationConfig()`. All existing loaders unchanged.

## 3. Files in flight (modified, not yet committed)

Run `git status` for the definitive list. Key dirty files from this session:

- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- `app/team/page.tsx` (team "join" banner removed)
- `app/register/page.tsx` (coming-soon gating)
- `components/site/Header.tsx`, `components/site/Footer.tsx`
- `components/sections/HeroSection.tsx`, `WhatToExpect.tsx`, `DayAtGlance.tsx`, `TeamPreview.tsx`, `AboutSection.tsx`
- `lib/schema.ts`, `lib/content.ts`
- `tailwind.config.ts`
- `content/pages/event.md` (new), `content/pages/registration.md` (new), `content/pages/cfp.md` (showSpeakers added)
- `public/images/sardarpatel.svg` (new)

Do NOT commit without running `pnpm typecheck && pnpm content:validate && pnpm build`.

## 4. Things that have changed (this session — 2026-05-27)

1. **Sardar Patel SVG in hero** — replaced inline `StatueOfUnityIllustration` with `next/image` at `public/images/sardarpatel.svg`, absolutely positioned flush to right edge of hero panel. Mobile fallback inline below text.
2. **Hero headline** — "Kubernetes Community Days ગુજરાત 2026" — ગુજરાત in Terracotta Orange + Noto Sans Gujarati; "2026" hardcoded in bordered pill badge (date badge removed, always shows year).
3. **Brand guidelines applied** — colors (Tech Blue `#4285F4`, Heritage Green `#557B3E`, Terracotta `#E05F36`, Warm Cream `#F6F4ED`, Dark Ink `#111827`, Deep Navy `#0F172A`); fonts (Plus Jakarta Sans display, Inter body, Noto Sans Gujarati); hero gradient (pale yellow → warm orange → coral/pink).
4. **`showSpeakers` flag** — independent boolean in `cfp.md` that controls speaker lineup + schedule visibility everywhere (hero buttons, nav, footer, `SpeakersPreview`, `DayAtGlance` "View Full Schedule").
5. **Registration flag** — new `content/pages/registration.md` with `open` + `url`. All "Book Tickets"/"Register" buttons gated. `/register` page shows coming-soon when `open: false`.
6. **Hero content editable via markdown** — `content/pages/event.md` drives headline, subheadline, eventDate, city, venueName, venueAddress, mapEmbedUrl, and DayAtGlance timeline.
7. **Key dates fixed** — `KeyDatesSection` was built but never added to homepage. Now rendered after `WhatToExpect`.
8. **DayAtGlance timeline editable** — `timeline:` array in `event.md`; component falls back to defaults if omitted.
9. **Navbar smart anchor resolution** — `usePathname()` in Header: `/#section` links become `#section` when on `/` (in-page smooth scroll) and stay `/#section` on other pages (browser jumps to anchor without scrolling from hero).
10. **CFP nav → smooth scroll** — "CFP" nav item changed from `/cfp` to `/#cfp`; `CfpSection` added to homepage gated on `cfpOpen`.
11. **WhatToExpect CFP banner** — "CFP Closed" state removed; entire banner hidden when `cfpOpen: false`.
12. **CtaSection removed** from homepage (dark navy "Be part of…" banner).
13. **Team "Want to join" banners removed** — from both homepage `TeamPreview` and `/team` page.
14. **`/team/[group]` route deleted** — "See more" buttons now go to `/team`.
15. **CNCF SVG aspect-ratio warning fixed** — `style={{ width: 'auto' }}` added to `<Image>`.
16. **Footer speaker/schedule links gated** on `showSpeakers`.

## 5. Failed attempts

- **Figma WebFetch on proto URL** — WebFetch returned empty. Pivoted to screenshot.
- **Figma MCP `get_design_context`** — file blocked; auth seat had no access.
- **`pnpm dev` HTTP 500** — first-compile latency, not a real failure.
- **Postgres connection refused** — Payload init failure cached as null; site runs in markdown-only mode.

## 6. Single next thing to try

**Add real photos.** Drop portraits into `public/images/team/<slug>.jpg` and `public/images/speakers/<slug>.jpg`, partner/sponsor logos into `public/images/partners/<slug>.svg`. Add `photo:` / `logo:` to the corresponding markdown frontmatter. No code change required — components already render the image when the field is set.

After photos: confirm `pnpm build` completes cleanly (no TypeScript errors, no broken image paths), then do a Vercel preview deployment.

---

### Logo + favicon (2026-05-27)

- `public/images/KCDGujaratLogo2000x2000.png` — new brand logo. Replaces `logo.jpg` in Header, Footer, and ComingSoon components. Displayed in a rounded container with `object-contain` + white background.
- `public/images/Favicon250x250.png` — new favicon. Added to `lib/seo.ts` `buildMetadata` via `icons.icon` + `icons.apple` so it applies to every route.

---

## How to keep this file fresh

At the end of any session that changed code, content, or plans:

1. Bump `_Last updated:_` to today's absolute date (YYYY-MM-DD).
2. Update §2 (current state) — only when files materially change shape, not on every typo edit.
3. Append to §4 (changes) and prune anything older than ~30 days that's now obvious from the repo.
4. Add any newly-tried-and-failed approach to §5, with the *symptom* and the *reason it was abandoned*. Don't list ideas that were merely considered.
5. Rewrite §6 (next thing) to the single most valuable next move — never a list.

CLAUDE.md §0 references this file; session start auto-loads CLAUDE.md, which steers the assistant here.
