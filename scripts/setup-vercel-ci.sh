#!/usr/bin/env bash
# One-time CI/CD setup for kcdgujarat.com (no VERCEL_TOKEN needed).
#
# Previews: Vercel Git integration deploys `main` + PRs automatically.
# Production: GitHub Actions pushes `main` → `production` branch after manual approval.
#
# Prerequisites:
#   gh auth login
#
# Usage:
#   ./scripts/setup-vercel-ci.sh

set -euo pipefail
cd "$(dirname "$0")/.."

command -v gh >/dev/null || { echo "Install GitHub CLI: brew install gh"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Run: gh auth login"; exit 1; }

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

cat <<EOF

Vercel + GitHub CI setup for $REPO
==================================

1. Vercel dashboard → kcdgujarat.com → Settings → Git
   - Connect GitHub repo: $REPO
   - Production Branch: production  (must NOT be main)

2. Create the production branch (once, from your machine):
   git fetch origin
   git push origin origin/main:production

3. GitHub → $REPO → Settings → Environments → production
   - Add Required reviewers for manual approval

4. Remove stale secrets (optional — no longer used by deploy workflows):
   gh secret delete VERCEL_TOKEN --repo "$REPO" || true
   gh secret delete VERCEL_ORG_ID --repo "$REPO" || true
   gh secret delete VERCEL_PROJECT_ID --repo "$REPO" || true

Deploy flow after setup:
  • Push to main        → Vercel preview (automatic)
  • Open PR             → Vercel preview (automatic)
  • Actions → Deploy Production → approve → pushes main to production branch

EOF

read -r -p "Create/update GitHub production environment with required reviewers? [y/N] " ans
case "$ans" in
  [yY]|[yY][eE][sS])
    gh api -X PUT "repos/$REPO/environments/production" -f wait_timer=0 >/dev/null || true
    echo "→ Open https://github.com/$REPO/settings/environments to add required reviewers."
    ;;
esac

read -r -p "Create production branch from main now? [y/N] " ans
case "$ans" in
  [yY]|[yY][eE][sS])
    git fetch origin main
    git push origin "origin/main:refs/heads/production"
    echo "✓ production branch created/updated"
    ;;
esac

echo "Done."
