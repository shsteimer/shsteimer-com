# Why Content-First TDD

Content-Driven TDD combines two ideas: the content-first philosophy of CDD and the discipline of test-driven development. Neither is new. The combination addresses a specific problem in EDS block development.

## The Problem

EDS blocks are stable for months, but when they change, structural changes break JavaScript test assertions. Traditional test suites have spiky maintenance costs — disproportionate to the value they provide for code that changes rarely. Browser validation is where truth lives, but ad-hoc browser testing doesn't leave durable artifacts behind.

## Content as Contract

The content model defines a **contract between authors and developers**:
- Authors promise to structure content in a specific way
- Developers promise that structure will render correctly

Breaking this contract has consequences: existing pages break, authors must rework content, trust erodes. Content-Driven TDD makes this contract explicit through prose specs and test fixtures before code is written.

## Why Content First

Content-first development isn't extra work — it's a multiplier.

**Code-first approach:**
1. Write code based on assumptions (fast)
2. Discover assumptions were wrong (slow)
3. Rewrite code to match reality (slow)
4. Create test content to validate (slow)
5. Fix bugs revealed by real content (slow)

**Content-first approach:**
1. Find or create content based on reality (moderate)
2. Write code against real content (fast)
3. Test continuously with known content (fast)
4. Ship with confidence (fast)

## Why TDD for Blocks

Agents work well with red-green-refactor loops. The discipline prevents:
- Writing code that "looks right" but doesn't match the authoring contract
- Building all the code at once and then debugging multiple failures simultaneously
- Skipping edge cases because they're tedious to test manually

But traditional test suites don't justify their maintenance cost for blocks. The solution: prose specs are durable (zero maintenance when idle), Playwright scripts are session-scoped (regenerated fresh each session rather than maintained). Session-scoped does not mean optional — every change must be browser-verified through Playwright. The scripts just aren't committed to git.

## Author Needs Come First

Authors are the primary users of the structures we create. Content models must be:
- **Intuitive**: Authors understand what goes where without training
- **Easy to work with**: Creating content feels natural
- **Forgiving**: Common mistakes are easy to spot and fix
- **Flexible**: Authors have room for creativity within structure

This often means more complex decoration code. Developer convenience is secondary to author experience.

## The TDD Mindset for Blocks

Traditional TDD tests implementation. Content-Driven TDD tests behavior through the authoring contract:

- "Block renders 3 cards" survives a DOM refactor
- `.querySelectorAll('.card').length === 3` doesn't

Prose assertions describe what a human would notice looking at the page. This is the right level of abstraction for blocks — detailed enough to catch regressions, abstract enough to survive refactors.

## Lifecycle

1. **Build**: Write spec + fixtures, TDD loop, ship block. Delete Playwright scripts, keep spec + fixtures.
2. **Idle**: Block unchanged for months. Spec and fixtures sit with zero maintenance cost. Nothing to rot — it's prose and HTML.
3. **Change**: Block gets modified. Read existing spec, reconcile fixtures against real pages, generate fresh Playwright scripts, verify current behavior, modify block and spec as needed.
4. **Regression sweep**: After global changes (CSS refactor, aem-lib update), read all specs, generate Playwright scripts, run them, report results. Triage tool, not CI gate.
