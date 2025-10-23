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

- [x] building-blocks - Complete with JS and CSS guidelines
- [x] docs-search - Search aem.live doc and blogs
- [x] block-collection-and-party - Search Block Collection and Block Party for reference implementations

### Skills Needing Full Implementation

- [ ] **content-driven-development**
  - Description: "Apply a Content Driven Development process to AEM Edge Delivery Services development. Use for any and all development tasks, including building new blocks, modifying existing blocks, making changes to core decoration functionality, etc."
  - Currently: Has basic structure, needs full process definition
  - Related to: building-blocks, content-modeling

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

**Options:**
1. Create a dedicated skill for local dev server usage
2. Add a section to AGENTS.md/CLAUDE.md with basic commands and workflow

**Key information to cover:**
- Starting the dev server: `npx -y @adobe/aem-cli up --no-open --forward-browser-logs`
- Using `--html-folder drafts` flag for static HTML testing
- Accessing local pages during development
- When to restart the server
- Background vs. foreground execution

**Decision needed:** Skill or documentation section?

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

**Current State:**
- `building-blocks` skill mentions author documentation should be created/updated (step 7)
- `content-driven-development` skill focuses on creating content for testing purposes
- These two purposes overlap but aren't explicitly connected

**Future Improvement:**
Figure out how to represent this connection in our skills library so that:
1. When using CDD, agents recognize that test content can become author docs
2. Agents guide users to structure test content in a way that serves both purposes
3. The content is placed in appropriate locations (e.g., `/drafts/library/{block-name}` or Sidekick Library)
4. Cross-references between `content-driven-development` and `building-blocks` skills are clear

**Considerations:**
- Not all test content makes good author documentation (may be too technical or minimal)
- Some projects may need more formal author documentation beyond test examples
- The location of the content matters (test vs. library vs. docs paths)
- Different authoring systems (Sidekick Library, DA Library, etc.) may have different needs

**Action Items:**
- [ ] When fleshing out `content-driven-development` skill, consider how to address this
- [ ] Update cross-references between skills to highlight this opportunity
- [ ] Provide guidance on when test content is sufficient vs. when separate author docs are needed
