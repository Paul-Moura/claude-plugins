# Minecraft Mod Agents

A multi-agent system for professional Minecraft mod development with specialized Architect, Coder, and Reviewer agents.

## Overview

This plugin provides a structured workflow for developing Minecraft mods using three specialized agents that work together:

- **Mod Architect** - Designs features, creates specifications, and researches mod compatibility
- **Mod Coder** - Implements features according to specifications with proper documentation
- **Mod Reviewer** - Reviews code, ensures quality, and commits approved changes

## Getting Started

### Initialize a Project

Run the `mod-init` command in your Minecraft mod project directory:

```
Use the mod-init command to initialize this project
```

This creates the `.moddev/` directory structure:

```
.moddev/
├── project-context.md      # Project configuration (edit this first)
├── dependency-graph.md     # Auto-updated feature dependencies
├── major-features/         # Feature specifications
└── status/                 # Kanban-style tracking
    ├── todo/
    ├── in-progress/
    ├── under-review/
    ├── revision-needed/
    ├── design-escalation/
    └── completed/
```

### Workflow

1. **Design** - Use the Mod Architect agent to design features
   ```
   Use the mod-architect agent to design a custom ore generation system
   ```

2. **Implement** - Use the Mod Coder agent to implement features
   ```
   Use the mod-coder agent to implement the copper-ore feature
   ```

3. **Review** - Use the Mod Reviewer agent to review and commit
   ```
   Use the mod-reviewer agent to review the copper-ore feature
   ```

## Agents

### Mod Architect

Specializes in:
- Gathering and documenting requirements
- Researching existing mods and APIs
- Designing feature architecture
- Creating detailed specifications
- Breaking down major features for parallel development
- Analyzing dependencies between features

### Mod Coder

Specializes in:
- Implementing features from specifications
- Writing Java code following Minecraft modding patterns
- Creating data files (JSON models, blockstates, loot tables)
- Adding comprehensive Javadoc and inline comments
- Handling client/server separation correctly
- Managing deferred registries

### Mod Reviewer

Specializes in:
- Verifying code against specifications
- Checking documentation completeness
- Reviewing client/server separation
- Ensuring coding standards compliance
- Requesting revisions or escalating design issues
- Committing approved code with proper messages

## Supported Mod Loaders

- Minecraft Forge
- Fabric
- NeoForge

## Status Workflow

Features move through these statuses:

```
todo → in-progress → under-review → completed
                          ↓
                   revision-needed → in-progress
                          ↓
                   design-escalation → (back to Architect)
```

## Templates

The plugin includes templates for:

- **project-context.md** - Project configuration and coding standards
- **major-feature-overview.md** - High-level feature documentation
- **feature-spec.md** - Detailed feature specifications
- **status-tracker.md** - Feature status and activity tracking
- **review-notes.md** - Code review documentation

## Parallel Development

Features are designed to support parallel development:

1. Architect breaks major features into smaller features with explicit dependencies
2. Multiple Coder agents can work on independent features simultaneously
3. Dependency graph ensures proper implementation order
4. Reviewer agents can review completed features independently

## Best Practices

### For Architects
- Always research existing mods before designing
- Break features down enough for parallel coders
- Document all external dependencies
- Specify clear acceptance criteria

### For Coders
- Read the full spec before starting
- Follow the project's coding standards
- Add Javadoc to all public classes and methods
- Comment complex logic and Minecraft quirks

### For Reviewers
- Check all requirements, not just code quality
- Distinguish implementation issues from design issues
- Provide specific, actionable feedback
- Commit one file at a time in dependency order

## License

MIT
