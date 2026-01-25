---
name: Mod Reviewer
description: This skill provides workflows for reviewing Minecraft mod implementations. Use when verifying code against specs, checking documentation, reviewing client/server separation, requesting changes, escalating design issues, or committing approved code.
version: 1.0.0
---

# Mod Reviewer Skill

This skill enables comprehensive code review for Minecraft mod implementations. It provides structured workflows for verifying requirements, checking code quality, providing feedback, and committing approved code.

## Overview

The Mod Reviewer skill facilitates five primary workflows:

1. **Review Code** - Analyze implementation against specification and standards
2. **Review Docs** - Verify documentation quality and completeness
3. **Request Changes** - Document feedback and return for revision
4. **Escalate Design** - Return to Architect when spec is flawed
5. **Commit** - Commit approved code with proper messages

## Review Code Workflow

### Step 1: Gather Context

Before reviewing:
1. Read `project-context.md` for coding standards
2. Read the feature's `spec.md` completely
3. Read previous `review-notes.md` if re-review
4. Read status file for files changed list

### Step 2: Review Each File

For each file, check:

**Requirements Coverage:**
- Does file implement what spec requires?
- Are all components from "Components to Create" present?
- Are all modifications from "Components to Modify" done?

**Code Quality:**
- Naming conventions followed?
- Package structure correct?
- Code style consistent?

**Javadoc Completeness:**
- Class-level Javadoc present and clear?
- All public methods have Javadoc?
- @param, @return, @throws as applicable?

**Inline Comments:**
- Complex logic explained?
- Magic numbers documented?
- Minecraft quirks noted?

**Client/Server Separation:**
- No `Minecraft.getInstance()` in common code?
- Proper use of `DistExecutor` or side checks?
- Network packets validate on both sides?

### Step 3: Rate Issues

For each issue found:

**Severity:**
- `blocker`: Must fix before approval
- `major`: Should fix, will block if not addressed
- `minor`: Should fix, can approve with note

**Type:**
- `bug`: Incorrect behavior
- `standards`: Coding convention violation
- `documentation`: Missing/incorrect docs
- `performance`: Inefficient code
- `design`: Architectural concern (may escalate)

## Review Docs Workflow

### Class-Level Javadoc

Required elements:
```java
/**
 * [1] Brief one-sentence description.
 * [2] <p>Extended description.</p>
 * [3] @see RelatedClass (optional)
 */
```

**Pass criteria:** Brief description present and clear. Extended description for non-trivial classes.

### Method-Level Javadoc

Required elements:
```java
/**
 * [1] Brief description.
 * [2] @param paramName Description
 * [3] @return Description
 * [4] @throws ExceptionType When thrown
 */
```

**Pass criteria:** All public methods have brief + all applicable tags.

### Inline Comments

Required for:
- Complex algorithms
- Magic numbers
- Minecraft quirks
- Performance optimizations
- Workarounds

### Documentation Score

| Category | Weight |
|----------|--------|
| Class Javadoc | 25% |
| Method Javadoc | 30% |
| Inline comments | 25% |
| Registry comments | 10% |
| Clarity | 10% |

**Pass threshold:** 1.5+ average (0-2 scale)

## Request Changes Workflow

### Document Review Notes

Create structured entry in `review-notes.md`:

```markdown
## Review #{N} - {YYYY-MM-DD}

**Reviewer**: {reviewer-id}
**Verdict**: `revision-needed`

### Summary
{2-3 sentence overview}

### Requirements Verification
| Requirement | Status | Notes |
|-------------|--------|-------|
| FR-001 | Pass | - |
| FR-002 | Fail | GUI doesn't update |

### Issues Found
```

### Document Each Issue

```markdown
#### Issue {N}: {Brief title}

- **Severity**: `blocker` | `major` | `minor`
- **Type**: `bug` | `standards` | `documentation`
- **Location**: `src/main/.../File.java:line`
- **Description**: {What's wrong}
- **Suggestion**: {How to fix}
```

### Update Status

1. Move to `status/revision-needed/`
2. Update status fields
3. Add activity log entry

### Summary for Coder

```markdown
### Action Required

**Total issues**: 3 (1 blocker, 2 minor)

**Must fix before next review:**
1. Issue 1: Fix GUI updates (blocker)

**Should fix:**
2. Issue 2: Add Javadoc
3. Issue 3: Add inline comment
```

## Escalate Design Workflow

### When to Escalate

**DO escalate when:**
- Spec is ambiguous and coder had to guess
- Spec asks for something technically impossible
- Spec has conflicting requirements
- Design pattern is inappropriate
- Missing component discovered
- Spec doesn't account for Minecraft behavior

**DON'T escalate when:**
- Coder made implementation error
- Documentation is missing
- Code doesn't follow standards
- Bug in the code

### Escalation Types

1. **Ambiguous Specification** - Coder implemented reasonable but wrong thing
2. **Technical Impossibility** - Can't be done in Minecraft
3. **Conflicting Requirements** - Two requirements contradict
4. **Inappropriate Pattern** - Specified approach won't work
5. **Missing Component** - Essential thing not specified
6. **Minecraft Behavior** - Spec ignores how MC works

### Document Escalation

```markdown
## Review #{N} - {YYYY-MM-DD}

**Reviewer**: {reviewer-id}
**Verdict**: `design-escalation`

### Design Escalation

**Type**: {Ambiguous | Impossible | Conflicting | etc.}
**Affected Requirements**: FR-003, FR-005
**Description**: {Detailed explanation}
**Recommendation**: {Suggested approach}
```

### Update Status

Move to `status/design-escalation/`

## Commit Workflow

### Prerequisites

Before committing:
- [ ] All FR-XXX requirements verified
- [ ] All NFR-XXX requirements verified
- [ ] Code quality standards met
- [ ] Documentation complete
- [ ] Client/server separation correct
- [ ] Build succeeds
- [ ] Tests pass

### Commit Strategy

**One commit per file** in dependency order:
1. Registry classes first
2. Core classes
3. Supporting classes
4. Client classes
5. Data files
6. Test files

### Commit Message Format

```
[{feature-name}] {type}: {description}

{optional body}

Co-Authored-By: {Coder Agent ID}
```

**Types:**
- `feat`: New feature code
- `fix`: Bug fix
- `asset`: Models, textures, JSON
- `refactor`: Code restructure
- `docs`: Documentation only
- `test`: Test files

### Commit Process

1. Verify correct branch
2. Review changed files with `git status`
3. Stage and commit each file individually
4. Record commit hashes
5. Update status to `completed`
6. Update major feature overview

## Best Practices

1. **Be specific** - Include file paths and line numbers
2. **Be actionable** - Tell coder exactly how to fix
3. **Be constructive** - Focus on what to do, not what's wrong
4. **Acknowledge good work** - Briefly note well-done implementations
5. **Distinguish implementation from design** - Only escalate design issues
