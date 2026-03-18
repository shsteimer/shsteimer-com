# Prose Spec Format

Spec files live in `/specs/<block>/` and describe expected block behavior in plain language. They are the durable record of what a block should do — human-readable documentation that happens to be testable.

## File Structure

```
/specs/
  hero/
    basic.md          # Core hero behavior
    responsive.md     # Responsive layout assertions
    variants.md       # Variant-specific behavior
  columns/
    layout.md         # Column layout behavior
    edge-cases.md     # Missing content, unusual inputs
```

Name spec files by what they describe, not by test fixture name. One spec file can reference multiple fixtures.

## Format

```markdown
---
block: columns
fixture: /drafts/fixtures/columns/two-col.plain.html
tags: [layout, responsive]
viewport: [desktop, mobile]
---

## Two-column layout

- On desktop (1200px), the block renders 2 columns side by side
- Each column contains its authored content (image, heading, text) in source order
- On mobile (375px), columns stack vertically, first column on top
- Both columns are approximately equal width on desktop

## Dark variant

- The dark variant has a visually dark background
- Text is legible against the dark background
- Links are visible and distinguishable
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `block` | yes | Block name (matches `blocks/<name>/`) |
| `fixture` | yes | Path to the primary test fixture. Can be a single path or an array of paths |
| `tags` | no | Categories for querying (layout, responsive, interactive, a11y, etc.) |
| `viewport` | no | Which viewports to test. Array of: desktop (1200px), tablet (768px), mobile (375px) |

### Fixture References

A spec can reference multiple fixtures:

```yaml
fixture:
  - /drafts/fixtures/columns/two-col.plain.html
  - /drafts/fixtures/columns/three-col.plain.html
```

Or reference a fixture in a specific assertion group:

```markdown
## Edge case: single column (fixture: /drafts/fixtures/columns/edge-cases.plain.html)

- When only one column of content is authored, the block renders it full-width
```

## Spec Size Should Match Change Scope

Not every change needs a deep spec. Match the depth to the work:

- **New block** — full spec: happy path, all variants, edge cases, error states, responsive, a11y
- **Block redesign** — rewrite affected assertions, keep unaffected ones
- **New variant** — add a variant section to the existing spec
- **CSS tweak** — a few assertions covering what changed is correct. A 2-rule CSS change doesn't need 20 assertions.
- **Bug fix** — add an assertion covering the case that was broken, if one doesn't exist

A thin spec for a small change is right-sized, not incomplete.

## Writing Good Assertions

Assertions describe **observable behavior**, not implementation details. They should survive internal refactors.

### Good Assertions

Unambiguous from DOM, a11y tree, or screenshot:

- "Renders 3 columns side by side on desktop"
- "Clicking the accordion heading reveals the body text"
- "Invalid content (row with no image) is not rendered"
- "On mobile, columns stack vertically"
- "The block contains a heading matching the authored text"
- "All images have non-empty alt text"
- "Keyboard focus moves through items in source order"
- "When no posts are available, the block displays an empty state message"
- "When a specific post path is authored, that post's title is displayed"

### Bad Assertions

Require measurement, subjective judgment, or describe code rather than behavior:

- "16px gap between columns" (pixel measurement — fragile)
- "Animation feels smooth" (subjective)
- "Font is 14px Helvetica" (can't determine from screenshot)
- "The `.card` div has class `active`" (implementation detail)
- "The block attempts to fetch featured posts" (describes code, not outcome)

That last one is common and worth flagging: assertions about what code *attempts* or *tries* are not assertions. State the observable outcome instead: "When no featured posts exist, the block falls back to displaying the latest post."

### Gray Area — Make It Concrete

"Cards have a distinct card-like appearance" is too vague to evaluate consistently. Fix it by specifying what you'll look for:

- **Too vague:** "Cards have a distinct card-like appearance"
- **Concrete:** "Each card has a visible border or shadow separating it from the background — check via screenshot"

- **Too vague:** "Image fills its container"
- **Concrete:** "The card image occupies the full width of the card at all viewports — check via screenshot"

- **Too vague:** "Content is visually centered"
- **Concrete:** "The block content appears horizontally centered on the page at desktop viewport — check via screenshot"

The pattern: if it's a visual assertion, say what you'll look for in the screenshot. This makes the evaluation repeatable.

## Edge Cases and Error States

For any block that fetches data or renders dynamic content, include at least one assertion about what happens when things go wrong or content is missing:

- What renders when the fetch returns no results?
- What renders when a required field (image, title, date) is absent?
- What renders when the authored content doesn't match the expected pattern?

These are the assertions most likely to catch real bugs. Don't skip them.

## Checklist Per Assertion

Before writing each assertion, verify:

- [ ] Does it describe behavior, not implementation?
- [ ] Would it survive an internal DOM refactor?
- [ ] Can it be evaluated from a screenshot, a11y snapshot, or DOM query?
- [ ] Is it specific enough that pass/fail is unambiguous?
- [ ] If visual, does it say what to look for in the screenshot?
- [ ] If describing a variant or edge case, does it state the expected outcome (not just "attempts to")?
- [ ] Does it matter to the user or author? (If not, skip it)

## Organizing Specs

Group assertions by concern, not by fixture:

```markdown
## Layout
- ...

## Content
- ...

## Accessibility
- ...

## Responsive
- ...

## Error states
- ...
```

Keep spec files focused. A block with many variants might have:
- `basic.md` — core behavior common to all variants
- `variants.md` — variant-specific assertions
- `responsive.md` — responsive layout (if complex enough to warrant its own file)
- `interactive.md` — click/keyboard/focus behavior

Most blocks need just one or two spec files.
