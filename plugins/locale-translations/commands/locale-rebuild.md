---
name: locale-rebuild
description: Rebuild the locale-translations MCP server (use after updates)
---

# Locale Rebuild Command

Rebuild the locale-translations MCP server. Use this after the plugin has been updated to recompile the TypeScript server.

## Execution Steps

### Step 1: Detect Plugin Location

Find the MCP server path. Check these locations in order:

1. **Marketplace cache**:
   ```
   Pattern: ~/.claude/plugins/cache/solobitcrafter-toolbox/locale-translations/*/mcp-server/package.json
   ```

2. **Development** (if not found in cache):
   Check common development paths or ask the user.

Use the Glob tool to find the path. Store it as `MCP_SERVER_PATH`.

### Step 2: Run Build

Use the Bash tool to execute the setup script (this will reinstall dependencies and rebuild):
- On Windows: `& "{MCP_SERVER_PATH}\setup.bat"`
- On Unix/Mac: `bash "{MCP_SERVER_PATH}/setup.sh"`

Wait for the build to complete before proceeding.

### Step 3: Restart MCP Server

After build completes successfully:

```
Rebuild complete!

Please restart the MCP server to use the updated version:
- Run: /mcp restart locale-translations
- Or restart Claude Code
```
