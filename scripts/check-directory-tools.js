#!/usr/bin/env node
'use strict';

// Scan all snake_case identifiers, including prose and fenced examples. The
// field vocabulary below is data, not a second tool allowlist. Invoking a field
// as a function or MCP-qualified name still treats it as a tool reference.
const fs = require('node:fs');
const path = require('node:path');
const DATA_IDENTIFIERS = new Set([
  'ad_personalization', 'ad_storage', 'ad_user_data', 'analytics_storage',
  'conversion_id', 'custom_label', 'event_id', 'google_product_category',
  'identifier_exists', 'li_fat_id', 'openai_ads', 'order_id', 'paid_social',
  'product_type', 'rdt_cid', 'sale_price', 'transaction_id', 'utm_campaign',
  'utm_content', 'utm_medium', 'utm_source', 'utm_term',
]);
const ROOT = path.resolve(__dirname, '..');
const SURFACES = ['skills', 'commands', 'rules', 'agents', 'context', 'output-styles', 'scripts/session-context.sh'];
// Docs mix tool names with shell commands, so they are checked only for
// unavailable tool families and banned phrases, not against the allowlist.
const DOCS = ['README.md'];
// Hosted Claude connector: OAuth only, so the config carries no headers or keys.
const MCP_URL = 'https://mcp.synterai.com/mcp';
const ENDPOINTS = new Set([MCP_URL, 'https://mcp.synterai.com', 'https://mcp.syntermedia.ai']);
// Tool families the hosted Claude connector does not expose.
const UNAVAILABLE_TOOL = /^(?:ga4|generate)_/;
// Pricing language is not allowed in listing or instruction copy. Hyphenated
// compounds such as "credential-free" and words such as "freed" are fine.
const BANNED_PHRASES = [/(?<![\w-])free(?![\w-])/i];
const MANIFESTS = ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json'];

function extractReferences(source) {
  const refs = [];
  source.split(/\r?\n/).forEach((line, index) => {
    const names = new Set();
    // Explicit syntax also supports future tool names without underscores.
    for (const match of line.matchAll(/\bmcp__[\w-]+?__([\w-]+)|\btool:([\w-]+)/g)) {
      names.add(match[1] || match[2]);
    }
    const unqualified = line.replace(/\bmcp__[\w-]+?__[\w-]+/g, '');
    for (const match of unqualified.matchAll(/\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g)) {
      const name = match[0];
      const invoked = /^(?:\s*\(|`\()/.test(unqualified.slice(match.index + name.length));
      if (!DATA_IDENTIFIERS.has(name) || invoked) names.add(name);
    }
    // Tool templates cannot be verified against an exact-name directory.
    if (/\b(?:[a-z]+_)*(?:<[^>]+>|\*)_[a-z_]+\b|\b[a-z]+_\*/.test(line)) {
      names.add('[dynamic tool template: spell out exact tool names]');
    }
    for (const name of names) refs.push({ name, line: index + 1 });
  });
  return refs;
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  if (fs.lstatSync(dir).isFile()) return [dir];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Instruction symlinks are not supported: ${filename}`);
    return entry.isDirectory() ? listFiles(filename) : [filename];
  });
}

function readAllowlist(root) {
  const names = JSON.parse(fs.readFileSync(path.join(root, 'tools/directory-tools.json'), 'utf8'));
  if (!Array.isArray(names) || names.length !== 31 || new Set(names).size !== 31 ||
      names.some(name => typeof name !== 'string' || !/^[a-z][a-z0-9_]+$/.test(name))) {
    throw new Error('tools/directory-tools.json must contain 31 unique tool names.');
  }
  const unavailable = names.filter(name => UNAVAILABLE_TOOL.test(name));
  if (unavailable.length) throw new Error(`tools/directory-tools.json lists tools the hosted connector does not expose: ${unavailable.join(', ')}`);
  return new Set(names);
}

function scan(root = ROOT) {
  const allowed = readAllowlist(root);
  const errors = [];
  const references = new Set();
  const files = SURFACES.flatMap(surface => listFiles(path.join(root, surface)));
  if (!files.length) throw new Error('No instruction files found.');
  for (const filename of files) {
    const source = fs.readFileSync(filename, 'utf8');
    const relative = path.relative(root, filename);
    for (const ref of extractReferences(source)) {
      references.add(ref.name);
      if (UNAVAILABLE_TOOL.test(ref.name)) errors.push(`${relative}:${ref.line}: tool ${ref.name} is not available on the hosted Claude connector`);
      else if (!allowed.has(ref.name)) errors.push(`${relative}:${ref.line}: unlisted tool ${ref.name}`);
    }
    errors.push(...findBannedPhrases(source, relative));
  }
  for (const doc of DOCS) {
    const filename = path.join(root, doc);
    if (!fs.existsSync(filename)) continue;
    const source = fs.readFileSync(filename, 'utf8');
    source.split(/\r?\n/).forEach((line, index) => {
      for (const match of line.matchAll(/\b(?:ga4|generate)_[a-z0-9_]+/g)) {
        errors.push(`${doc}:${index + 1}: tool ${match[0]} is not available on the hosted Claude connector`);
      }
    });
    errors.push(...findBannedPhrases(source, doc));
  }
  for (const manifest of MANIFESTS) {
    const filename = path.join(root, manifest);
    if (fs.existsSync(filename)) errors.push(...findBannedPhrases(fs.readFileSync(filename, 'utf8'), manifest));
  }
  errors.push(...checkMcpConfig(root));
  return { allowed, references, errors, fileCount: files.length };
}

function findBannedPhrases(source, relative) {
  const errors = [];
  source.split(/\r?\n/).forEach((line, index) => {
    for (const pattern of BANNED_PHRASES) {
      const match = line.match(pattern);
      if (match) errors.push(`${relative}:${index + 1}: banned phrase "${match[0]}"`);
    }
  });
  return errors;
}

function checkMcpConfig(root) {
  let server;
  let servers;
  try {
    servers = JSON.parse(fs.readFileSync(path.join(root, '.mcp.json'), 'utf8')).mcpServers;
    server = servers && servers.synter;
  } catch {
    return ['.mcp.json: missing or invalid JSON'];
  }
  if (!server || Object.keys(servers).length !== 1 || server.type !== 'http' || server.url !== MCP_URL ||
      Object.keys(server).some(key => !['type', 'url', 'description'].includes(key))) {
    return [`.mcp.json: expected one OAuth-only Synter HTTP server at ${MCP_URL} with no headers or credentials`];
  }
  return [];
}

async function readLiveTools({ token, url = MCP_URL, fetchImpl = fetch }) {
  if (!token) throw new Error('Live check requires SYNTER_MCP_TOKEN (an OAuth access token).');
  if (!ENDPOINTS.has(url)) throw new Error('Live check URL must be one of the two production Synter MCP endpoints.');
  let session;
  let protocol = '2025-03-26';
  let requestId = 0;
  async function rpc(method, params, notification = false) {
    const id = notification ? undefined : ++requestId;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'MCP-Protocol-Version': protocol,
    };
    if (session) headers['Mcp-Session-Id'] = session;
    const response = await fetchImpl(url, {
      method: 'POST', headers, redirect: 'error', signal: AbortSignal.timeout(30000),
      body: JSON.stringify({ jsonrpc: '2.0', ...(notification ? {} : { id }), method, params }),
    });
    // Never print response bodies or headers: they may contain credentials.
    if (!response.ok) throw new Error(`${method}: HTTP ${response.status}`);
    session = response.headers.get('mcp-session-id') || session;
    if (notification) { await response.body?.cancel(); return; }
    const body = await response.text();
    let messages;
    const parse = value => {
      try { return JSON.parse(value); }
      catch { throw new Error(`${method}: invalid JSON response`); }
    };
    if ((response.headers.get('content-type') || '').includes('text/event-stream')) {
      messages = body.split(/\r?\n\r?\n/).flatMap(event => {
        const data = event.split(/\r?\n/).filter(line => line.startsWith('data:'))
          .map(line => line.slice(5).trimStart()).join('\n');
        return data ? [parse(data)] : [];
      });
    } else {
      messages = [parse(body)];
    }
    const message = messages.find(item => item.id === id);
    if (!message || message.jsonrpc !== '2.0' || message.error || !message.result) {
      throw new Error(`${method}: invalid or unsuccessful JSON-RPC response`);
    }
    return message.result;
  }
  const init = await rpc('initialize', {
    protocolVersion: protocol, capabilities: {},
    clientInfo: { name: 'synter-directory-validator', version: '1.0.0' },
  });
  if (typeof init.protocolVersion !== 'string') throw new Error('initialize: missing protocol version');
  protocol = init.protocolVersion;
  await rpc('notifications/initialized', {}, true);
  const names = new Set();
  const cursors = new Set();
  let cursor;
  do {
    const result = await rpc('tools/list', cursor ? { cursor } : {});
    if (!Array.isArray(result.tools)) throw new Error('tools/list: missing tools array');
    for (const tool of result.tools) {
      if (typeof tool.name !== 'string' || !tool.name || names.has(tool.name)) {
        throw new Error('tools/list: missing or duplicate tool name');
      }
      names.add(tool.name);
    }
    cursor = result.nextCursor;
    if (cursor !== undefined && (typeof cursor !== 'string' || !cursor || cursors.has(cursor))) {
      throw new Error('tools/list: invalid or repeated pagination cursor');
    }
    if (cursor) cursors.add(cursor);
    if (cursors.size > 100) throw new Error('tools/list: pagination limit exceeded');
  } while (cursor);
  return names;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--live')) throw new Error('Usage: node scripts/check-directory-tools.js [--live]');
  const result = scan();
  // The checked-in Claude directory bundle ships separately; hold it to the same rules.
  const bundle = path.join(ROOT, 'packages/claude-directory');
  if (fs.existsSync(bundle)) result.errors.push(...scan(bundle).errors.map(error => `packages/claude-directory/${error}`));
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  if (args.includes('--live') || process.env.SYNTER_MCP_TOKEN) {
    const live = await readLiveTools({ token: process.env.SYNTER_MCP_TOKEN, url: process.env.SYNTER_MCP_URL });
    const missing = [...result.allowed].filter(name => !live.has(name));
    if (missing.length) throw new Error(`Live server is missing directory tools: ${missing.join(', ')}`);
    console.log(`Live tools/list contains all ${result.allowed.size} directory tools.`);
  }
  console.log(`Checked ${result.fileCount} instruction files: ${result.references.size} referenced tools, all in the ${result.allowed.size}-tool directory.`);
}

module.exports = { extractReferences, scan, readLiveTools };
if (require.main === module) main().catch(error => {
  // Mask the OAuth token even if a lower-level library includes it in an error.
  const message = process.env.SYNTER_MCP_TOKEN
    ? error.message.split(process.env.SYNTER_MCP_TOKEN).join('[redacted]') : error.message;
  console.error(message);
  process.exitCode = 1;
});
