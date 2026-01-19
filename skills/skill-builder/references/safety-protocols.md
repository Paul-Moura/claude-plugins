# Irreversible Action Safety Protocols

This reference provides comprehensive guidance for identifying and handling actions that cannot be easily undone.

## Philosophy

Even when Claude has permission to perform an action, permission does not equal prudence. The ability to do something does not mean it should be done without consideration. For actions with permanent consequences, additional safeguards protect the user from unintended outcomes.

## Identifying Irreversible Actions

### Category 1: Database Operations

**Irreversible:**
- INSERT (creates data that may have side effects)
- UPDATE (overwrites previous values)
- DELETE (removes data)
- DROP (destroys structure)
- TRUNCATE (removes all data)
- Schema migrations that drop columns or tables

**Reversible:**
- SELECT (read-only)
- Creating new tables/columns (can be dropped)
- Adding indexes (can be removed)

**Nuance:** Even INSERT can be "reversed" by DELETE, but:
- Auto-increment IDs will have gaps
- Triggers may have fired
- Audit logs will show the activity
- Related systems may have reacted

### Category 2: File System Operations

**Irreversible:**
- Deleting files outside git tracking
- Overwriting files without backup
- Deleting directories recursively
- Modifying binary files

**Reversible:**
- Changes to git-tracked files (can revert)
- Creating new files (can delete)
- Changes in working directory (can stash/reset)

### Category 3: External API Calls

**Irreversible:**
- POST/PUT/PATCH/DELETE to external services
- Sending emails or notifications
- Publishing content
- Triggering webhooks
- Payment processing
- User account modifications

**Reversible:**
- GET requests (read-only)
- Idempotent operations with rollback capability

### Category 4: Cloud and Infrastructure

**Irreversible:**
- Deleting cloud resources (VMs, databases, storage)
- Modifying production configurations
- Deploying to production
- Changing DNS records
- Modifying security groups/firewall rules
- Scaling down (may lose data on terminated instances)

**Reversible:**
- Creating new resources (can be deleted)
- Staging/development deployments
- Read-only cloud API calls

### Category 5: Communication

**Irreversible:**
- Sending emails
- Posting to social media
- Publishing to package registries (npm, PyPI)
- Sending Slack/Teams messages
- Creating public GitHub issues/PRs
- Notifying users or customers

### Category 6: Security-Sensitive

**Irreversible:**
- Rotating secrets or API keys (old ones stop working)
- Revoking access tokens
- Deleting user accounts
- Modifying permissions
- Certificate operations

## The Safety Protocol

### Step 1: Identification

Before executing any action, evaluate:
- Does this modify state outside the current codebase?
- Could this action affect users, customers, or external systems?
- Is there a simple "undo" command?
- Would I need a backup to restore the previous state?

If any answer suggests irreversibility, proceed with the protocol.

### Step 2: Warning

Clearly communicate:

```
⚠️ This action cannot be easily undone.

I'm about to [specific action description].

This will [explain the impact]:
- [Specific change 1]
- [Specific change 2]
- [etc.]
```

### Step 3: Backup Offer

Propose appropriate backup:

```
Would you like me to create a backup first?

I can:
- [Specific backup option 1]
- [Specific backup option 2]

Or proceed without backup if you're confident.
```

### Step 4: Explicit Confirmation

Require clear confirmation:

```
Please confirm you want me to proceed with [action] by saying "yes" or "proceed".
```

Do not proceed on:
- Ambiguous responses ("sure", "I guess", "maybe")
- Topic changes
- Silence

### Step 5: Execution with Logging

When proceeding:
- Log what was done
- Note the timestamp
- Record any identifiers (IDs, keys, etc.)
- Save backup location if one was created

## Backup Strategies by Type

### Database Backups

**Before UPDATE/DELETE:**
```sql
-- Export affected rows first
SELECT * FROM table WHERE [conditions] INTO OUTFILE 'backup.csv';
-- Or for smaller datasets, just show the current state
```

**Before schema changes:**
```sql
-- Document current schema
DESCRIBE table_name;
-- Export table definition
SHOW CREATE TABLE table_name;
```

### File Backups

**Before deletion:**
```bash
# Copy to backup location
cp -r /path/to/file /path/to/backups/file.bak.$(date +%Y%m%d_%H%M%S)
```

**Before overwrite:**
```bash
# Create timestamped backup
cp original.file original.file.bak.$(date +%Y%m%d_%H%M%S)
```

### API State Backups

**Before modification:**
- GET the current state
- Save the response to a file
- Note the endpoint and timestamp

### Configuration Backups

**Before changes:**
- Export current configuration
- Screenshot if web interface
- Document current settings in detail

## Example Interactions

### Example 1: Database Update

**Claude:** I'm ready to update the user preferences for 150 users to enable the new feature.

⚠️ This action cannot be easily undone.

I'll be running:
```sql
UPDATE user_preferences SET new_feature_enabled = true WHERE account_type = 'premium';
```

This will modify 150 rows in the user_preferences table.

Would you like me to first export the current values of these rows so we can restore them if needed?

**User:** Yes, back it up first.

**Claude:** I'll export the current state first, then proceed with the update.

### Example 2: File Deletion

**Claude:** I found 47 log files in `/var/logs/app/` older than 30 days that match your cleanup criteria.

⚠️ This action cannot be easily undone.

These files are not tracked by git and will be permanently deleted:
- 47 files totaling 2.3 GB
- Oldest: 2024-11-15
- Newest: 2024-12-16

Would you like me to:
1. Move them to a backup directory first
2. Compress them to an archive before deleting
3. Just list them so you can review
4. Proceed with deletion

**User:** Compress them first, then delete.

**Claude:** I'll create `/var/logs/app/archived_logs_20250116.tar.gz` with these files, then delete the originals.

### Example 3: API Modification

**Claude:** I'm ready to update the webhook URL in your Stripe configuration.

⚠️ This action cannot be easily undone.

Changing the webhook URL will:
- Immediately route all Stripe events to the new endpoint
- The old endpoint will stop receiving events
- Any in-flight events during the switch may be affected

Current URL: https://old.example.com/webhook
New URL: https://new.example.com/webhook

I recommend:
1. Ensuring the new endpoint is live and tested
2. Noting the current URL in case we need to revert

Please confirm you want me to proceed with this change.

## Edge Cases

### Partially Reversible Actions

Some actions are technically reversible but with consequences:
- Creating a user (can delete, but they may have already logged in)
- Sending a test email (can't unsend, but impact is low)
- Publishing a draft (can unpublish, but subscribers may have seen it)

For these, use judgment:
- Low-impact: Proceed with lighter warning
- High-impact: Full protocol

### Cascading Effects

Watch for actions that trigger other irreversible actions:
- Deleting a user that cascades to their data
- Updating a foreign key that affects child records
- Deploying code that runs database migrations

Warn about the full impact, not just the direct action.

### Time-Sensitive Situations

If the user indicates urgency:
- Still warn, but be concise
- Offer quick backup options
- Don't skip confirmation entirely

## When NOT to Warn

Avoid warning fatigue by not flagging:
- Normal git operations (commits, pushes to feature branches)
- File edits within git-tracked directories
- Read-only operations
- Local development actions
- Actions with obvious undo (IDE changes, etc.)
- Actions the user explicitly said don't need confirmation

## Recording Safety Preferences

When users adjust safety preferences, record them:

**More caution:**
"Always ask before any database modification, even SELECT with LIMIT."

**Less caution:**
"Don't warn me about file deletions in the /tmp directory."

Store these in the appropriate CLAUDE.md based on scope.
