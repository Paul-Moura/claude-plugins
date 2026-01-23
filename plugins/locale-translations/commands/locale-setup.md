---
name: locale-setup
description: Set up and configure the locale-translations MCP server
---

# Locale Setup Command

Set up the locale-translations MCP server. This command is idempotent - safe to run multiple times.

## Execution Steps

Execute these steps in order.

### Step 1: Detect Plugin Location

Find the MCP server path. Check these locations in order:

1. **Marketplace cache**:
   ```
   Pattern: ~/.claude/plugins/cache/solobitcrafter-toolbox/locale-mcp-server/*/mcp-server/package.json
   ```

2. **Development** (if not found in cache):
   Check common development paths or ask the user.

Use the Glob tool to find the path. Store it as `MCP_SERVER_PATH`.

### Step 2: Check and Build if Needed

Use Glob to check if `{MCP_SERVER_PATH}/dist/index.js` exists.

**If dist/index.js does NOT exist:**

Use the Bash tool to build the MCP server:
- Run: `cd "{MCP_SERVER_PATH}" && npm install && npm run build`

Wait for the build to complete before proceeding.

**If dist/index.js already exists:**

Tell the user: "MCP server already built. Skipping build step."

Proceed to Step 3.

### Step 3: Check Configuration

Read `~/.claude.json` and check if `mcpServers.locale-translations` is already configured.

**If already configured:**

Output: "MCP server already configured in ~/.claude.json"

Ask the user: "Would you like to reconfigure the API connection?"
- If no: Skip to Step 5 (test connection)
- If yes: Proceed to Step 4

**If not configured:**

Proceed to Step 4.

### Step 4: Gather Configuration and Update

Use AskUserQuestion to gather configuration:

**Question 1: API Base URL**
- Question: "What is the base URL for your locale translation API?"
- Header: "API URL"
- Options:
  - "https://localhost:5001/api/locale (Recommended)" (Local HTTPS with self-signed cert)
  - "http://localhost:5000/api/locale" (Local HTTP - no TLS)

**Question 2: TLS Verification** (only if URL starts with https://localhost)
- Question: "Disable TLS certificate verification? (Required for self-signed certificates)"
- Header: "TLS"
- Options:
  - "Yes - Disable verification"
  - "No - Keep verification enabled"

**Question 3: API Key**
- Question: "Does your API require an API key?"
- Header: "API Key"
- Options:
  - "No API key required"
  - "Yes, I need to provide an API key"

If API key needed, ask for the key value.

**Update ~/.claude.json:**

Read current file, merge this configuration (preserve existing servers):

```json
{
  "mcpServers": {
    "locale-translations": {
      "command": "node",
      "args": ["{MCP_SERVER_PATH}/dist/index.js"],
      "env": {
        "LOCALE_API_BASE_URL": "{user_provided_url}"
      }
    }
  }
}
```

Add to env if applicable:
- TLS disabled: `"NODE_TLS_REJECT_UNAUTHORIZED": "0"`
- API key: `"LOCALE_API_KEY": "{user_provided_key}"`

**Important:** Use absolute path in args.

After saving, inform user:

```
Configuration saved. Please restart the MCP server:
- Run: /mcp restart locale-translations
- Or restart Claude Code

Tell me when ready to test the connection.
```

Wait for user confirmation.

### Step 5: Test Connection

Call `mcp__locale-translations__locale_search` with query: "test"

**If successful:**
```
Setup complete! The locale-translations MCP server is configured and working.

Available tools:
- locale_search - Find translations by pattern or text
- locale_get - Get a specific translation by key
- locale_list_namespace - List translations in a namespace
- locale_create - Create a new translation
- locale_update - Update an existing translation
- locale_bulk_create - Create multiple translations
- locale_suggest_key - Generate a key following conventions

Use /locale-manager for guided translation workflows.
```

**If failed:**
```
Connection test failed. Please verify:
1. The API server is running at: {configured_url}
2. The URL is accessible
3. API key is correct (if required)

Error: {error_message}

Run /locale-setup again to reconfigure.
```
