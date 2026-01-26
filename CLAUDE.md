# Claude Code Instructions

## Version Management

**IMPORTANT: Always bump version numbers before pushing changes to git.**

This project uses semantic versioning (MAJOR.MINOR.PATCH):

- **PATCH** (0.0.X): Bug fixes, documentation updates, minor tweaks
- **MINOR** (0.X.0): New features, non-breaking changes, significant improvements
- **MAJOR** (X.0.0): Breaking changes, major rewrites

### Files to Update

When making changes to a plugin, update versions in:

1. **Plugin's `plugin.json`**: `plugins/<plugin-name>/.claude-plugin/plugin.json`
2. **Marketplace manifest**: `.claude-plugin/marketplace.json` (both the plugin entry AND metadata version)

### Checklist Before Pushing

- [ ] Identify which plugin(s) were modified
- [ ] Bump the plugin version in its `plugin.json`
- [ ] Bump the same plugin version in `marketplace.json`
- [ ] Bump the marketplace `metadata.version` if any plugin changed
- [ ] Commit version bumps with message: `chore(<plugin-name>): Bump version to X.Y.Z`

### Current Plugins

| Plugin | Description |
|--------|-------------|
| `toolbox` | Skills and commands for prompt engineering, MCP servers, subagents, hooks |
| `locale-mcp-server` | MCP server for locale translations REST API |
| `locale-translations` | Skills, commands, and agent for managing locale translations |
| `minecraft-mod-agents` | Multi-agent system for Minecraft mod development |
