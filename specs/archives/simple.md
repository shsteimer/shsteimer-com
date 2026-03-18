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

- Sub-group items are rendered as links but are not interactive buttons
- Sub-group items do not display a chevron indicator
- Sub-group post lists are collapsed by default (same expand/collapse CSS as default variant applies, but there is no toggle mechanism)

## Layout

- Sub-group items are displayed as a bulleted list (disc markers) rather than as bordered cards
- Each group's content area has a visible border and background
- Group headings are smaller than the default variant
- On desktop (1200px), the block renders as a single-column bulleted list
- On mobile (375px), the block container has a dashed top border separating it from content above
