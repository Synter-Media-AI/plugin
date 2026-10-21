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
  '.cursor-mcp.json',
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

// (d) Client-specific HTTP syntax remains separate from the portable MCP schema.
for (const [configPath, expectedUrl] of [
  ['.mcp.json', 'https://mcp.synterai.com'],
  ['.cursor-mcp.json', 'https://mcp.synterai.com'],
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
  const expectedConfig = manifestPath.startsWith('.cursor') ? './.cursor-mcp.json' : './.mcp.json';
  if (manifest.mcpServers !== undefined && manifest.mcpServers !== expectedConfig) {
    errors.push(`${manifestPath}: mcpServers must reference ${expectedConfig}`);
  }
  if (manifestPath.startsWith('.cursor') && manifest.mcpServers !== expectedConfig) {
    errors.push(`${manifestPath}: missing Cursor mcpServers reference`);
  }
}

// Portable Agent Plugins entry point and OpenAI directory requirements.
const portable = manifests['plugin.json'];
const portableMcp = manifests['mcp.json'];
const allowedPortableKeys = ['$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions'];
if (!portable || portable.$schema !== 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json' ||
    portable.name !== pluginJson?.name || portable.version !== pluginJson?.version ||
    Object.keys(portable).some(key => !allowedPortableKeys.includes(key))) {
  errors.push('plugin.json: portable schema, identity, and version must match the canonical package');
}
const openai = portable?.extensions?.['com.openai'];
const listing = openai?.interface;
for (const [key, limit] of [['displayName', 30], ['shortDescription', 30], ['longDescription', 4000], ['developerName', 80], ['category', 100]]) {
  if (typeof listing?.[key] !== 'string' || !listing[key].trim() || listing[key].length > limit) errors.push(`plugin.json: invalid listing ${key}`);
}
for (const key of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
  try {
    const url = new URL(listing?.[key]);
    if (url.origin !== 'https://synterai.com' || url.username || url.password) throw new Error();
  } catch { errors.push(`plugin.json: ${key} must use canonical Synter HTTPS URL`); }
}
for (const asset of ['logo', 'composerIcon']) {
  const value = listing?.[asset];
  if (typeof value !== 'string' || !value.startsWith('./assets/') || value.includes('..') || !fs.existsSync(path.join(REPO_ROOT, value))) errors.push(`plugin.json: missing packaged ${asset}`);
}
if (openai?.hooks || openai?.apps || fs.existsSync(path.join(REPO_ROOT, '.app.json'))) errors.push('plugin.json: public OpenAI package cannot declare hooks or app references');
const portableServer = portableMcp?.mcpServers?.synter;
if (portableMcp?.$schema !== 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json' ||
    Object.keys(portableMcp?.mcpServers || {}).length !== 1 || portableServer?.type !== 'streamable-http' ||
    portableServer?.url !== 'https://mcp.synterai.com' ||
    Object.keys(portableServer || {}).some(key => !['type', 'url'].includes(key))) {
  errors.push('mcp.json: expected portable HTTP transport and OAuth DCR without credentials');
}
for (const pathName of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', '.cursor-plugin/plugin.json', '.cursor-plugin/marketplace.json', 'plugin.json']) {
  if (JSON.stringify(manifests[pathName]).includes('syntermedia.ai')) errors.push(`${pathName}: obsolete public domain`);
}

// (e) Keep the shell hook Claude-only: Cursor also auto-discovers hooks/hooks.json.
if (fs.existsSync(path.join(REPO_ROOT, 'hooks/hooks.json'))) {
  errors.push('hooks/hooks.json: forbidden because Cursor auto-discovers this file; keep Claude hooks inline');
}
const cursorManifest = manifests['.cursor-plugin/plugin.json'];
if (cursorManifest && Object.prototype.hasOwnProperty.call(cursorManifest, 'hooks')) {
  errors.push('.cursor-plugin/plugin.json: must not declare a hooks key');
}
const sessionStartHooks = pluginJson && pluginJson.hooks && pluginJson.hooks.SessionStart;
const sessionContextCommand = '"${CLAUDE_PLUGIN_ROOT}"/scripts/session-context.sh';
if (!Array.isArray(sessionStartHooks) || !sessionStartHooks.some(entry =>
  entry && Array.isArray(entry.hooks) && entry.hooks.some(hook =>
    hook && hook.type === 'command' && hook.command === sessionContextCommand
  )
)) {
  errors.push('.claude-plugin/plugin.json: must declare an inline SessionStart command hook pointing at scripts/session-context.sh');
}

if (errors.length > 0) {
  console.error('Manifest validation failed:\n');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}

console.log('All manifests, skill frontmatter, versions, authentication guards, and hook isolation checks passed.');
