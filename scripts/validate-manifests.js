#!/usr/bin/env node
// Validates the plugin's manifests and skill frontmatter before a PR merges.
// Node stdlib only — no dependencies to keep CI fast and reproducible.
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const errors = [];

function readFile(relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  return fs.readFileSync(abs, 'utf8');
}

function parseJson(relPath) {
  const raw = readFile(relPath);
  try {
    return JSON.parse(raw);
  } catch (err) {
    errors.push(`${relPath}: invalid JSON — ${err.message}`);
    return null;
  }
}

// (a) Parse-validate every JSON manifest.
const MANIFEST_PATHS = [
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  '.cursor-plugin/plugin.json',
  '.cursor-plugin/marketplace.json',
  '.mcp.json',
  'mcp.json',
  'plugin.json',
];

const manifests = {};
for (const relPath of MANIFEST_PATHS) {
  manifests[relPath] = parseJson(relPath);
}

// (b) marketplace.json plugins[0].name must match plugin.json name.
const pluginJson = manifests['.claude-plugin/plugin.json'];
const marketplaceJson = manifests['.claude-plugin/marketplace.json'];
if (pluginJson && marketplaceJson) {
  const marketplaceName = marketplaceJson.plugins && marketplaceJson.plugins[0] && marketplaceJson.plugins[0].name;
  if (marketplaceName !== pluginJson.name) {
    errors.push(
      `.claude-plugin/marketplace.json: plugins[0].name ("${marketplaceName}") does not match ` +
      `.claude-plugin/plugin.json name ("${pluginJson.name}")`
    );
  }

  const cursorPluginJson = manifests['.cursor-plugin/plugin.json'];
  const cursorMarketplaceJson = manifests['.cursor-plugin/marketplace.json'];
  const cursorMarketplaceVersion = cursorMarketplaceJson && cursorMarketplaceJson.metadata && cursorMarketplaceJson.metadata.version;
  if (cursorPluginJson && cursorPluginJson.version !== pluginJson.version) {
    errors.push(
      `.cursor-plugin/plugin.json version ("${cursorPluginJson.version}") does not match ` +
      `.claude-plugin/plugin.json version ("${pluginJson.version}")`
    );
  }
  if (cursorMarketplaceVersion !== pluginJson.version) {
    errors.push(
      `.cursor-plugin/marketplace.json metadata.version ("${cursorMarketplaceVersion}") does not match ` +
      `.claude-plugin/plugin.json version ("${pluginJson.version}")`
    );
  }
}

// (c) Skill frontmatter check: name matches directory, description present.
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');
if (fs.existsSync(SKILLS_DIR)) {
  const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const dirName of skillDirs) {
    const skillPath = path.join('skills', dirName, 'SKILL.md');
    const absSkillPath = path.join(REPO_ROOT, skillPath);
    if (!fs.existsSync(absSkillPath)) {
      errors.push(`${skillPath}: missing`);
      continue;
    }

    const content = fs.readFileSync(absSkillPath, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      errors.push(`${skillPath}: missing frontmatter block (--- ... ---)`);
      continue;
    }

    const frontmatter = frontmatterMatch[1];
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    const descriptionMatch = frontmatter.match(/^description:\s*(.+)$/m);

    const name = nameMatch ? nameMatch[1].trim() : null;
    const description = descriptionMatch ? descriptionMatch[1].trim() : null;

    if (!name) {
      errors.push(`${skillPath}: frontmatter missing "name"`);
    } else if (name !== dirName) {
      errors.push(`${skillPath}: frontmatter name ("${name}") does not match directory ("${dirName}")`);
    }

    if (!description) {
      errors.push(`${skillPath}: frontmatter missing "description"`);
    }
  }
} else {
  errors.push('skills/: directory not found');
}

// (d) Authentication guards — Claude's public directory requires OAuth for
// authenticated remote MCP services. Cursor keeps its supported API-key path.
const claudeMcp = manifests['.mcp.json'];
const claudeServer = claudeMcp && claudeMcp.mcpServers && claudeMcp.mcpServers.synter;
if (!claudeServer || claudeServer.type !== 'http' || claudeServer.url !== 'https://mcp.syntermedia.ai') {
  errors.push('.mcp.json: Synter must use the production HTTPS remote MCP endpoint');
}
if (claudeServer && claudeServer.headers) {
  errors.push('.mcp.json: Claude plugin must use browser OAuth, not static request headers');
}
if (pluginJson && pluginJson.userConfig && pluginJson.userConfig.synter_api_key) {
  errors.push('.claude-plugin/plugin.json: Claude plugin must not collect a static Synter API key');
}

// (e) Root plugin.json is an Agent Plugins 1.0.0 manifest (Cursor detects it
// as a second plugin format). Keep it a real file — symlinks break on Windows
// checkouts and some marketplace crawlers — and keep it schema-clean.
const AGENT_PLUGIN_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
const AGENT_PLUGIN_KEYS = new Set([
  '$schema', 'name', 'version', 'description', 'author', 'homepage',
  'repository', 'license', 'keywords', 'extensions',
]);
if (fs.lstatSync(path.join(REPO_ROOT, 'plugin.json')).isSymbolicLink()) {
  errors.push('plugin.json: must be a regular file, not a symlink');
}
const rootPluginJson = manifests['plugin.json'];
if (rootPluginJson) {
  if (rootPluginJson.$schema !== AGENT_PLUGIN_SCHEMA) {
    errors.push(`plugin.json: $schema must be ${AGENT_PLUGIN_SCHEMA}`);
  }
  for (const key of Object.keys(rootPluginJson)) {
    if (!AGENT_PLUGIN_KEYS.has(key)) {
      errors.push(`plugin.json: "${key}" is not an Agent Plugins 1.0.0 manifest field`);
    }
  }
  if (pluginJson && rootPluginJson.name !== pluginJson.name) {
    errors.push('plugin.json: name does not match .claude-plugin/plugin.json');
  }
  if (pluginJson && rootPluginJson.version !== pluginJson.version) {
    errors.push('plugin.json: version does not match .claude-plugin/plugin.json');
  }
}

// (f) Cursor Marketplace checklist: logo committed and referenced by a
// relative path that exists in the repo.
for (const [relPath, logo] of [
  ['.cursor-plugin/plugin.json', manifests['.cursor-plugin/plugin.json'] && manifests['.cursor-plugin/plugin.json'].logo],
  ['.cursor-plugin/marketplace.json', (manifests['.cursor-plugin/marketplace.json'] && manifests['.cursor-plugin/marketplace.json'].plugins || [])[0] && manifests['.cursor-plugin/marketplace.json'].plugins[0].logo],
]) {
  if (!logo) continue;
  if (/^[a-z]+:\/\//i.test(logo) || logo.startsWith('/') || logo.includes('..')) {
    errors.push(`${relPath}: logo must be a relative repo path (got "${logo}")`);
  } else if (!fs.existsSync(path.join(REPO_ROOT, logo))) {
    errors.push(`${relPath}: logo "${logo}" does not exist`);
  }
}

// (g) Listing copy: no "free" framing in Cursor-facing manifest text (pricing
// is Solo $20/mo or credits).
for (const relPath of ['.cursor-plugin/plugin.json', '.cursor-plugin/marketplace.json']) {
  if (/\bfree\b/i.test(readFile(relPath))) {
    errors.push(`${relPath}: remove "free" wording from listing copy`);
  }
}

const mcpJson = readFile('mcp.json');
if (!mcpJson.includes('SYNTER_API_KEY')) {
  errors.push('mcp.json: missing required literal "SYNTER_API_KEY"');
}

if (errors.length > 0) {
  console.error('Manifest validation failed:\n');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}

console.log('All manifests, skill frontmatter, versions, and authentication guards passed.');
