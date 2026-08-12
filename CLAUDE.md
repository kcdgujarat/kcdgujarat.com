# CLAUDE.md — KCD Gujarat 2026

This file is the canonical brief for any AI assistant (Claude Code, Cursor, etc.) or human contributor working in this repository. Read it end‑to‑end before changing code, and keep it up to date when conventions change.

## 0. Session start

**ALWAYS read [`handoff.md`](./handoff.md) before doing any work.** It tracks current goal, in-flight files, recent changes, failed attempts, and the single next thing to try. CLAUDE.md is for conventions; `handoff.md` is for active state. After any meaningful change, update `handoff.md` per the instructions in its trailing section.

## 1. Project overview

This repository hosts the official website for **Kubernetes Community Days (KCD) Gujarat 2026** — a CNCF‑backed, community‑driven, single‑day conference for the cloud‑native community in Gujarat, India.

The site is modeled on [kcd.cncgkochi.in](https://kcd.cncgkochi.in) (KCD Kochi 2026) in scope, page structure, and tone. Treat that site as the visual and informational reference; do not copy its branding, logos, color palette, or photography.

**Goals of this codebase:**

- Serve a fast, accessible, SEO‑friendly marketing/event site.
- Let non‑developer organizers update most content (speakers, sponsors, schedule, FAQs, sessions) through either a Markdown file in Git **or** the Payload CMS admin UI — without touching React code.
- Be cheap to host and easy to redeploy on Vercel as content changes through the conference cycle.

## 2. Tech stack (locked)

Do not swap any of the following without an explicit decision documented in this file.

- **Framework:** Next.js 14+ (App Router, React Server Components, TypeScript, `strict: true`).
- **Headless CMS:** [Payload CMS 3.x](https://payloadcms.com/), running in the same Next.js app (Payload's Next.js integration). Postgres adapter (Neon or Supabase in production, local Docker Postgres in dev).
- **Content source of truth:** Markdown / MDX files committed to Git under `/content` *plus* Payload collections. See section 5 for which content lives where.
- **Styling:** Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) components. No CSS‑in‑JS, no other component libraries. Icons via `lucide-react`.
- **Deployment:** Vercel (frontend + Payload admin). Database on Neon. Media on Vercel Blob or S3‑compatible storage.
- **Package manager:** pnpm. Node ≥ 20.
- **Linting / formatting:** ESLint (Next config) + Prettier + `eslint-plugin-tailwindcss`. Run `pnpm lint` and `pnpm typecheck` before any commit.

## 3. Information architecture

The site is a **multi‑page Next.js app** (App Router). The home page is a long marketing landing page with anchor sections; speakers, sponsors, venue, and schedule are first‑class routed pages so they are crawlable, deep‑linkable, and individually shareable on social.

Routes (under `app/`):

- `/` — Home. Hero, about KCD, what to expect, "previous editions" teaser, CTA buttons (Register, CFP), navigation links into the four standalone pages, sponsor strip, FAQs, code of conduct link, organizers, contact.
- `/speakers` — Speaker grid (photo, name, role, company, talk title), each clickable to `/speakers/[slug]` for full bio + session details.
- `/schedule` — Multi‑track agenda. Filter/toggle by track. Each session links to `/schedule/[slug]` with abstract, speaker(s), room, time.
- `/sponsors` — Tiered logo wall (Platinum / Gold / Silver / Community). Each tier rendered with appropriate prominence; clicking a sponsor opens its site in a new tab.
- `/venue` — Venue name, address, embedded map, travel/parking info, accommodation suggestions, accessibility info.
- `/cfp` — Call for proposals (links out to Sessionize).
- `/register` — Registration (links out to the ticketing provider; this page exists so we control SEO/OG).
- `/code-of-conduct` — Static MDX.
- `/team` — Organizers and volunteers.
- `/sponsorship` — Sponsorship prospectus / tiers and benefits.
- `/blog` and `/blog/[slug]` — Optional but supported; pre/post‑event posts.
- `/faq` — FAQs (also surfaced as an accordion section on `/`).

The header navigation on every page links to: Home, Speakers, Schedule, Sponsors, Venue, CFP, Register. Footer links: Code of Conduct, Team, Sponsorship, FAQ, social, CNCF disclaimer.

## 4. Folder layout

```
.
├── app/                          # Next.js App Router routes
│   ├── (marketing)/page.tsx      # Home
│   ├── speakers/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── schedule/
│   ├── sponsors/
│   ├── venue/
│   ├── cfp/
│   ├── register/
│   ├── team/
│   ├── sponsorship/
│   ├── code-of-conduct/
│   ├── faq/
│   ├── blog/
│   ├── api/                      # Route handlers (revalidate, og, etc.)
│   ├── (payload)/                # Payload-mounted admin & API routes
│   ├── layout.tsx
│   └── globals.css
├── components/                   # Reusable UI (shadcn/ui based)
│   ├── ui/                       # shadcn primitives (generated)
│   ├── site/                     # Header, Footer, Nav, SponsorTier…
│   └── sections/                 # HeroSection, ScheduleGrid, SpeakerCard…
├── content/                      # Markdown/MDX — Git is source of truth
│   ├── pages/                    # Static page bodies (about, venue body…)
│   ├── speakers/                 # One .md per speaker
│   ├── sessions/                 # One .md per session
│   ├── sponsors/                 # One .md per sponsor (or a sponsors.yaml)
│   ├── faq/                      # One .md per question
│   └── blog/                     # One .md per post
├── lib/
│   ├── content.ts                # Markdown loaders (gray-matter + remark)
│   ├── payload.ts                # Payload helpers / typed fetchers
│   ├── seo.ts                    # Metadata builders
│   └── i18n.ts                   # Locale dictionary loader
├── public/
│   ├── images/                   # Static, non-CMS imagery
│   └── og/                       # Pre-rendered fallback OG images
├── payload.config.ts             # Payload CMS config (collections, access)
├── collections/                  # Payload collection definitions
├── messages/                     # i18n dictionaries (en.json, gu.json)
├── scripts/                      # One-off scripts (e.g., import speakers)
├── tests/                        # Playwright + Vitest
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md
```

## 5. Content model — Markdown vs. Payload

This project intentionally supports **both** Git‑backed Markdown *and* Payload CMS. Use this rule:

- **Markdown in `/content` is the source of truth** for: speakers, sessions, sponsors, FAQs, blog posts, and the body copy of static pages (home sections, venue, code of conduct, sponsorship prospectus).
- **Payload CMS is used for**: site‑wide settings (event dates, registration URL, hero CTA, contact email), media library (uploaded speaker photos, sponsor logos), and an optional editor‑friendly path for organizers who don't want to open a PR. When a record exists in both Markdown and Payload with the same `slug`, **Markdown wins** at build time.
- A nightly (and on‑demand) sync job pulls Payload changes into a Markdown PR so Git remains the durable record.

### 5.1 Markdown file conventions

Every Markdown file uses YAML frontmatter. Slugs come from filename (`kebab-case.md`). Required fields per type:

```markdown
---
# content/speakers/jane-doe.md
name: "Jane Doe"
role: "Staff Engineer"
company: "Acme Cloud"
photo: "/images/speakers/jane-doe.jpg"   # or a Payload media id
socials:
  twitter: "https://x.com/janedoe"
  linkedin: "https://linkedin.com/in/janedoe"
  github: "https://github.com/janedoe"
sessions: ["scaling-stateful-workloads"]  # slugs from /content/sessions
featured: true
---

Short bio in Markdown. Supports **bold**, links, lists.
```

```markdown
---
# content/sessions/scaling-stateful-workloads.md
title: "Scaling Stateful Workloads on Kubernetes"
speakers: ["jane-doe"]
track: "Platform Engineering" # must match a `schema` value in lib/tracks.ts
type: "Talk"                  # Talk | Lightning | Panel | Keynote (no workshop track)
durationMinutes: 30
start: "2026-09-12T10:30:00+05:30"
room: "Hall A"
level: "Intermediate"         # All levels | Beginner | Intermediate | Advanced
tags: ["statefulset", "storage"]
---

Abstract goes here.
```

```markdown
---
# content/sponsors/kodekloud.md
name: "KodeKloud"
tier: "gold"                  # platinum | gold | silver | community | diversity | media
logo: "/images/sponsors/kodekloud.svg"   # prefer SVG
url: "https://kodekloud.com"
order: 10
---
```

Loaders live in `lib/content.ts`. They use `gray-matter` for frontmatter, `remark` + `remark-gfm` + `rehype-shiki` for rendering. **Validate every loaded file with Zod** (`lib/schema.ts`); fail the build on invalid frontmatter so a bad PR cannot reach production.

### 5.2 Payload collections

Defined in `collections/`. Minimum set:

- `Settings` (global): `eventDate`, `eventEndDate`, `registrationUrl`, `cfpUrl`, `heroHeadline`, `heroSubheadline`, `socialLinks`, `contactEmail`.
- `Media`: uploaded images. Used by other collections via relationship fields.
- `Speakers`, `Sessions`, `Sponsors`, `FAQs`, `BlogPosts` — mirror Markdown shape so the merge step is mechanical.
- Access control: public read via the API; write requires authenticated organizer role. Never expose draft content publicly.

### 5.3 Build-time merge

`lib/content.ts` exposes `getSpeakers()`, `getSessions()`, `getSponsors()`, `getFaqs()`, `getBlogPosts()`. Each:

1. Loads all Markdown files of that type.
2. Fetches the matching Payload collection.
3. Merges by `slug` — Markdown frontmatter wins on conflict, Payload supplies anything missing (typically uploaded media URLs).
4. Returns a typed, sorted list.

Pages are statically generated (`generateStaticParams` + `revalidate`). A Payload `afterChange` hook calls `/api/revalidate` with a secret to refresh affected paths.

## 6. Styling and components

- Tailwind config extends with brand colors under `theme.extend.colors.kcd` (define `primary`, `accent`, `ink`, `surface`, `muted`). Pull palette from the Gujarat brand guide (TBD); fall back to CNCF blue + a warm Gujarati accent until set.
- Use shadcn/ui primitives (`button`, `card`, `dialog`, `tabs`, `accordion`, `sheet` for mobile nav) — generated into `components/ui/`. Do not edit them by hand after generation; re‑run the CLI.
- Dark mode is supported via `next-themes` and `class` strategy. Default to `system`.
- Custom sections live in `components/sections/`. Keep them server components unless they need interactivity.
- Animations: prefer CSS + `framer-motion` only when meaningful. Respect `prefers-reduced-motion`.
- Images: always `next/image`. Speaker photos square 512×512 minimum. Sponsor logos prefer SVG; if PNG, supply 2× and a transparent background.

## 7. SEO and Open Graph

- Every route exports `generateMetadata` returning `title`, `description`, `openGraph`, `twitter`, and a canonical URL. Centralize via `lib/seo.ts`.
- Title pattern: `${pageTitle} — KCD Gujarat 2026`. Home is `KCD Gujarat 2026 — Kubernetes Community Day, Gujarat`.
- Per‑page OG images are generated at the edge via `app/api/og/route.tsx` using `next/og`. Speakers, sessions, and sponsors get individualized OG cards (name + photo/logo + event lockup).
- Ship `app/sitemap.ts` and `app/robots.ts`. Sitemap must include every speaker, session, sponsor, and blog post.
- Add `JSON‑LD` `Event` schema on `/`, `Person` on speaker detail, `Organization` for sponsors.
- Lighthouse SEO and Best Practices scores must stay ≥ 95 in CI.

## 8. Accessibility

WCAG 2.2 AA is the minimum bar. Every PR must hold or improve the a11y posture below — never disable an a11y rule to clear CI.

### 8.1 Semantic HTML

- Reach for the right element first; ARIA only when there is no native equivalent.
- One `<h1>` per page; heading levels nest in order (`h1` → `h2` → `h3`), never skip levels for styling.
- Landmarks present on every page: `<header>` (in root layout), `<main id="main">` (one per page, layout already provides it — sections use `<section>`), `<footer>` (root layout), `<nav aria-label="...">` for any navigation list.
- Use `<button>` for actions, `<a>` for navigation. Never bind click handlers to `<div>` / `<span>` without `role="button"` + keyboard handling.
- Lists (`<ul>`, `<ol>`, `<dl>`) for groups of repeated items (sponsor tiers, FAQs, schedule rows, social links). Don't render lists as bare `<div>` grids.

### 8.2 Keyboard + focus

- Every interactive element must be reachable with `Tab` and operable with `Enter`/`Space`.
- Focus order matches visual order. Don't use positive `tabindex` values; use `tabindex="-1"` only to take an element out of the tab order programmatically.
- Visible focus indicators are required. We use `:focus-visible { outline: 2px solid #2d6bf0; outline-offset: 2px; }` globally in `globals.css`. Never override with `outline: none` unless replaced with an equally visible alternative (the same applies inside the `kcd-glass-link` chip).
- Custom widgets (menus, dialogs, tabs, accordions) must follow the ARIA Authoring Practices for keyboard interaction (e.g. dialogs trap focus + restore on close; accordions toggle with Enter/Space + arrow nav).
- Skip-to-main link is in `app/layout.tsx` and must remain the first focusable element.

### 8.3 Color + contrast

- Body text contrast ≥ **4.5:1**; large text (≥ 18px regular or 14px bold) and active UI components ≥ **3:1**. Verify with the actual rendered token, not the raw hex.
- Don't communicate state with color alone — pair with an icon, label, or shape (e.g. a sold-out badge has both red tint *and* the text "Sold out").
- Watch translucent surfaces (`kcd-glass`) — the worst-case background under the glass must still satisfy contrast for foreground text.
- When using `text-kcd-ink/65` or similar low-opacity utilities, confirm the resolved ratio against the actual background. Drop down to `/70` or `/80` if the contrast fails.

### 8.4 Images + media

- Every `<Image>` has an `alt` attribute. Informative images describe the content; decorative images use `alt=""` *and* `aria-hidden` only when paired with adjacent text that conveys the meaning.
- Speaker photos: `alt="<name>"`. Sponsor logos: `alt="<sponsor name>"`. Inline decorative SVGs: add `aria-hidden` and skip `alt`.
- Never embed text into images that isn't also present in the surrounding DOM.
- Videos must ship with captions; transcripts go alongside.

### 8.5 Forms

- Every input has a visible `<label>` (or `aria-labelledby`). Placeholder text is not a label.
- Group related fields with `<fieldset>` + `<legend>`.
- Inline error messages reference the input via `aria-describedby`, and the input gets `aria-invalid="true"` until corrected.
- Required fields show the requirement in text, not just with `*`.

### 8.6 Motion + reduced-motion

- All animations, transitions, parallax effects, and auto-advancing content must respect `prefers-reduced-motion: reduce`. The HeroSection parallax bails out when the user has reduced motion enabled (`React.useRef` listener short-circuits) — keep that pattern for new motion.
- No content that flashes more than 3 times per second.
- Don't trap users in carousels — provide pause + arrow controls and don't auto-advance faster than 5s.

### 8.7 Internationalization + scripts

- `<html lang="...">` set per active locale (`en` / `gu`).
- Gujarati text uses the dedicated `font-gujarati` variable; never force Latin numerals where the locale would use Gujarati script.

### 8.8 Progressive enhancement

- Schedule grid must render and be navigable without JS — filters are progressive enhancement on top of a fully-rendered server list.
- Hash navigation (`/#about`, `/team#organizers`, etc.) must scroll to the right section with the sticky header offset (`scroll-margin-top` is set globally in `globals.css`).
- Any feature gated on a markdown flag (e.g. CFP `open: true|false`) must degrade cleanly when the flag is missing — default to the safer state.

### 8.9 Testing

- Run `pnpm test:a11y` (Playwright + axe) in CI on `/`, `/speakers`, `/schedule`, `/sponsors`, `/venue`, `/team`. Zero serious or critical violations.
- Manual checks before merging any UI PR:
  - Tab through every interactive element on the changed page. Focus ring visible? Logical order? Skip links work?
  - Resize to 320px and 1440px — content reflows, no horizontal scroll on touch widths, no overlapping focus rings.
  - Toggle "Reduce motion" in the OS — animations stop, content still readable, hover/focus chips still highlight.
  - Run Lighthouse on the changed route. **Accessibility ≥ 95**. SEO + Best Practices ≥ 95 in CI.
  - Verify with VoiceOver (macOS) or NVDA (Windows) — landmarks announce, headings read in order, images describe themselves correctly.
- Don't add `eslint-disable jsx-a11y/*` or `@axe-core/*` ignores without an explicit, time-bounded justification in the PR body.

## 9. Internationalization

The conference languages are English (default) and Gujarati. Stub i18n now even if Gujarati translations come later.

- Use `next-intl`. Locales: `en` (default), `gu`. Routing: `/` for English, `/gu` for Gujarati. Do not 404 missing Gujarati strings — fall back to English.
- All user‑visible strings come from `messages/{locale}.json`. Never hard‑code copy in components.
- Markdown content can have a `gu` sibling: `content/speakers/jane-doe.gu.md`. Loader picks the localized file when present.
- Format dates with `Intl.DateTimeFormat` and the active locale; default time zone is `Asia/Kolkata`.
- Add `hreflang` alternates in metadata.

## 10. Deployment (Vercel)

- One Vercel project. `main` branch deploys to production; PRs get preview deployments with their own Payload database branch (Neon branching) seeded from prod content.
- Required env vars (see `.env.example` — keep it updated):
  - `DATABASE_URL` (Postgres)
  - `PAYLOAD_SECRET`
  - `PAYLOAD_PUBLIC_SERVER_URL`
  - `BLOB_READ_WRITE_TOKEN` or S3 credentials
  - `REVALIDATE_SECRET`
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_REGISTRATION_URL`, `NEXT_PUBLIC_CFP_URL`
- Caching: pages use ISR with `revalidate = 3600`. Payload `afterChange` hooks call `/api/revalidate` with `REVALIDATE_SECRET` to refresh affected paths immediately.
- Image optimization stays on Vercel. Allow remote patterns only for the configured CMS/blob domain — never `**`.
- Custom domain: `kcdgujarat.com` (apex) → www redirect handled by Vercel.

## 11. Development workflow

```
pnpm install
pnpm dev                # next dev + payload admin at /admin
pnpm payload:generate   # regenerate Payload types into src/payload-types.ts
pnpm content:validate   # zod-validate all /content frontmatter
pnpm typecheck
pnpm lint
pnpm test               # vitest unit
pnpm test:e2e           # playwright
pnpm build              # production build
```

Conventions:

- Trunk‑based on `main`; feature branches named `kcd-<topic>`. Squash merges only.
- Conventional Commits (`feat:`, `fix:`, `content:`, `chore:`, `docs:`).
- Every PR: passing `lint`, `typecheck`, `content:validate`, `test`, Playwright smoke, and a Vercel preview link.
- Adding a speaker/session/sponsor is a content PR that *only* touches `/content/...` plus optionally `public/images/...`. Reviewers should not need to read code for these PRs.

## 12. Guidelines for AI assistants working in this repo

When asked to make changes, follow this order of preference:

1. If the change is content (new speaker, fix a typo, swap a sponsor logo, edit FAQ, blog post), edit Markdown under `/content` and assets under `/public`. Do not touch React.
2. If the change is presentational (layout, spacing, copy in shared chrome), edit the relevant `components/sections/*` or `components/site/*`. Keep components small and server‑rendered by default.
3. If the change is a new content type or a new field, update: the Zod schema in `lib/schema.ts`, the loader in `lib/content.ts`, the matching Payload collection in `collections/`, and the rendering component. All four must move together.
4. If the change is a new page, add a route under `app/`, plus `generateMetadata`, sitemap entry, navigation link (header and/or footer), and at least one Playwright smoke test.

Hard rules:

- Never commit secrets. `.env*` files are gitignored except `.env.example`.
- Never bypass Zod validation on Markdown content.
- Never introduce a new top‑level dependency without justifying it in the PR description; prefer the existing stack.
- Never disable accessibility lint rules to "fix" a build.
- Never hard‑code event dates, registration URLs, or contact emails in components — read them from Payload `Settings` or env.
- Never copy assets, logos, or text from kcd.cncgkochi.in. It's a structural reference only.
- When in doubt, ask in the PR description rather than guessing about branding, sponsor tiers, or speaker bios.

## 13. Open items (resolve before launch)

- Confirm event date, venue, and host city within Gujarat.
- Lock the brand palette and typography; update Tailwind theme.
- Decide ticketing provider (KonfHub vs. Tito vs. self‑hosted) and wire `NEXT_PUBLIC_REGISTRATION_URL`.
- Confirm CFP platform (Sessionize is the default per the reference site).
- Add `LICENSE` (CC‑BY‑4.0 for content, MIT for code is the typical KCD pattern) once organizers confirm.
- Replace placeholder OG fallback in `public/og/`.

---

_Last updated: 2026‑05‑10. Update this file in the same PR as any change that contradicts it._
