# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Claude Code plugin marketplace repository (`solobitcrafter-toolbox`) containing multiple plugins that extend Claude Code with skills, commands, agents, and MCP servers.

## Build Commands

### MCP Server (locale-mcp-server)

```bash
cd plugins/locale-mcp-server/mcp-server
npm install
npm run build    # Compile TypeScript to dist/
npm run dev      # Watch mode for development
```

## Architecture

### Marketplace Structure

```
.claude-plugin/marketplace.json    # Marketplace manifest (plugin registry)
plugins/
  <plugin-name>/
    .claude-plugin/plugin.json     # Plugin manifest
    skills/                        # SKILL.md files
    commands/                      # Slash command .md files
    agents/                        # Agent configuration files
    .mcp.json                      # MCP server config (if applicable)
```

### Plugin Types

| Plugin | Type | Purpose |
|--------|------|---------|
| `toolbox` | Skills + Agents | Prompt engineering, MCP servers, subagents, hooks |
| `locale-mcp-server` | MCP Server | TypeScript server exposing locale API tools |
| `locale-translations` | Skills + Commands + Agent | User-facing locale management (requires locale-mcp-server) |
| `minecraft-mod-agents` | Agents | Multi-agent system for Minecraft mod development |

### MCP Server Architecture (locale-mcp-server)

```
mcp-server/
  src/
    index.ts           # Server entry point, tool registration
    api/client.ts      # REST API client for locale backend
    types/locale.ts    # TypeScript interfaces
    tools/             # Individual MCP tool implementations
      search.ts, get.ts, create.ts, update.ts, bulk.ts, list.ts, suggest.ts
```

The MCP server uses `@modelcontextprotocol/sdk` and communicates with an external REST API configured via `LOCALE_API_BASE_URL` environment variable.

## Documentation Maintenance

**IMPORTANT: Keep documentation up-to-date with code changes.**

When making changes to this repository, update the relevant documentation:

1. **This file (`CLAUDE.md`)** - Update when:
   - Adding/removing plugins
   - Changing build commands or architecture
   - Modifying version management process
   - Adding new patterns or conventions

2. **Plugin README files (`plugins/<plugin-name>/README.md`)** - Update when:
   - Adding/removing MCP tools, skills, commands, or agents
   - Changing configuration options or environment variables
   - Modifying installation or setup instructions
   - Updating usage examples

3. **Plugin tables in this file** - Keep the Plugin Types table current when adding new plugins

## Version Management

**IMPORTANT: Always bump version numbers before pushing changes to git.**

Semantic versioning (MAJOR.MINOR.PATCH):
- **PATCH**: Bug fixes, documentation updates
- **MINOR**: New features, non-breaking changes
- **MAJOR**: Breaking changes

### Files to Update

When modifying a plugin:

1. `plugins/<plugin-name>/.claude-plugin/plugin.json` - Plugin version
2. `.claude-plugin/marketplace.json` - Both plugin version AND `metadata.version`

### Commit Convention

```
chore(<plugin-name>): Bump version to X.Y.Z
```

## MCP Configuration

The `locale-mcp-server` plugin's `.mcp.json` contains **localhost defaults only**. Production URLs should be configured at the **user level** in `~/.claude.json` to avoid committing secrets to the repo.

Users run `/locale-setup` to configure their API connection in `~/.claude.json`.
