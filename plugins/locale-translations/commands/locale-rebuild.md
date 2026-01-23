---
name: locale-rebuild
description: Rebuild the locale-translations MCP server (use after updates)
---

# Locale Rebuild Command

Rebuild the locale-translations MCP server. Use this after the MCP server plugin has been updated to recompile the TypeScript server.

## Execution Steps

### Step 1: Detect Plugin Location

Find the MCP server path. Check these locations in order:

1. **Marketplace cache**:
   ```
   Pattern: ~/.claude/plugins/cache/solobitcrafter-toolbox/locale-mcp-server/*/mcp-server/package.json
   ```

2. **Development** (if not found in cache):
   Check common development paths or ask the user.

Use the Glob tool to find the path. Store it as `MCP_SERVER_PATH`.

### Step 2: Run Build

Use the Bash tool to execute the setup script (this will reinstall dependencies and rebuild):
- On Windows: `cd "{MCP_SERVER_PATH}" && npm install && npm run build`
- On Unix/Mac: `cd "{MCP_SERVER_PATH}" && npm install && npm run build`

Wait for the build to complete before proceeding.

### Step 3: Restart MCP Server

After build completes successfully:

```
Rebuild complete!

To use the updated version, you must FULLY RESTART Claude Code:
- Close the terminal completely
- Reopen Claude Code

NOTE: Simply running `/mcp restart locale-translations` will reconnect but may NOT
reload environment variables or pick up code changes. A full restart is required.
```
