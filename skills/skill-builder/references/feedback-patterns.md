# Feedback Integration Patterns

This reference provides detailed patterns for capturing, categorizing, and storing user feedback to improve Claude's behavior over time.

## Feedback Categories

### 1. Corrections

User indicates Claude did something wrong or suboptimal.

**Indicators:**
- "Actually, you should..."
- "No, that's not right..."
- "Don't do X, do Y instead"
- "That's not how we do it here"

**Action:**
- Acknowledge the correction
- Understand the correct behavior
- Determine if this applies broadly or specifically
- Store in appropriate location

### 2. Preferences

User expresses how they want things done.

**Indicators:**
- "I prefer..."
- "Always do X when..."
- "I like it when you..."
- "Can you remember to..."

**Action:**
- Clarify the preference if ambiguous
- Determine scope (this project, all projects, specific situations)
- Store as a guideline, not a hard rule

### 3. Safety Rules

User establishes boundaries or confirmation requirements.

**Indicators:**
- "Always ask before..."
- "Never do X without..."
- "Make sure to confirm..."
- "Don't automatically..."

**Action:**
- Treat as high-priority
- Store prominently in relevant location
- Apply consistently going forward

### 4. Domain Knowledge

User provides information about their systems, processes, or conventions.

**Indicators:**
- "Our API works like..."
- "The database schema is..."
- "We follow this convention..."
- "Here's how our deployment works..."

**Action:**
- Document thoroughly
- Ask clarifying questions
- Store in project or skill references

## Determining Storage Location

### Decision Tree

```
Is this feedback about a specific skill?
├── Yes → Store in that skill's references/ or SKILL.md
└── No → Continue...

Is this feedback project-specific?
├── Yes → Store in project's CLAUDE.md or .claude/
└── No → Continue...

Is this a safety rule or global preference?
├── Yes → Store in ~/.claude/CLAUDE.md or relevant global skill
└── No → Ask the user for clarification
```

### Storage Locations Explained

**Project CLAUDE.md** (`/path/to/project/CLAUDE.md`)
- Project coding conventions
- Team-specific patterns
- Codebase architecture notes
- Project-specific safety rules

**Project .claude/ directory** (`/path/to/project/.claude/`)
- Project-specific skills
- Local configurations
- Project memory files

**Global CLAUDE.md** (`~/.claude/CLAUDE.md`)
- Cross-project preferences
- User's coding style
- Global safety rules
- Tool preferences

**Skill references** (`skill-name/references/`)
- Skill-specific improvements
- Edge cases for that skill
- Enhanced instructions

## Feedback Capture Workflow

### Step 1: Recognize Feedback

Listen for signals that the user is providing important information:
- Explicit corrections or preferences
- Implicit patterns in their requests
- Frustration or repetition indicating a gap

### Step 2: Clarify if Needed

Ask targeted questions:
- "Should this apply to all projects or just this one?"
- "Is this a hard rule or a preference?"
- "Are there exceptions to this?"

### Step 3: Propose Storage

Tell the user where you plan to store it:
- "I'll add this to the project's CLAUDE.md since it's specific to this codebase."
- "This seems like a global preference, so I'll note it in your user-level settings."

### Step 4: Store and Confirm

After storing:
- Summarize what was recorded
- Explain when it will apply
- Offer to adjust if the user disagrees

## Example Scenarios

### Scenario 1: Project Convention

**User:** "In this project, we always use `snake_case` for database columns."

**Action:**
1. Recognize: Domain knowledge, project-specific
2. Clarify: "Got it. Should I also use snake_case for the TypeScript types that map to these columns, or just the actual column names?"
3. Store: Add to project's CLAUDE.md
4. Confirm: "I've noted that database columns in this project use snake_case."

### Scenario 2: Global Safety Rule

**User:** "Whenever you're about to delete files that aren't in git, warn me first."

**Action:**
1. Recognize: Safety rule, global scope
2. Clarify: Already clear
3. Store: Add to global CLAUDE.md or safety-protocols reference
4. Confirm: "I've added this as a safety rule. Before deleting any files not tracked by git, I'll warn you and ask for confirmation."

### Scenario 3: Skill Improvement

**User:** "When you're doing localization, you should also check if there's a similar existing key we could reuse."

**Action:**
1. Recognize: Skill improvement for localization skill
2. Clarify: "Should I always suggest reusing similar keys, or just flag them as options?"
3. Store: Update the localization skill's SKILL.md or references
4. Confirm: "I've enhanced the localization skill to check for similar existing keys before creating new ones."

## Feedback Format Templates

### For CLAUDE.md Files

```markdown
## Preferences

- [Category]: [Preference description]
  - Context: [When this applies]
  - Added: [Date]

## Safety Rules

- **[Rule name]**: [Rule description]
  - Trigger: [When to apply this rule]
  - Action: [What to do]
  - Added: [Date]

## Domain Knowledge

### [System/Area Name]
[Description of how it works, conventions, etc.]
```

### For Skill References

```markdown
## Learned Improvements

### [Improvement Title]
- **Source**: User feedback on [date]
- **Situation**: [When this applies]
- **Behavior**: [What to do differently]
- **Example**: [Concrete example]
```

## Handling Conflicting Feedback

When new feedback conflicts with existing stored information:

1. **Identify the conflict**: "I have a note that says X, but you're now saying Y."
2. **Ask for clarification**: "Should I update my understanding, or is this a different situation?"
3. **Update appropriately**: Replace old info or add nuance for different contexts
4. **Confirm the change**: "I've updated my notes to reflect [new understanding]."
