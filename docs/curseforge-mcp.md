# CurseForge Local CLI MCP Adapter

A narrow, stdio-only Model Context Protocol (MCP 2025-11-25) server exposing safe, scoped operations over the existing `curseforge_publish.py` CLI.

## Quick Start

```bash
# Read-only mode (default)
python scripts/curseforge_mcp.py \
  --root /path/to/repo \
  --manifest curseforge-project.json \
  --journal /path/outside/repository/curseforge-journal.json

# With mutation gate enabled (requires --allow-write)
CURSEFORGE_API_KEY=your-key \
python scripts/curseforge_mcp.py \
  --root /path/to/repo \
  --manifest curseforge-project.json \
  --journal /path/outside/repository/curseforge-journal.json \
  --allow-write \
  --update-metadata path/to/metadata.json
```

## Launch Options

| Option | Required | Description |
|--------|----------|-------------|
| `--root` | Yes | Absolute path to repository root (contains manifest, publisher, artifact) |
| `--manifest` | No (default: `curseforge-project.json`) | Manifest filename relative to `--root` |
| `--journal` | No | Local journal file **outside** the repository (the adapter default is host-specific; set an explicit path for your environment) |
| `--update-metadata` | No | Fixed metadata JSON for `update-file` operations |
| `--allow-write` | No | Enable `upload` and `update_file` tools (default: disabled) |
| `--timeout` | No (default: `120`) | Subprocess timeout in seconds (0–180) |

**Credentials**: Only via environment variables `CURSEFORGE_API_KEY` or `CF_API_KEY`. Never passed as arguments.

## Exposed Tools

### Read-Only (always available)

| Tool | Description | Arguments |
|------|-------------|-----------|
| `project_info` | Returns fixed project/version policy from manifest | `{}` |
| `preflight` | Validates local source/tag/artifact; no network | `{}` |
| `status` | Reads local journal only; **NOT** remote status | `{}` |
| `plan` | Resolves release metadata via author GET; no writes | `{}` |
| `upload_dry_run` | Validates upload via author GET only; **never uploads** | `{}` |

### Mutation (require `--allow-write` at launch)

| Tool | Description | Arguments |
|------|-------------|-----------|
| `upload` | Upload fixed artifact. **Accepted is NOT verified/published**. Requires human confirmations. | `confirm_project_id` (int), `confirm_sha256` (hex), `confirm_no_existing_file` (true) |
| `update_file` | Update fixed metadata target. **Accepted is NOT verified**. Requires human confirmations. | `confirm_project_id` (int), `confirm_file_id` (int), `confirm_metadata_sha256` (hex) |

### Dry-Run Variants (require `--update-metadata`)

| Tool | Description |
|------|-------------|
| `update_file_dry_run` | Validate fixed metadata update via author GET only |

## Confirmation Requirements

All mutation tools require **explicit human confirmations** passed as tool arguments:

- `confirm_project_id` — Must match manifest `project_id`
- `confirm_sha256` / `confirm_metadata_sha256` — Lowercase SHA-256 of exact bytes
- `confirm_file_id` — Must match configured metadata `fileID`
- `confirm_no_existing_file` — Must be `true` (operator checked remote for duplicates)

These are **not optional** — the adapter refuses calls without them.

## Limitations

1. **Status is local journal only** — There is no documented CurseForge API endpoint to read back published files. The `status` tool returns journal state with `verification: "verification-required"`.

2. **Upload accepted ≠ published** — The CurseForge API returns `accepted` but files may require moderation, MFA, or additional author UI steps. Never blindly retry.

3. **Creation needs supported author UI/MFA** — New projects or versions requiring MFA cannot be fully automated via API.

4. **Fixed root/manifest/journal** — Configured at launch; cannot be changed via tool calls.

5. **No credentials in parameters** — Tokens only from environment; the adapter redacts them from logs.

6. **No shell, no arbitrary exec** — Runs publisher as `argv` subprocess with bounded stdout/time/errors.

## Protocol Compliance

- **MCP Version**: 2025-11-25
- **Transport**: stdio (JSON-RPC 2.0)
- **Initialize**: Required before `tools/list` or `tools/call`
- **Notifications**: `notifications/initialized` must follow initialize
- **Tools**: Single-page list (no pagination)

## Testing

```bash
# Run all tests
python -m unittest tests.test_curseforge_mcp -v

# Tests cover:
# - initialize → notifications/initialized → tools/list
# - tools/call for project_info, preflight, etc.
# - Mutation refused without --allow-write
# - Invalid tool names refused
# - --allow-write enables write_enabled in project_info
```

## Architecture

```
Client (MCP) ←stdio→ curseforge_mcp.py ←argv→ curseforge_publish.py ←HTTP→ CurseForge API
                     ↑                    ↑
              fixed root/manifest    local journal
              journal outside repo    (append-only)
```

The adapter:
- Validates manifest policy on startup
- Enforces containment (all paths inside `--root`)
- Binds subprocess stdout (64 KiB max), timeout (≤180s), stderr (discarded)
- Redacts API keys from any JSON passing through
- Returns only adapter-authored error messages (never raw CLI/exception output)

## Security Boundaries

| Capability | Exposed? | Notes |
|------------|----------|-------|
| Read manifest/project | ✅ | `project_info` |
| Local preflight validation | ✅ | `preflight` |
| Local journal status | ✅ | `status` |
| Remote metadata plan (GET) | ✅ | `plan`, `upload_dry_run` |
| Upload artifact (POST) | ⚠️ Gated | `--allow-write` + confirmations |
| Update metadata (POST) | ⚠️ Gated | `--allow-write` + `--update-metadata` + confirmations |
| Arbitrary file read | ❌ | Never |
| Arbitrary command exec | ❌ | Never |
| Credentials in params | ❌ | Env only |
| Shell interpolation | ❌ | `argv` only |

## Example Session

```json
# Initialize
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "test", "version": "1"}}}

# Notification (no response)
{"jsonrpc": "2.0", "method": "notifications/initialized"}

# List tools
{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}

# Call project_info
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "project_info", "arguments": {}}}

# Call preflight
{"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "preflight", "arguments": {}}}
```

Response format:
```json
{"jsonrpc": "2.0", "id": 3, "result": {"content": [{"type": "text", "text": "{\"project_id\": 1703803, \"version\": \"1.9.0\", ...}"}], "isError": false}}
```

Error format:
```json
{"jsonrpc": "2.0", "id": 3, "result": {"content": [{"type": "text", "text": "Unknown or disabled tool; mutations require --allow-write at launch"}], "isError": true}}
```

## Dependency Requirements

- Python 3.11+
- Standard library only (no external dependencies)
- Uses `subprocess`, `selectors`, `json`, `pathlib`, `hashlib`, `signal`, `tempfile`

The official MCP Python SDK (`mcp` 2.0.0) is available in the environment but **not used** — this adapter implements the stdio protocol directly for minimal dependency surface.