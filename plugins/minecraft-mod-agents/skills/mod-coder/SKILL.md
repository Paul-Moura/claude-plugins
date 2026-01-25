---
name: Mod Coder
description: This skill provides workflows for implementing Minecraft mod features from specifications. Use when writing Java code, creating data files, handling registries, debugging issues, or updating feature status.
version: 1.0.0
---

# Mod Coder Skill

This skill enables implementation of Minecraft mod features according to specifications. It provides structured workflows for writing code, creating data files, testing, debugging, and managing development status.

## Overview

The Mod Coder skill facilitates four primary workflows:

1. **Implement** - Write Java code based on specifications
2. **Test** - Verify code compiles, runs, and functions correctly
3. **Debug** - Investigate and fix issues
4. **Update Status** - Track progress through the development pipeline

## Implementation Workflow

### Implementation Order

Always implement in this order to avoid forward reference issues:

1. **Registry Classes First**
   - Ensure DeferredRegister exists
   - Add new registry entries

2. **Core Classes**
   - Utility/helper classes (no dependencies)
   - Base classes (if any)
   - Main feature classes (blocks, items, entities)
   - Supporting classes (block entities, containers)

3. **Event Handlers**
   - Register after core classes exist
   - Use correct bus (FORGE for game events, MOD for lifecycle)

4. **Client-Only Code**
   - Always in separate classes
   - Properly sided with `@OnlyIn` or `DistExecutor`

5. **Network Packets**
   - After classes that use them
   - Include encode, decode, and handle methods

### Code Patterns

**Block with BlockEntity:**
```java
public class FeatureBlock extends BaseEntityBlock {
    @Override
    public RenderShape getRenderShape(BlockState state) {
        return RenderShape.MODEL;
    }

    @Nullable
    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new FeatureBlockEntity(pos, state);
    }

    @Nullable
    @Override
    public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
            Level level, BlockState state, BlockEntityType<T> type) {
        return level.isClientSide() ? null :
            createTickerHelper(type, ModBlockEntities.FEATURE_BLOCK_ENTITY.get(),
                FeatureBlockEntity::serverTick);
    }
}
```

**BlockEntity with Tick:**
```java
public class FeatureBlockEntity extends BlockEntity {
    public static void serverTick(Level level, BlockPos pos,
            BlockState state, FeatureBlockEntity blockEntity) {
        // Server-side tick logic
        blockEntity.setChanged(); // Mark dirty for saving
    }

    @Override
    protected void saveAdditional(CompoundTag tag) {
        super.saveAdditional(tag);
        // Save data
    }

    @Override
    public void load(CompoundTag tag) {
        super.load(tag);
        // Load data
    }
}
```

### Documentation Requirements

**Class-Level Javadoc:**
```java
/**
 * Brief one-line description.
 *
 * <p>Extended description explaining the class's role.</p>
 *
 * @see RelatedClass
 * @since 1.0.0
 */
```

**Method-Level Javadoc:**
```java
/**
 * Brief description of what this method does.
 *
 * @param paramName Description of parameter
 * @return Description of return value
 * @throws ExceptionType When this is thrown
 */
```

**Inline Comments:**
```java
// Non-obvious logic explanation
int threshold = 100; // Threshold based on energy transfer rate per tick

// Minecraft quirk explanation
setChanged(); // Required for data persistence across world reload
```

## Testing Workflow

### Compilation Test

```bash
./gradlew build
```

Check for:
- Cannot find symbol (missing import or typo)
- Incompatible types (wrong type returned/assigned)
- Method not found (wrong MC version API)

### Data File Validation

Verify JSON files are valid:
- No trailing commas
- All keys quoted
- Correct structure per Minecraft requirements

### Runtime Test (Client)

```bash
./gradlew runClient
```

Verify:
- Game launches without crash
- Mod appears in mod list
- Registry entries exist
- Textures/models load
- Interactions work as specified

### Runtime Test (Server)

```bash
./gradlew runServer
```

Verify:
- Server starts without crash
- No client-only code errors

### Functional Testing

For each FR-XXX in spec:
1. Document test steps
2. Document expected result
3. Document actual result (PASS/FAIL)

## Debug Workflow

### Common Issues

**NullPointerException in BlockEntity:**
```java
// WRONG
level.sendBlockUpdated(...); // level might be null

// RIGHT
if (level != null && !level.isClientSide()) {
    level.sendBlockUpdated(...);
}
```

**Client Crash on Dedicated Server:**
```java
// WRONG
Minecraft.getInstance().player.displayClientMessage(...);

// RIGHT
DistExecutor.unsafeRunWhenOn(Dist.CLIENT, () -> () -> {
    Minecraft.getInstance().player.displayClientMessage(...);
});
```

**Data Not Persisting:**
```java
public void setEnergy(int energy) {
    this.energyStorage.setEnergy(energy);
    setChanged(); // CRITICAL: Mark dirty for saving
}
```

**Texture Not Loading:**
Check path format in JSON:
```json
{
  "textures": {
    "all": "modid:block/feature_block"
  }
}
```
Maps to: `assets/modid/textures/block/feature_block.png`

### Debug Checklist

1. Read the full error message/stack trace
2. Check if issue is client-only or server-only
3. Add logging around the problem area
4. Check similar working code in codebase
5. Check MC/Forge source for expected behavior
6. Simplify until it works, then add complexity back

## Status Update Workflow

### Claiming a Feature

1. Move `status/todo/{feature}.md` to `status/in-progress/{feature}.md`
2. Update status fields (Status, Assigned, Last Updated)
3. Add activity log entry

### Submitting for Review

1. Update "Files Changed" section in status file
2. Move to `status/under-review/`
3. Add activity log entry

### Resubmitting After Revision

1. Move from `status/revision-needed/` to `status/under-review/`
2. Increment review attempts counter
3. Add activity log entry

## Quality Checklist

Before submitting for review:

- [ ] All files from spec created
- [ ] All registry entries added
- [ ] All data files valid JSON
- [ ] All public classes have Javadoc
- [ ] All public methods have Javadoc
- [ ] Complex logic has inline comments
- [ ] Client/server separation verified
- [ ] Build succeeds
- [ ] Manual testing confirms functionality

## Best Practices

1. **Follow the spec exactly** - If you disagree, implement anyway and let Reviewer escalate
2. **Document everything** - Javadoc and inline comments are mandatory
3. **Test before submitting** - Don't rely on Reviewer to find bugs
4. **Client/server awareness** - Always consider which side code runs on
5. **Clean up debug code** - Remove logging before review
