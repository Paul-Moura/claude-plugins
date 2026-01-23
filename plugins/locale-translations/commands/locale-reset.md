---
name: locale-reset
description: Remove locale-translations MCP server configuration for fresh setup
---

# Locale Reset Command

Remove the locale-translations MCP server configuration from BOTH user-level and project-level settings to allow a fresh setup. This is useful for testing the setup process, reconfiguring from scratch, or fixing misconfiguration issues.

## Configuration Locations

MCP servers can be configured at two levels in `~/.claude.json`:

1. **User-level** (recommended): Root-level `mcpServers` object - available in ALL projects
2. **Project-level**: Inside `projects["path/to/project"].mcpServers` - only available in that project

This reset command clears BOTH locations to ensure a clean slate.

## Execution Steps

### Step 1: Read Current Configuration

Read `~/.claude.json` and check for `locale-translations` in BOTH locations:

1. **User-level**: `mcpServers.locale-translations` (at root level)
2. **Project-level**: `projects[*].mcpServers.locale-translations` (in any project entry)

**If not configured in either location:**

Tell the user: "No locale-translations configuration found at user-level or project-level. Nothing to reset."

Done.

**If configured in one or both locations:**

Report where it was found and proceed to Step 2.

### Step 2: Remove Configuration from User-Level

If `mcpServers.locale-translations` exists at the root level:

Use the Edit tool to remove the `locale-translations` entry from the root `mcpServers` in `~/.claude.json`.

Be careful to:
- Only remove the `locale-translations` key, not other MCP servers
- Preserve the rest of the file structure
- Handle the case where `locale-translations` is the only entry (remove empty `mcpServers` object too)

### Step 3: Remove Configuration from Project-Level

Check ALL entries in `projects` object for `mcpServers.locale-translations`.

For EACH project that has it configured:
- Remove the `locale-translations` entry from that project's `mcpServers`
- If `mcpServers` becomes empty, remove the empty object

Report which project paths had configuration removed.

### Step 4: Confirm Reset

Tell the user:

```
Configuration removed from ~/.claude.json:
- User-level: [Removed / Not found]
- Project-level: [List of project paths cleared, or "Not found"]

The plugin's default configuration (.mcp.json) will be used:
- API URL: https://localhost:5001/api/locale
- TLS verification: Disabled (for self-signed certs)

To reconfigure with custom settings, run /locale-setup
IMPORTANT: Use --scope user to configure at user-level (available in all projects)

To apply changes, fully restart Claude Code (close and reopen terminal).
```
