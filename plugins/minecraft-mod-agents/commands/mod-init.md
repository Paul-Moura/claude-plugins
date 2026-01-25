---
name: mod-init
description: Initialize the .moddev directory structure for a Minecraft mod project
---

# Mod Init Command

Initialize the `.moddev/` directory structure for managing Minecraft mod development with the multi-agent workflow.

## Execution Steps

### Step 1: Check Existing Structure

Use Glob to check if `.moddev/project-context.md` already exists.

**If exists:**
- Tell user: "Project already initialized. Found existing .moddev/project-context.md"
- Ask: "Would you like to reinitialize? This will preserve existing major-features and status files but reset project-context.md"
- If no: Exit command

### Step 2: Detect Project Type

Look for indicators of the mod project type:

1. Check for `build.gradle` or `build.gradle.kts`
2. Search for mod loader indicators:
   - Forge: Look for `net.minecraftforge` in build.gradle
   - Fabric: Look for `fabric-loom` or `net.fabricmc`
   - NeoForge: Look for `net.neoforged`

3. Try to extract:
   - Mod ID (from mods.toml, fabric.mod.json, or build.gradle)
   - Minecraft version
   - Mod loader version
   - Package structure (from src/main/java)

### Step 3: Gather Configuration

Use AskUserQuestion to confirm or gather configuration:

**Question 1: Mod Loader**
- Question: "Which mod loader is this project using?"
- Header: "Loader"
- Options:
  - "Forge (Recommended)" - Minecraft Forge mod loader
  - "Fabric" - Fabric mod loader
  - "NeoForge" - NeoForge mod loader

**Question 2: Minecraft Version**
- Question: "What Minecraft version are you targeting?"
- Header: "MC Version"
- Options:
  - "1.20.1" - Most stable for mods
  - "1.21.x" - Latest features
  - "1.19.x" - Legacy support

Pre-select detected values if found.

**Question 3: Mod ID**
Ask for mod ID if not detected:
- "Enter your mod ID (lowercase, no spaces, e.g., 'mymod')"

**Question 4: Package Base**
Ask for package base if not detected:
- "Enter your package base (e.g., 'com.example.mymod')"

### Step 4: Create Directory Structure

Create the following directories:

```
.moddev/
├── major-features/
└── status/
    ├── todo/
    ├── in-progress/
    ├── under-review/
    ├── revision-needed/
    ├── design-escalation/
    └── completed/
```

Use Bash to create: `mkdir -p .moddev/major-features .moddev/status/{todo,in-progress,under-review,revision-needed,design-escalation,completed}`

### Step 5: Create Project Context

Write `.moddev/project-context.md` with gathered configuration:

```markdown
# Project Context

> **This file is the single source of truth for all agents. Update this before starting any work.**

## Minecraft Target

| Property | Value |
|----------|-------|
| Minecraft Version | `{mc_version}` |
| Mod Loader | `{loader}` |
| Loader Version | `{loader_version}` |
| Java Version | `17` |
| Mappings | `official` |

## Project Identity

| Property | Value |
|----------|-------|
| Mod ID | `{mod_id}` |
| Mod Name | `{mod_name}` |
| Package Base | `{package_base}` |
| Group ID | `{group_id}` |

## External Dependencies

| Mod | Purpose | Required | API Documentation |
|-----|---------|----------|-------------------|
| | | | |

## Coding Standards

### Naming Conventions
- **Classes**: PascalCase (e.g., `DiamondPickaxeItem`)
- **Methods/Fields**: camelCase (e.g., `getMaxDamage()`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_STACK_SIZE`)
- **Packages**: lowercase (e.g., `{package_base}.items`)

### Package Structure
```
{package_base}/
├── {ModClass}.java           # Main mod class
├── Config.java               # Mod configuration
├── block/                    # Block classes
├── item/                     # Item classes
├── entity/                   # Entity classes
├── client/                   # Client-only code (rendering, etc.)
├── data/                     # Data generators
├── network/                  # Packet handlers
├── registry/                 # Deferred registries
└── util/                     # Utilities
```

### Documentation Requirements
- All public classes must have Javadoc class descriptions
- All public methods must have Javadoc with `@param`, `@return`, `@throws` as applicable
- Complex logic blocks require inline comments explaining the "why"
- Registry entries should have comments explaining their purpose

### Client/Server Guidelines
- Use `@OnlyIn(Dist.CLIENT)` sparingly - prefer sided proxies or event checks
- Network packets must validate on both sides
- Never access client-only classes from common code

## Build Commands

| Action | Command |
|--------|---------|
| Build | `./gradlew build` |
| Run Client | `./gradlew runClient` |
| Run Server | `./gradlew runServer` |
| Run Data Gen | `./gradlew runData` |
| Test | `./gradlew test` |

## Repository Conventions

- Branch naming: `feature/{major-feature}/{feature-name}`
- Commit format: One file per commit with message `[{feature-name}] {action}: {description}`
- PR title: `[{major-feature}] {brief description}`
```

### Step 6: Create Dependency Graph Template

Write `.moddev/dependency-graph.md`:

```markdown
# Dependency Graph

This file tracks dependencies between features to enable parallel development.

## How to Read

- Features at the same level can be developed in parallel
- Features must wait for all dependencies to complete before starting
- Update this file when creating new features with dependencies

## Current Features

_No features yet. Use the mod-architect agent to design your first major feature._
```

### Step 7: Confirm Success

Output:

```
Mod project initialized successfully!

Created structure:
  .moddev/
  ├── project-context.md      # Edit this with your project details
  ├── dependency-graph.md     # Auto-updated when features are created
  ├── major-features/         # Feature specs go here
  └── status/                 # Kanban-style tracking
      ├── todo/
      ├── in-progress/
      ├── under-review/
      ├── revision-needed/
      ├── design-escalation/
      └── completed/

Next steps:
1. Review and update .moddev/project-context.md with your project details
2. Use the mod-architect agent to design your first feature
3. Use the mod-coder agent to implement features
4. Use the mod-reviewer agent to review and commit code

Run the agents with:
- "Use the mod-architect agent to design {feature description}"
- "Use the mod-coder agent to implement {feature name}"
- "Use the mod-reviewer agent to review {feature name}"
```
