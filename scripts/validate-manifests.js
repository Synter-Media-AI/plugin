#!/usr/bin/env node
// Validates a source tree or an extracted Desktop package before release.
// Node stdlib only — no dependencies to keep CI fast and reproducible.
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, '..');
const errors = [];

const EXPECTED = {
  name: 'synter',
  displayName: 'Synter',
  skills: 57,
  agents: 7,
  mcpUrl: 'https://mcp.syntermedia.ai',
  repository: 'https://github.com/Synter-Media-AI/plugin',
  logo: 'https://raw.githubusercontent.com/Synter-Media-AI/plugin/main/assets/logo.png',
  supportEmail: 'support@synterai.com',
};

function readFile(relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  return fs.readFileSync(abs, 'utf8');
}

function parseJson(relPath) {
  let raw;
  try {
    raw = readFile(relPath);
  } catch (err) {
    errors.push(`${relPath}: missing or unreadable — ${err.message}`);
    return null;
  }
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

// Claude's authoritative manifest lives in .claude-plugin/. Keep the root alias
// as a symlink so tools that inspect plugin.json cannot drift to another copy.
const rootManifestPath = path.join(REPO_ROOT, 'plugin.json');
if (!fs.existsSync(rootManifestPath) || !fs.lstatSync(rootManifestPath).isSymbolicLink()) {
  errors.push('plugin.json: expected a symlink to .claude-plugin/plugin.json');
} else if (fs.readlinkSync(rootManifestPath) !== '.claude-plugin/plugin.json') {
  errors.push('plugin.json: symlink must target .claude-plugin/plugin.json');
}

// (b) Identity and version must agree on every marketplace surface.
const pluginJson = manifests['.claude-plugin/plugin.json'];
const marketplaceJson = manifests['.claude-plugin/marketplace.json'];
if (pluginJson && marketplaceJson) {
  const marketplaceEntry = marketplaceJson.plugins && marketplaceJson.plugins[0];
  const marketplaceName = marketplaceEntry && marketplaceEntry.name;
  if (marketplaceJson.name !== EXPECTED.name || !Array.isArray(marketplaceJson.plugins) || marketplaceJson.plugins.length !== 1) {
    errors.push('.claude-plugin/marketplace.json: expected marketplace "synter" with exactly one plugin');
  }
  if (marketplaceName !== pluginJson.name) {
    errors.push(
      `.claude-plugin/marketplace.json: plugins[0].name ("${marketplaceName}") does not match ` +
      `.claude-plugin/plugin.json name ("${pluginJson.name}")`
    );
  }

  const cursorPluginJson = manifests['.cursor-plugin/plugin.json'];
  const cursorMarketplaceJson = manifests['.cursor-plugin/marketplace.json'];
  const cursorMarketplaceVersion = cursorMarketplaceJson && cursorMarketplaceJson.metadata && cursorMarketplaceJson.metadata.version;
  const versions = {
    '.claude-plugin/plugin.json': pluginJson.version,
    '.claude-plugin/marketplace.json': marketplaceEntry && marketplaceEntry.version,
    '.cursor-plugin/plugin.json': cursorPluginJson && cursorPluginJson.version,
    '.cursor-plugin/marketplace.json': cursorMarketplaceVersion,
  };
  for (const [relPath, version] of Object.entries(versions)) {
    if (version !== pluginJson.version) {
      errors.push(`${relPath} version ("${version}") does not match canonical version ("${pluginJson.version}")`);
    }
  }
  if (!/^\d+\.\d+\.\d+$/.test(pluginJson.version || '')) {
    errors.push(`.claude-plugin/plugin.json: version ("${pluginJson.version}") is not semantic MAJOR.MINOR.PATCH`);
  }
  if (pluginJson.name !== EXPECTED.name || pluginJson.displayName !== EXPECTED.displayName) {
    errors.push('.claude-plugin/plugin.json: canonical name/displayName must be synter/Synter');
  }
  if (pluginJson.repository !== EXPECTED.repository) {
    errors.push(`.claude-plugin/plugin.json: repository must be ${EXPECTED.repository}`);
  }
  if (!pluginJson.author || pluginJson.author.name !== EXPECTED.displayName || pluginJson.author.email !== EXPECTED.supportEmail) {
    errors.push(`.claude-plugin/plugin.json: publisher must be Synter <${EXPECTED.supportEmail}>`);
  }
  if (cursorPluginJson && (cursorPluginJson.name !== EXPECTED.name || cursorPluginJson.displayName !== EXPECTED.displayName || cursorPluginJson.repository !== EXPECTED.repository)) {
    errors.push('.cursor-plugin/plugin.json: canonical name, displayName, or repository is incorrect');
  }
  if (cursorPluginJson && (!cursorPluginJson.author || cursorPluginJson.author.email !== EXPECTED.supportEmail)) {
    errors.push(`.cursor-plugin/plugin.json: publisher email must be ${EXPECTED.supportEmail}`);
  }
  if (cursorPluginJson && cursorPluginJson.logo !== EXPECTED.logo) {
    errors.push(`.cursor-plugin/plugin.json: logo must be ${EXPECTED.logo}`);
  }
  const cursorEntry = cursorMarketplaceJson && cursorMarketplaceJson.plugins && cursorMarketplaceJson.plugins[0];
  if (!cursorMarketplaceJson || cursorMarketplaceJson.name !== EXPECTED.name || !Array.isArray(cursorMarketplaceJson.plugins) || cursorMarketplaceJson.plugins.length !== 1) {
    errors.push('.cursor-plugin/marketplace.json: expected marketplace "synter" with exactly one plugin');
  }
  if (cursorEntry && (cursorEntry.name !== EXPECTED.name || cursorEntry.source !== '.')) {
    errors.push('.cursor-plugin/marketplace.json: plugin must be named "synter" and sourced from "."');
  }
  if (!cursorEntry || cursorEntry.logo !== EXPECTED.logo) {
    errors.push(`.cursor-plugin/marketplace.json: logo must be ${EXPECTED.logo}`);
  }
}

// (c) Runtime inventory and frontmatter.
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');
if (fs.existsSync(SKILLS_DIR)) {
  const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  if (skillDirs.length !== EXPECTED.skills) {
    errors.push(`skills/: expected ${EXPECTED.skills} skill directories, found ${skillDirs.length}`);
  }

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

const AGENTS_DIR = path.join(REPO_ROOT, 'agents');
const agentFiles = fs.existsSync(AGENTS_DIR)
  ? fs.readdirSync(AGENTS_DIR).filter((name) => name.endsWith('.md'))
  : [];
if (agentFiles.length !== EXPECTED.agents) {
  errors.push(`agents/: expected ${EXPECTED.agents} Markdown agents, found ${agentFiles.length}`);
}
for (const fileName of agentFiles) {
  const content = fs.readFileSync(path.join(AGENTS_DIR, fileName), 'utf8');
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter || !/^name:\s*\S+/m.test(frontmatter[1]) || !/^description:\s*\S+/m.test(frontmatter[1])) {
    errors.push(`agents/${fileName}: frontmatter must contain name and description`);
  }
}

const hooks = parseJson('hooks/hooks.json');
const sessionHooks = hooks && hooks.hooks && hooks.hooks.SessionStart;
if (!Array.isArray(sessionHooks) || sessionHooks.length !== 1) {
  errors.push('hooks/hooks.json: expected exactly one SessionStart hook group');
} else {
  const commands = sessionHooks[0] && sessionHooks[0].hooks;
  if (!Array.isArray(commands) || commands.length !== 1 || commands[0].type !== 'command') {
    errors.push('hooks/hooks.json: expected exactly one SessionStart command hook');
  } else if (!commands[0].command.includes('${CLAUDE_PLUGIN_ROOT}')) {
    errors.push('hooks/hooks.json: SessionStart hook must resolve its script through ${CLAUDE_PLUGIN_ROOT}');
  }
}

const requiredFiles = [
  'assets/logo.png',
  'context/brand-and-safety.md',
  'hooks/hooks.json',
  'output-styles/synter.md',
  'scripts/session-context.sh',
  'README.md',
  'INSTALL.md',
  'CHANGELOG.md',
  'LICENSE',
];
for (const relPath of requiredFiles) {
  if (!fs.existsSync(path.join(REPO_ROOT, relPath))) {
    errors.push(`${relPath}: required package file missing`);
  }
}

const logoPath = path.join(REPO_ROOT, 'assets/logo.png');
if (fs.existsSync(logoPath)) {
  const logo = fs.readFileSync(logoPath);
  const pngSignature = '89504e470d0a1a0a';
  if (logo.subarray(0, 8).toString('hex') !== pngSignature || logo.readUInt32BE(16) !== 1024 || logo.readUInt32BE(20) !== 1024 || logo[25] !== 6) {
    errors.push('assets/logo.png: expected a valid 1024x1024 RGBA PNG');
  }
}

const publicDocs = ['README.md', 'INSTALL.md'].map((relPath) => readFile(relPath)).join('\n');
for (const staleUrl of ['https://syntermedia.ai/logo.svg', 'https://docs.syntermedia.ai/tools']) {
  if (publicDocs.includes(staleUrl)) {
    errors.push(`documentation: remove unavailable URL ${staleUrl}`);
  }
}

// (d) Authentication guards — Claude's public directory requires OAuth for
// authenticated remote MCP services. Cursor keeps its supported API-key path.
const claudeMcp = manifests['.mcp.json'];
const claudeServer = claudeMcp && claudeMcp.mcpServers && claudeMcp.mcpServers.synter;
const claudeServerNames = claudeMcp && claudeMcp.mcpServers ? Object.keys(claudeMcp.mcpServers) : [];
if (claudeServerNames.length !== 1 || claudeServerNames[0] !== EXPECTED.name) {
  errors.push('.mcp.json: expected exactly one connector named "synter"');
}
if (!claudeServer || claudeServer.type !== 'http' || claudeServer.url !== EXPECTED.mcpUrl) {
  errors.push('.mcp.json: Synter must use the production HTTPS remote MCP endpoint');
}
if (claudeServer && claudeServer.headers) {
  errors.push('.mcp.json: Claude plugin must use browser OAuth, not static request headers');
}
if (pluginJson && pluginJson.userConfig && pluginJson.userConfig.synter_api_key) {
  errors.push('.claude-plugin/plugin.json: Claude plugin must not collect a static Synter API key');
}

const cursorMcp = manifests['mcp.json'];
const cursorServers = cursorMcp && cursorMcp.mcpServers ? Object.keys(cursorMcp.mcpServers) : [];
const cursorServer = cursorMcp && cursorMcp.mcpServers && cursorMcp.mcpServers.synter;
if (cursorServers.length !== 1 || !cursorServer || cursorServer.type !== 'http' || cursorServer.url !== EXPECTED.mcpUrl) {
  errors.push('mcp.json: expected exactly one Synter HTTP connector at the production endpoint');
}
if (!cursorServer || !cursorServer.headers || cursorServer.headers['X-Synter-Key'] !== '${SYNTER_API_KEY}') {
  errors.push('mcp.json: Cursor connector must use the SYNTER_API_KEY variable');
}

if (errors.length > 0) {
  console.error('Manifest validation failed:\n');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}

console.log(
  `Validated Synter ${pluginJson && pluginJson.version}: ` +
  `${EXPECTED.skills} skills, ${EXPECTED.agents} agents, 1 SessionStart hook, 1 OAuth MCP connector, and canonical branding.`
);
