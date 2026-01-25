# Project Context

> **This file is the single source of truth for all agents. Update this before starting any work.**

## Minecraft Target

| Property | Value |
|----------|-------|
| Minecraft Version | `1.20.1` |
| Mod Loader | `Forge` |
| Loader Version | `47.2.0` |
| Java Version | `17` |
| Mappings | `official` |

## Project Identity

| Property | Value |
|----------|-------|
| Mod ID | `examplemod` |
| Mod Name | `Example Mod` |
| Package Base | `com.example.examplemod` |
| Group ID | `com.example` |

## External Dependencies

List all mod dependencies this project relies on:

| Mod | Purpose | Required | API Documentation |
|-----|---------|----------|-------------------|
| JEI | Recipe viewing integration | Optional | https://github.com/mezz/JustEnoughItems/wiki |

## Coding Standards

### Naming Conventions
- **Classes**: PascalCase (e.g., `DiamondPickaxeItem`)
- **Methods/Fields**: camelCase (e.g., `getMaxDamage()`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_STACK_SIZE`)
- **Packages**: lowercase (e.g., `com.example.examplemod.items`)

### Package Structure
```
com.example.examplemod/
├── ExampleMod.java           # Main mod class
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
- Use `@OnlyIn(Dist.CLIENT)` sparingly—prefer sided proxies or event checks
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
