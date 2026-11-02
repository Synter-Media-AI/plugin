#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Data identifiers, URL parameters, cookie fields, and platform taxonomy tags
// that appear in snake_case in skills documentation but are not MCP tools.
export const DATA_IDENTIFIERS = new Set([
  'ad_personalization', 'ad_storage', 'ad_user_data', 'analytics_storage',
  'conversion_id', 'custom_label', 'event_id', 'google_product_category',
  'identifier_exists', 'li_fat_id', 'openai_ads', 'order_id', 'paid_social',
  'product_type', 'rdt_cid', 'sale_price', 'transaction_id', 'utm_campaign',
  'utm_content', 'utm_medium', 'utm_source', 'utm_term',
  '_fbc', '_fbp', '_rdt_uuid',
]);

export function loadAllowlist(allowlistPath = path.join(ROOT, 'scripts/hosted-tools.json')) {
  if (!fs.existsSync(allowlistPath)) {
    throw new Error(`Allowlist file not found: ${allowlistPath}`);
  }
  const content = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
  if (!Array.isArray(content) || content.length === 0) {
    throw new Error(`Invalid allowlist file: ${allowlistPath}`);
  }
  return new Set(content);
}

export function extractToolReferences(content) {
  const refs = [];
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    // Match explicit syntax: mcp__synter__<tool> or tool:<tool>
    for (const match of line.matchAll(/\bmcp__[a-zA-Z0-9_-]+?__([a-z][a-z0-9_]+)|\btool:([a-z][a-z0-9_]+)/g)) {
      const toolName = match[1] || match[2];
      refs.push({ name: toolName, line: index + 1 });
    }
    // Match backticked snake_case identifiers
    for (const match of line.matchAll(/`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`/g)) {
      const name = match[1];
      if (!DATA_IDENTIFIERS.has(name)) {
        refs.push({ name, line: index + 1 });
      }
    }
  });
  return refs;
}

export function findSkillFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findSkillFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

export function checkSkillTools({ root = ROOT, allowlistPath } = {}) {
  const allowed = loadAllowlist(allowlistPath);
  const skillDirs = [
    path.join(root, 'skills'),
    path.join(root, 'packages/claude-directory/skills'),
  ].filter(d => fs.existsSync(d));

  const skillFiles = skillDirs.flatMap(d => findSkillFiles(d));
  if (skillFiles.length === 0) {
    throw new Error('No skill files found to check.');
  }

  const errors = [];
  let checkedRefs = 0;

  for (const file of skillFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(root, file);
    const refs = extractToolReferences(content);
    for (const ref of refs) {
      checkedRefs++;
      if (!allowed.has(ref.name)) {
        errors.push(`${relPath}:${ref.line}: referenced tool \`${ref.name}\` is not in scripts/hosted-tools.json`);
      }
    }
  }

  return { errors, skillCount: skillFiles.length, checkedRefs, allowedCount: allowed.size };
}

export function main() {
  const result = checkSkillTools();
  if (result.errors.length > 0) {
    console.error(`Found ${result.errors.length} unapproved tool reference(s):`);
    for (const err of result.errors) {
      console.error(`  ${err}`);
    }
    process.exitCode = 1;
    return;
  }
  console.log(`Checked ${result.skillCount} skill files (${result.checkedRefs} tool references): all exist in scripts/hosted-tools.json (${result.allowedCount} hosted tools).`);
}

try {
  if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main();
  }
} catch {
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
  }
}
