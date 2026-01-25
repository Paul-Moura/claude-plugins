# Feature Specification: {FEATURE_NAME}

> **Major Feature**: [{MAJOR_FEATURE_NAME}](../../overview.md)
> **Status**: `todo` | `in-progress` | `under-review` | `revision-needed` | `design-escalation` | `completed`
> **Priority**: `critical` | `high` | `medium` | `low`
> **Assigned Coder**: {coder-id or unassigned}

## Summary

{One paragraph describing what this feature does and its value to the player/user}

## Dependencies

### Internal Dependencies (other features)

| Feature | Status | Blocking? | Notes |
|---------|--------|-----------|-------|
| [{dep-feature}](../dep-feature/spec.md) | `completed` | Yes | {Why it's needed first} |

### External Dependencies (mods/libraries)

| Dependency | Version | Required? | Integration Approach |
|------------|---------|-----------|---------------------|
| {Mod Name} | 1.0.0+ | Optional | {How to check availability, graceful degradation} |

## Requirements

### Functional Requirements

1. **FR-001**: {Specific, testable requirement}
   - Acceptance: {How to verify this is met}

2. **FR-002**: {Specific, testable requirement}
   - Acceptance: {How to verify this is met}

### Non-Functional Requirements

1. **NFR-001**: Performance - {Specific performance requirement}
2. **NFR-002**: Compatibility - {MC version, mod compatibility requirements}

## Technical Design

### Components to Create

| Component | Type | Location | Purpose |
|-----------|------|----------|---------|
| `FeatureBlock` | Block | `block/FeatureBlock.java` | {Purpose} |
| `FeatureBlockEntity` | BlockEntity | `block/entity/FeatureBlockEntity.java` | {Purpose} |

### Components to Modify

| Component | Location | Changes |
|-----------|----------|---------|
| `ModBlocks` | `registry/ModBlocks.java` | Add registry entry for FeatureBlock |

### Registry Entries

```java
// Blocks
public static final RegistryObject<Block> FEATURE_BLOCK = BLOCKS.register("feature_block", ...);

// Items (BlockItem)
public static final RegistryObject<Item> FEATURE_BLOCK_ITEM = ITEMS.register("feature_block", ...);
```

### Data Files Required

| File | Type | Purpose |
|------|------|---------|
| `blockstates/feature_block.json` | Blockstate | Block model variants |
| `models/block/feature_block.json` | Model | Block model definition |
| `loot_tables/blocks/feature_block.json` | Loot Table | Block drops |

### Client/Server Considerations

| Aspect | Client | Server | Notes |
|--------|--------|--------|-------|
| Registration | Yes | Yes | Common code |
| Rendering | Yes | No | Client only, use event registration |
| Logic | No | Yes | Server authoritative |
| Sync | Yes | Yes | {Describe what needs syncing} |

### Network Packets (if any)

| Packet | Direction | Purpose | Data |
|--------|-----------|---------|------|
| `FeatureUpdatePacket` | S->C | Sync state to client | `{blockPos, state}` |

## Implementation Notes

{Any additional context, gotchas, or recommendations for the implementing coder}

## Testing Requirements

### Manual Tests
1. {Step-by-step test scenario 1}
2. {Step-by-step test scenario 2}

### Automated Tests
- [ ] Unit test for {specific logic}
- [ ] Integration test for {specific interaction}

## Review Checklist

_To be used by Reviewer agent_

- [ ] All functional requirements met
- [ ] All non-functional requirements met
- [ ] Code follows project coding standards
- [ ] All public classes/methods have Javadoc
- [ ] Complex logic has inline comments
- [ ] Client/server separation correct
- [ ] No deprecated API usage (or documented exception)
- [ ] Performance acceptable
- [ ] Tests pass
- [ ] Data files valid JSON

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| {DATE} | Architect | Initial specification |
