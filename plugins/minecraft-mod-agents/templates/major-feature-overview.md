# Major Feature: {MAJOR_FEATURE_NAME}

## Overview

{Brief description of what this major feature accomplishes and why it exists}

## Scope

### In Scope
- {Specific capability 1}
- {Specific capability 2}

### Out of Scope
- {What this major feature explicitly does NOT cover}

## External Dependencies

| Dependency | Type | Purpose | Integration Notes |
|------------|------|---------|-------------------|
| {Mod/Library} | Required/Optional | {Why needed} | {How to integrate} |

## Features

| Feature | Status | Dependencies | Priority | Assigned |
|---------|--------|--------------|----------|----------|
| [{feature-1}](./features/feature-1/spec.md) | `todo` | None | High | - |
| [{feature-2}](./features/feature-2/spec.md) | `todo` | feature-1 | Medium | - |

## Dependency Graph

```
feature-1 (no deps)
    │
    ▼
feature-2 (depends on: feature-1)
    │
    ▼
feature-3 (depends on: feature-2)

feature-4 (no deps) ──────┐
                          ▼
feature-5 (depends on: feature-2, feature-4)
```

## Architecture Notes

{High-level technical decisions that apply to all features in this major feature}

## Completion Criteria

This major feature is complete when:
- [ ] All features in `completed` status
- [ ] Integration tested as a whole
- [ ] Documentation updated
- [ ] No open design escalations
