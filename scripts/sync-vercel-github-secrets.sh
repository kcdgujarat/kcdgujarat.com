#!/usr/bin/env bash
# Sync Vercel credentials into GitHub Actions secrets for kcdgujarat/kcdgujarat.com.
#
# Prerequisites:
#   vercel login          (must have access to team "KCD Gujarat - Vercel")
#   gh auth login         (repo admin)
#
# Usage:
#   ./scripts/sync-vercel-github-secrets.sh              # refresh all three secrets
#   ./scripts/sync-vercel-github-secrets.sh --token-only # refresh VERCEL_TOKEN only
#
# If `vercel link` fails (username slug = team slug "kcdgujarat"), pass the Team ID:
#   VERCEL_ORG_ID=team_xxxxxxxx VERCEL_PROJECT_ID=prj_sC0hhxLYuibIcJFRLFCnzfYNvdIj \
#     ./scripts/sync-vercel-github-secrets.sh
#
# Team ID: Vercel → Team Settings → General → Team ID (starts with team_)
# Project ID: Vercel → kcdgujarat.com → Settings → Project ID

set -euo pipefail
cd "$(dirname "$0")/.."

TOKEN_ONLY=0
if [ "${1:-}" = "--token-only" ]; then
  TOKEN_ONLY=1
fi

# Known project for this repo (override with VERCEL_PROJECT_ID)
DEFAULT_PROJECT_ID="prj_sC0hhxLYuibIcJFRLFCnzfYNvdIj"

command -v vercel >/dev/null || { echo "Install Vercel CLI: pnpm add -g vercel"; exit 1; }
command -v gh >/dev/null || { echo "Install GitHub CLI: brew install gh"; exit 1; }
command -v node >/dev/null || { echo "Node.js is required"; exit 1; }

vercel whoami >/dev/null || { echo "Run: vercel login"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Run: gh auth login"; exit 1; }

resolve_project_ids() {
  if [ -n "${VERCEL_ORG_ID:-}" ] && [ -n "${VERCEL_PROJECT_ID:-}" ]; then
    echo "→ Using VERCEL_ORG_ID / VERCEL_PROJECT_ID from environment"
    ORG_ID="$VERCEL_ORG_ID"
    PROJECT_ID="$VERCEL_PROJECT_ID"
    return 0
  fi

  if [ -f .vercel/project.json ]; then
    echo "→ Using .vercel/project.json"
    ORG_ID=$(node -p "require('./.vercel/project.json').orgId")
    PROJECT_ID=$(node -p "require('./.vercel/project.json').projectId")
    return 0
  fi

  # Personal username and team slug are both "kcdgujarat" — must use team_ ID, not slug.
  if [ -n "${VERCEL_TEAM_ID:-}" ]; then
    echo "→ Linking with team ID scope …"
    if vercel link --yes --scope "$VERCEL_TEAM_ID" --project "$DEFAULT_PROJECT_ID"; then
      if [ -f .vercel/project.json ]; then
        ORG_ID=$(node -p "require('./.vercel/project.json').orgId")
        PROJECT_ID=$(node -p "require('./.vercel/project.json').projectId")
        return 0
      fi
    fi
  fi

  if [ "$TOKEN_ONLY" -eq 1 ]; then
    echo "→ --token-only: skipping org/project lookup"
    ORG_ID=""
    PROJECT_ID=""
    return 0
  fi

  cat <<EOF >&2
✗ Could not resolve Vercel org/project IDs.

Common cause: your personal Vercel username and team slug are both "kcdgujarat",
so \`vercel link --scope kcdgujarat\` hits your personal account instead of the team.

Fix — pick one:

  A) Refresh token only (keeps existing VERCEL_ORG_ID / VERCEL_PROJECT_ID in GitHub):
     ./scripts/sync-vercel-github-secrets.sh --token-only

  B) Pass team + project IDs explicitly:
     VERCEL_ORG_ID=team_xxxxxxxx \\
     VERCEL_PROJECT_ID=$DEFAULT_PROJECT_ID \\
     ./scripts/sync-vercel-github-secrets.sh

     Team ID: Vercel dashboard → Team Settings → General → Team ID
     Project ID: kcdgujarat.com → Settings → Project ID

  C) Link locally, then re-run:
     vercel link --yes --scope team_xxxxxxxx --project $DEFAULT_PROJECT_ID
EOF
  exit 1
}

resolve_project_ids

TOKEN_NAME="github-actions-kcdgujarat-$(date +%Y%m%d)"
echo "→ Creating Vercel token: $TOKEN_NAME"
TOKEN=$(vercel tokens add "$TOKEN_NAME" --format json | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).token")

if [ -z "$TOKEN" ]; then
  echo "Could not create token. Try manually: https://vercel.com/account/tokens"
  exit 1
fi

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "→ Setting GitHub secrets on $REPO …"
gh secret set VERCEL_TOKEN --body "$TOKEN"

if [ "$TOKEN_ONLY" -eq 0 ] && [ -n "${ORG_ID:-}" ] && [ -n "${PROJECT_ID:-}" ]; then
  gh secret set VERCEL_ORG_ID --body "$ORG_ID"
  gh secret set VERCEL_PROJECT_ID --body "$PROJECT_ID"
  echo "✓ Updated VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
  echo "  orgId=$ORG_ID"
  echo "  projectId=$PROJECT_ID"
else
  echo "✓ Updated VERCEL_TOKEN only"
fi

echo ""
echo "Re-run: gh workflow run deploy-preview.yml --ref main"
