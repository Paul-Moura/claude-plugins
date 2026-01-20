---
name: Skill Builder
description: This skill should be used proactively when Claude identifies a task pattern that would benefit from a new or enhanced skill, when the user mentions wanting Claude to "learn", "remember how to", "do this automatically", "create a skill", "enhance a skill", or when Claude notices repetitive workflows, manual handoffs, or missed automation opportunities.
version: 0.1.0
---

# Skill Builder

This skill enables Claude to proactively identify opportunities for new skills and guide the user through creating or enhancing them.

## Core Principle

Operate as a meta-skill that improves Claude's own capabilities over time by:
1. Recognizing patterns that indicate a skill opportunity
2. Proposing skills to the user with clear value propositions
3. Gathering requirements through guided questions
4. Creating or enhancing skills with proper structure
5. Storing learned feedback in appropriate locations

## Proactive Identification

### When to Suggest a New Skill

Identify skill opportunities when observing:

**Repetitive Patterns**
- Same type of task performed multiple times across sessions
- Similar code transformations applied repeatedly
- Consistent manual steps that could be automated

**Manual Handoffs**
- Providing lists for the user to manually enter somewhere
- Generating output that requires user action to apply
- Creating instructions instead of executing directly

**Missed Automation**
- Tasks where Claude could do more if given access/knowledge
- Workflows requiring external tools Claude could integrate with
- Domain knowledge that would improve future assistance

**Integration Opportunities**
- User frequently interacts with specific APIs, databases, or services
- Repetitive data entry or retrieval patterns
- Cross-system workflows that could be streamlined

### Proposing a Skill

When an opportunity is identified, propose it conversationally:

```
Hey, it looks like we have an opportunity to give me a skill to make this easier for you.

[Describe the pattern observed]

I could create a skill that allows me to [specific capability]. This would mean instead of [current manual process], I could [improved automated process].

Do you want to create this skill?
```

## Requirements Gathering

### Question Strategy

Ask questions in phases to avoid overwhelming the user:

**Phase 1: Core Understanding**
- What is the primary goal of this skill?
- What triggers should activate it?
- What are 2-3 concrete examples of use?

**Phase 2: Scope and Access**
- What systems/APIs/databases does this involve?
- What permissions or access would Claude need?
- Are there existing tools, scripts, or documentation to reference?

**Phase 3: Safety and Constraints**
- Are there actions that should require confirmation?
- Are there irreversible operations involved?
- What are the boundaries of this skill's authority?

**Phase 4: External Setup (if needed)**
- What does the user need to configure?
- Are there APIs to expose or commands to create?
- Provide clear, actionable setup instructions

### Gathering External Requirements

When the skill requires user action (API access, command creation, etc.):

1. Explain what is needed and why
2. Provide step-by-step instructions
3. Offer to verify the setup once complete
4. Document the setup in the skill for future reference

## Skill Creation

### Determining Skill Location

Evaluate scope to determine where to place the skill:

**Project-Specific Skill** (in project's `.claude/skills/` or `CLAUDE.md`)
- Only relevant to one codebase
- Uses project-specific APIs, schemas, or patterns
- References project files or structure

**Global Skill** (in `~/.claude/plugins/local/` or `~/.claude/CLAUDE.md`)
- Applies across multiple projects
- General workflow improvements
- User preferences that span contexts

Ask clarifying questions if scope is ambiguous:
- "Is this localization pattern specific to this project, or do you use it across multiple apps?"
- "Should this database access skill work for all your projects or just this one?"

### Skill Structure

Create skills following the standard structure:

```
skill-name/
├── SKILL.md           # Core instructions (1,500-2,000 words)
├── references/        # Detailed documentation
├── examples/          # Working examples
└── scripts/           # Utility scripts (if needed)
```

### Writing the SKILL.md

**Frontmatter**: Use third-person with specific triggers
```yaml
---
name: Skill Name
description: This skill should be used when the user asks to "phrase 1", "phrase 2", or when [specific conditions].
version: 0.1.0
---
```

**Body**: Use imperative/infinitive form, not second person
- Correct: "To add a localization entry, first check for existing keys..."
- Incorrect: "You should check for existing keys..."

## Feedback Integration

### Capturing Important Feedback

When the user provides feedback that should persist:

1. Identify if it's a **correction**, **preference**, or **safety rule**
2. Determine scope (project vs global)
3. Store in the appropriate location
4. Confirm with the user what was recorded

### Storage Locations

**Project-level feedback** → Project's `CLAUDE.md` or `.claude/` directory
- Project-specific conventions
- Codebase patterns
- Team preferences

**Global feedback** → `~/.claude/CLAUDE.md` or relevant skill's references
- Cross-project preferences
- Safety rules
- Workflow preferences

**Skill-specific feedback** → The skill's own `references/` or `SKILL.md`
- Improvements to skill behavior
- Edge cases discovered
- Enhanced instructions

### Example Feedback Integration

User says: "Actually, when you're making database changes, always ask me first if it can't be undone."

Action:
1. Identify: Safety rule about irreversible actions
2. Scope: Global (applies everywhere)
3. Store: Add to irreversible action safety rules
4. Confirm: "I've noted that for any irreversible action, I should warn you, offer to make a backup, and require explicit confirmation before proceeding."

## Irreversible Action Safety Protocol

### Definition

An irreversible action is any operation that:
- Cannot be undone with a simple command (no `git revert`, `ctrl+z`, etc.)
- Modifies external state permanently (databases, APIs, cloud resources)
- Deletes data without automatic backup
- Affects systems outside the current working directory
- Could impact production environments

### Required Behavior

Before executing any potentially irreversible action:

1. **Identify**: Recognize the action as potentially irreversible
2. **Warn**: Clearly state "This action cannot be easily undone"
3. **Explain**: Describe what will be changed and the impact
4. **Offer Backup**: Ask "Would you like me to create a backup first?"
5. **Confirm**: Require explicit confirmation before proceeding

### Examples of Irreversible Actions

- Database INSERT, UPDATE, DELETE operations
- API calls that modify remote state
- File deletions outside git-tracked directories
- Cloud resource modifications (AWS, GCP, Azure)
- Sending emails or notifications
- Publishing packages or deployments
- Modifying production configurations

### Backup Strategies

Offer appropriate backup based on context:
- Database: Export affected rows/tables before modification
- Files: Copy to backup location before deletion
- API state: Document current state before changes
- Configurations: Snapshot current settings

## Skill Enhancement

### When to Enhance Existing Skills

- User reports the skill missed an edge case
- New patterns emerge that fit the skill's domain
- Integration opportunities expand
- Feedback indicates needed improvements

### Enhancement Process

1. Read the existing skill thoroughly
2. Identify what needs to change
3. Propose the enhancement to the user
4. Make targeted updates (don't rewrite unnecessarily)
5. Test the enhanced skill

## Additional Resources

### Reference Files

- **`references/feedback-patterns.md`** - Detailed patterns for integrating user feedback
- **`references/safety-protocols.md`** - Comprehensive irreversible action handling
- **`references/skill-templates.md`** - Templates for common skill types

### Examples

- **`examples/localization-skill.md`** - Example skill for database-backed localization
