# Skill Development Notes

## Iterative Skill Building Prompt

Use this prompt when working with an agent to build new skills:

```
I want to build a new skill called [SKILL_NAME]. The description is: "[DESCRIPTION]"

Let's work on this iteratively following the skill best practices at https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices.md

Don't do anything without first clarifying the intent with me, and ask me lots of clarifying questions.

Initial context:
- Purpose: [What this skill should accomplish]
- When to use: [When agents should invoke this skill]
- Related skills: [List any related skills that might be referenced]

Let's start by:
1. Clarifying the scope and structure
2. Identifying what sections the skill should have
3. Determining if we need resource files
4. Understanding any examples or patterns to include

Please ask me clarifying questions to understand:
- The exact scope and boundaries of this skill
- What information agents need before using the skill
- The step-by-step process the skill should guide
- Whether we need separate resource files for detailed guidelines
- What good/bad examples would be helpful
- How this skill integrates with other skills
```

## Skills Checklist

### Fully Implemented Skills

- [x] building-blocks - Complete with JS and CSS guidelines, enforces CDD prerequisites
- [x] docs-search - Search aem.live doc and blogs
- [x] block-collection-and-party - Search Block Collection and Block Party for reference implementations
- [x] content-driven-development - Complete with 3-phase process, find-block-content script, orchestrates other skills

### Skills Needing Full Implementation

- [ ] **content-modeling**
  - Description: "Create effective content models for your blocks that are easy for authors to work with. Use this skill anytime you are building new blocks, making changes to existing blocks that modify the initial structure authors work with."
  - Currently: Mentioned but not created
  - Should cover: Author experience, content structure patterns, when to split vs combine content


- [ ] **testing-blocks** (formerly testing-skill-tbd)
  - Description: Guide for writing unit tests for AEM blocks. Use after implementing block functionality.
  - Currently: Mentioned in building-blocks but not created
  - Should cover: What to test, what not to test, testing patterns, mocking strategies

### Future Skills to Consider

- [ ] **performance-optimization** - Optimizing blocks for LCP, CLS, etc.
- [ ] **accessibility** - Ensuring blocks meet accessibility standards
- [ ] **debugging** - Common debugging techniques for AEM blocks
- [ ] **deployment** - PR process, testing in production, rollback strategies

## Testing Skills Effectively

Ideas for tasks to validate skills are working:

### Testing building-blocks skill
- **Simple block**: "Create a testimonial block that displays a quote, author name, and optional author image"
- **Block with variants**: "Create a card block with 'horizontal' and 'vertical' variants"
- **Block requiring DOM transformation**: "Create a tabs block that converts a list into clickable tabs with content panels"
- **Block with dynamic content**: "Create a blog roll block that fetches and displays recent posts"
- **Modify existing block**: "Add a 'compact' variant to the quote block"

### Testing content-driven-development skill
- "I want to create a new hero block but I don't have content yet - walk me through CDD"
- "Help me understand the content model for a pricing table block"
- "I have content at /test/sample-page - let's build a block for it"

### Testing content-modeling skill
- "What's a good content model for a FAQ accordion?"
- "I want authors to create product cards - help me design the content structure"
- "Should this be one block with variants or multiple blocks?"

### Testing block-collection-and-party skill
- "Find examples of carousel/slider blocks I can reference"
- "Are there any existing navigation patterns in the block collection?"
- "Show me examples of blocks that use intersection observer"

### Testing docs-search skill
- "How does block decoration work in AEM Edge Delivery?"
- "What are the performance implications of eager vs lazy block loading?"
- "How do I use metadata in my blocks?"

### Testing testing-blocks skill
- "Write unit tests for the quote block"
- "What should I test in a block that fetches external data?"
- "How do I mock DOM elements for block testing?"

### Integration Testing (multiple skills)
- "Build a complete feature carousel block from scratch" (should use: content-modeling → content-driven-development → block-collection-and-party → building-blocks → testing-blocks)
- "I need a new content type for case studies with a custom block" (tests full workflow)
- "Improve the performance of the existing hero block" (performance-optimization + building-blocks)

## Topics Needing Coverage

### Local Dev Server Usage

**Issue:** Agents need to know how to use the local dev server for testing and development.

**Current Coverage:**
- ✅ `content-driven-development` skill mentions restarting with `--html-folder drafts` for local HTML testing
- ❌ Starting the dev server initially not covered
- ❌ Accessing local pages during development not covered
- ❌ When to restart the server (beyond drafts folder use case) not covered
- ❌ Background vs. foreground execution not covered

**Options:**
1. Create a dedicated skill for local dev server usage
2. Add a section to AGENTS.md/CLAUDE.md with basic commands and workflow

**Key information still needing coverage:**
- Starting the dev server: `npx -y @adobe/aem-cli up --no-open --forward-browser-logs`
- Accessing local pages in browser during development (http://localhost:3000)
- When to restart the server (code changes don't require restart, config changes might)
- Background vs. foreground execution strategies

**Decision needed:** Skill or documentation section? (Likely CLAUDE.md since it's basic tooling)

### Raising Pull Requests

**Issue:** Agents need guidance on when and how to raise PRs.

**Options:**
1. Create a dedicated skill (deployment skill?)
2. Add a section to AGENTS.md/CLAUDE.md with PR guidelines

**Key information to cover:**
- When to raise a PR vs. continue iterating
- PR description best practices
- What to include in PR (code + tests + docs reminder)
- Review process expectations
- Branch naming conventions

**Decision needed:** Skill or documentation section?

**Initial thought:** This seems like documentation in AGENTS.md/CLAUDE.md is sufficient since Claude Code has built-in PR functionality.

### Review Old AGENTS.md

**Action item:** After completing the 3 remaining skills (content-driven-development, content-modeling, testing-blocks), review the old AGENTS.md at https://raw.githubusercontent.com/adobe/aem-boilerplate/dd12ed29a04e807673240a34acb95331ca6f82a5/AGENTS.md to ensure we haven't missed any important information that should be in our skills or documentation.

## Cross-Skill Integration Ideas

### CDD Content as Author Documentation

**Issue:** Content created during Content Driven Development (CDD) can often serve double-duty as author-facing documentation, eliminating the need to create separate documentation.

**Status:** ✅ Addressed

**Implementation:**
- `content-driven-development` skill Step 1.3 now includes "Making Test Content Serve as Author Documentation" subsection
- Provides guidance on when test content IS sufficient vs. when separate docs are needed
- Includes actionable advice on structuring test content to serve both purposes
- Covers appropriate locations for different authoring systems (Sidekick Library, DA Library, etc.)
- Asks user explicitly if test content should serve as author documentation
- `building-blocks` skill step 7 maintains comprehensive guidance on author documentation needs

**Key points covered:**
- ✅ When test content is sufficient as author documentation
- ✅ When separate author documentation is needed
- ✅ How to structure test content to serve both purposes
- ✅ Where to place content for different authoring systems
- ✅ Explicit prompt to ask user about documentation approach

**Cross-references:**
- CDD Step 1.3 guides content creation with documentation in mind
- Building-blocks step 7 handles documentation requirements during implementation
- Both skills now work together to avoid redundant documentation work
