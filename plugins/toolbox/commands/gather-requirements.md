---
description: Guided requirements gathering for project planning with iterative questioning
---

## Context

You are entering the Planning & Documentation phase (Phase 3) of the project workflow pipeline. Your task is to conduct thorough, iterative requirements gathering until there are ZERO gaps in understanding across the entire development lifecycle.

## Process

### Round 1: Mandatory Baseline Questions

Ask ALL of the following in a single, structured message. Do not skip any:

1. **Project Overview:** What is this project? Describe it in 1-3 sentences.
2. **Problem Statement:** What specific problem does this project solve? Who experiences this problem?
3. **Target Users:** Who will use this? (end users, developers, internal team, public)
4. **Core Features:** What are the absolute must-have features? List them.
5. **Nice-to-Have Features:** What features would be good but are not essential?
6. **Technical Constraints:** Are there required technologies, languages, frameworks, or platforms?
7. **Integration Requirements:** Does this need to integrate with any existing systems, APIs, or services?
8. **Deployment Target:** Where will this run? (web, mobile, desktop, server, cloud, on-premise)
9. **Security & Compliance:** Are there security requirements, data privacy concerns, or regulatory compliance needs?
10. **Performance Requirements:** Are there specific performance targets? (response time, throughput, concurrent users)
11. **Success Criteria:** How will you measure whether this project is successful?
12. **Known Risks:** Are there any known risks, challenges, or uncertainties?

Present these as a numbered list using the AskUserQuestion tool or direct output. Wait for the user's complete response before proceeding.

### Round 2+: Contextual Follow-Up Questions

Based on the user's answers, generate follow-up questions to close gaps. Use these patterns to identify what to ask:

**For each core feature mentioned:**
- What are the specific user interactions and flows?
- What happens on error or edge cases?
- Are there different behaviors for different user roles or permissions?
- What data does this feature create, read, update, or delete?

**For each integration mentioned:**
- What is the data format? (JSON, XML, GraphQL, etc.)
- What authentication method does it use?
- Is there a sandbox or test environment?
- What is the expected data volume and frequency?
- What happens if the integration is unavailable?

**For each technical constraint:**
- Why this specific technology? (understanding the "why" may reveal flexibility)
- What version?
- Are there upgrade plans or version locks?

**For deployment targets:**
- What is the expected scale at launch? In 6 months? In 1 year?
- Who manages infrastructure and deployments?
- What is the CI/CD situation? (existing pipeline, new setup needed)
- Is there a staging environment?
- What is the rollback strategy?

**For security requirements:**
- What data classification levels exist? (public, internal, confidential, PII)
- Are there audit logging requirements?
- What authentication and authorization model? (OAuth, JWT, RBAC, etc.)
- Are there data retention or deletion requirements?

**General probing questions (ask when relevant):**
- Are there existing designs, wireframes, mockups, or prototypes?
- Is there an existing codebase this builds on or replaces?
- What is the team structure? (solo developer, small team, large org)
- Are there deadlines or milestones tied to external commitments?
- What documentation already exists?
- Are there similar products or competitor systems to reference?
- What does the data model look like at a high level?
- Are there accessibility requirements?
- What browsers, devices, or OS versions must be supported?
- Is there a branding or design system to follow?
- What monitoring and observability is needed?
- How should errors be reported to users vs logged internally?

### Determining When to Ask More Questions

After each round, evaluate:

- Are there any features where you cannot describe the full user flow?
- Are there integration points without defined error handling?
- Is the deployment strategy specific enough to write an implementation plan?
- Are security requirements concrete and actionable?
- Can you define a testing strategy from current requirements?
- Does every feature have clear, testable acceptance criteria?
- Are all dependencies between features identified?
- Are there any assumptions you are making that haven't been confirmed?

If ANY answer is no, ask another round of targeted questions.

### Completion Criteria

Stop asking questions only when ALL of the following are true:

1. Every core feature has defined user flows, data flows, and edge case handling
2. All integrations have defined formats, auth, error handling, and fallback behavior
3. The deployment strategy is specific enough to create an implementation plan
4. Security requirements are concrete and actionable
5. A testing strategy can be fully defined from the requirements
6. No feature has ambiguous or untestable acceptance criteria
7. All dependencies between features are identified and documented
8. No assumptions remain unconfirmed

## Output

When all rounds are complete:

1. Summarize the gathered requirements and confirm with the user that nothing is missing
2. Create `.claude-docs/planning/requirements.md` — structured requirements document organized by feature area
3. Create feature files in `.claude-docs/features/00-draft/` — one `.md` file per feature using the feature file template defined in the master instructions (`CLAUDE.md`)
4. Note any areas that need delegated research and flag them for Phase 1 (or link to existing research if it already exists)
5. Proceed to create the remaining planning documents:
   - `.claude-docs/planning/development-plan.md`
   - `.claude-docs/planning/testing-scope.md`
   - `.claude-docs/planning/implementation-plan.md`
   - Mermaid diagrams in `.claude-docs/planning/diagrams/`
