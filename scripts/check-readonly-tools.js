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

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}

function loadReadonly() {
  const names = loadJson('tools/readonly-tools.json');
  if (!Array.isArray(names) || names.length < 10) {
    throw new Error('tools/readonly-tools.json missing or too small');
  }
  if (names.some((n) => WRITE_TOOLS.has(n))) {
    throw new Error('readonly-tools.json contains write tools');
  }
  return new Set(names);
}

function loadAllowlist(rel, min) {
  const names = loadJson(rel);
  if (!Array.isArray(names) || names.length < min || new Set(names).size !== names.length) {
    throw new Error(`${rel} must list at least ${min} unique names`);
  }
  return new Set(names);
}

function listDirs(rel) {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();
}

function listAgentStems() {
  const dir = path.join(ROOT, 'agents');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((n) => n.endsWith('.md'))
    .map((n) => n.replace(/\.md$/, ''))
    .sort();
}

function main() {
  const readonly = loadReadonly();
  const skillAllow = loadAllowlist('tools/readonly-skills.json', 10);
  const agentAllow = loadAllowlist('tools/readonly-agents.json', 1);
  const errors = [];

  for (const rel of ['.cursor-mcp.json', 'mcp.json']) {
    const json = loadJson(rel);
    for (const cfg of Object.values(json.mcpServers || {})) {
      if (cfg.url !== CANONICAL) {
        errors.push(`${rel}: url must be ${CANONICAL}, got ${cfg.url}`);
      }
      if (cfg.headers) {
        errors.push(`${rel}: must not set static credential headers`);
      }
    }
  }

  const shippedSkills = listDirs('skills');
  for (const name of shippedSkills) {
    if (!skillAllow.has(name)) {
      errors.push(`skills/${name}: not in tools/readonly-skills.json allowlist`);
    }
  }
  for (const name of skillAllow) {
    if (!shippedSkills.includes(name)) {
      errors.push(`tools/readonly-skills.json: missing shipped skills/${name}`);
    }
  }

  const shippedAgents = listAgentStems();
  for (const name of shippedAgents) {
    if (!agentAllow.has(name)) {
      errors.push(`agents/${name}.md: not in tools/readonly-agents.json allowlist`);
    }
  }
  for (const name of agentAllow) {
    if (!shippedAgents.includes(name)) {
      errors.push(`tools/readonly-agents.json: missing shipped agents/${name}.md`);
    }
  }

  // Ban write-flavored skill names even if somehow allowlisted later
  for (const banned of ['launch', 'optimize', 'replicate', 'campaign-preflight', 'ad-copy-generation']) {
    if (shippedSkills.includes(banned)) {
      errors.push(`skills/${banned}: write-flavored skill must not ship in read-only listing`);
    }
  }

  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  if (!/free,\s*read-only|free and read-only|\*\*free and read-only\*\*|\*\*free, read-only\*\*/i.test(readme)) {
    errors.push('README.md: must state the Cursor listing is free and read-only');
  }
  if (/\$0\.25|Solo \(\$20/i.test(readme)) {
    errors.push('README.md: must not include paid write pricing copy');
  }
  if (/\bskills\/launch\b|\blaunch workflow\b|\bWrites require\b|\bcreate_ad_copy\b/i.test(readme)) {
    errors.push('README.md: must not describe launch/write workflows or write tools');
  }
  for (const banned of ['launch', 'optimize', 'budget-optimizer', 'media-buyer', 'creative-director']) {
    if (new RegExp(`\\[\`${banned}\`\\]`).test(readme)) {
      errors.push(`README.md: must not list removed skill/agent ${banned}`);
    }
  }

  fs.readFileSync(path.join(ROOT, 'rules/readonly-marketplace.mdc'), 'utf8');
  const cursorPlugin = loadJson('.cursor-plugin/plugin.json');
  if (!/read-only/i.test(cursorPlugin.description || '')) {
    errors.push('.cursor-plugin/plugin.json: description must say read-only');
  }
  if (!readonly.size) errors.push('readonly allowlist empty');

  // Keep Claude directory allowlists in sync with root shipping set
  const dirSkills = new Set(loadJson('config/claude-directory/skills-allowlist.json'));
  const dirAgents = new Set(loadJson('config/claude-directory/agents-allowlist.json'));
  if ([...skillAllow].sort().join() !== [...dirSkills].sort().join()) {
    errors.push('config/claude-directory/skills-allowlist.json must match tools/readonly-skills.json');
  }
  if ([...agentAllow].sort().join() !== [...dirAgents].sort().join()) {
    errors.push('config/claude-directory/agents-allowlist.json must match tools/readonly-agents.json');
  }

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(
    `readonly-tools ok (${readonly.size} tools); skills ${skillAllow.size}; agents ${agentAllow.size}; Cursor MCP URL ${CANONICAL}`
  );
}

main();
