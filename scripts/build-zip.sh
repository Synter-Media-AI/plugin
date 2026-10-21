#!/usr/bin/env bash
# Build and byte-verify separate Claude and OpenAI plugin archives.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec python3 "$REPO_ROOT/scripts/build-packages.py"
