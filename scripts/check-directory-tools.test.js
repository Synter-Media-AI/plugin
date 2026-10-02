'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { extractReferences, scan, readLiveTools } = require('./check-directory-tools');

test('extracts tools from prose, tables, functions, fences, and MCP qualification', () => {
  const source = [
    'Call `ga4_get_report` after list_connected_accounts.',
    '| `invented_tool` | unsupported |',
    '```js',
    'await mcp__synter__another_unknown({ event_id: "example" });',
    'dispatch("public_ad_library_intelligence", {});',
    '```',
    'Call tool:singleword or mcp__synter__hyphen-tool.',
    'event_id is a data field, but event_id() is a call.',
  ].join('\n');
  assert.deepEqual(extractReferences(source), [
    { name: 'ga4_get_report', line: 1 }, { name: 'list_connected_accounts', line: 1 },
    { name: 'invented_tool', line: 2 }, { name: 'another_unknown', line: 4 },
    { name: 'public_ad_library_intelligence', line: 5 },
    { name: 'singleword', line: 7 }, { name: 'hyphen-tool', line: 7 },
    { name: 'event_id', line: 8 },
  ]);
});

test('data fields are not tools, but dynamic tool templates fail closed', () => {
  assert.deepEqual(extractReferences('Use `utm_source`, `paid_social`, and `event_id` fields.'), []);
  assert.deepEqual(extractReferences('Call `event_id`()'), [{ name: 'event_id', line: 1 }]);
  assert.match(extractReferences('Use `pull_<platform>_ads_performance`')[0].name, /dynamic tool template/);
  assert.match(extractReferences('Run `get_*`')[0].name, /dynamic tool template/);
});

test('checks nested files in every instruction surface, including optional commands', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synter-directory-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'tools'));
  fs.copyFileSync(path.join(__dirname, '../tools/directory-tools.json'), path.join(root, 'tools/directory-tools.json'));
  for (const surface of ['skills', 'commands', 'rules', 'agents']) {
    fs.mkdirSync(path.join(root, surface, 'nested'), { recursive: true });
    fs.writeFileSync(path.join(root, surface, 'nested/instructions.md'), `Use list_campaigns and unknown_${surface}.`);
  }
  const result = scan(root);
  assert.equal(result.fileCount, 4);
  assert.equal(result.errors.length, 4);
  for (const surface of ['skills', 'commands', 'rules', 'agents']) {
    assert.ok(result.errors.some(error => error.includes(`unknown_${surface}`)));
  }
  fs.mkdirSync(path.join(root, 'scripts'));
  const script = path.join(root, 'scripts/check-directory-tools.js');
  fs.copyFileSync(path.join(__dirname, 'check-directory-tools.js'), script);
  const cli = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(cli.status, 1);
  assert.match(cli.stderr, /unlisted tool unknown_commands/);
  fs.writeFileSync(path.join(root, 'tools/directory-tools.json'), '["list_campaigns", "list_campaigns"]');
  assert.throws(() => scan(root), /34 unique tool names/);
});

function response(id, result, { sse = false, session = false } = {}) {
  const message = JSON.stringify({ jsonrpc: '2.0', id, result });
  return new Response(sse ? `event: message\r\ndata: ${message}\r\n\r\n` : message, {
    headers: {
      'Content-Type': sse ? 'text/event-stream' : 'application/json',
      ...(session ? { 'Mcp-Session-Id': 'test-session' } : {}),
    },
  });
}

test('live check initializes, passes session headers, parses JSON/SSE, and paginates', async () => {
  const calls = [];
  const names = await readLiveTools({ token: 'test-oauth-token', fetchImpl: async (url, options) => {
    const body = JSON.parse(options.body);
    calls.push(body);
    assert.equal(url, 'https://mcp.synterai.com');
    assert.equal(options.headers.Authorization, 'Bearer test-oauth-token');
    assert.equal(options.redirect, 'error');
    if (body.method === 'initialize') return response(body.id, { protocolVersion: '2025-03-26' }, { session: true });
    assert.equal(options.headers['Mcp-Session-Id'], 'test-session');
    if (body.method === 'notifications/initialized') {
      assert.equal(body.id, undefined);
      return new Response(null, { status: 202 });
    }
    assert.equal(body.method, 'tools/list');
    if (!body.params.cursor) return response(body.id, { tools: [{ name: 'list_campaigns' }], nextCursor: 'page-2' }, { sse: true });
    assert.equal(body.params.cursor, 'page-2');
    return response(body.id, { tools: [{ name: 'get_connection_status' }] });
  } });
  assert.deepEqual([...names], ['list_campaigns', 'get_connection_status']);
  assert.equal(calls.length, 4);
});

test('live check rejects missing tokens, untrusted endpoints, and failed authentication', async () => {
  await assert.rejects(readLiveTools({ token: '' }), /requires SYNTER_MCP_TOKEN/);
  await assert.rejects(readLiveTools({ token: 'secret', url: 'https://other.example' }), /production Synter/);
  await assert.rejects(readLiveTools({ token: 'secret', fetchImpl: async () => new Response('sensitive body', { status: 401 }) }), /^Error: initialize: HTTP 401$/);
});

test('live check rejects malformed results and looping cursors', async () => {
  for (const mode of ['missing-tools', 'looping-cursor', 'rpc-error', 'duplicate-tools']) {
    const fetchImpl = async (url, options) => {
      const { method, id } = JSON.parse(options.body);
      if (method === 'initialize') return response(id, { protocolVersion: '2025-03-26' });
      if (method === 'notifications/initialized') return new Response(null, { status: 202 });
      if (mode === 'missing-tools') return response(id, {});
      if (mode === 'rpc-error') return new Response(JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Unavailable' } }));
      if (mode === 'duplicate-tools') return response(id, { tools: [{ name: 'list_campaigns' }, { name: 'list_campaigns' }] });
      return response(id, { tools: [], nextCursor: 'same-page' });
    };
    await assert.rejects(readLiveTools({ token: 'secret', fetchImpl }), /missing tools|repeated pagination|JSON-RPC response|duplicate tool/);
  }
});
