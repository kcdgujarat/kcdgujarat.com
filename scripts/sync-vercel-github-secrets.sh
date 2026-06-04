#!/usr/bin/env bash
# Push Vercel IDs from .vercel/project.json into GitHub Actions secrets.
# You still add VERCEL_TOKEN manually in the Vercel dashboard.
#
# Usage:
#   vercel link   # once, in repo root
#   ./scripts/sync-vercel-github-secrets.sh

set -euo pipefail
cd "$(dirname "$0")/.."

command -v gh >/dev/null || { echo "Install: brew install gh"; exit 1; }
command -v jq >/dev/null || { echo "Install: brew install jq"; exit 1; }
[ -f .vercel/project.json ] || { echo "Run: vercel link"; exit 1; }

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
PROJECT_ID=$(jq -r .projectId .vercel/project.json)
ORG_ID=$(jq -r .orgId .vercel/project.json)

echo "Setting secrets on $REPO …"
gh secret set VERCEL_PROJECT_ID --body "$PROJECT_ID" --repo "$REPO"
if [ "$ORG_ID" != "null" ] && [ -n "$ORG_ID" ]; then
  gh secret set VERCEL_ORG_ID --body "$ORG_ID" --repo "$REPO"
fi

echo "✓ VERCEL_PROJECT_ID (+ VERCEL_ORG_ID if team project)"
echo "→ Create VERCEL_TOKEN at https://vercel.com/account/tokens and run:"
echo "  gh secret set VERCEL_TOKEN --repo $REPO"
