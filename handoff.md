# Handoff — KCD Gujarat 2026

> **READ THIS FIRST.** Every Claude Code session begins here. Update this file at end of every meaningful change so the next session boots with current context. CLAUDE.md is canonical for conventions; this file is canonical for *active work*.

_Last updated: 2026-06-02 (CFP markdown render + typography)_

## 1. Goal

Ship the public marketing/event site for **KCD Gujarat 2026** — a CNCF-backed, community-organized Kubernetes conference. All content lives in markdown under `content/`; **no CMS or database**. See CLAUDE.md §2–§5 for conventions (note: CLAUDE.md still mentions Payload — update in a follow-up PR).

## 2. Current state of files

### Layout + chrome

- `app/layout.tsx` — fonts + Header/Footer. Loads `getEventConfig()` (contact email), `getSocialLinks()` (footer icons), CFP + registration config for nav CTAs. No database.
- `components/site/Header.tsx` — sticky liquid-glass pill nav. Team link → `/#team`. Nav/CTA gated on `comingSoon`, `cfpOpen`, `showSpeakers`, registration phase.
- `components/site/Footer.tsx` — dark navy 4-column grid. Social icons via `<SocialLinks variant="footer" />` under logo **and** in copyright bar.
- `components/site/SocialLinks.tsx` — shared X / LinkedIn / Instagram / GitHub / YouTube icon row. Used in footer, coming-soon, `/cfp` and `/register` “opens soon” cards.
- `lib/site-social.ts` — `SiteSocialLinks` type + `normalizeSiteSocialLinks()` (maps legacy `twitter` → `x`).
- `lib/content.ts` — `getSocialLinks()` reads `content/pages/social.md`; throws on invalid YAML (no silent `{}`).
- `proxy.ts` — CSP + coming-soon gating. Do **not** add `middleware.ts` (Next.js 16 conflict).

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
- `registration.md` — `startDate` / optional `endDate` → auto `open` + `phase`; `url`.
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

Working tree **clean** as of last commit: `0eaa235` — `(feat): no more payload cms, fixes social renders`.

After pull: `pnpm install && pnpm typecheck && pnpm content:validate && pnpm build`.

Dev: use `pnpm dev` (runs content watcher + Next). Restart after killing stale `next` processes.

## 4. Recent changes (2026-06-02)

27. **Payload + Postgres removed** — markdown-only site; deleted `payload.config.ts`, `collections/`, `app/(payload)/`, `lib/payload.ts`. Docker compose is app-only.
28. **Social links file** — `content/pages/social.md` + `getSocialLinks()` + `SocialLinks` component. Fixed empty icons caused by Payload `settings.socialLinks` + `twitter` vs `x` key mismatch.
29. **CFP / registration date phases** — `upcoming` / `open` / `closed` from `startDate`/`endDate` in markdown.
30. **Dev content hot reload** — `scripts/dev.mjs` + `lib/content-revision.ts` + `ensureDevContentFresh()`.
31. **CFP markdown** — `@tailwindcss/typography` + `MarkdownBody`; `/cfp` renders `cfp.bodyHtml` on all phases (was hidden during `upcoming`/`closed`).
32. **CFP silent failure** — invalid `homeSection.cards[].icon` (e.g. `group`) made `getCfpConfig()` fall back to `open: false`; now throws with path/message. Icons: megaphone, wrench, graduation-cap, users, group.

## 5. Failed attempts

- **Postgres / Payload** — removed entirely; was optional fallback, caused empty settings.
- **Social icons in `event.md`** — moved to dedicated `social.md`.
- **Silent `getSocialLinks()` catch** — replaced with `safeParse` + throw on invalid frontmatter.
- **`middleware.ts` + `proxy.ts`** — Next.js 16 rejects both; keep `proxy.ts` only.
- **`pnpm dev` content-watch EMFILE** — watcher can crash on macOS file limits; use plain `next dev` as fallback or raise `ulimit`.

## 6. Single next thing to try

**Update CLAUDE.md** to reflect markdown-only stack (remove Payload/Postgres from locked stack, env vars, folder layout). Confirm Vercel deploy without `DATABASE_URL` and smoke-test social icons on preview after editing `social.md`.

---

## How to keep this file fresh

At the end of any session that changed code, content, or plans:

1. Bump `_Last updated:_` to today's absolute date (YYYY-MM-DD).
2. Update §2 (current state) — only when files materially change shape, not on every typo edit.
3. Append to §4 (changes) and prune anything older than ~30 days that's now obvious from the repo.
4. Add any newly-tried-and-failed approach to §5, with the *symptom* and the *reason it was abandoned*.
5. Rewrite §6 (next thing) to the single most valuable next move — never a list.

CLAUDE.md §0 references this file; session start auto-loads CLAUDE.md, which steers the assistant here.
