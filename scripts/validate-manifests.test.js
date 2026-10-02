'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synter-manifests-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const entry of ['.claude-plugin', '.cursor-plugin', '.mcp.json', 'mcp.json', 'skills']) {
    fs.cpSync(path.join(__dirname, '..', entry), path.join(root, entry), { recursive: true });
  }
  fs.mkdirSync(path.join(root, 'scripts'));
  const script = path.join(root, 'scripts/validate-manifests.js');
  fs.copyFileSync(path.join(__dirname, 'validate-manifests.js'), script);
  return {
    root,
    edit(client, mutate) {
      const file = path.join(root, `.${client}-plugin/plugin.json`);
      const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
      mutate(manifest);
      fs.writeFileSync(file, JSON.stringify(manifest));
    },
    validate() {
      return spawnSync(process.execPath, [script], { encoding: 'utf8' });
    },
  };
}

test('accepts the Claude-only inline hook configuration', t => {
  const result = fixture(t).validate();
  assert.equal(result.status, 0, result.stderr);
});

test('rejects a shared hook file that Cursor would auto-discover', t => {
  const repo = fixture(t);
  fs.mkdirSync(path.join(repo.root, 'hooks'));
  fs.writeFileSync(path.join(repo.root, 'hooks/hooks.json'), '{}');
  const result = repo.validate();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /hooks\/hooks.json: forbidden/);
});

for (const hooks of [null, {}]) {
  test(`rejects a Cursor hooks key even when set to ${JSON.stringify(hooks)}`, t => {
    const repo = fixture(t);
    repo.edit('cursor', manifest => { manifest.hooks = hooks; });
    const result = repo.validate();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /must not declare a hooks key/);
  });
}

for (const [name, mutate] of [
  ['missing hook', manifest => { delete manifest.hooks; }],
  ['file reference instead of inline hook', manifest => { manifest.hooks = './hooks/hooks.json'; }],
  ['wrong event', manifest => { manifest.hooks = { Stop: manifest.hooks.SessionStart }; }],
  ['wrong command', manifest => { manifest.hooks.SessionStart[0].hooks[0].command = 'echo wrong'; }],
  ['wrong hook type', manifest => { manifest.hooks.SessionStart[0].hooks[0].type = 'prompt'; }],
]) {
  test(`rejects Claude configuration with ${name}`, t => {
    const repo = fixture(t);
    repo.edit('claude', mutate);
    const result = repo.validate();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /must declare an inline SessionStart command hook/);
  });
}
