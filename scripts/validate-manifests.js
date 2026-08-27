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

// (d) Interpolation guards — the two mcp manifests must reference their
// respective client's variable substitution syntax, or a client's install
// UI silently ships a dead API key.
const mcpDotJson = readFile('.mcp.json');
if (!mcpDotJson.includes('user_config.synter_api_key')) {
  errors.push('.mcp.json: missing required literal "user_config.synter_api_key"');
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

console.log('All manifests, skill frontmatter, and interpolation guards passed.');
