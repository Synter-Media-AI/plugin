#!/usr/bin/env bash
# Validate the exact Desktop/Cowork ZIP, not just its source checkout.
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 dist/synter-plugin-<version>.zip" >&2
  exit 2
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ZIP_PATH="$1"
[[ "$ZIP_PATH" = /* ]] || ZIP_PATH="$REPO_ROOT/$ZIP_PATH"
[[ -f "$ZIP_PATH" ]] || { echo "FATAL: archive not found: $ZIP_PATH" >&2; exit 1; }

VERSION=$(node -p "require('$REPO_ROOT/.claude-plugin/plugin.json').version")
EXPECTED_NAME="synter-plugin-$VERSION.zip"
[[ "$(basename "$ZIP_PATH")" == "$EXPECTED_NAME" ]] \
  || { echo "FATAL: expected archive name $EXPECTED_NAME" >&2; exit 1; }

STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT
unzip -Z1 "$ZIP_PATH" > "$STAGE/entries.txt"

[[ -s "$STAGE/entries.txt" ]] || { echo 'FATAL: archive is empty' >&2; exit 1; }
if grep -Eq '(^/|(^|/)\.\.(/|$)|^__MACOSX/|(^|/)\.DS_Store$)' "$STAGE/entries.txt"; then
  echo 'FATAL: archive contains unsafe or platform-specific paths' >&2
  exit 1
fi
if grep -Ev '^synter/' "$STAGE/entries.txt" | grep -q .; then
  echo 'FATAL: every archive entry must be under the single synter/ folder' >&2
  exit 1
fi
if grep -Eq '^synter/synter/' "$STAGE/entries.txt"; then
  echo 'FATAL: plugin is nested more than one folder deep' >&2
  exit 1
fi

unzip -q "$ZIP_PATH" -d "$STAGE/unpacked"
PLUGIN="$STAGE/unpacked/synter"

required=(
  '.claude-plugin/plugin.json'
  '.mcp.json'
  'hooks/hooks.json'
  'context/brand-and-safety.md'
  'output-styles/synter.md'
  'scripts/session-context.sh'
  'assets/logo.png'
  'README.md'
  'INSTALL.md'
  'CHANGELOG.md'
  'LICENSE'
)
for rel in "${required[@]}"; do
  [[ -f "$PLUGIN/$rel" ]] || { echo "FATAL: package is missing $rel" >&2; exit 1; }
done

for forbidden in plugin.json .claude-plugin/marketplace.json .cursor-plugin mcp.json .git .github dist sdk scripts/build-zip.sh scripts/validate-manifests.js scripts/validate-package.sh; do
  [[ ! -e "$PLUGIN/$forbidden" ]] || { echo "FATAL: package contains non-runtime path $forbidden" >&2; exit 1; }
done

PACKAGE_VERSION=$(node -p "require('$PLUGIN/.claude-plugin/plugin.json').version")
[[ "$PACKAGE_VERSION" == "$VERSION" ]] \
  || { echo "FATAL: packaged version $PACKAGE_VERSION does not match source version $VERSION" >&2; exit 1; }

SKILLS=$(find "$PLUGIN/skills" -mindepth 2 -maxdepth 2 -type f -name SKILL.md | wc -l | tr -d ' ')
AGENTS=$(find "$PLUGIN/agents" -mindepth 1 -maxdepth 1 -type f -name '*.md' | wc -l | tr -d ' ')
[[ "$SKILLS" == 57 ]] || { echo "FATAL: expected 57 skills, found $SKILLS" >&2; exit 1; }
[[ "$AGENTS" == 7 ]] || { echo "FATAL: expected 7 agents, found $AGENTS" >&2; exit 1; }

node - "$PLUGIN" <<'NODE'
const fs = require('fs');
const path = require('path');
const root = process.argv[2];
const manifest = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/plugin.json')));
const mcp = JSON.parse(fs.readFileSync(path.join(root, '.mcp.json')));
const hooks = JSON.parse(fs.readFileSync(path.join(root, 'hooks/hooks.json')));
const servers = Object.keys(mcp.mcpServers || {});
if (manifest.name !== 'synter' || manifest.displayName !== 'Synter') throw new Error('canonical Synter identity is missing');
if (servers.length !== 1 || servers[0] !== 'synter') throw new Error('expected exactly one Synter MCP connector');
const server = mcp.mcpServers.synter;
if (server.type !== 'http' || server.url !== 'https://mcp.syntermedia.ai' || server.headers) throw new Error('Claude MCP must use the OAuth HTTP endpoint without static headers');
const sessionHooks = hooks.hooks?.SessionStart;
if (!Array.isArray(sessionHooks) || sessionHooks.length !== 1 || !Array.isArray(sessionHooks[0].hooks) || sessionHooks[0].hooks.length !== 1 || sessionHooks[0].hooks[0].type !== 'command') throw new Error('expected exactly one SessionStart command hook');
const logo = fs.readFileSync(path.join(root, 'assets/logo.png'));
if (logo.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || logo.readUInt32BE(16) !== 1024 || logo.readUInt32BE(20) !== 1024 || logo[25] !== 6) throw new Error('expected a valid 1024x1024 RGBA PNG logo');
NODE

bash -n "$PLUGIN/scripts/session-context.sh"
echo "Validated $EXPECTED_NAME: Synter $VERSION, 57 skills, 7 agents, 1 hook, 1 OAuth connector, one-folder layout."
