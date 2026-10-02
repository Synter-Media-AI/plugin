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

// (d) Each client has its own OAuth-only remote URL. Claude must match the
// connector under review; Cursor points at the Synter AI endpoint.
for (const [configPath, expectedUrl] of [
  ['.mcp.json', 'https://mcp.syntermedia.ai'],
  ['mcp.json', 'https://mcp.synterai.com'],
]) {
  const config = manifests[configPath];
  const servers = config && config.mcpServers;
  const server = servers && servers.synter;
  if (!servers || Object.keys(servers).length !== 1 || !server ||
      server.type !== 'http' || server.url !== expectedUrl) {
    errors.push(`${configPath}: expected a single Synter HTTP server at ${expectedUrl}`);
  }
  if (server && Object.keys(server).some(key => !['type', 'url', 'description'].includes(key))) {
    errors.push(`${configPath}: OAuth-only remote configuration permits only type, url, and description; no headers, env, commands, or credential fields`);
  }
}
for (const manifestPath of ['.claude-plugin/plugin.json', '.cursor-plugin/plugin.json']) {
  const manifest = manifests[manifestPath];
  if (!manifest) continue;
  if (manifest.userConfig || manifest.variables || manifest.env || manifest.headers) {
    errors.push(`${manifestPath}: do not collect static credentials or declare authentication headers`);
  }
  const expectedConfig = manifestPath.startsWith('.cursor') ? './mcp.json' : './.mcp.json';
  if (manifest.mcpServers !== undefined && manifest.mcpServers !== expectedConfig) {
    errors.push(`${manifestPath}: mcpServers must reference ${expectedConfig}`);
  }
  if (manifestPath.startsWith('.cursor') && manifest.mcpServers !== expectedConfig) {
    errors.push(`${manifestPath}: missing Cursor mcpServers reference`);
  }
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
