---
name: content-driven-tdd
description: Test-driven development workflow for AEM Edge Delivery Services. Use for ALL code changes that affect rendering or behavior - new blocks, block modifications, CSS styling, bug fixes, core functionality (scripts.js, styles, etc.), or any JavaScript/CSS work. Combines content-first philosophy with a red-green-refactor TDD loop using prose specs, committed test fixtures, and session-scoped Playwright scripts that verify every change in a real browser.
---

# Content-Driven TDD

You are an orchestrator of a test-driven development workflow for AEM Edge Delivery Services. This workflow combines the content-first philosophy of CDD with a red-green-refactor TDD loop: prose specs describe expected behavior, committed test fixtures exercise the authoring contract, and Playwright scripts verify every change in a real browser.

## Philosophy

Content-first development and TDD are not competing ideas. The content model defines valid inputs, test fixtures instantiate them, prose assertions describe expected rendering, and code makes them pass. Straight line from model to content to assertions to code.

Three artifact types — two committed and one session-scoped:

- **Prose specs** (`/specs/<block>/*.md`) — markdown files describing the block's expected behavior in plain language. Human-readable, survives idle periods without maintenance, doubles as block documentation. Committed to git.
- **Test fixtures** (`/drafts/fixtures/<block>/*.plain.html`) — EDS-format authored markup exercising the authoring contract. Valid cases, edge cases, invalid input. Served by the local dev server. Also documents valid authoring patterns for content editors. Committed to git.
- **Playwright scripts** (`/test/tmp/`) — generated fresh from the prose spec each session. Mix of coded assertions (DOM queries for structural checks) and screenshots/a11y snapshots (for visual/layout checks you evaluate). Not committed to git, but **always written and run** — browser verification is not optional. The scripts are session-scoped (regenerated each time rather than maintained long-term), not skippable.

Read `references/philosophy.md` if:
- The user asks "why" questions about content-first or TDD approach
- You need to understand reasoning behind design decisions
- You're unsure whether to prioritize author vs developer experience

## Workflow

```
1. Start dev server
2. Analyze & plan → acceptance criteria
3. Design content model → table structure (the authoring contract)
4. Create/find test content → fixtures in /drafts/fixtures/<block>/
5. Reconcile → sync fixtures against real content patterns
6. TDD loop → [write assertion → Playwright script → red → code → green → refactor]*
7. Regression check → verify real pages aren't broken
8. Lint & test → npm run lint, npm test
9. Final validation → acceptance criteria review
10. Ship it → PR with preview link
```

---

## Step 1: Start Dev Server

Start the dev server in the background:

```bash
aem up --html-folder drafts --no-open --forward-browser-logs
```

**Do not hardcode port 3000.** The AEM CLI automatically selects a port — port 3000 when running from the main repo, a deterministic different port when running from a git worktree (based on the worktree name). Read the actual port from the startup output. It will appear in a line like:

```
[aem-sdk] Server running at http://localhost:3331
```

Capture that port and use it for all subsequent `curl` and Playwright commands in this session. Verify the server is up:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:<PORT>/
```

Do not kill or restart any existing dev server process — another agent may be using it.

---

## Step 2: Analyze & Plan

**Invoke:** analyze-and-plan skill

Provide the task description, any screenshots/designs/existing URLs. The skill will guide requirements analysis and define acceptance criteria.

**Confirm with the user** which behaviors matter most before proceeding. Not every visual detail needs an assertion. Focus on the authoring contract, not pixel perfection.

---

## Step 3: Design Content Model

**Skip if:** CSS-only changes that don't affect content structure.

**Invoke:** content-modeling skill

The content model IS the spec. It defines the contract between authors and developers — what inputs are valid, what structure the code expects. Get this right before writing any code or assertions.

---

## Step 4: Create/Find Test Fixtures

**Goal:** end this step with `.plain.html` fixture files in `/drafts/fixtures/<block>/` covering all test scenarios.

### For New Blocks

Create fixture files based on the content model from Step 3:

1. Create `/drafts/fixtures/<block>/` directory
2. Write `.plain.html` files following EDS markup structure
3. Read `references/html-structure.md` for format guidance

A single `.plain.html` can contain multiple instances of the same block with different content, variants, and edge cases — test everything in one page load when it makes sense. Use separate files when contexts would interfere or isolation matters.

Name files descriptively: `basic.plain.html`, `variants.plain.html`, `edge-cases.plain.html`.

4. Validate: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/drafts/fixtures/<block>/basic`

### For Existing Blocks

**Invoke:** find-test-content skill to discover existing pages using the block.

Then proceed to Step 5 (Reconcile) to sync found patterns against fixtures.

### For User-Provided URLs

Validate the URLs load, document them, and create fixture files that replicate the patterns for local testing.

---

## Step 5: Reconcile

**Skip if:** new block with no existing content to reconcile against.

**Do not skip for existing block modifications** — even visual-only or CSS-only changes. You need to know what real authored content looks like before changing how it renders. Reconcile:

- **New patterns found in the wild** → write `.plain.html` fixtures to cover them
- **Edge cases not in real content** → write fixtures for those too
- **Redundant fixture files** → prune (same pattern covered twice)
- **Existing fixtures that no longer match the content model** → update or remove

Multiple block instances can go on one `.plain.html` page to reduce file count. Keep `/drafts/fixtures/<block>/` tidy — reconciliation includes pruning, not just adding.

---

## Step 6: TDD Loop

This is the core build phase. One assertion at a time, red-green-refactor.

### Before Starting: Write the Spec File

Create `/specs/<block>/` directory and a spec file for each fixture. See `references/spec-format.md` for the full format.

```markdown
---
block: <block-name>
fixture: /drafts/fixtures/<block>/basic.plain.html
tags: [layout, responsive]
---

## Tracer bullet

- The block loads and decorates without errors
- The block renders visible content from the fixture
```

Start with a **tracer bullet** — the first assertion proves the path works end-to-end (block loads, decorates, renders something). Then layer on specific behaviors.

### The Loop

For each assertion:

1. **Write one prose assertion** in the spec file
2. **Extend the Playwright script** — add a coded check or screenshot/a11y snapshot for this assertion only
3. **Run it** — expect red (failing)
4. **Write the minimal block code** to make this assertion pass
5. **Run it** — expect green (passing)
6. **Refactor** — clean up, but only when green
7. **Back to step 1** for the next assertion

**Critical rules:**

- **One assertion at a time. No exceptions.** Do not write all assertions upfront then implement. Do not write all spec sections first. Write one assertion, make it pass, then write the next. This is the hardest discipline to maintain — the instinct to plan ahead is strong. Resist it. Each assertion should respond to what you learned from the previous cycle.
- **Never refactor while red.** Get to green first, then clean up.
- **Test behavior, not implementation.** "Block renders 3 cards" survives a refactor. `.querySelectorAll('.card').length === 3` doesn't. Prose assertions describe what the user sees, not DOM structure.
- **Choose evaluation method per assertion and stick with it.** If "columns are side by side" is evaluated via screenshot, use screenshot every time you check that assertion.

### Choosing Assertion Type

For each assertion, pick the right evaluation approach:

**Coded checks** (DOM queries, hard pass/fail) — use for:
- Structural requirements ("block renders N items")
- Content presence ("heading text matches authored content")
- Accessibility ("all images have alt text")
- Interactive behavior ("clicking header expands body")

**Screenshots** — use for:
- Layout ("columns are side by side on desktop")
- Visual appearance ("dark variant has dark background")
- Responsive behavior ("columns stack on mobile")

**A11y snapshots** — use for:
- Semantic structure ("heading hierarchy is correct")
- ARIA attributes and roles
- Focus order and keyboard navigation

### Playwright Script Patterns

Read `references/playwright-patterns.md` for script templates and patterns.

Write scripts to `test/tmp/` (e.g., `test/tmp/test-<block>.js`). This directory is gitignored. Scripts are session-scoped — generated fresh each session rather than maintained long-term — but they are a required part of the workflow. Every assertion must be verified in a real browser. No exceptions. Do not skip writing and running Playwright scripts, even for changes that seem simple.

### When to Use Vitest Instead

Pure functions, data processing, utility methods, API integrations — these get **persistent vitest unit tests** written as part of the TDD loop, not prose assertions. Prose assertions cover rendering and behavior in the browser. Vitest covers logic. Both happen within the same red-green-refactor cycle.

Put vitest tests in `test/` following existing conventions (see `references/unit-testing.md`).

---

## Step 7: Regression Check

**Skip if:** new block with no existing content.

After the TDD loop, verify that real pages using this block aren't broken:

1. Load URLs found in Step 4 (find-test-content results)
2. Take screenshots at desktop and mobile viewports
3. Check for console errors
4. Compare behavior against expectations

For global changes (CSS refactor, aem-lib update), run a broader sweep across multiple blocks.

---

## Step 8: Lint & Test

```bash
npm run lint
```

Fix any issues (`npm run lint:fix` for auto-fixable problems).

```bash
npm test
```

Verify all existing tests pass. If you wrote new vitest unit tests in the TDD loop, they should already be passing.

---

## Step 9: Final Validation

1. Review acceptance criteria from Step 2
2. Load all fixture URLs in browser — check mobile, tablet, desktop
3. Verify no console errors
4. Confirm no visual regressions on existing content

---

## Step 10: Ship It

1. Create feature branch (if not already on one)
2. Stage specific files only — block code, specs, fixtures, any vitest tests
   - **Do commit:** block JS/CSS, `/specs/<block>/` files, `/drafts/fixtures/<block>/` files, vitest tests
   - **Do NOT commit:** Playwright scripts in `test/tmp/` (session-scoped, not maintained), temp files
3. Commit with conventional commit format
4. Push to feature branch
5. Create PR with preview link

**PR description must include:**
- Preview URL: `https://{branch}--{repo}--{owner}.aem.page/{path}`
- If only local fixture content exists, create a draft PR and include next steps for CMS content creation

Read `references/shipping.md` for the full PR template and draft PR workflow.

---

## Related Skills

- **analyze-and-plan** — Step 2, requirements and acceptance criteria
- **content-modeling** — Step 3, authoring contract design
- **find-test-content** — Step 4, discover existing pages using the block
- **block-collection-and-party** — reference implementations during coding
- **code-review** — before shipping, final review

## Reference Files

- `references/philosophy.md` — why content-first + TDD
- `references/html-structure.md` — creating `.plain.html` fixture files
- `references/spec-format.md` — prose spec format and assertion quality guidelines
- `references/playwright-patterns.md` — session-scoped Playwright script templates
- `references/js-guidelines.md` — JavaScript patterns for EDS blocks
- `references/css-guidelines.md` — CSS patterns for EDS blocks
- `references/unit-testing.md` — vitest unit testing for logic-heavy code
- `references/shipping.md` — PR workflow, draft PRs, CMS content handoff
