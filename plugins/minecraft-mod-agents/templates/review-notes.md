# Review Notes: {FEATURE_NAME}

> **Feature**: [{FEATURE_NAME}](./spec.md)
> **Status Tracker**: [Status](./status.md)

---

## Review #1 - {YYYY-MM-DD}

**Reviewer**: {reviewer-id}
**Verdict**: `approved` | `revision-needed` | `design-escalation`

### Summary

{2-3 sentence overview of the review findings}

### Requirements Verification

| Requirement | Status | Notes |
|-------------|--------|-------|
| FR-001 | `pass` / `fail` | {Notes if any} |
| FR-002 | `pass` / `fail` | {Notes if any} |
| NFR-001 | `pass` / `fail` | {Notes if any} |

### Code Quality

| Category | Score (0-2) | Notes |
|----------|-------------|-------|
| Naming conventions | {0-2} | |
| Package structure | {0-2} | |
| Code style | {0-2} | |
| Error handling | {0-2} | |

### Documentation Quality

| Category | Score (0-2) | Notes |
|----------|-------------|-------|
| Class Javadoc | {0-2} | |
| Method Javadoc | {0-2} | |
| Inline comments | {0-2} | |
| Registry comments | {0-2} | |

### Client/Server Separation

- [ ] No `Minecraft.getInstance()` in common code
- [ ] Proper use of `DistExecutor` or side checks
- [ ] Network packets validate on both sides
- [ ] `@OnlyIn` used appropriately (if at all)

### Issues Found

#### Issue 1: {Brief title}

- **Severity**: `blocker` | `major` | `minor`
- **Type**: `bug` | `standards` | `documentation` | `performance` | `design`
- **Location**: `src/main/.../File.java:line`
- **Description**: {What's wrong}
- **Suggestion**: {How to fix}

### Action Required

**Total issues**: {N} ({X} blocker, {Y} major, {Z} minor)

**Must fix before next review:**
1. {Issue description}

**Should fix:**
1. {Issue description}

### Positive Notes

{Brief acknowledgment of well-done aspects}

---

## Review #2 - {YYYY-MM-DD}

_Template for subsequent reviews_

**Reviewer**: {reviewer-id}
**Verdict**: `approved` | `revision-needed`
**Previous Issues Resolved**: {X}/{Y}

### Previous Issues Status

| Issue | Status | Notes |
|-------|--------|-------|
| Issue 1 from Review #1 | `resolved` / `unresolved` | |

### New Issues Found

{If any}

### Final Verdict

{If approved, note any minor items to address in future features}

---

## Commit Record

_Filled in upon approval_

| File | Commit Hash | Message |
|------|-------------|---------|
| - | - | - |

**Total Commits**: {N}
**Approved By**: {reviewer-id}
**Approval Date**: {YYYY-MM-DD}
