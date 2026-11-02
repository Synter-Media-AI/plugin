'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('check-skill-tools.mjs passes on current repository skills and hosted-tools.json', async () => {
  const script = path.join(__dirname, 'check-skill-tools.mjs');
  const result = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Checked \d+ skill files/);
  assert.match(result.stdout, /304 hosted tools/);
});

test('check-skill-tools.mjs fails when a skill references an unlisted tool', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tools-test-'));
  try {
    fs.mkdirSync(path.join(tmpDir, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'skills/demo'), { recursive: true });

    // Copy allowlist
    fs.copyFileSync(
      path.join(__dirname, 'hosted-tools.json'),
      path.join(tmpDir, 'scripts/hosted-tools.json')
    );
    // Copy script
    fs.copyFileSync(
      path.join(__dirname, 'check-skill-tools.mjs'),
      path.join(tmpDir, 'scripts/check-skill-tools.mjs')
    );

    // Write a skill with an invalid tool
    fs.writeFileSync(
      path.join(tmpDir, 'skills/demo/SKILL.md'),
      '---\nname: demo\ndescription: demo\n---\nCall `unlisted_fake_tool` to do things.\n'
    );

    const result = spawnSync(
      process.execPath,
      [path.join(tmpDir, 'scripts/check-skill-tools.mjs')],
      { cwd: tmpDir, encoding: 'utf8' }
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /referenced tool `unlisted_fake_tool` is not in scripts\/hosted-tools\.json/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('check-skill-tools.mjs ignores data identifiers in skills', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tools-test-'));
  try {
    fs.mkdirSync(path.join(tmpDir, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'skills/demo'), { recursive: true });

    fs.copyFileSync(
      path.join(__dirname, 'hosted-tools.json'),
      path.join(tmpDir, 'scripts/hosted-tools.json')
    );
    fs.copyFileSync(
      path.join(__dirname, 'check-skill-tools.mjs'),
      path.join(tmpDir, 'scripts/check-skill-tools.mjs')
    );

    // Write a skill with allowed tool and data identifiers
    fs.writeFileSync(
      path.join(tmpDir, 'skills/demo/SKILL.md'),
      '---\nname: demo\ndescription: demo\n---\nCheck `list_connected_accounts` with `utm_source`, `utm_medium`, and `event_id`.\n'
    );

    const result = spawnSync(
      process.execPath,
      [path.join(tmpDir, 'scripts/check-skill-tools.mjs')],
      { cwd: tmpDir, encoding: 'utf8' }
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Checked 1 skill files/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
