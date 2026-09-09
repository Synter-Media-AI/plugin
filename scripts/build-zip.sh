#!/usr/bin/env bash
# Build a versioned Claude Desktop/Cowork upload with exactly one top-level
# synter/ folder. Claude accepts this layout and does not scan deeper nesting.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

VERSION=$(node -p "require('./.claude-plugin/plugin.json').version")
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

# Validate source metadata before staging an artifact from it.
node scripts/validate-manifests.js

# Allowlist the Claude runtime and user-facing package surface. Cursor, SDK,
# CI, and packaging utilities do not belong in a Desktop upload.
mkdir -p "$STAGE/synter/.claude-plugin" "$STAGE/synter/scripts" "$STAGE/synter/assets"
rsync -a \
  .mcp.json agents context hooks output-styles skills \
  README.md INSTALL.md CHANGELOG.md LICENSE \
  "$STAGE/synter/"
cp -p .claude-plugin/plugin.json "$STAGE/synter/.claude-plugin/plugin.json"
cp -p scripts/session-context.sh "$STAGE/synter/scripts/session-context.sh"
cp -p assets/logo.png "$STAGE/synter/assets/logo.png"

mkdir -p dist
ZIP_PATH="dist/synter-plugin-$VERSION.zip"
rm -f "$ZIP_PATH"
export COPYFILE_DISABLE=1
(cd "$STAGE" && find synter -type f -print | LC_ALL=C sort | zip -Xq "$REPO_ROOT/$ZIP_PATH" -@)

echo "Built $ZIP_PATH"
bash scripts/validate-package.sh "$ZIP_PATH"

node - "$ZIP_PATH" "$ZIP_PATH.sha256" <<'NODE'
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const [zipPath, checksumPath] = process.argv.slice(2);
const digest = crypto.createHash('sha256').update(fs.readFileSync(zipPath)).digest('hex');
fs.writeFileSync(checksumPath, `${digest}  ${path.basename(zipPath)}\n`);
NODE
echo "Wrote $ZIP_PATH.sha256"
