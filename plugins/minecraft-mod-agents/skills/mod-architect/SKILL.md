---
name: Mod Architect
description: This skill provides workflows for designing Minecraft mod features, including research, architecture design, specification writing, and dependency analysis. Use when planning new features, creating specs, or analyzing feature dependencies.
version: 1.0.0
---

# Mod Architect Skill

This skill enables comprehensive design and specification of Minecraft mod features. It provides structured workflows for researching existing solutions, designing architectures, writing detailed specifications, and analyzing dependencies for parallel development.

## Overview

The Mod Architect skill facilitates four primary workflows:

1. **Research** - Investigate existing mods, APIs, and patterns before designing
2. **Design** - Create architecture diagrams, registry plans, and data file maps
3. **Document** - Write formal specifications and status trackers
4. **Analyze Dependencies** - Optimize feature dependencies for parallel development

## Research Workflow

Before designing any new feature, research existing solutions.

### Step 1: Define Research Goals

Identify:
- What specific question are you trying to answer?
- What would make an existing solution acceptable vs unacceptable?
- What constraints exist (licensing, dependencies, complexity)?

### Step 2: Search for Existing Mods

Search CurseForge and Modrinth for mods that:
- Provide similar functionality
- Offer APIs you could integrate with
- Might conflict with your planned feature

For each relevant mod, document:
- Mod name and link
- What functionality it provides
- Whether it has an API
- Compatibility (MC versions, loaders)
- Recommendation: Use / Integrate / Avoid / Irrelevant

### Step 3: Search Mod Loader Documentation

Check official documentation for:
- Relevant API classes/methods
- Built-in solutions to your problem
- Correct events, registries, or systems to use

### Step 4: Compile Research Report

Create a summary including what was searched, what was found, recommendations with justification, and risks.

## Design Workflow

After research, create the architecture design.

### Component Diagram

Show relationships between classes:

```
┌─────────────────┐     ┌─────────────────┐
│  FeatureBlock   │────▶│FeatureBlockEntity│
└─────────────────┘     └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│FeatureBlockItem │     │ EnergyStorage   │
└─────────────────┘     └─────────────────┘
```

### Registry Plan

Define all registry entries:

| Registry Name | Class | Properties |
|--------------|-------|------------|
| `feature_block` | `FeatureBlock` | strength=3.5, requiresTool |
| `feature_block_entity` | `FeatureBlockEntity` | feature_block |

### Data Files Map

List all non-code files:
- Blockstates: `assets/{modid}/blockstates/feature_block.json`
- Models: `assets/{modid}/models/block/feature_block.json`
- Loot Tables: `data/{modid}/loot_tables/blocks/feature_block.json`
- Recipes: `data/{modid}/recipes/feature_block.json`

### Network Protocol (if needed)

Define packets with:
- Purpose
- Direction (Server → Client or Client → Server)
- Data fields with types
- Trigger conditions
- Validation requirements

## Documentation Workflow

### Major Feature Overview

Create at `.moddev/major-features/{name}/overview.md` with:
- Overview (what and why)
- Scope (in/out)
- External dependencies table
- Features table with status, deps, priority
- Dependency graph (ASCII)
- Completion criteria

### Feature Specification

Create at `.moddev/major-features/{major}/features/{feature}/spec.md` with:
- Summary
- Dependencies (internal and external)
- Functional requirements (FR-XXX format)
- Non-functional requirements (NFR-XXX format)
- Technical design (components, registries, data files)
- Client/server considerations
- Testing requirements
- Review checklist

### Status Tracker

Create at `.moddev/status/todo/{feature}.md` with:
- Link to spec
- Current status
- Assigned agent
- Blocked by
- Dependencies status
- Activity log

## Dependency Analysis Workflow

### Step 1: Identify Dependencies

For each feature, identify:
- **Code dependencies**: Does it import/use code from another feature?
- **Registry dependencies**: Does it reference registries from another feature?
- **Data dependencies**: Do its data files reference another feature's assets?
- **Logical dependencies**: Does it only make sense after another feature exists?

### Step 2: Check for Problems

- **Circular Dependencies**: A → B → C → A (must resolve)
- **Over-coupling**: Feature depends on 5+ others (consider splitting)
- **Under-specification**: Vague dependencies (be specific)

### Step 3: Determine Execution Order

Group features by when they can start:

```
Level 0 (no deps):      [feature-a, feature-b]
Level 1 (deps on L0):   [feature-c, feature-d]
Level 2 (deps on L1):   [feature-e]
```

Features at the same level can be developed in parallel.

### Step 4: Calculate Parallelization Factor

```
Parallelization factor: total features / sequential levels
```

If factor is low (< 1.5x), consider restructuring dependencies.

## Quality Standards

### Requirements

**Good requirement:**
> **FR-001**: The energy storage block must display current energy level via a GUI.
> - Acceptance: When player right-clicks block, a GUI opens showing energy as "{current}/{max} FE" with a visual bar.

**Bad requirement:**
> **FR-001**: The block should show energy.

### Technical Design

**Good design:**
> | Component | Type | Location | Purpose |
> |-----------|------|----------|---------|
> | `EnergyStorageBlock` | Block | `block/EnergyStorageBlock.java` | Handles placement, interaction routing |
> | `EnergyStorageBlockEntity` | BlockEntity | `block/entity/EnergyStorageBlockEntity.java` | Stores energy, handles tick logic |

**Bad design:**
> Create a block that stores energy and has a GUI.

## Best Practices

1. **Research first, design second** - Always check for existing solutions
2. **Complete specifications** - Include everything a Coder needs
3. **Minimize dependencies** - Enable parallel development
4. **Version-specific notes** - Document when designs are version-dependent
5. **Clear acceptance criteria** - Make requirements testable
