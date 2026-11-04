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

test('extractToolReferences detects unquoted, list, backtick, and explicit tool references', async () => {
  const { extractToolReferences } = await import('./check-skill-tools.mjs');
  const content = [
    'Call list_campaigns before pause_campaign.',
    '- list_connected_accounts: verify platforms',
    'Run `pull_meta_ads_performance(days=30, level="ad-set")` for detail.',
    'Use tool:optimize_budget and mcp__synter__get_attribution.',
  ].join('\n');
  const refs = extractToolReferences(content);
  assert.deepEqual(refs, [
    { name: 'list_campaigns', line: 1 },
    { name: 'pause_campaign', line: 1 },
    { name: 'list_connected_accounts', line: 2 },
    { name: 'pull_meta_ads_performance', line: 3 },
    { name: 'optimize_budget', line: 4 },
    { name: 'get_attribution', line: 4 },
  ]);
});

test('extractToolReferences ignores data identifiers unless invoked, and avoids false positives for URLs and files', async () => {
  const { extractToolReferences } = await import('./check-skill-tools.mjs');
  const content = [
    'Use `utm_source`, `utm_medium`, and `event_id` fields.',
    'Call event_id() as a function.',
    'Visit https://synterai.com/privacy_policy and https://synterai.com/terms_of_service.',
    'See rules/brand_safety.md and assets/logo_opaque.png for guidelines.',
    'Read [campaign documentation](docs/campaign_guide.md) or [list_campaigns](docs/list_campaigns.md).',
    '<!-- comment with custom_metric_key -->',
  ].join('\n');
  const refs = extractToolReferences(content);
  assert.deepEqual(refs, [
    { name: 'event_id', line: 2 },
    { name: 'list_campaigns', line: 5 },
  ]);
});

test('extractToolReferences fails closed on dynamic tool templates', async () => {
  const { extractToolReferences } = await import('./check-skill-tools.mjs');
  const content = [
    'Use `pull_<platform>_ads_performance` to fetch data.',
    'Run `get_*` for all metrics.',
  ].join('\n');
  const refs = extractToolReferences(content);
  assert.equal(refs.length, 2);
  assert.match(refs[0].name, /dynamic tool template/);
  assert.match(refs[1].name, /dynamic tool template/);
});

test('check-skill-tools.mjs fails when a skill references an unquoted unlisted tool in prose or lists', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tools-unquoted-'));
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

    // Skill with unquoted tool in prose and list
    fs.writeFileSync(
      path.join(tmpDir, 'skills/demo/SKILL.md'),
      '---\nname: demo\ndescription: demo\n---\nCall unlisted_prose_tool to run checks.\n- unlisted_list_tool: unlisted bullet tool\n'
    );

    const result = spawnSync(
      process.execPath,
      [path.join(tmpDir, 'scripts/check-skill-tools.mjs')],
      { cwd: tmpDir, encoding: 'utf8' }
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /referenced tool `unlisted_prose_tool` is not in scripts\/hosted-tools\.json/);
    assert.match(result.stderr, /referenced tool `unlisted_list_tool` is not in scripts\/hosted-tools\.json/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('check-skill-tools.mjs scans config/claude-directory/help.md and reports unlisted tools', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tools-help-'));
  try {
    fs.mkdirSync(path.join(tmpDir, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'skills/demo'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'config/claude-directory'), { recursive: true });

    fs.copyFileSync(
      path.join(__dirname, 'hosted-tools.json'),
      path.join(tmpDir, 'scripts/hosted-tools.json')
    );
    fs.copyFileSync(
      path.join(__dirname, 'check-skill-tools.mjs'),
      path.join(tmpDir, 'scripts/check-skill-tools.mjs')
    );

    // Valid root skill
    fs.writeFileSync(
      path.join(tmpDir, 'skills/demo/SKILL.md'),
      '---\nname: demo\ndescription: demo\n---\nUse `list_campaigns`.\n'
    );
    // config/claude-directory/help.md with unhosted tool
    fs.writeFileSync(
      path.join(tmpDir, 'config/claude-directory/help.md'),
      '---\nname: help\ndescription: help\n---\nCall unlisted_directory_help_tool to inspect accounts.\n'
    );

    const result = spawnSync(
      process.execPath,
      [path.join(tmpDir, 'scripts/check-skill-tools.mjs')],
      { cwd: tmpDir, encoding: 'utf8' }
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /config\/claude-directory\/help\.md:5: referenced tool `unlisted_directory_help_tool` is not in scripts\/hosted-tools\.json/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('check-skill-tools.mjs passes when config/claude-directory/help.md has valid tools and URLs', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tools-help-pass-'));
  try {
    fs.mkdirSync(path.join(tmpDir, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'skills/demo'), { recursive: true });
    fs.mkdirSync(path.join(tmpDir, 'config/claude-directory'), { recursive: true });

    fs.copyFileSync(
      path.join(__dirname, 'hosted-tools.json'),
      path.join(tmpDir, 'scripts/hosted-tools.json')
    );
    fs.copyFileSync(
      path.join(__dirname, 'check-skill-tools.mjs'),
      path.join(tmpDir, 'scripts/check-skill-tools.mjs')
    );

    fs.writeFileSync(
      path.join(tmpDir, 'skills/demo/SKILL.md'),
      '---\nname: demo\ndescription: demo\n---\nUse `list_campaigns`.\n'
    );
    fs.writeFileSync(
      path.join(tmpDir, 'config/claude-directory/help.md'),
      '---\nname: help\ndescription: help\n---\nUse list_connected_accounts. See [Privacy](https://synterai.com/privacy) and rules/brand_safety.md.\n'
    );

    const result = spawnSync(
      process.execPath,
      [path.join(tmpDir, 'scripts/check-skill-tools.mjs')],
      { cwd: tmpDir, encoding: 'utf8' }
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Checked 2 skill files/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
