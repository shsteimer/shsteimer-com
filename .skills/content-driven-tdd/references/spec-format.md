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

One spec file per fixture. Name spec files by what they describe — the fixture name is a reasonable default, but `basic.md`, `edge-cases.md`, `variants.md` are all fine.

## Format

```markdown
---
block: columns
fixture: /drafts/fixtures/columns/two-col.plain.html
tags: [layout, responsive]
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
| `fixture` | yes | Path to the test fixture for this spec. One path per spec file. |
| `tags` | no | Categories for querying (layout, responsive, interactive, a11y, etc.) |

### Viewport guidance

There is no `viewport` frontmatter field. Viewport context belongs in the assertion text, where it's unambiguous and self-describing:

- "On desktop (1200px), columns render side by side — check via screenshot"
- "On mobile (375px), columns stack vertically — check via screenshot"

**When to test at multiple viewports:**

- **New block or substantive modification** — always verify at desktop and mobile at minimum. You cannot assume identical behavior until you check. Layout bugs are common and a screenshot is cheap.
- **Edge case specs** — test at default viewport only unless the edge case is specifically viewport-related.
- **Targeted fix (CSS tweak, bug fix)** — check the affected viewports, not necessarily all.

**Keep responsive assertions inline** with content and interaction assertions. Don't create a separate `responsive.md` for viewport-specific behavior — only warranted when responsive layout is the primary concern of the entire spec.

**Breakpoints are ranges, not points.** Layout changes happen at 600px and 900px. The standard sizes are mid-range representatives:

| Name | Width | Range |
|------|-------|-------|
| mobile | 375px | < 600px |
| tablet | 768px | 600–899px |
| desktop | 1200px | 900px+ |

Breakpoint boundaries (599, 600, 601, 899, 900, 901) are where subtle layout bugs most often appear. The standard sizes won't catch them — when investigating a responsive issue, test at those boundary values.

### Multiple fixtures → multiple spec files

One spec file covers one fixture. If a block needs multiple fixtures (happy path, edge cases, variants), write one spec file per fixture:

```
specs/posts/
  basic.md         # fixture: /drafts/fixtures/posts/basic.plain.html
  edge-cases.md    # fixture: /drafts/fixtures/posts/edge-cases.plain.html
```

This keeps each spec focused and avoids ambiguity about which assertions apply to which fixture.

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
- "The element has `role=button`" (DOM attribute — assert via a11y tree instead, see Accessibility Assertions)
- "The element does not have a role attribute" (absence of an attribute is not a behavior — describe the user experience instead)
- "The block attempts to fetch featured posts" (describes code, not outcome)

That last one is common and worth flagging: assertions about what code *attempts* or *tries* are not assertions. State the observable outcome instead: "When no featured posts exist, the block falls back to displaying the latest post."

### Gray Area — Make It Concrete

"Cards have a distinct card-like appearance" is too vague to evaluate consistently. Fix it by describing what observable thing you'd look for:

- **Too vague:** "Cards have a distinct card-like appearance"
- **Concrete:** "Each card has a visible border or shadow separating it from the background"

- **Too vague:** "Image fills its container"
- **Concrete:** "The card image occupies the full width of the card"

- **Too vague:** "Content is visually centered"
- **Concrete:** "The block content appears horizontally centered on the page at desktop (1200px)"

Don't annotate assertions with "check via screenshot" or "check via DOM query" — the reference doc defines which evaluation method applies to which assertion type. Keep assertions focused on what, not how.

## Accessibility Assertions

Every block spec should include accessibility assertions as a first-class concern, not an afterthought. Accessibility is user-facing behavior — assistive technology users experience roles, labels, and semantic structure directly, just as sighted users experience layout and color.

**Describe the assistive technology user's experience, not DOM attributes.** The accessibility tree is the source of truth — it represents what screen readers and other assistive technology actually communicate. Use a11y snapshots to verify these assertions, not DOM attribute queries.

- **Bad:** "The element has `role=button` and `aria-expanded=false`" (DOM attribute check — implementation detail)
- **Bad:** "The element does not have a `role` attribute" (absence of an attribute — not a behavior)
- **Good:** "Sub-group headings are announced as expandable buttons in the accessibility tree"
- **Good:** "Sub-groups in the simple variant appear as links in the accessibility tree, not interactive controls"
- **Good:** "The hamburger button's accessible label updates to reflect expanded or collapsed state"

The good examples describe what an assistive technology user would experience. Whether that's implemented via `role="button"`, `aria-expanded`, or some other mechanism is irrelevant to the spec — the a11y tree captures the result.

**When variants differ in accessibility behavior**, assert the intended experience for each variant. The simple archives variant uses links (navigate away) while the default uses buttons (expand inline) — both are correct, just different interaction models.

## Edge Cases and Error States

For any block that fetches data or renders dynamic content, include at least one assertion about what happens when things go wrong or content is missing:

- What renders when the fetch returns no results?
- What renders when a required field (image, title, date) is absent?
- What renders when the authored content doesn't match the expected pattern?

These are the assertions most likely to catch real bugs. Don't skip them.

### Authoring contract violations

For blocks that don't use authored content (or use only specific fields), assert what happens when an author puts unexpected content inside the block. The right assertion describes the observable outcome — not the implementation:

- **Good:** "Authored content inside the block does not appear in the rendered output"
- **Bad:** "The block calls replaceChildren, discarding authored content"

This documents the authoring contract explicitly and catches regressions if the rendering approach changes.

## Block side effects

Some blocks affect parts of the page outside their own element — adding classes to the header, setting global state, dispatching events. These side effects are part of the block's behavior and belong in the spec.

- "When the block loads, the `<header>` element receives the `with-search` CSS class"
- "Clicking the share button dispatches a `share` event on the document"

If a side effect is load-time (happens during decoration), put it in the load/decoration section. If it's interaction-driven, put it with the relevant interaction assertions.

## Checklist Per Assertion

Before writing each assertion, verify:

- [ ] Does it describe behavior, not implementation?
- [ ] Would it survive an internal DOM refactor?
- [ ] Can it be evaluated from a screenshot, a11y snapshot, or DOM query?
- [ ] Is it specific enough that pass/fail is unambiguous?
- [ ] If visual, does it say what to look for in the screenshot?
- [ ] If describing a variant or edge case, does it state the expected outcome (not just "attempts to")?
- [ ] Does it matter to the user or author? (If not, skip it)
- [ ] Is the assertion in a spec whose fixture activates the behavior? Assertions about conditionally visible elements belong in a fixture/spec where the condition is met — not in one where the element happens to exist in the DOM but is hidden. A DOM query will silently pass on a hidden element, giving false confidence.

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
