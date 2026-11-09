#!/usr/bin/env bash
# Claude Code --strict still rejects privacyPolicyUrl as an unknown field, but
# Claude Directory Bot requires it on .claude-plugin/plugin.json. Allow only that
# known warning; fail on any other warning or error.
set -euo pipefail
TARGET=${1:?target required}
TMP=$(mktemp)
set +e
npx -y @anthropic-ai/claude-code@2.1.263 plugin validate "$TARGET" --strict >"$TMP" 2>&1
STATUS=$?
set -e
cat "$TMP"
if [[ $STATUS -eq 0 ]]; then
  rm -f "$TMP"
  exit 0
fi
# Strip the allowed privacyPolicyUrl warning and re-evaluate.
FILTERED=$(grep -v "privacyPolicyUrl: Unknown field 'privacyPolicyUrl'" "$TMP" || true)
# If the only failure was that warning (plus the generic strict line), accept.
if echo "$FILTERED" | grep -Eq '✘|Found [2-9] |Found [1-9][0-9]+ |error|Error'; then
  # Still has other problems if more than the boilerplate remains as failures.
  if echo "$FILTERED" | grep -E '❯|✘ Validation failed' | grep -vq 'Validation failed'; then
    rm -f "$TMP"
    exit 1
  fi
  # Count remaining ❯ warning lines
  REMAINING=$(echo "$FILTERED" | grep -c '❯' || true)
  if [[ "$REMAINING" -gt 0 ]]; then
    rm -f "$TMP"
    exit 1
  fi
fi
echo "Allowed known Claude Directory field: privacyPolicyUrl"
rm -f "$TMP"
exit 0
