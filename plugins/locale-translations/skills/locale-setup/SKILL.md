---
name: Locale Setup
description: Set up and configure the locale-translations MCP server. Use this skill when the user wants to configure the locale MCP server, connect to a locale API, or troubleshoot locale server connectivity issues.
version: 1.0.0
---

# Locale Setup Skill

This skill guides users through setting up the locale-translations MCP server, including building the server, configuring the API connection, and verifying everything works.

## Setup Workflow

Execute these steps in order. Do not skip steps.

### Step 1: Detect Plugin Location

The MCP server is located relative to this skill at `../../mcp-server/`.

Determine the absolute path by finding where this plugin is installed. The plugin can be in one of these locations:

1. **Marketplace cache** (installed via `/plugin install`):
   `~/.claude/plugins/cache/solobitcrafter-toolbox/locale-translations/{version}/mcp-server/`

2. **Development** (local plugin):
   The path where the plugin source is located.

Use the Glob tool to find the plugin:
```
Pattern: ~/.claude/plugins/cache/solobitcrafter-toolbox/locale-translations/*/mcp-server/package.json
```

If not found in cache, check if running from a development location by looking for `mcp-server/package.json` relative to the skill location.

Store the resolved `MCP_SERVER_PATH` for subsequent steps.

### Step 2: Check Build Status

Check if the MCP server has been built by verifying the `dist/index.js` file exists:

```
Check: {MCP_SERVER_PATH}/dist/index.js
```

**If dist folder does NOT exist:**

Inform the user they need to build the MCP server and provide the exact commands:

```
The MCP server needs to be built before it can be used.

Please run these commands:

cd "{MCP_SERVER_PATH}"
npm install
npm run build

After running these commands, tell me "done" and I'll continue with configuration.
```

Wait for the user to confirm before proceeding. Do not continue until the build is complete.

**If dist folder exists:**

Proceed to Step 3.

### Step 3: Gather Configuration

Use the AskUserQuestion tool to gather the required configuration:

**Question 1: API Base URL**
- Question: "What is the base URL for your locale translation API?"
- Header: "API URL"
- Options:
  - "http://localhost:5000/api/locale" (Local development)
  - "https://localhost:5001/api/locale" (Local HTTPS)
  - Other (let user enter custom URL)

**Question 2: TLS Verification (only ask if URL starts with https://localhost)**
- Question: "Should TLS certificate verification be disabled? (Required for self-signed certificates)"
- Header: "TLS"
- Options:
  - "Yes - Disable verification (for self-signed certs)"
  - "No - Keep verification enabled"

**Question 3: API Key (optional)**
- Question: "Does your API require an API key for authentication?"
- Header: "API Key"
- Options:
  - "No API key required"
  - "Yes, I need to provide an API key"

If user selects yes for API key, ask them to provide the key value.

### Step 4: Update Configuration

Read the user's Claude configuration file at `~/.claude.json`.

Add or update the `mcpServers` section with the locale-translations server configuration:

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

**Additional env variables based on user responses:**

- If TLS verification disabled: Add `"NODE_TLS_REJECT_UNAUTHORIZED": "0"`
- If API key provided: Add `"LOCALE_API_KEY": "{user_provided_key}"`

Use the Edit tool to modify the `~/.claude.json` file:

1. Read the current file content
2. Parse as JSON
3. Merge the new mcpServers configuration (preserve existing servers)
4. Write back the updated JSON

**Important:** The path in `args` must be an absolute path, not a relative path.

### Step 5: Restart MCP Server

Inform the user:

```
Configuration has been saved to ~/.claude.json

To activate the MCP server, you need to restart it. You can either:

1. Run: /mcp restart locale-translations
2. Or restart Claude Code entirely

Please restart the MCP server and tell me when ready to test.
```

Wait for user confirmation.

### Step 6: Test Connection

After the user confirms the restart, test the connection by calling the `locale_search` MCP tool:

```
Use mcp__locale-translations__locale_search with:
- query: "test"
```

**If successful:**
```
Setup complete! The locale-translations MCP server is now configured and working.

You can now use these tools:
- locale_search - Find translations by pattern or text
- locale_get - Get a specific translation by key
- locale_list_namespace - List translations in a namespace
- locale_create - Create a new translation
- locale_update - Update an existing translation
- locale_bulk_create - Create multiple translations
- locale_suggest_key - Generate a key following conventions

Try the /locale-manager skill for guided translation workflows.
```

**If failed:**
```
Connection test failed. Please verify:

1. The API server is running at: {configured_url}
2. The URL is accessible from this machine
3. Any required API keys are correct

Error details: {error_message}

Would you like to reconfigure the connection?
```

## Troubleshooting

### Common Issues

**"Cannot find module" error:**
- The MCP server hasn't been built
- Solution: Run `npm install && npm run build` in the mcp-server folder

**"ECONNREFUSED" error:**
- The API server is not running
- Solution: Start your locale API server

**"CERT" or "TLS" errors:**
- Self-signed certificate issue
- Solution: Re-run setup and enable "Disable TLS verification"

**"401 Unauthorized" error:**
- API key is required but not configured, or the key is invalid
- Solution: Re-run setup and provide a valid API key

### Reconfiguring

To change the configuration, simply run this skill again. It will update the existing configuration with new values.
