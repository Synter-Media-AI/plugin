# Claude plugin directory submission

Prepared: 2026-09-06

This is the reviewer-ready package for the public Synter plugin repository. It
does not record or imply that the provider-side submission form was sent.

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
| Support | `https://syntermedia.ai/contact` |
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

After Anthropic approves and publishes the community listing, its separate
installation path will be:

```text
/plugin marketplace add anthropics/claude-plugins-community
/plugin install synter@claude-community
```

Do not advertise the community command until the listing appears in Anthropic's
catalog.

The public repository is also directly installable in Claude Desktop and
Cowork: **Customize → Plugins → Personal plugins → + → Add marketplace → Add
from a repository**, then enter `Synter-Media-AI/plugin` and install `synter`.
Direct installation is not public-directory discovery.

## Validation and reviewer checklist

- [x] Repository is public and contains an MIT license.
- [x] `.claude-plugin/plugin.json` names the plugin `synter` and points to the
  canonical public repository.
- [x] `.claude-plugin/marketplace.json` references the repository root.
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
- [x] The production MCP tool surface has 195 tools; every tool supplies a
  title plus boolean `readOnlyHint` and `destructiveHint` annotations.
- [x] Clean Claude Code configuration can add `Synter-Media-AI/plugin`, install
  `synter@synter`, and inventory all 57 skills, 7 agents, 1 hook, and 1 MCP
  server.
- [ ] Provider reviewer exercises `/synter:quickstart`, one read-only report,
  and one write preview without approving the write.
- [ ] Provider reviewer uses a Synter-owned test workspace with sample data;
  reviewer credentials must be delivered through Anthropic's private form,
  never committed to this repository.
- [ ] An authorized Synter representative accepts the Software Directory Terms
  and submits through the authenticated Claude.ai or Console form.

## Security and data-use evidence

- The plugin declares no local executable dependency or install script.
- The only remote MCP destination is `https://mcp.syntermedia.ai`, which uses
  OAuth 2.1 with PKCE for Claude clients.
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
| Tool annotations | All 195 discovered tools include `title`, boolean `readOnlyHint`, and boolean `destructiveHint` |
| Privacy and support | `https://syntermedia.ai/privacy`; `https://syntermedia.ai/contact` |
| Narrow, visible instructions | Human-readable skills and agents in this repository; no encoded or remotely loaded behavioral instructions |
| Approval boundary | Spend-changing operations require explicit approval; a model response is not approval |
| Test account | Must be supplied privately by Synter in the submission form |

The plugin manages advertising workflows and can invoke creative tools, so the
submission must describe those capabilities accurately. Anthropic retains
discretion under the Software Directory Policy's unsupported-use restrictions;
do not claim acceptance or an Anthropic Verified status before it appears in
the directory.

## Provider-side action still required

Submission requires an authenticated Synter representative with the required
Claude.ai directory-management access or Console Developer/Admin/Owner role,
acceptance of Anthropic's Software Directory Terms, and a private reviewer test
account. Use one of:

- `https://claude.ai/admin-settings/directory/submissions/plugins/new`
- `https://platform.claude.com/plugins/submit`

No pull request to Anthropic's read-only community catalog is required or
accepted; approved entries are synchronized from Anthropic's review pipeline.
