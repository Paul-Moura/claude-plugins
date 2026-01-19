# Example: Localization Database Skill

This example demonstrates how the skill-builder would create a skill for managing database-backed localization, based on a real use case.

## The Opportunity Identified

**Pattern Observed:**
During code refactoring to add localization support, Claude was:
1. Refactoring code to use translation keys
2. Generating a list of namespace, key, description, en translation, es translation
3. Providing this list to the user to manually enter into a database

**Skill Proposed:**
"Hey, it looks like we have an opportunity to give me a skill to make this easier for you.

I noticed we're doing localization refactoring, and after updating the code, I'm providing you with translation entries to manually add to the database.

I could create a skill that allows me to not only refactor the code to implement localization, but also directly add the entries to the database if they don't exist. I could also look up existing keys to reuse and prevent cluttering the database.

Do you want to create this skill?"

## Requirements Gathered

**Q: What database and tables are involved?**
A: PostgreSQL, `translations` table with columns: namespace, key, description, en, es, created_at, updated_at

**Q: How should I connect to the database?**
A: We have an MCP server for database access, or you can use the API endpoint at `/api/admin/translations`

**Q: Should I always check for existing keys?**
A: Yes, search for similar keys by keyword matching before creating new ones

**Q: Any confirmation needed?**
A: Show me what you'll add before doing it, but you don't need to ask for each one individually

## The Resulting Skill

```markdown
---
name: Localization Manager
description: This skill should be used when the user asks to "add translations", "localize this component", "refactor for i18n", "add localization", or when refactoring code to use translation keys. Handles both code changes and database entries.
version: 0.1.0
---

# Localization Manager

This skill manages the complete localization workflow: refactoring code to use translation keys and managing the translation database entries.

## Workflow

### Step 1: Code Refactoring

When localizing a component or file:
1. Identify all user-facing strings
2. Determine appropriate namespace (usually component/feature name)
3. Generate semantic keys (e.g., `button.submit`, `error.required_field`)
4. Replace strings with translation function calls

### Step 2: Key Reuse Check

Before creating new translation entries:
1. Query existing keys in the same namespace
2. Search for similar keys by keyword
3. Present reusable options to user
4. Only create new keys when no suitable match exists

### Step 3: Database Entry

After code refactoring is complete:
1. Compile list of new translation entries needed
2. Present summary for user review:
   - Namespace
   - Key
   - Description
   - English text
   - Spanish text (or flag for later translation)
3. Upon approval, add entries to database
4. Report what was added

## Database Schema

Table: `translations`
- namespace (varchar): Feature/component grouping
- key (varchar): Unique identifier within namespace
- description (varchar): Context for translators
- en (text): English translation
- es (text): Spanish translation
- created_at (timestamp)
- updated_at (timestamp)

Primary key: (namespace, key)

## API Endpoints

### Check Existing Keys
GET /api/admin/translations?namespace={ns}&search={keyword}

### Add Translation
POST /api/admin/translations
Body: { namespace, key, description, en, es }

### Batch Add
POST /api/admin/translations/batch
Body: { entries: [{ namespace, key, description, en, es }, ...] }

## Example Interaction

User: "Localize the LoginForm component"

Claude:
1. Reads LoginForm.tsx
2. Identifies strings: "Email", "Password", "Sign In", "Forgot password?", "Invalid credentials"
3. Checks existing keys in `auth` namespace
4. Finds "auth.email" and "auth.password" already exist
5. Proposes:

"I've refactored LoginForm.tsx to use translation keys. Here's what I'll add to the database:

| Namespace | Key | EN | ES | Status |
|-----------|-----|----|----|--------|
| auth | email | Email | - | REUSING EXISTING |
| auth | password | Password | - | REUSING EXISTING |
| auth | button.sign_in | Sign In | Iniciar sesión | NEW |
| auth | link.forgot_password | Forgot password? | ¿Olvidaste tu contraseña? | NEW |
| auth | error.invalid_credentials | Invalid credentials | Credenciales inválidas | NEW |

Should I add the 3 new entries to the database?"

User: "Yes"

Claude adds entries, confirms completion.

## Safety Considerations

- Always show entries before adding (user review step)
- Check for duplicates to prevent errors
- Database operations are additive (INSERT), not destructive
- If unsure about Spanish translation, flag for human review
```

## What This Example Demonstrates

1. **Proactive identification** of a repetitive manual handoff
2. **Guided requirements gathering** to understand the system
3. **Proper skill structure** with clear workflow steps
4. **Integration with external systems** (database via API)
5. **Safety consideration** (review before adding)
6. **Reuse optimization** (checking for existing keys)
