# SoloBitCrafter Toolbox

A collection of custom Claude Code skills and agents by Paul-Jason Moura.

## Installation

Add this marketplace to Claude Code:

```
/plugin marketplace add Paul-Moura/claude-plugins
```

Then install the toolbox plugin via the `/plugin` menu, or:

```
claude plugin install toolbox@solobitcrafter-toolbox
```

## Available Plugins

| Plugin | Description |
|--------|-------------|
| **toolbox** | Core skills and agents for code review, UI/UX, and web application development |
| **locale-translations** | MCP server, skill, and agent for managing locale translations via REST API |

## Available Skills

| Skill | Description |
|-------|-------------|
| **skill-builder** | Proactively identifies opportunities for new skills and guides users through creating or enhancing them |
| **locale-manager** | Provides workflows for implementing and managing locale translations via REST API |

## Available Agents

| Agent | Description |
|-------|-------------|
| **code-reviewer** | Thorough code review for security, performance, best practices, modularity, and maintainability |
| **ui-expert** | Reviews and improves UI/UX for design consistency, minimalism, and responsive design |
| **web-app-coder** | Writes production-quality web application code with focus on security and performance |
| **win-form-coder** | Creates and enhances Windows Forms applications in .NET with enterprise-grade quality |
| **locale-implementer** | Implements localization in existing codebases by analyzing code, creating translations, and generating i18n code |

## Repository Structure

```
claude-plugins/
├── .claude-plugin/
│   └── marketplace.json        # Marketplace catalog
├── plugins/
│   ├── toolbox/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json     # Plugin manifest
│   │   ├── agents/
│   │   │   ├── code-reviewer.md
│   │   │   ├── ui-expert.md
│   │   │   ├── web-app-coder.md
│   │   │   └── win-form-coder.md
│   │   └── skills/
│   │       └── skill-builder/
│   │           └── SKILL.md
│   └── locale-translations/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── mcp-server/
│       │   └── src/
│       ├── skills/
│       │   └── locale-manager/
│       ├── agents/
│       │   └── locale-implementer.md
│       └── README.md
└── README.md
```

## Adding a Plugin

Create a new folder under `plugins/<plugin-name>/` with its own `.claude-plugin/plugin.json` manifest. Then add an entry to the root `marketplace.json`.

## Adding a Skill

Each skill lives in `plugins/<plugin-name>/skills/<skill-name>/SKILL.md`:

```yaml
---
name: skill-name
description: What this skill does and when Claude should use it
allowed-tools: Read, Bash, Write
user-invocable: true
---

# Skill Title

Instructions for how Claude should use this skill.
```

## Adding an Agent

Each agent lives in `plugins/<plugin-name>/agents/<agent-name>.md`:

```markdown
---
name: agent-name
description: What this agent specializes in and when to use it
model: opus
color: blue
---

# Agent Name

Detailed instructions for the agent's behavior and expertise.
```

## Skills vs Agents

| | **Skills** | **Agents** |
|--|-----------|------------|
| **Purpose** | Knowledge/patterns shared in main conversation | Task delegation with isolated context |
| **Invocation** | Slash command or Claude auto-invokes | Claude delegates or explicit request |
| **Context** | Shares main conversation | Separate conversation history |

## License

MIT
