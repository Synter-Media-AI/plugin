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

## Validation and reviewer checklist

- [x] Repository is public and contains an MIT license.
- [x] `.claude-plugin/plugin.json` names the plugin `synter` and points to the
  canonical public repository.
- [x] `.claude-plugin/marketplace.json` references the repository root.
- [x] `.mcp.json` uses the production HTTPS MCP endpoint and a sensitive,
  required user-config API key.
- [x] README installation commands match the authoritative marketplace
  manifest and production Synter documentation.
- [x] `node scripts/validate-manifests.js` passes.
- [x] `npx -y @anthropic-ai/claude-code plugin validate . --strict` prints
  `✔ Validation passed` on 2026-09-06.
- [ ] Provider reviewer confirms the plugin does not collect credentials in
  prompts; the configured key is sent only as `X-Synter-Key` to
  `https://mcp.syntermedia.ai`.
- [ ] Provider reviewer exercises `/synter:quickstart`, one read-only report,
  and one write preview without approving the write.
- [ ] An authorized Synter representative submits the public repository URL
  through the Claude.ai or Console plugin submission form.

## Security and data-use evidence

- The plugin declares no local executable dependency or install script.
- The only remote MCP destination is `https://mcp.syntermedia.ai`.
- The session hook prints a static operating and approval-safety primer into
  session context; it does not read or transmit credentials.
- Advertising writes are approval-gated. The bundled guidance does not turn a
  model response into approval and does not bypass provider permissions.
- Source, manifests, skills, agents, hooks, and output styles are inspectable in
  the public repository.

## Provider-side action still required

Submission is an external Anthropic action. A Synter representative with the
required Claude.ai directory-management access or Console Developer/Admin/Owner
role must submit this repository at one of:

- `https://claude.ai/admin-settings/directory/submissions/plugins/new`
- `https://platform.claude.com/plugins/submit`

No pull request to Anthropic's read-only community catalog is required or
accepted; approved entries are synchronized from Anthropic's review pipeline.
