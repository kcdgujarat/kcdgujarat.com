#!/usr/bin/env bash
# One-time CI/CD setup for kcdgujarat.com
#
# • Push to main → Vercel builds automatically (staged until promoted)
# • Actions → Deploy Production → approve → promotes latest main deploy to production
#
# Prerequisites:
#   gh auth login
#   vercel login   (optional; for reading project/team ids)
#
# Usage:
#   ./scripts/setup-vercel-ci.sh

set -euo pipefail
cd "$(dirname "$0")/.."

command -v gh >/dev/null || { echo "Install GitHub CLI: brew install gh"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Run: gh auth login"; exit 1; }

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

cat <<EOF

Vercel + GitHub production promote — $REPO
==========================================

1. Vercel → Project → Settings → Git
   - Connect this repo
   - Production Branch: main

2. Vercel → Settings → Environments → Production
   - Branch Tracking: main
   - Turn OFF "Auto-assign Custom Production Domains"
     (instant promote via API; optional but recommended)

   If main still deploys as Preview, the workflow rebuilds for production
   automatically (same code, production env vars).

3. GitHub secrets (repo → Settings → Secrets → Actions):
   VERCEL_TOKEN        — Vercel → Account → Tokens → Create
   VERCEL_PROJECT_ID   — Project → Settings → General → Project ID
   VERCEL_ORG_ID       — Team ID (Settings → General). Leave unset for personal hobby.

4. GitHub → Environments → production → add Required reviewers

Deploy flow:
  • git push origin main     → Vercel builds (preview/staged on main)
  • Actions → Deploy Production → Approve → latest main deploy goes live

You do NOT need a \`production\` git branch.

EOF

read -r -p "Open GitHub production environment settings in browser? [y/N] " ans
case "$ans" in
  [yY]|[yY][eE][sS])
    gh api -X PUT "repos/$REPO/environments/production" -f wait_timer=0 >/dev/null || true
    open "https://github.com/$REPO/settings/environments" 2>/dev/null || true
    echo "→ Add required reviewers on the production environment."
    ;;
esac

if command -v vercel >/dev/null 2>&1 && [ -f .vercel/project.json ]; then
  echo ""
  echo "From .vercel/project.json:"
  jq '{ VERCEL_PROJECT_ID: .projectId, VERCEL_ORG_ID: .orgId }' .vercel/project.json 2>/dev/null || true
  echo "Set these as GitHub secrets (VERCEL_TOKEN you create in the Vercel dashboard)."
fi

echo "Done."
