# Handoff — KCD Gujarat 2026

> **READ THIS FIRST.** Every Claude Code session begins here. Update this file at end of every meaningful change so the next session boots with current context. CLAUDE.md is canonical for conventions; this file is canonical for *active work*.

_Last updated: 2026-08-23 (venue confirmed: Narayani Heights)_

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

### Hero (`components/sections/HeroSection.tsx`)

- Fills the viewport (`min-h-[100svh]`, content vertically centred, `pt-28`/`md:pt-32` to clear the sticky header) so the statue reads full height and the next section can't peek in at the fold.
- **No tagline.** `subheadline` is gone from the hero props, `app/page.tsx`, `EventConfigFrontmatter`, and `content/pages/event.md` — don't re-add one field without the other three. Under the `<h1>` sits the KubeCon-style lockup: `formatEventDateRangeShort(eventDate, eventEndDate)` over `city`, both `uppercase` in CSS so screen readers still get natural casing. The date is wrapped in `<time dateTime>` with the raw ISO value.
- `formatEventDateRangeShort()` (`lib/utils.ts`) collapses same-day to `September 19`, same-month to `September 19–21`, and spans months as `November 30 – December 2`. All Asia/Kolkata.
- CTAs are one row (`lg:flex-nowrap`, pills are `shrink-0`): Register / View Schedule / Submit a Talk / Become a Sponsor, each still gated on its flag. The old "Meet the speakers →" text link is gone — `/speakers` is reachable from the nav.
- `components/sections/Countdown.tsx` — the only client component in the hero. Weeks/days/hours/minutes/seconds circles ticking to `eventDate`. First paint is value-free (`–` placeholders in fixed-size circles) because the server can't know the visitor's clock; real numbers land on mount, so hydration stays stable and nothing shifts. Switches to a "Happening now" chip between `eventDate` and `eventEndDate`, then renders `null`. The digits are `aria-hidden` — a per-second live region is unusable with a screen reader — and a static `sr-only` sentence (`formatEventDateTime()`) carries the date instead.
- Scroll cue: a plain `<a href="#about">` chevron pinned bottom-centre. No JS — the global `scroll-behavior: smooth` + `scroll-margin-top: 6rem` do the work, and `animate-bounce` is already killed by the global `prefers-reduced-motion` block.

### Schedule + speakers (imported from Sessionize)

- `content/sessions/*.md` — 22 accepted sessions; `content/speakers/*.md` — 33 speakers. All generated from the Sessionize export, **not** hand-written. The old fictional placeholders are gone.
- Regenerate with `python3 scripts/import-sessionize.py "<accepted sessions>.xlsx"` (add `--skip-photos` to keep existing images). It **overwrites** every file in `content/sessions` + `content/speakers`, so hand-edits are lost — re-run, then re-apply. Session slugs are pinned per Sessionize id in `SESSION_SLUGS`; name fixups live in `NAME_OVERRIDES`; keynotes in `SESSION_TYPE_OVERRIDES` (Sessionize has no keynote format, so the promotion is recorded in the script, not the markdown, or the next import would drop it).
- Photos: `node scripts/import-speaker-photos.mjs "<speakers photo export>.zip"` (a folder works too) copies each file **byte for byte** to `public/images/speakers/<slug>-<hash8>.<ext>` — no resize, no re-encode, no crop, no padding (~21.5 MB for 33). The square framing is CSS (`object-cover`), never baked into the file. The 8-char digest of the contents is the cache-buster; the script also rewrites the `photo:` line in each speaker markdown to the file it wrote, so the extension and hash can never drift out of sync. Re-running with the same export is a no-op. Unmatched filenames are a hard error; aliases in `SLUG_ALIASES`. `dhwani-suthar` (400×400) and `rudraksh-karpe` (460×460) are below the 512 minimum — ask for bigger files.
- Day shape (19 Sept, Asia/Kolkata), matching the schedulelist export: registration 07:30, opening 09:15, keynotes 09:30–10:10, sponsor keynote 10:10, break 10:15, sessions 10:45–12:40, lunch 13:00, sessions 14:00–15:55, high tea 16:00, lightning talks 16:30–17:10, panel 17:25, closing 17:45, ends 18:00. Hall 1 + Hall 2 run in parallel from 10:45. The two 09:30/09:50 Hall 1 talks are the keynotes.
- **Sessions and non-session items come from two different places, by design.** `content/sessions/*.md` owns anything with a speaker; `content/pages/event.md` `timeline` owns everything else (registration, breaks, sponsor slots, ceremonies, reserved placeholders) with `time`, `endTime`, `label`, `icon`, optional `room`, and `glance`. Nothing is inferred from gaps any more, so the site can't advertise a break the printed schedule doesn't have. `lib/schedule.ts` `buildScheduleOverview()` collapses back-to-back sessions into blocks for the homepage card and interleaves the `glance: true` timeline rows; `buildAgenda()` splits the same timeline into venue-wide `rows` and room-specific `roomItems` for `/schedule`. A row with a `room` renders as a hall card in that slot; one without spans the width. `eventDate` is doors-open (07:30) and `eventEndDate` the close (18:00) — those feed the JSON-LD `Event`, while the visible "Event Ends" row is a `timeline` entry. A block whose sessions are *all* `type: Keynote` is labelled "Keynotes", so don't add a hand-written keynote row — that's what the 09:30 block already is.
- `DayAtGlance` gets `sessions` from the homepage but only when `showSpeakers` is true, so the card can't leak the schedule pre-announcement (it falls back to `PLANNED_TIMELINE`).
- Tracks: `lib/tracks.ts` is the single source of truth, and `label === schema` — both are the verbatim CFP track names. The `SessionFrontmatter.track` enum in `lib/schema.ts` must stay in lockstep. Nine tracks: Platform Engineering, Application Development + Delivery, Operations + Performance, Observability, Security, Connectivity, AI Inference + Agentic, Cloud Native Experience, Emerging + Advanced.
- `ScheduleGrid` groups day → parallel time slot (two cards side by side when halls overlap) and colours the theme badge from `TRACKS[].color`. Two filter groups — **Theme** and **Hall** — render as `aria-pressed` chip toggles (not ARIA tabs) via the shared `FilterChips`, each a `role="group"` labelled by its visible caption. Hall names are collected from the sessions and room agenda items, so a third room needs no code change, and the whole group is hidden when there's only one hall. The two filters compose. **One hall holds one item per slot** — a room agenda item is dropped when a session already occupies that hall at that time, so a stale placeholder can never sit next to the talk that replaced it. Row building is pure and lives in a `useMemo`; never mutate the grouped slots (see §5). Session cards take a `speakers` prop (`{ slug, name }[]`) from `/schedule` and print the names under the title (comma-separated, `sr-only` "Speakers:" prefix). The card stays a single link to the session so speaker names are not nested `<a>`s — `/schedule/[slug]` has the clickable speaker list with square photos.
- `/schedule` shows the venue-wide agenda rows from `buildAgenda().rows`, in the same 12-hour style as the slots. They're positioned against **all** sessions, never the filtered subset, and only render between two visible slots — so a filter can't leave a dangling Lunch at either end. A **theme** filter hides the hall placeholders (they have no theme); a **hall** filter keeps them but narrows them to that hall, so Hall 2 still shows its Women in Tech Gathering and reserved slots.
- `level` accepts `All levels` (Sessionize "Any") plus Beginner/Intermediate/Advanced.
- **There is no workshop track.** `SessionFrontmatter.type` is `Talk | Lightning | Panel | Keynote`, and the importer raises on a workshop-format row (`UNSUPPORTED_FORMATS`) instead of silently filing it as a talk. Session formats advertised on `/cfp` are Lightning (10 min) / Session (25 min) / Panel (25 min). If workshops are ever reinstated, the enum, the importer, the `/cfp` formats + home cards, and the `WhatToExpect` grid all have to move together.

### Sponsors (logo wall)

- Markdown under `content/sponsors/*.md`. Tier enum: `platinum | gold | silver | community | diversity | media`.
- Rendered by `SponsorTier` (centered flex wrap, fixed card size `h-28 w-44` → `md:h-36 md:w-56`) on homepage `SponsorStrip` and `/sponsors`. Logo height still scales by tier.
- `render: false` hides a sponsor (e.g. `sample-sponsor.md`).
- Current published: Valkey (gold), SUSE (diversity) — SUSE logo path is `/images/sponsors/suse.svg` (asset may still need adding).

### Venue (`Narayani Heights`, confirmed 2026-08-23)

- **Narayani Heights**, Ahmedabad Airport–Gandhinagar Road, adjacent to Apollo Hospital, Bhat, Gandhinagar, Gujarat **382428**. Coordinates `23.111919, 72.62925`; site `narayaniheights.com`; venue desk `+91 79 6170 1800`.
- Everything lives in `content/pages/event.md`: `venueName`, `venueAddress`, `mapEmbedUrl`, `venueUrl`, `venueDirectionsUrl`, `venueCoordinates`, `venuePhotos[]`, `venueTravel[]`. Schema in `lib/schema.ts` (`VenuePhoto`, `VenueTravelItem`, `VenueTravelIcon`). **`getEventConfig()`'s catch-branch fallback must list `venuePhotos: []` and `venueTravel: []`** — they are `.default([])`, so a fallback missing them fails typecheck.
- `mapEmbedUrl` must stay on **`www.google.com`** — `proxy.ts` CSP allows only that host in `frame-src`. The `?q=…&output=embed` form 301s to `/maps/embed?pb=…` on the *same* host, so it passes; a `maps.google.com` URL would be blocked.
- `venueDirectionsUrl` targets raw coordinates, not a name — Google geocodes "Narayani Heights" to more than one place in Gujarat, and there is no Places `place_id` to pin it with.
- Distances in `venueTravel` are **road** figures from OSRM, and `driveMinutes` is padded above free-flow for real Ahmedabad traffic. Airport ~7 km (T2 is nearer than T1), Ranip Bus Stand ~11 km, Ahmedabad Junction ~15 km. Sabarmati Junction is ~8 km, which is why the Kalupur row tells long-distance travellers to get off there instead.
- Photos: `public/images/venue/`, content-hashed like the speaker photos. Sourced from the venue's own press shots on `narayaniheights.com`, resized to a 2400px long edge at q82 (the originals are ~7000px / 20 MB — do **not** commit those). `/venue` credits them as "Photos courtesy of Narayani Heights". Ignore the `2026/05/*.jpg` set on that site: watermarked restaurant shots. Ignore anything named `ChatGPT-Image-*`: AI-generated.
- `components/site/VenueTravel.tsx` holds the icon map + `orderVenueTravel()`, shared by `/venue` and the homepage `VenueSection` (which passes `showNotes={false}`). `VenueSection` shows the hero photo when there is one and falls back to the map embed only when there isn't.
- `components/site/VenuePhotos.tsx` (client) owns every venue photo frame and the click-to-enlarge lightbox: `VenueHeroPhoto` (used by both `/venue` and the homepage `VenueSection`) and `VenuePhotoGrid` (`/venue`, `offset={1}` because photo 0 is the hero). Each renders its own `Lightbox` instance rather than sharing state through a provider — the hero and the gallery sit either side of the map and the "On the day" cards, so a shared provider would have to wrap the whole page for no behavioural gain. Both are handed the **full** photo list plus a start index, so paging walks all three either way.
  - Triggers are `<a href="{photo.src}">`, not `<button>` — the raw image still opens if JS never arrives, and the handler `preventDefault()`s only unmodified left-clicks so cmd/ctrl-click still works. `Dialog` (`components/ui/dialog.tsx`) already does the focus trap, Escape, backdrop click, scroll lock, and focus restore; the lightbox adds only Left/Right paging with wrap-around and an `aria-live` "N of 3" counter.
  - Verified over CDP: Enter on a focused trigger opens it, focus lands on Close, Tab cycles inside the panel and never escapes, Escape closes and restores focus to the trigger, `body.style.overflow` is restored, backdrop click closes. **A programmatic `.click()` in a test makes focus-restore look broken** — it lands on `<body>` because nothing focused the link first. Focus the trigger and send Enter.
  - `VenuePhoto.width`/`.height` in `event.md` are the file's real pixel size and are what let the lightbox size a photo to its own aspect. Omit them and it falls back to a fixed-height `object-contain` box, which letterboxes — that was the visible bug at 390px before the dimensions were recorded.
- **The `/venue` accessibility card is deliberately hedged.** Nothing about step-free routing or accessible washrooms is published by the venue or confirmed by the organisers, so the copy says we will arrange it on request rather than promising a facility. Parking (180 cars, multi-level basement) and food (from the `timeline`) are confirmed and stated plainly. See §6.

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

`content/speakers/amritansh.md` + `public/images/speakers/amritansh-7ba53882.{jpg → jpeg}` are dirty in the working tree from a session before 2026-08-23 — same content hash, extension only. Unrelated to the venue work; commit it separately.

Missing: `public/images/sponsors/suse.svg` (markdown already points at that path).

After pull: `pnpm install && pnpm typecheck && pnpm content:validate && pnpm build`.

Dev: use `pnpm dev` (runs content watcher + Next). Restart after killing stale `next` processes.

## 4. Recent changes (2026-08-23)

59. **Venue photos open in a lightbox** — every venue photo frame moved out of `app/venue/page.tsx` and the homepage `VenueSection` into the new client component `components/site/VenuePhotos.tsx`, and clicking one now opens it enlarged in the existing `Dialog` with caption, Left/Right paging, and an "N of 3" counter. Triggers are anchors to the image file so the photos stay reachable without JS. `VenuePhoto` gained optional `width`/`height`, filled in for all three photos in `event.md`, which is what stops the lightbox letterboxing on narrow viewports. Parking is now stated as fact — **180 cars, multi-level basement** (confirmed 2026-08-23) — so only the accessibility card is still hedged.
58. **Venue confirmed and built out** — `/venue` was a stub: a heading, an empty map slot, and four "will be shared closer to the date" cards. It now carries the real venue. `content/pages/event.md` gained `venueUrl`, `venueDirectionsUrl`, `venueCoordinates`, `venuePhotos[]`, and `venueTravel[]`; `lib/schema.ts` gained `VenuePhoto` / `VenueTravelItem` / `VenueTravelIcon` to match. `/venue` grew a real `<h1>` (it previously had none — `SectionHeader` emits an `<h2>`), a hero photo, a "Getting here" grid, the map, "On the day", a photo gallery, and `Place` JSON-LD with `geo`. The homepage `VenueSection` takes the photo + distances and drops its placeholder cards. The `Event` JSON-LD `location` on `/` upgraded from a bare address string to a `PostalAddress` with `geo`. `content/faq/where-will-event-be-held.md` no longer says the venue will be announced soon.

## 4a. Earlier changes (2026-08-14)

57. **Speaker photos on session detail** — `/schedule/[slug]` speaker cards were name + role only. Each card now has a 96px square photo (`object-cover`, centred) linking through to `/speakers/[slug]`. Initials fill in if a photo is missing. Files stay uncropped; the square is CSS, same as the speakers grid.
56. **Schedule filter labelled Theme** — `/schedule` chip group was "Track" / "All tracks"; now "Theme" / "All themes", matching the homepage "Talk themes" wording. Page header is "Sessions and themes"; empty-filter copy says theme not track. Internal `track` field names unchanged.
55. **Talk themes, not parallel-track topics** — The Day at a Glance card heading was "Parallel tracks covering talks on the following topics", which mixed CFP themes with the two halls. It now reads **Talk themes** / "Two parallel tracks — switch any time.", with the nine themes still in a single stacked list. Section description matches: "nine talk themes across two parallel tracks."
54. **Speaker names on `/schedule`** — `SessionRow` was title + track/type badges only; speaker slugs on the session were unused. `/schedule` now loads speakers and passes `{ slug, name }` into `ScheduleGrid`, which resolves names in session-slug order and renders them under the title. Names are text (the card is already a session link). `SchedulePreview` accepts the same prop so a future homepage embed stays in sync.
53. **Lightning-slot caption** — parallel rows whose talks are all `type: Lightning` (the 16:30 block onwards) now read "parallel lightning talks" instead of "parallel sessions". No count in front of either label. Driven off session type, so moving a lightning talk earlier flips the caption with it. Also filled in the missing `slotLabel` helper the grid was already calling.
52. **Keynotes are labelled in the title** — `SessionRow` prefixes a `Keynote`-typed session's title with `[Keynote] ` in `text-kcd-primary`, and drops the type badge for those two so the word doesn't appear twice on one card. Talks and lightning talks keep their badge. Driven off `session.type`, so marking another session as a keynote in `content/sessions/*.md` is enough.
51. **Speaker photos: untouched files, centred cover frames** — The importer used to force every photo into an 800×800 `fit: 'cover'` square using sharp's attention strategy, which mangled most of the 22 non-square photos (aspects run 0.56 to 1.40). It now copies each file byte for byte to `public/images/speakers/<slug>-<hash8>.<ext>` and rewrites the `photo:` line in the speaker markdown to match. Framing is CSS: `SpeakerCard` and the detail page fill their square with a centred `object-cover`. Signed off as matching the reference Sessionize grid. Filenames carry a content hash because the first pass looked like it had failed — the bytes on disk were correct, but next/image *and* the browser cache by URL, so the old cropped square kept being served under the unchanged `<slug>.jpg`.
50. **Filter by hall** — `/schedule` gained a second chip row beside the track filter, and both filter groups now share one `FilterChips` component with a visible caption wired through `aria-labelledby`. Halls are derived from `session.room` plus the room agenda items rather than hardcoded, sorted numerically, and the group is suppressed unless there are at least two. Under a hall filter each slot holds a single card so the "N parallel sessions" label and the two-column grid drop away on their own. Verified: Hall 1 → 14 cards, Hall 2 → 12 (talks plus its three reserved/gathering placeholders), Security + Hall 1 → the empty state, unfiltered → 26 cards and 12 parallel labels. `SchedulePreview` also renders `ScheduleGrid` but is currently imported nowhere, so `/schedule` is the only affected surface.
49. **One item per hall per slot** — `withRoomItems()` in `ScheduleGrid` shallow-copied `day.slots` but then mutated the shared slot objects (`slot.items = [...]`), so React's dev double-render appended each hall agenda card twice — the 14:00 / 14:30 / 15:00 / 17:00 slots read "3 parallel sessions" with a duplicated Hall 1 or Hall 2 card. Slots and their `items` arrays are now copied before mutation, a room item is skipped when that hall is already occupied at that time (a real talk wins over a placeholder), and the whole per-day row build moved into a `useMemo` so it runs once per input change. Every parallel slot now reads "2 parallel sessions", Hall 1 left / Hall 2 right, and it survives toggling track filters.
48. **Schedule aligned to the schedulelist export** — All 15 non-session agenda items live in `content/pages/event.md` `timeline`, which now carries `endTime`, optional `room`, and `glance`. `lib/schedule.ts` gained `buildAgenda()` splitting venue-wide rows from room-specific cards, and `buildScheduleOverview()` no longer *derives* breaks from gaps — nothing on the site can invent a break that the export doesn't list. `buildScheduleBreaks()` is gone. Venue-wide rows (Lunch, High Tea, Buffer) still render under a track filter; hall placeholders don't, since they belong to no track.
47. **Confirmed day boundaries** — Registration 07:30 (was 08:00), closing ceremony 17:40 (was 17:10), plus a new 18:00 "Event Ends" row so the advertised close is visible on the site, not just in the JSON-LD. `eventDate` moved to 07:30 to match doors-open. Also corrected two wrong `cfp.md` comments (21:00 read "9:00 AM", 23:59 read "6:00 PM").
46. **Workshops removed site-wide** — No page, schema, or script mentions workshops. `SessionFrontmatter.type` dropped `Workshop`; the `/cfp` "Workshop — 90 minutes" format and its home card are gone (the home card grid is now exactly `md:grid-cols-3`); the homepage `WhatToExpect` "Hands-on Workshops" card became "Lightning Talks"; copy fixed in `sponsorship.md` + `/sponsorship` fallbacks, `registration.md`, `CtaSection`, `PastEvents`, and `/schedule` metadata. The `wrench` option stays in `CfpFormatIcon` — it's a generic icon, not a workshop reference.
45. **Keynotes marked + breaks on `/schedule`** — The 09:30 and 09:50 Hall 1 talks are now `type: Keynote`, pinned in the importer's `SESSION_TYPE_OVERRIDES` so a re-import keeps them. The overview card labels an all-keynote block "Keynotes", which made the hand-written 09:00 "Keynote Sessions" row in `event.md` redundant — removed. `/schedule` now renders the break rows too, via the new `buildScheduleBreaks()`, formatted in the same 12-hour style as the slots.
44. **Schedule overview card derived from sessions** — New `lib/schedule.ts`; `DayAtGlance` takes `sessions` + fixed `timeline` rows instead of a fully hand-kept list. Surfaced a 10:10–10:45 break that the hand-written version had missed. `event.md` `timeline` trimmed to registration / keynote / closing.
43. **Key Dates removed entirely** — Deleted `components/sections/KeyDatesSection.tsx`, `content/pages/key-dates.md`, `getKeyDates()`, and `KeyDatesFrontmatter`; dropped the `/#key-dates` header nav item and the homepage section. `scripts/validate-content.ts` no longer has a default schema for `content/pages` — every page file must be registered in `fileSchema` or validation fails, so a new page can't slip through unvalidated.
42. **Schedule built from the accepted-sessions export** — 22 sessions + 33 speakers generated by `scripts/import-sessionize.py`; photos by `scripts/import-speaker-photos.mjs`. Placeholder speakers/sessions deleted. `ScheduleGrid` regrouped into parallel time slots.
41. **Tracks re-cut to the CFP taxonomy** — Old `Platform | DevSecOps | AI/ML | Networking | Beginner` enum replaced by the nine verbatim track names. Copy that enumerated the old five updated in `SchedulePreview`, `DayAtGlance`, `content/pages/cfp.md`, and the `CfpConfigFrontmatter` default.

## 4b. Earlier changes (2026-08-10)

40. **Organiser cleanup reverted** — Restored Neel Shah + Janki Chhatbar (markdown + photos). Grid back to `lg:grid-cols-4` / `previewCount=4`. Prior order values and original OrganiserCard/schema restored.

## 4c. Earlier changes (2026-07-28)

37. **Key Dates header nav + fluid header** — Key Dates → `/#key-dates`. Fluid pill `max-w-[100rem]`. Inline nav only at `xl` (1280px+); iPad Pro / tablets use hamburger + Register so brand/links/CTA never overlap.

## 4d. Earlier changes (2026-07-24)

35. **FAQ page rebuilt with sections** — `FaqFrontmatter` gained `section` (string, default `General`) + `featured` (bool). `getFaqSections()` in `lib/content.ts` groups FAQs by section; section order follows the lowest `order` in each group. `/faq` (`app/faq/page.tsx`) now renders one `<h2>` card per section under a page `<h1>`. Homepage `/#faq` shows only `featured: true` FAQs (falls back to all if none) — see `homeFaqs` in `app/page.tsx`. FAQ markdown under `content/faq/` (General/Registration/CFP/Sponsors/Community/Event/Contact); General 4 are `featured`. Old `what-is-kcd.md` + `who-should-attend.md` samples removed.
36. **Registration FAQs** — tickets are transferable (`can-i-transfer-my-ticket.md`); GST + PG fees borne by KCD Gujarat (`are-gst-and-pg-fees-included.md`).

## 4e. Earlier changes (2026-07-23)

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
- **Squaring the speaker photo files** — two attempts, both rejected. Cropping with sharp's attention strategy cut the heads off most non-square headshots. Padding out to a square canvas in the frame colour (`kcd-subtle`) kept every pixel, but the bars read as broken next to a reference grid of edge-to-edge tiles. What works: leave the file alone and let a centred `object-cover` fill the frame.
- **`object-top` on speaker photos** — pins the crop to the top of the frame so tall portraits keep the face, and it matches `OrganiserCard`. But several photos have the subject low (Darshil is seated at the bottom of a tall shot), and those tiles became a ceiling with a head sliced off at the bottom edge. Centred is the better default across this export; check Darshil, Sarvani, and Surabhi before changing it.
- **Replacing an image under the same filename** — next/image caches optimized output by URL and browsers hold it for a long max-age, so corrected photos kept rendering as the old crop even after the files on disk were right (`.next/cache/images` was only half the story; the browser cache was the stubborn half). Filenames now carry a content hash, which makes the URL change whenever the bytes do.
- **Hydration warning while driving the page from an agent browser** — the "some attributes of the server rendered HTML didn't match" overlay on `/schedule` came from `data-cursor-ref` attributes the automation injects, not from the app. Diffing the fetched SSR HTML against the live DOM showed those were the only attribute differences. Don't chase it; re-check in a plain browser first.
- **Mutating slots while rendering `ScheduleGrid`** — building rows during render and mutating the grouped slots duplicated cards under React's dev double-render. Keep the row build pure and memoized.

## 6. Single next thing to try

**Get the venue's accessibility answers and replace the hedged copy on `/venue`.** The address, coordinates, map, photos, road distances, food, and parking (180 cars, multi-level basement) are all confirmed. Accessibility is the one card still hedged: step-free routing from the porch to both halls, accessible washrooms, and lift access are unknown, the venue publishes none of it, and CLAUDE.md §8 makes this the line that matters most — a wrong promise here strands somebody at the gate. One call to the venue desk (`+91 79 6170 1800`) settles it. Also still open: the two hall names as the venue will actually label them on the day. Everything else on the venue work (schema, content, photos, lightbox, JSON-LD, typecheck, lint, validate, build) is green.

Still open behind that: the four TBA / reserved `timeline` slots in `content/pages/event.md` — the 14:00 Hall 1 "Platinum Sponsor Tech Talk", 15:00 Hall 2 "Reserved Session", 17:00 Hall 2 "Reserved Lightning Talk", and 17:25 "Panel / Fireside — TBA", plus the unclaimed 17:10–17:25 window. Once a real speaker is confirmed for any of them it becomes a `content/sessions/*.md` file and its `timeline` row gets deleted (the session then wins that hall automatically).

---

## How to keep this file fresh

At the end of any session that changed code, content, or plans:

1. Bump `_Last updated:_` to today's absolute date (YYYY-MM-DD).
2. Update §2 (current state) — only when files materially change shape, not on every typo edit.
3. Append to §4 (changes) and prune anything older than ~30 days that's now obvious from the repo.
4. Add any newly-tried-and-failed approach to §5, with the *symptom* and the *reason it was abandoned*.
5. Rewrite §6 (next thing) to the single most valuable next move — never a list.

CLAUDE.md §0 references this file; session start auto-loads CLAUDE.md, which steers the assistant here.
