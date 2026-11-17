# Claude plugin directory submission

Prepared: 2026-11-17

This is the reviewer-ready copy for the public Synter plugin repository.
The Claude Directory package lives at `packages/claude-directory`. It is a
free, read-only listing: 83 hosted MCP tools, 27 skills, and 3 agent
instructions, with browser OAuth sign-in to Synter's `/mcp/directory`
endpoint. Do not merge or publish this listing until the matching
`/mcp/directory` profile is live in production (synter-media #14019).

Synter's separate remote MCP connector submission is in review; that does
not submit or publish this plugin in Anthropic's plugin directory.

## Current directory status

- **Connector Directory:** submitted 2026-09-05 from the Synter Team
  organization; slug `synter`; status **In review** at
  `https://claude.ai/admin-settings/directory/submissions/synter`.
- **Plugin Directory:** no submission ID or published listing has been
  verified. This public repository remains directly installable while the
  separate plugin submission is completed.

Anthropic documents the Connector Directory and Plugin Directory as separate,
complementary catalogs. Do not treat connector review as plugin publication.

## Submission fields

| Field | Value |
| --- | --- |
| Public repository | `https://github.com/Synter-Media-AI/plugin` |
| Marketplace source | `packages/claude-directory` |
| Plugin name | `synter` |
| Version | `1.3.3` |
| Publisher | Synter |
| Website | `https://synterai.com` |
| License | MIT |
| Category | Marketing and advertising |
| Short description | Free, read-only Synter skills and MCP connector. Review performance, audiences, and plans across 30+ ad platforms over OAuth. |
| Brand icon | `assets/logo.png` — canonical transparent 1024×1024 Synter mark |
| Support | `https://synterai.com/contact` |
| Privacy policy | `https://synterai.com/privacy` |
| Terms | `https://synterai.com/terms` |
| MCP endpoint | `https://mcp.synterai.com/mcp/directory` |

Suggested long description:

> Synter is a free, read-only plugin for reviewing advertising performance,
> audiences, and campaign plans across 30+ ad platforms. It connects to
> Synter's hosted MCP service over browser OAuth. Users sign in, verify the
> connected workspace and advertising accounts, and use the 83-tool
> `/mcp/directory` surface for lookups and reports. This listing does not
> include tools that create, update, or change campaigns.

## Canonical installation

Direct installation from Synter's marketplace:

```text
/plugin marketplace add Synter-Media-AI/plugin
/plugin install synter@synter
```

After Anthropic publishes the community-directory listing, Claude Code users
add Anthropic's community marketplace and install Synter from its published
`claude-community` catalog:

```text
/plugin marketplace add anthropics/claude-plugins-community
/plugin install synter@claude-community
```

Do not advertise the directory command until `synter` appears in Anthropic's
public community catalog. The separate, automatically configured
`claude-plugins-official` marketplace is curated by Anthropic and has no public
application process.

The public repository is also directly installable in Claude Desktop and
Cowork: **Customize → Plugins → Personal plugins → + → Add marketplace → Add
from a repository**, then enter `Synter-Media-AI/plugin` and install `synter`.
Direct installation is not public-directory discovery.

## Validation and reviewer checklist

- [x] Repository is public and contains an MIT license.
- [x] `.claude-plugin/plugin.json` names the plugin `synter` and points to the
  canonical public repository.
- [x] Marketplace source for this listing is `packages/claude-directory`.
- [x] `assets/logo.png` is the canonical transparent 1024×1024 Synter mark,
  ready to supply if the authenticated directory form requests brand artwork.
- [x] No unsupported `icon` or `logo` key was added to the Claude manifest;
  Anthropic's current strict schema has no such field. The Cursor manifest's
  supported `logo` field points to this asset.
- [x] `packages/claude-directory/.mcp.json` uses
  `https://mcp.synterai.com/mcp/directory` and secure browser OAuth; it
  contains no static key, token, custom auth header, or credential prompt.
- [x] The directory package contains no local lifecycle hooks, executable
  scripts, or SDK runner.
- [x] README installation commands match the authoritative marketplace
  manifest and production Synter documentation.
- [x] `node scripts/validate-manifests.js` passes.
- [x] `node scripts/check-directory-tools.js` checks instruction files
  against the 83-name `tools/directory-tools.json` allowlist.
- [x] `node scripts/check-directory-tools.js --live` defaults to
  `/mcp/directory` and rejects unexpected tools or missing `title` /
  `readOnlyHint` / `destructiveHint` annotations.
- [x] Official listing copy uses “30+ ad platforms,” not a counted platform
  total.
- [ ] Run the optional live directory check with reviewer-authorized OAuth
  before submission.
- [ ] Provider reviewer exercises `/synter:quickstart`, confirms OAuth
  sign-in, and runs a read-only report against sample data.
- [ ] Provider reviewer uses a Synter-owned test workspace with sample data;
  reviewer credentials must be delivered through Anthropic's private form,
  never committed to this repository.
- [ ] An authorized Synter representative submits this public GitHub plugin
  through the authenticated plugin form. The existing connector submission
  does not satisfy this step.

## Security and data-use evidence

- The Claude Directory package is static instructions plus the declared remote
  HTTPS MCP connection. It contains no local hooks, compiled binaries, or
  bundled runners.
- The listing connects to `https://mcp.synterai.com/mcp/directory` with browser
  OAuth and no static credentials or headers. Users sign in through the OAuth
  prompt and verify the workspace before using account data.
- The published tool surface is the 83-name read-only directory allowlist.
  Tools that create, update, or change campaigns are not included.
- Source, manifests, skills, agents, and output styles are inspectable in the
  public repository.
- Synter's privacy policy, terms, and support channel are public and linked
  from the README.

## Reviewer prompts

Use a Synter-owned test workspace with synthetic or sample campaign data.

1. `Use Synter to sign in over OAuth, list my connected ad accounts, and identify the workspace.`
2. `Report sample campaign performance and conversions for the last seven days. Read only; do not change anything.`
3. `Review the current campaign plan and account health for this workspace.`

Expected behavior: all three prompts perform only reads against the
`/mcp/directory` tool surface. Unavailable accounts or metrics should be
reported plainly. Sample data must be identified as sample data.

## Directory policy evidence

| Requirement | Evidence |
| --- | --- |
| Public source and license | Public GitHub repository; MIT `LICENSE` |
| OAuth for authenticated remote MCP | Browser OAuth at `https://mcp.synterai.com/mcp/directory`; metadata, DCR, PKCE, and protected-tool `401` challenge |
| Tool directory | 83 checked-in read-only tool names in `tools/directory-tools.json`; live annotations require a fresh authenticated review |
| Platform claim | Official copy is “30+ ad platforms” |
| Privacy and support | `https://synterai.com/privacy`; `https://synterai.com/contact` |
| Narrow, visible instructions | Human-readable skills and agents in this repository; no encoded or remotely loaded behavioral instructions |
| Read-only listing | Directory package and tool allowlist contain only lookup and report tools |
| Test account | Must be supplied privately by Synter in the submission form |

This listing helps reviewers inspect advertising performance, audiences, and
plans. Describe those read-only capabilities accurately. Anthropic retains
discretion under the Software Directory Policy's unsupported-use restrictions;
do not claim an Anthropic Verified status before it appears in the directory.

## Provider-side plugin action still required

The remote MCP connector is already in review. Publishing this plugin still
requires an authenticated Synter representative with the required Claude.ai
directory-management access or Console Developer/Admin/Owner role and a
private reviewer test account. Use one of:

- `https://claude.ai/admin-settings/directory/submissions/plugins/new`
- `https://platform.claude.com/plugins/submit`

No pull request to Anthropic's read-only community catalog is required or
accepted; published entries are synchronized from Anthropic's review pipeline.
