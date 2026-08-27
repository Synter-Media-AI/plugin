#!/usr/bin/env bash
# Build dist/synter-plugin-<version>.zip with the plugin at the archive root —
# exactly the layout Claude Desktop's "Upload plugin" zip import expects.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

VERSION=$(node -p "require('./.claude-plugin/plugin.json').version")
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

# Plugin surface only — dev/consumption paths stay out of the artifact.
rsync -a \
  --exclude '.git' --exclude '.github' --exclude 'dist' \
  --exclude 'sdk' --exclude '.cursor-plugin' \
  ./ "$STAGE/synter/"

mkdir -p dist
ZIP_PATH="dist/synter-plugin-$VERSION.zip"
rm -f "$ZIP_PATH"
(cd "$STAGE" && zip -qr "$REPO_ROOT/$ZIP_PATH" synter)

echo "Built $ZIP_PATH"

# Hard root-check: Claude Desktop's zip upload requires the manifest at
# <archive-root>/.claude-plugin/plugin.json, not nested under a repo folder.
unzip -l "$ZIP_PATH" | grep -q 'synter/.claude-plugin/plugin.json' \
  || { echo "FATAL: plugin.json not at archive root" >&2; exit 1; }

echo "OK: synter/.claude-plugin/plugin.json present at archive root"
