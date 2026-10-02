# Claude plugin directory submission

Prepared: 2026-09-06

This is the reviewer-ready package for the public Synter plugin repository.
Synter's separate remote MCP connector submission is in review; that does not
submit or publish this plugin in Anthropic's plugin directory.

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
| Plugin name | `synter` |
| Publisher | Synter |
| Website | `https://syntermedia.ai` |
| License | MIT |
| Category | Marketing and advertising |
| Short description | Operate cross-channel advertising with approval-gated Synter agents, skills, and MCP tools. |
| Brand icon | `assets/logo.png` — canonical transparent 1024×1024 Synter mark |
| Support | `https://syntermedia.ai/support` |
| Privacy policy | `https://syntermedia.ai/privacy` |
| Terms | `https://syntermedia.ai/terms` |

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
- [x] `npx -y @anthropic-ai/claude-code plugin validate . --strict` prints
  `✔ Validation passed` on 2026-09-06.
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
- Claude uses `https://mcp.syntermedia.ai` to match the connector under review. Cursor separately uses `https://mcp.synterai.com`. Both plugin configurations use browser OAuth without static credentials or headers.
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
| OAuth for authenticated remote MCP | OAuth metadata, DCR, PKCE, and protected-tool `401` challenge at `https://mcp.syntermedia.ai` |
| Tool directory | 34 checked-in tool names; live annotations require a fresh authenticated review |
| Privacy and support | `https://syntermedia.ai/privacy`; `https://syntermedia.ai/support` |
| Narrow, visible instructions | Human-readable skills and agents in this repository; no encoded or remotely loaded behavioral instructions |
| Approval boundary | Spend-changing operations require explicit approval; a model response is not approval |
| Test account | Must be supplied privately by Synter in the submission form |

The plugin manages advertising workflows, writes text ads, and selects existing assets. The submission must describe those capabilities accurately. Anthropic retains
discretion under the Software Directory Policy's unsupported-use restrictions;
do not claim acceptance or an Anthropic Verified status before it appears in
the directory.

## Provider-side plugin action still required

The remote MCP connector is already in review. Publishing this plugin still
requires an authenticated Synter representative with the required Claude.ai
directory-management access or Console Developer/Admin/Owner role and a
private reviewer test account. Use one of:

- `https://claude.ai/admin-settings/directory/submissions/plugins/new`
- `https://platform.claude.com/plugins/submit`

No pull request to Anthropic's read-only community catalog is required or
accepted; approved entries are synchronized from Anthropic's review pipeline.
