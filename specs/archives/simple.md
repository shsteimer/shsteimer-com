---
block: archives
fixture: /drafts/fixtures/archives/simple.plain.html
tags: [content, responsive]
---

## Load and decoration

- The block loads and decorates without console errors
- The block renders archive groups sourced from the query index, replacing its empty authored content

## Content

- The block displays Categories and Date groups, each with a heading
- The Tags group is not visible
- Each group contains labeled items showing a post count in parentheses

## Sub-group behavior

- Sub-group items do not display a chevron indicator
- Sub-group items are not expandable — they link to the archives page instead

## Accessibility

- Sub-group items in the simple variant appear as links in the accessibility tree, not buttons
- The Tags group is completely absent from the accessibility tree
- Each group heading is announced as a level-2 heading

## Layout

- Sub-group items are displayed as a bulleted list (disc markers) rather than as bordered cards
- Each group's content area has a visible border and background
- Group headings are smaller than the default variant
- On desktop (1200px), the block renders as a single-column bulleted list
- On mobile (375px), the block container has a dashed top border separating it from content above
