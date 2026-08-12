# Handoff — KCD Gujarat 2026

> **READ THIS FIRST.** Every Claude Code session begins here. Update this file at end of every meaningful change so the next session boots with current context. CLAUDE.md is canonical for conventions; this file is canonical for *active work*.

_Last updated: 2026-08-12 (schedule aligned to the schedulelist export; one item per hall per slot; keynotes marked; workshops removed)_

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

### Schedule + speakers (imported from Sessionize)

- `content/sessions/*.md` — 22 accepted sessions; `content/speakers/*.md` — 33 speakers. All generated from the Sessionize export, **not** hand-written. The old fictional placeholders are gone.
- Regenerate with `python3 scripts/import-sessionize.py "<accepted sessions>.xlsx"` (add `--skip-photos` to keep existing images). It **overwrites** every file in `content/sessions` + `content/speakers`, so hand-edits are lost — re-run, then re-apply. Session slugs are pinned per Sessionize id in `SESSION_SLUGS`; name fixups live in `NAME_OVERRIDES`; keynotes in `SESSION_TYPE_OVERRIDES` (Sessionize has no keynote format, so the promotion is recorded in the script, not the markdown, or the next import would drop it).
- Photos: `node scripts/import-speaker-photos.mjs "<speakers photo export>.zip"` → 800×800 JPEG in `public/images/speakers/<slug>.jpg` (sharp, attention crop, ~1.9 MB total). Unmatched filenames are a hard error; aliases in `SLUG_ALIASES`. `dhwani-suthar` source was only 400×400 — below the 512 minimum, ask for a bigger file.
- Day shape (19 Sept, Asia/Kolkata), matching the schedulelist export: registration 07:30, opening 09:15, keynotes 09:30–10:10, sponsor keynote 10:10, break 10:15, sessions 10:45–12:40, lunch 13:00, sessions 14:00–15:55, high tea 16:00, lightning talks 16:30–17:10, panel 17:25, closing 17:45, ends 18:00. Hall 1 + Hall 2 run in parallel from 10:45. The two 09:30/09:50 Hall 1 talks are the keynotes.
- **Sessions and non-session items come from two different places, by design.** `content/sessions/*.md` owns anything with a speaker; `content/pages/event.md` `timeline` owns everything else (registration, breaks, sponsor slots, ceremonies, reserved placeholders) with `time`, `endTime`, `label`, `icon`, optional `room`, and `glance`. Nothing is inferred from gaps any more, so the site can't advertise a break the printed schedule doesn't have. `lib/schedule.ts` `buildScheduleOverview()` collapses back-to-back sessions into blocks for the homepage card and interleaves the `glance: true` timeline rows; `buildAgenda()` splits the same timeline into venue-wide `rows` and room-specific `roomItems` for `/schedule`. A row with a `room` renders as a hall card in that slot; one without spans the width. `eventDate` is doors-open (07:30) and `eventEndDate` the close (18:00) — those feed the JSON-LD `Event`, while the visible "Event Ends" row is a `timeline` entry. A block whose sessions are *all* `type: Keynote` is labelled "Keynotes", so don't add a hand-written keynote row — that's what the 09:30 block already is.
- `DayAtGlance` gets `sessions` from the homepage but only when `showSpeakers` is true, so the card can't leak the schedule pre-announcement (it falls back to `PLANNED_TIMELINE`).
- Tracks: `lib/tracks.ts` is the single source of truth, and `label === schema` — both are the verbatim CFP track names. The `SessionFrontmatter.track` enum in `lib/schema.ts` must stay in lockstep. Nine tracks: Platform Engineering, Application Development + Delivery, Operations + Performance, Observability, Security, Connectivity, AI Inference + Agentic, Cloud Native Experience, Emerging + Advanced.
- `ScheduleGrid` groups day → parallel time slot (two cards side by side when halls overlap) and colours the track badge from `TRACKS[].color`. Filter buttons are `aria-pressed` toggles, not ARIA tabs. **One hall holds one item per slot** — a room agenda item is dropped when a session already occupies that hall at that time, so a stale placeholder can never sit next to the talk that replaced it. Row building is pure and lives in a `useMemo`; never mutate the grouped slots (see §5).
- `/schedule` shows the venue-wide agenda rows from `buildAgenda().rows`, in the same 12-hour style as the slots. They're positioned against **all** sessions, never the filtered subset, and only render between two visible slots — so a track filter can't leave a dangling Lunch at either end. Hall placeholders are hidden entirely under a filter, since they have no track.
- `level` accepts `All levels` (Sessionize "Any") plus Beginner/Intermediate/Advanced.
- **There is no workshop track.** `SessionFrontmatter.type` is `Talk | Lightning | Panel | Keynote`, and the importer raises on a workshop-format row (`UNSUPPORTED_FORMATS`) instead of silently filing it as a talk. Session formats advertised on `/cfp` are Lightning (10 min) / Session (25 min) / Panel (25 min). If workshops are ever reinstated, the enum, the importer, the `/cfp` formats + home cards, and the `WhatToExpect` grid all have to move together.

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
- No `key-dates.md` — the Key Dates section, component, loader, and schema were removed entirely (see §4).
- `cfp.md` — `startDate` / `endDate` + optional `startTime` / `endTime` (`HH:mm`, 24h, Asia/Kolkata) → auto `open` + `phase`; `showSpeakers`, `url`; `homeSection` for homepage `/#cfp` cards.
- `registration.md` — `startDate` / optional `endDate` + optional `startTime` / `endTime` (`HH:mm`, 24h) → auto `open` + `phase`; `url`.
- `sponsorship.md` — tiers, `contactEmail`, prospectus via `static/prospectus.pdf`.

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

`content/pages/cfp.md` has `showSpeakers: true` — intentional, confirmed 2026-08-12. `/speakers`, `/schedule`, their detail routes, and the homepage speaker grid are public.

The `timeline` in `event.md` now mirrors the 2026-08-12 schedulelist export row for row. Four of those rows are placeholders the export itself hasn't filled (14:00 Hall 1 sponsor tech talk, 15:00 Hall 2 reserved session, 17:00 Hall 2 reserved lightning talk, 17:25 panel/fireside), and 17:10–17:25 is unclaimed. See §6.

Missing: `public/images/sponsors/suse.svg` (markdown already points at that path).

After pull: `pnpm install && pnpm typecheck && pnpm content:validate && pnpm build`.

Dev: use `pnpm dev` (runs content watcher + Next). Restart after killing stale `next` processes.

## 4. Recent changes (2026-08-12)

49. **One item per hall per slot** — `withRoomItems()` in `ScheduleGrid` shallow-copied `day.slots` but then mutated the shared slot objects (`slot.items = [...]`), so React's dev double-render appended each hall agenda card twice — the 14:00 / 14:30 / 15:00 / 17:00 slots read "3 parallel sessions" with a duplicated Hall 1 or Hall 2 card. Slots and their `items` arrays are now copied before mutation, a room item is skipped when that hall is already occupied at that time (a real talk wins over a placeholder), and the whole per-day row build moved into a `useMemo` so it runs once per input change. Every parallel slot now reads "2 parallel sessions", Hall 1 left / Hall 2 right, and it survives toggling track filters.
48. **Schedule aligned to the schedulelist export** — All 15 non-session agenda items live in `content/pages/event.md` `timeline`, which now carries `endTime`, optional `room`, and `glance`. `lib/schedule.ts` gained `buildAgenda()` splitting venue-wide rows from room-specific cards, and `buildScheduleOverview()` no longer *derives* breaks from gaps — nothing on the site can invent a break that the export doesn't list. `buildScheduleBreaks()` is gone. Venue-wide rows (Lunch, High Tea, Buffer) still render under a track filter; hall placeholders don't, since they belong to no track.
47. **Confirmed day boundaries** — Registration 07:30 (was 08:00), closing ceremony 17:40 (was 17:10), plus a new 18:00 "Event Ends" row so the advertised close is visible on the site, not just in the JSON-LD. `eventDate` moved to 07:30 to match doors-open. Also corrected two wrong `cfp.md` comments (21:00 read "9:00 AM", 23:59 read "6:00 PM").
46. **Workshops removed site-wide** — No page, schema, or script mentions workshops. `SessionFrontmatter.type` dropped `Workshop`; the `/cfp` "Workshop — 90 minutes" format and its home card are gone (the home card grid is now exactly `md:grid-cols-3`); the homepage `WhatToExpect` "Hands-on Workshops" card became "Lightning Talks"; copy fixed in `sponsorship.md` + `/sponsorship` fallbacks, `registration.md`, `CtaSection`, `PastEvents`, and `/schedule` metadata. The `wrench` option stays in `CfpFormatIcon` — it's a generic icon, not a workshop reference.
45. **Keynotes marked + breaks on `/schedule`** — The 09:30 and 09:50 Hall 1 talks are now `type: Keynote`, pinned in the importer's `SESSION_TYPE_OVERRIDES` so a re-import keeps them. The overview card labels an all-keynote block "Keynotes", which made the hand-written 09:00 "Keynote Sessions" row in `event.md` redundant — removed. `/schedule` now renders the break rows too, via the new `buildScheduleBreaks()`, formatted in the same 12-hour style as the slots.
44. **Schedule overview card derived from sessions** — New `lib/schedule.ts`; `DayAtGlance` takes `sessions` + fixed `timeline` rows instead of a fully hand-kept list. Surfaced a 10:10–10:45 break that the hand-written version had missed. `event.md` `timeline` trimmed to registration / keynote / closing.
43. **Key Dates removed entirely** — Deleted `components/sections/KeyDatesSection.tsx`, `content/pages/key-dates.md`, `getKeyDates()`, and `KeyDatesFrontmatter`; dropped the `/#key-dates` header nav item and the homepage section. `scripts/validate-content.ts` no longer has a default schema for `content/pages` — every page file must be registered in `fileSchema` or validation fails, so a new page can't slip through unvalidated.
42. **Schedule built from the accepted-sessions export** — 22 sessions + 33 speakers generated by `scripts/import-sessionize.py`; photos by `scripts/import-speaker-photos.mjs`. Placeholder speakers/sessions deleted. `ScheduleGrid` regrouped into parallel time slots.
41. **Tracks re-cut to the CFP taxonomy** — Old `Platform | DevSecOps | AI/ML | Networking | Beginner` enum replaced by the nine verbatim track names. Copy that enumerated the old five updated in `SchedulePreview`, `DayAtGlance`, `content/pages/cfp.md`, and the `CfpConfigFrontmatter` default.

## 4a. Earlier changes (2026-08-10)

40. **Organiser cleanup reverted** — Restored Neel Shah + Janki Chhatbar (markdown + photos). Grid back to `lg:grid-cols-4` / `previewCount=4`. Prior order values and original OrganiserCard/schema restored.

## 4b. Earlier changes (2026-07-28)

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
- **Sessionize CDN photo URLs** — the export's `Profile Picture` column points at `cdn.sessionize.com` and is capped at 400×400. Don't hot-link it (would need a new `images.remotePatterns` entry) and don't use it as the source; use the separate "speakers photo export" zip, which ships the originals.
- **`pnpm dev` content-watch EMFILE** — watcher can crash on macOS file limits; use plain `next dev` as fallback or raise `ulimit`.
- **Deriving breaks from gaps between sessions** — worked while the day was only sessions, but it can't distinguish Lunch from a hall changeover and it invented rows the printed schedule doesn't have. Non-session items are now explicit in `event.md`; don't reintroduce gap inference.
- **Mutating slots while rendering `ScheduleGrid`** — building rows during render and mutating the grouped slots duplicated cards under React's dev double-render. Keep the row build pure and memoized.

## 6. Single next thing to try

**Fill the four TBA / reserved slots** in `content/pages/event.md` `timeline` — the 14:00 Hall 1 "Platinum Sponsor Tech Talk", the 15:00 Hall 2 "Reserved Session", the 17:00 Hall 2 "Reserved Lightning Talk", and the 17:25 "Panel / Fireside — TBA" are placeholders from the export. Once a real speaker is confirmed for any of them, it becomes a `content/sessions/*.md` file and its `timeline` row gets deleted (the session then wins that hall automatically). Also unclaimed: the 17:10–17:25 window between the last lightning talk and the panel. Everything else (schedule, content, photos, tracks, keynotes, typecheck, validate, build) is green.

---

## How to keep this file fresh

At the end of any session that changed code, content, or plans:

1. Bump `_Last updated:_` to today's absolute date (YYYY-MM-DD).
2. Update §2 (current state) — only when files materially change shape, not on every typo edit.
3. Append to §4 (changes) and prune anything older than ~30 days that's now obvious from the repo.
4. Add any newly-tried-and-failed approach to §5, with the *symptom* and the *reason it was abandoned*.
5. Rewrite §6 (next thing) to the single most valuable next move — never a list.

CLAUDE.md §0 references this file; session start auto-loads CLAUDE.md, which steers the assistant here.
