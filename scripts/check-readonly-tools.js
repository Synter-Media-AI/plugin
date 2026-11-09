#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const WRITE_TOOLS = new Set([
  'create_campaign_plan', 'upsert_plan_entity', 'approve_campaign_plan',
  'execute_campaign_plan', 'enable_campaign', 'pause_campaign',
  'update_campaign_budget', 'add_keywords', 'add_negative_keywords',
  'create_ad_copy',
]);
const CANONICAL = 'https://mcp.synterai.com';

function loadReadonly() {
  const names = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/readonly-tools.json'), 'utf8'));
  if (!Array.isArray(names) || names.length < 10) {
    throw new Error('tools/readonly-tools.json missing or too small');
  }
  if (names.some((n) => WRITE_TOOLS.has(n))) {
    throw new Error('readonly-tools.json contains write tools');
  }
  return new Set(names);
}

function main() {
  const readonly = loadReadonly();
  const errors = [];
  for (const rel of ['.cursor-mcp.json', 'mcp.json']) {
    const json = JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
    for (const cfg of Object.values(json.mcpServers || {})) {
      if (cfg.url !== CANONICAL) {
        errors.push(`${rel}: url must be ${CANONICAL}, got ${cfg.url}`);
      }
      if (cfg.headers) {
        errors.push(`${rel}: must not set static credential headers`);
      }
    }
  }
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  if (!/free,\s*read-only|free and read-only|\*\*free, read-only\*\*/i.test(readme)) {
    errors.push('README.md: must state the Cursor listing is free and read-only');
  }
  if (/\$0\.25|Solo \(\$20/i.test(readme)) {
    errors.push('README.md: must not include paid write pricing copy');
  }
  fs.readFileSync(path.join(ROOT, 'rules/readonly-marketplace.mdc'), 'utf8');
  const cursorPlugin = JSON.parse(
    fs.readFileSync(path.join(ROOT, '.cursor-plugin/plugin.json'), 'utf8')
  );
  if (!/read-only/i.test(cursorPlugin.description || '')) {
    errors.push('.cursor-plugin/plugin.json: description must say read-only');
  }
  if (!readonly.size) errors.push('readonly allowlist empty');
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(`readonly-tools ok (${readonly.size} tools); Cursor MCP URL ${CANONICAL}`);
}

main();
