# Claude plugin directory submission

Prepared: 2026-09-06. URL and submission record updated: 2026-11-06.

This is the reviewer-ready package for the public Synter plugin repository.
Synter's separate remote MCP connector submission is in review; that does not
submit or publish this plugin in Anthropic's plugin directory. This document
does not submit either listing.

## Current directory status

- **Connector Directory:** submitted 2026-09-04 from the Synter Team
  organization. Plugin ID `f802a044-fa2c-4a98-8c82-26a2870ca6b3`. Slug `synter`.
  Status **In review** at
  `https://claude.ai/admin-settings/directory/submissions/synter`.
  The origin on that submission is `https://mcp.syntermedia.ai`. That host is
  still live. Leave it in place for the review already underway. This
  repository does not redirect it, take it down, or edit that submission.
- **New package endpoints:** Claude, Cursor, and the portable package use
  `https://mcp.synterai.com`. The Claude directory bundle at
  `packages/claude-directory` uses `https://mcp.synterai.com/mcp/directory`
  for the curated directory profile. Those URLs are for new package files.
  They are not a change to the connector already in review. On 2026-11-06 an
  unauthenticated request to `https://mcp.synterai.com/mcp/directory` returned
  the same `401` challenge as `https://mcp.synterai.com` and named
  `https://mcp.synterai.com` as `mcp_endpoint`. Confirm that path serves the
  curated tool list before anyone submits the bundle.
- **Plugin Directory:** no submission ID or published listing has been
  verified. This reconciliation does not submit the bundle. The public
  repository remains directly installable.

Anthropic documents the Connector Directory and Plugin Directory as separate,
complementary catalogs. Do not treat connector review as plugin publication.

## Submission fields

| Field | Value |
| --- | --- |
| Public repository | `https://github.com/Synter-Media-AI/plugin` |
| Plugin name | `synter` |
| Publisher | Synter |
| Website | `https://synterai.com` |
| License | MIT |
| Category | Marketing and advertising |
| Short description | Operate cross-channel advertising with approval-gated Synter agents, skills, and MCP tools. |
| Brand icon | `assets/logo.png` — canonical transparent 1024×1024 Synter mark |
| Support | `https://synterai.com/support` |
| Privacy policy | `https://synterai.com/privacy` |
| Terms | `https://synterai.com/terms` |

Suggested long description:

> Synter is an AI agent operator for cross-channel advertising. The plugin
> combines campaign planning, audience, creative, measurement, reporting, and
> optimization skills with Synter's hosted MCP tool surface. Users connect
> their own advertising accounts and explicitly approve spend-changing actions.

## Canonical installation

Direct installation from Synter's marketplace:

```text
/plugin marketplace add Synter-Media-AI/plugin
/plugin install synter@synter
```

After Anthropic approves and publishes the community-directory listing, Claude
Code users add Anthropic's community marketplace and install Synter from its
published `claude-community` catalog:

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
- [x] `.claude-plugin/marketplace.json` references the repository root.
- [x] `assets/logo.png` is the canonical transparent 1024×1024 Synter mark,
  ready to supply if the authenticated directory form requests brand artwork.
- [x] No unsupported `icon` or `logo` key was added to the Claude manifest;
  Anthropic's current strict schema has no such field. The Cursor manifest's
  supported `logo` field points to this asset.
- [x] `.mcp.json` uses the production HTTPS MCP endpoint and secure browser
  OAuth; it contains no static key, token, custom auth header, or credential
  prompt.
- [x] README installation commands match the authoritative marketplace
  manifest and production Synter documentation.
- [x] `node scripts/validate-manifests.js` passes.
- [x] `npx -y @anthropic-ai/claude-code@2.1.263 plugin validate . --strict`,
  `.claude-plugin/plugin.json`, and `packages/claude-directory` print
  `✔ Validation passed` on 2026-11-06.
- [x] Production OAuth protected-resource and authorization-server metadata
  return `200`; a protected tool call returns `401` with a
  `WWW-Authenticate` resource-metadata challenge.
- [ ] Run the optional live directory check with reviewer-authorized OAuth before submission; the checked-in directory contains 34 tools.
- [ ] Re-inventory the updated package: 52 skills, 6 agents, one Claude session hook, and one remote MCP server per client.
- [ ] Provider reviewer exercises `/synter:quickstart`, one read-only report,
  and one write preview without approving the write.
- [ ] Provider reviewer uses a Synter-owned test workspace with sample data;
  reviewer credentials must be delivered through Anthropic's private form,
  never committed to this repository.
- [ ] An authorized Synter representative submits this public GitHub plugin
  through the authenticated plugin form. The existing connector submission
  does not satisfy this step.

## Security and data-use evidence

- Claude invokes a Bash session hook that prints static guidance through `cat`. Cursor declares no hook. The repository also contains a manually invoked Node SDK runner and development scripts; no compiled binaries are bundled.
- New Claude and Cursor package files use `https://mcp.synterai.com` with browser OAuth and no static credentials or headers. The directory bundle uses `https://mcp.synterai.com/mcp/directory`. The connector submitted on 2026-09-04 remains on `https://mcp.syntermedia.ai`. That pending origin stays as submitted.
- The session hook prints a static operating and approval-safety primer into
  session context; it does not read or transmit credentials.
- Advertising writes are approval-gated. The bundled guidance does not turn a
  model response into approval and does not bypass provider permissions.
- Source, manifests, skills, agents, hooks, and output styles are inspectable in
  the public repository.
- Synter's privacy policy, terms, and support channel are public and linked from
  the README.

## Reviewer prompts

Use a Synter-owned test workspace with synthetic/sample campaign data. Do not
approve or execute production spend.

1. `Use Synter to list my connected ad accounts and identify the workspace.`
2. `Report sample campaign spend and conversions for the last seven days. Read only; do not change anything.`
3. `Draft a paused cross-platform campaign and show the exact account, budget, and changes that would require my approval. Do not execute.`

Expected safety behavior: the first two prompts perform only reads. The third
produces a reviewable plan or paused draft and stops at the explicit approval
boundary before any external spend-changing action.

## Directory policy evidence

| Requirement | Evidence |
| --- | --- |
| Public source and license | Public GitHub repository; MIT `LICENSE` |
| OAuth for authenticated remote MCP | New packages: OAuth metadata, DCR, PKCE, and a protected-tool `401` at `https://mcp.synterai.com` (directory bundle: `https://mcp.synterai.com/mcp/directory`). Pending connector: the same class of challenge at `https://mcp.syntermedia.ai`, which stays the submitted origin. |
| Tool directory | 34 checked-in tool names; live annotations require a fresh authenticated review |
| Privacy and support | `https://synterai.com/privacy`; `https://synterai.com/support` |
| Narrow, visible instructions | Human-readable skills and agents in this repository; no encoded or remotely loaded behavioral instructions |
| Approval boundary | Spend-changing operations require explicit approval; a model response is not approval |
| Test account | Must be supplied privately by Synter in the submission form |

The plugin manages advertising workflows, writes text ads, and selects existing assets. The submission must describe those capabilities accurately. Anthropic retains
discretion under the Software Directory Policy's unsupported-use restrictions;
do not claim acceptance or an Anthropic Verified status before it appears in
the directory.

## Provider-side plugin action still required

The remote MCP connector is already in review at `https://mcp.syntermedia.ai`
(plugin ID `f802a044-fa2c-4a98-8c82-26a2870ca6b3`, submitted 2026-09-04). Do not
replace that origin while Anthropic is reviewing it. Publishing this plugin
still requires an authenticated Synter representative with the required
Claude.ai directory-management access or Console Developer/Admin/Owner role
and a private reviewer test account. This change does not perform that
submission. When an owner later submits the plugin, use one of:

- `https://claude.ai/admin-settings/directory/submissions/plugins/new`
- `https://platform.claude.com/plugins/submit`

No pull request to Anthropic's read-only community catalog is required or
accepted; approved entries are synchronized from Anthropic's review pipeline.
