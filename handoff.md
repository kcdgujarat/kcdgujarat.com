# Handoff — KCD Gujarat 2026

> **READ THIS FIRST.** Every Claude Code session begins here. Update this file at end of every meaningful change so the next session boots with current context. CLAUDE.md is canonical for conventions; this file is canonical for *active work*.

_Last updated: 2026-05-24_

## 1. Goal

Ship the public marketing/event site for **KCD Gujarat 2026** — a CNCF-backed, community-organized Kubernetes conference. Structurally modeled after KCD Kochi 2026 (`kcd_kochi_website/`), Gujarat-themed (cream + navy + blue/green/orange palette, Outfit + Hind Vadodara fonts, liquid-glass nav). All long-lived content lives in markdown under `content/`; Payload CMS is a fallback. See CLAUDE.md §2–§5 for the locked stack and content rules.

## 2. Current state of files

**Layout + chrome**

- `app/layout.tsx` — loads `Outfit` + `Hind_Vadodara` Google Fonts, fetches `getSettings()` + `getCfpConfig()`, passes `cfpOpen` + `cfpUrl` to Header + Footer.
- `components/site/Header.tsx` — sticky liquid-glass pill nav. NAV items flagged `hideWhenCfpOpen` (Speakers, Schedule) and `cfpOnly` (CFP). Primary CTA swaps between `Submit a Talk` (CFP open) and `Register` (CFP closed). Mobile menu sheet uses same filter.
- `components/site/Footer.tsx` — dark navy 4-column grid. Event + Get-involved columns swap links based on `cfpOpen`. CFP-Open pill badge shown in brand block when open. Blog link removed.
- `app/globals.css` — cream body bg, Outfit + Hind Vadodara CSS vars, `marquee` keyframes, `.kcd-glass` + `.kcd-glass-link` (liquid-glass surface + hover chip), universal hover transitions, `:focus-visible` baseline outline (a11y).
- `tailwind.config.ts` — extended palette under `kcd.*` (primary/green/orange/yellow/ink/navy/bg/cream/surface/muted/border/subtle/notice). `font-gujarati` family registered.

**Routing model**

- `/` (`app/page.tsx`) — composes HeroSection → AboutSection → WhatToExpect → SpeakersPreview (gated) → DayAtGlance → VenueSection → TeamPreview → SponsorStrip → CommunityPartners → FaqSection → CtaSection. Fetches `getSpeakers/getSessions/getSponsors/getFaqs/getTeam/getPartners/getCfpConfig` in parallel.
- `/team` (`app/team/page.tsx`) — full grouped roster (Organizers / Core / Volunteers) with anchors.
- `/team/[group]` — group-filtered sub-route via `generateStaticParams` → `organizers | core | volunteers`. "See more" buttons on home link here.
- `/speakers` + `/speakers/[slug]` — gated by CFP. When `cfp.open: true` → empty state with Submit-a-Talk; detail routes return 404 (empty `generateStaticParams`).
- `/schedule` + `/schedule/[slug]` — same gating pattern.
- `/sponsors`, `/sponsorship`, `/venue`, `/cfp`, `/register`, `/faq`, `/code-of-conduct`, `/team`, `/api/*`, `/admin/*` — unchanged from earlier iterations.
- Removed: `/blog`, `/blog/[slug]`. Don't re-add without explicit request.

**Sections / cards / lists** (all under `components/sections/`)

- `HeroSection.tsx` — `'use client'`, two-tier CTA layout, parallax on rainbow blur + headline + statue SVG (respects `prefers-reduced-motion`), CFP-open badge.
- `AboutSection.tsx` — Gujarat intro + CNCF support card (`public/images/cncf.svg`).
- `WhatToExpect.tsx` — 4 activity cards + CFP callout block (deadline + Submit-a-Talk).
- `DayAtGlance.tsx` — timeline + 5 parallel tracks from `lib/tracks.ts`. Empty state when CFP open.
- `SpeakersPreview.tsx` — uses `getSpeakers()` from markdown.
- `TeamPreview.tsx` — caps each group at 4 cards, "See more {group} (N more)" CTA → `/team/{group}`.
- `SponsorStrip.tsx` — tiered (Diamond → Media). Renders empty-state CTA when no markdown sponsors.
- `CommunityPartners.tsx` — markdown-driven via `getPartners()`.
- `CtaSection.tsx` — final dark-navy block with rainbow blur + optional sold-out state.
- `VenueSection.tsx`, `FaqSection.tsx`, `CfpSection.tsx`, `ComingSoon.tsx` — pre-existing, lightly touched.
- Deleted from page composition but file still on disk (unused, safe to remove): `CommunityMixers.tsx`, `PastEvents.tsx`, `KeyDatesSection.tsx`.

**Content (`content/`)**

- `pages/cfp.md` — controls global CFP state: `open: true|false`, `deadline`, `url`. Default: `open: true`.
- `pages/key-dates.md` — existing.
- `team/*.md` — **17 members**: 7 organizers (Aditya, Priya, Rohan, Nidhi, Karan, Anjali, Yash) + 10 volunteers (Arjun, Meera, Vikram, Sneha, Devang, Riya, Hardik, Tanvi, Kunal, Pooja).
- `partners/*.md` — **8 partners**: CNCG Ahmedabad, AWS UG Gujarat, DevOps Gujarat, GDG Cloud Ahmedabad, Women in Cloud Native, Techbeatly, Konfhub, TinkerHub.
- `speakers/*.md` — **15 speakers** total (Asha + 14 new).
- `sessions/*.md` — **16 sessions**, covers all 15 speakers + 2 keynotes (Raghav, Sneha). All 5 tracks + 4 talk types represented. Placeholder date `2026-09-12`.
- `sponsors/sample-sponsor.md` — only sample. Add real sponsors here when confirmed.
- `faq/*.md` — 3 existing.

**Schema + loaders**

- `lib/schema.ts` — Zod schemas: `SpeakerFrontmatter`, `SessionFrontmatter` (track enum: Platform/DevSecOps/AI-ML/Networking/Beginner), `SponsorFrontmatter`, `FaqFrontmatter`, `KeyDatesFrontmatter`, `TeamFrontmatter` (group: organizer/core/volunteer), `PartnerFrontmatter`, `CfpConfigFrontmatter`. `BlogFrontmatter` removed.
- `lib/content.ts` — `getSpeakers/getSessions/getSponsors/getFaqs/getKeyDates/getTeam/getPartners/getCfpConfig`. `getBlogPosts` removed.
- `lib/tracks.ts` — **single source of truth** for tracks: `{id, schema, label, color}`. Both `DayAtGlance` and `ScheduleGrid` import from here. `schema` strings must match `SessionFrontmatter.track` enum.
- `lib/payload.ts` — hardened: init failure cached as null, single warn, downstream `getSettings()` handles null. Site runs in markdown-only mode when Postgres unavailable.
- `scripts/validate-content.ts` — validates speakers/sessions/sponsors/faq/pages/team/partners. Per-file override for `pages/cfp.md` (uses `CfpConfigFrontmatter`).
- `collections/BlogPosts.ts` deleted; `payload.config.ts` no longer references it.

**Other**

- `proxy.ts` (renamed from `middleware.ts`) — exports `proxy(req)` for Next 16 convention. Adds CSP headers, skips on `/admin` + `/api`.
- `eslint.config.mjs` — ignores `kcd_kochi_website/**`.

## 3. Files in flight (modified, not yet committed)

`git status` should be the source of truth. Run it first thing in any session. Anticipated dirty files vs `main`:

- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- `app/team/page.tsx`, `app/team/[group]/page.tsx` (new)
- `app/speakers/page.tsx`, `app/speakers/[slug]/page.tsx`
- `app/schedule/page.tsx`, `app/schedule/[slug]/page.tsx`
- `app/sitemap.ts`
- `components/site/Header.tsx`, `components/site/Footer.tsx`, `components/site/ScheduleGrid.tsx`
- `components/sections/HeroSection.tsx`, `AboutSection.tsx`, `WhatToExpect.tsx` (new), `DayAtGlance.tsx` (new), `TeamPreview.tsx`, `SponsorStrip.tsx`, `CommunityPartners.tsx` (rewritten), `CtaSection.tsx`
- `components/sections/CommunityMixers.tsx`, `PastEvents.tsx`, `KeyDatesSection.tsx` (unused, safe to delete)
- `components/ui/button.tsx` (primary variant `!text-white`)
- `lib/schema.ts`, `lib/content.ts`, `lib/tracks.ts` (new), `lib/payload.ts`
- `scripts/validate-content.ts`
- `tailwind.config.ts`, `payload.config.ts`, `proxy.ts` (was `middleware.ts`), `CLAUDE.md`
- `content/pages/cfp.md`, `content/team/*.md` (17 files), `content/partners/*.md` (8 files), `content/speakers/*.md` (14 new), `content/sessions/*.md` (15 new)
- `public/images/cncf.svg` (copied from Kochi assets)
- `app/blog/*`, `collections/BlogPosts.ts` — deleted

Do NOT commit without running `pnpm typecheck && pnpm content:validate && pnpm build`.

## 4. Things that have changed

Chronological, most recent first:

1. **Site stability hardening** — `lib/payload.ts` now caches init failure as null instead of retrying every request. Suppresses Postgres-down log spam in local dev. Markdown content remains source of truth.
2. **`middleware.ts` → `proxy.ts`** — Next 16 convention. Exported fn renamed from `middleware` to `proxy`.
3. **A11y guidelines added** (`CLAUDE.md §8`) — 9 testable subsections (semantic HTML, keyboard/focus, contrast, images, forms, motion, i18n, progressive enhancement, testing). Global `:focus-visible` outline rule added to `globals.css`.
4. **Blog removed completely** — app routes, content dir, Payload collection, schema, loader, sitemap entries, footer link.
5. **Hero + Header + Footer + Sitemap CFP gating** — when `cfp.open: true`, hide Speakers/Schedule nav links, swap Hero CTAs, drop Speakers/Schedule from footer, drop those paths from sitemap. Hero shows orange-dot CFP-Open badge with deadline.
6. **`/speakers` + `/schedule` route gating** — empty state ("announce after CFP closes") + Submit-a-Talk CTA when `cfp.open: true`. `[slug]` routes return 404 in that state.
7. **`content/pages/cfp.md` introduced** — single markdown flag drives CFP gating. Schema: `CfpConfigFrontmatter { open, deadline?, url?, announcedAt? }`.
8. **Tracks unified across home + schedule** — `lib/tracks.ts` is canonical. `DayAtGlance` (display) and `ScheduleGrid` (filter) both import. Filter compares against `schema` string (matches `SessionFrontmatter.track` enum).
9. **15 sessions added** — covers all 15 speakers, 2 keynotes (Raghav, Sneha), all 5 tracks, 4 talk types.
10. **14 new speakers added** — 15 total.
11. **`getPartners()` + 8 partner markdown files** added.
12. **`getTeam()` + 17 team markdown files** added (4→7 organizers, 4→10 volunteers).
13. **`/team` + `/team/[group]` routes** — `/team` shows all groups; sub-routes for filtered. TeamPreview on home caps 4-per-group + "See more" CTA.
14. **Homepage rewritten around KCD Kochi content map** — 12-section flow, all sections markdown-driven where possible.
15. **Removed homepage sections (user request)** — Hero Panel B (navy "Kubernetes Community Day ગુજરાત" lockup), CommunityMixers, PastEvents, keynote teaser cards in DayAtGlance.
16. **Liquid glass nav** — frosted pill container + per-link hover chip. Border highlight, inner sheen, layered shadows. Falls back to solid cream on browsers without `backdrop-filter`.
17. **Parallax hero** — rainbow blur + headline + statue SVG translate3d at scroll. In-view culling + `prefers-reduced-motion: reduce` bail-out.
18. **Theme tokens** — Outfit (display) + Hind Vadodara (Gujarati). `kcd-*` palette extended with brand colors. Body bg = `#EEE8DA` cream.
19. **Footer reverted to 4-column grid** with navy bg (retained from Figma-driven redesign).

## 5. Failed attempts

- **Figma WebFetch on proto URL** — WebFetch returned empty (Figma renders client-side via JS, no HTML scrape). Pivoted.
- **Figma MCP `get_design_context` / `get_screenshot`** — file blocked. `whoami` showed auth as `me@heyadityak.com` on Starter / View seat; file `Np73YOl6ZyoWNxz14TXvAn` not shared with that account. Asked user to share or export.
- **PNG-export route** — asked user to export hero/navbar/footer frames to `/Users/beingadityak/Downloads/`. Files didn't appear (latest in dir was older than today). Eventually user pasted a screenshot directly into chat.
- **`pnpm dev` returning HTTP 500** — appeared transiently when curling immediately after spawn. Was first-compile latency, not a real failure. Subsequent probes returned 200 across every route.
- **Postgres connection refused at `::1:5432`** — Payload tries to init at startup, fails noisily. Mitigated by hardening `lib/payload.ts` to cache the rejection and degrade to markdown-only mode. **Not a site-broken signal — site renders fine without Postgres.**

## 6. Single next thing to try

**Verify the dev-server fix end-to-end:** clear `.next`, run `pnpm dev`, hit `/`, `/team`, `/team/organizers`, `/speakers` (gated state), `/schedule` (gated state). Confirm:

1. All routes return 200 + render HTML with the expected content.
2. Console shows the single `[payload] init failed` warning instead of per-request stack traces.
3. CFP-gated sections behave correctly (Speakers + Schedule routes show "after CFP closes" state because `content/pages/cfp.md` has `open: true`).
4. Liquid-glass nav + focus rings + parallax all work in a real browser session.

If anything in (1)–(4) fails, capture the exact error before changing anything else. The previous "site is not working" report could not be reproduced — build + dev + every route returned 200 here. Need the user's specific symptom (URL + error text + browser console) to act further.

After that's clean, the next bounded task is **real photos**: drop portraits into `public/images/team/<slug>.jpg`, `public/images/speakers/<slug>.jpg`, and partner logos into `public/images/partners/<slug>.svg`. Then add `photo:` / `logo:` to the corresponding markdown frontmatter. No code change required — components already render the image when the field is set.

---

## How to keep this file fresh

At the end of any session that changed code, content, or plans:

1. Bump `_Last updated:_` to today's absolute date (YYYY-MM-DD).
2. Update §2 (current state) — only when files materially change shape, not on every typo edit.
3. Append to §4 (changes) and prune anything older than ~30 days that's now obvious from the repo.
4. Add any newly-tried-and-failed approach to §5, with the *symptom* and the *reason it was abandoned*. Don't list ideas that were merely considered.
5. Rewrite §6 (next thing) to the single most valuable next move — never a list.

CLAUDE.md §0 references this file; session start auto-loads CLAUDE.md, which steers the assistant here.
