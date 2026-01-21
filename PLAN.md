# Locale Translation Plugin Implementation Plan

## Overview

Create a standalone Claude Code marketplace plugin for locale translation management. This plugin provides an MCP server, skill, and agent that enable AI agents to interact with a locale translation database via REST API.

**Plugin Name:** `locale-translations`
**Location:** `./plugins/locale-translations/`

## Prerequisites

- REST API is running and accessible (documented in `./docs/locale-api.md`)
- API base URL is configurable via `LOCALE_API_BASE_URL` environment variable

## Phase 1: Plugin Structure Setup

**Agent:** `general-purpose`
**Expectation:** Create the folder structure and plugin manifest files without writing any functional code.

### Tasks

1. Create the plugin directory structure:
   ```
   plugins/locale-translations/
   ├── .claude-plugin/
   │   └── plugin.json
   ├── mcp-server/
   │   ├── package.json
   │   ├── tsconfig.json
   │   ├── .env.example
   │   └── src/
   │       ├── index.ts (placeholder)
   │       ├── types/
   │       │   └── locale.ts (placeholder)
   │       ├── api/
   │       │   └── client.ts (placeholder)
   │       └── tools/
   │           └── (empty, files created in Phase 2)
   ├── skills/
   │   └── locale-manager/
   │       └── SKILL.md (placeholder)
   ├── agents/
   │   └── locale-implementer.md (placeholder)
   └── README.md (placeholder)
   ```

2. Create `plugin.json` with proper metadata:
   ```json
   {
     "name": "locale-translations",
     "description": "MCP server, skill, and agent for managing locale translations via REST API",
     "version": "1.0.0",
     "author": {
       "name": "Paul-Jason Moura",
       "email": "paul.j.moura@gmail.com"
     },
     "homepage": "https://github.com/Paul-Moura/claude-plugins/plugins/locale-translations",
     "repository": "https://github.com/Paul-Moura/claude-plugins",
     "license": "MIT"
   }
   ```

3. Update root `marketplace.json` to include the new plugin:
   ```json
   {
     "name": "locale-translations",
     "source": "./plugins/locale-translations",
     "description": "MCP server, skill, and agent for managing locale translations via REST API",
     "version": "1.0.0",
     "author": {
       "name": "Paul-Jason Moura",
       "email": "paul.j.moura@gmail.com"
     }
   }
   ```

### Verification
- Directory structure exists
- `plugin.json` is valid JSON
- `marketplace.json` contains the new plugin entry

---

## Phase 2: MCP Server Implementation

**Agent:** `general-purpose` with `create-mcp-servers` skill
**Expectation:** Implement the complete MCP server with all 7 tools. Reference `./docs/locale-api.md` for API endpoints and `./prompts/002-locale-mcp-server-plugin.md` for tool specifications.

### Tasks

1. **Create TypeScript types** (`src/types/locale.ts`):
   - `LocaleTranslation` interface
   - `SearchResult` interface
   - `BulkOperationResult` interface
   - `PaginatedResponse` interface
   - API error types

2. **Create API client** (`src/api/client.ts`):
   - HTTP client wrapper using fetch
   - Base URL from environment variable
   - Error handling with descriptive messages
   - Methods for each API endpoint per `./docs/locale-api.md`

3. **Implement MCP tools** (one file per tool in `src/tools/`):
   - `search.ts` - `locale_search` tool
   - `get.ts` - `locale_get` tool
   - `list.ts` - `locale_list_namespace` tool
   - `create.ts` - `locale_create` tool
   - `update.ts` - `locale_update` tool
   - `bulk.ts` - `locale_bulk_create` tool
   - `suggest.ts` - `locale_suggest_key` tool

4. **Create MCP server entry point** (`src/index.ts`):
   - Initialize MCP server using official SDK
   - Register all 7 tools with proper schemas
   - Handle server lifecycle

5. **Configure package.json**:
   - Dependencies: `@modelcontextprotocol/sdk`, `dotenv`
   - Dev dependencies: `typescript`, `@types/node`
   - Scripts: `build`, `start`, `dev`

6. **Create .env.example**:
   ```
   LOCALE_API_BASE_URL=http://localhost:5000/api/locale
   LOCALE_API_KEY=
   ```

### Verification
- `npm install` succeeds
- `npm run build` compiles without errors
- `npm start` launches server without crashing
- All 7 tools appear in server capabilities

---

## Phase 3: Locale Manager Skill

**Agent:** `general-purpose` with `create-agent-skills` skill
**Expectation:** Create a comprehensive skill for locale management workflows. The skill should guide both implementation and management tasks.

### Tasks

1. **Create SKILL.md** (`skills/locale-manager/SKILL.md`):

   Frontmatter:
   ```yaml
   ---
   name: Locale Manager
   description: This skill should be used when the user asks to "implement localization", "add translations", "manage locale keys", "audit translations", "import/export translations", or when implementing i18n in an application.
   version: 1.0.0
   ---
   ```

   Content sections:
   - **Overview**: What this skill enables
   - **MCP Server Dependency**: Note that the locale MCP server must be configured
   - **Implementation Workflow**:
     - Search for existing translations before creating
     - Generate consistent key names using `locale_suggest_key`
     - Create missing translations with `locale_create` or `locale_bulk_create`
     - Generate code using the localization library
   - **Management Workflow**:
     - Audit translations in a namespace
     - Find missing translations (en exists but es doesn't)
     - Bulk import from JSON/CSV
     - Export namespace to file
   - **Key Naming Convention**: Document the format `APP.COMPONENT.CATEGORY.KEY`
   - **Best Practices**:
     - Always search before creating
     - Use bulk operations for 3+ translations
     - Group keys by component/feature

### Verification
- SKILL.md follows proper frontmatter format
- Workflows are clear and actionable
- References MCP tools correctly

---

## Phase 4: Locale Implementer Agent

**Agent:** `general-purpose` with `create-subagents` skill
**Expectation:** Create an agent that specializes in implementing localization in existing codebases.

### Tasks

1. **Create agent file** (`agents/locale-implementer.md`):

   Frontmatter:
   ```yaml
   ---
   name: locale-implementer
   description: "Use this agent when implementing localization in an application. It analyzes code for hardcoded strings, suggests translation keys, creates translations via the locale API, and generates properly localized code. Examples: 'Localize this component', 'Add i18n to this file', 'Find hardcoded strings and replace with translations'."
   model: sonnet
   color: blue
   ---
   ```

   Agent instructions:
   - **Role**: Expert at implementing i18n/l10n in applications
   - **Process**:
     1. Analyze target code for hardcoded user-facing strings
     2. Search existing translations for reusable keys
     3. Generate key suggestions for new strings
     4. Create missing translations via MCP tools
     5. Rewrite code using the localization library
   - **Key Naming**: Follow `APP.COMPONENT.CATEGORY.KEY` convention
   - **Output**: Modified code + list of created translations
   - **Quality Checks**:
     - No hardcoded strings remain
     - Keys are consistent with existing patterns
     - Both en and es translations provided

### Verification
- Agent frontmatter is valid
- Description includes clear usage examples
- Instructions are comprehensive but focused

---

## Phase 5: Documentation and README

**Agent:** `general-purpose`
**Expectation:** Create comprehensive documentation for the plugin.

### Tasks

1. **Create plugin README** (`README.md`):
   - Overview and purpose
   - Installation instructions
   - MCP server setup:
     - How to configure the server in claude_desktop_config.json
     - Environment variables
   - Available tools (list all 7 with descriptions)
   - Skill usage guide
   - Agent usage guide
   - Example workflows
   - Troubleshooting

2. **Create claude-code-config.json example** (`mcp-server/claude-code-config.json`):
   ```json
   {
     "mcpServers": {
       "locale-translations": {
         "command": "node",
         "args": ["path/to/locale-mcp-server/dist/index.js"],
         "env": {
           "LOCALE_API_BASE_URL": "http://localhost:5000/api/locale"
         }
       }
     }
   }
   ```

### Verification
- README covers all components
- Setup instructions are complete
- Example config is valid JSON

---

## Phase 6: Manual Testing

**Agent:** `general-purpose`
**Expectation:** Verify the MCP server works against the live API. The API must be running.

### Tasks

1. **Build the MCP server**:
   ```bash
   cd plugins/locale-translations/mcp-server
   npm install
   npm run build
   ```

2. **Test each tool manually** (requires API running):
   - `locale_search`: Search for "button" translations
   - `locale_get`: Get a known key
   - `locale_list_namespace`: List a namespace
   - `locale_create`: Create a test translation
   - `locale_update`: Update the test translation
   - `locale_bulk_create`: Create 3 test translations
   - `locale_suggest_key`: Generate a key suggestion

3. **Verify error handling**:
   - Search with no results
   - Get non-existent key
   - Create duplicate key
   - Update non-existent key
   - Bulk create with some invalid keys

4. **Cleanup**: Delete test translations if the API supports it

### Verification
- All tools return expected responses
- Errors are descriptive and helpful
- No crashes or unhandled exceptions

---

## Phase 7: Update Root README

**Agent:** `general-purpose`
**Expectation:** Update the repository README to include the new plugin.

### Tasks

1. Update `./README.md`:
   - Add `locale-translations` to plugin list
   - Add `locale-manager` skill to skills table
   - Add `locale-implementer` agent to agents table
   - Update repository structure diagram

### Verification
- README accurately reflects all plugins
- Tables are properly formatted

---

## Execution Notes

### Agent Delegation Rules

1. **Do not perform work directly** - All implementation must be delegated to agents
2. **Use appropriate agents**:
   - Structure/files: `general-purpose` agent
   - MCP server: `general-purpose` with `create-mcp-servers` skill loaded
   - Skills: `general-purpose` with `create-agent-skills` skill loaded
   - Agents: `general-purpose` with `create-subagents` skill loaded
3. **Provide context**: Each agent delegation should include:
   - Reference to relevant files (`./docs/locale-api.md`, `./prompts/002-locale-mcp-server-plugin.md`)
   - Clear expectations for deliverables
   - Verification criteria

### Dependencies Between Phases

```
Phase 1 (Structure)
    ↓
Phase 2 (MCP Server) → Phase 6 (Testing)
    ↓
Phase 3 (Skill)
    ↓
Phase 4 (Agent)
    ↓
Phase 5 (Documentation)
    ↓
Phase 7 (Root README)
```

Phases 2, 3, and 4 can potentially run in parallel after Phase 1, but Phase 6 requires Phase 2 to be complete.

### Success Criteria

- [ ] Plugin structure matches existing `toolbox` plugin pattern
- [ ] MCP server compiles and runs
- [ ] All 7 MCP tools are functional
- [ ] Skill provides clear implementation and management workflows
- [ ] Agent can guide localization implementation
- [ ] Documentation is complete and accurate
- [ ] Root README updated with new plugin
- [ ] marketplace.json includes the new plugin
