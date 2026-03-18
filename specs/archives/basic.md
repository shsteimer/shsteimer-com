---
block: archives
fixture: /drafts/fixtures/archives/basic.plain.html
tags: [content, interactive, responsive]
---

## Load and decoration

- The block loads and decorates without console errors
- The block renders archive groups sourced from the query index, replacing its empty authored content

## Content and ordering

- The block displays three groups — Categories, Date, and Tags — each with a heading
- Each group contains a list of labeled items showing a post count in parentheses (e.g., "AEM (8)")
- Date items are listed newest year first
- Categories and Tags items are listed by post count, most posts first

## Expand and collapse

- All sub-group items start collapsed — their post lists are not visible
- Clicking a sub-group item expands it, revealing a list of post links beneath
- Clicking the same item again collapses it, hiding the post links
- Each sub-group item displays a chevron indicator pointing right when collapsed and down when expanded

## Post links

- Each expanded sub-group contains a list of post titles that link to the post's URL path

## Accessibility

- Sub-group items are announced as buttons in the accessibility tree (e.g., button "AEM (8)")
- The expanded/collapsed state of each sub-group is communicated to assistive technology
- When expanded, the nested post links are announced as a list of links within the sub-group
- Each group heading is announced as a level-2 heading

## Layout

- Each sub-group item has a visible border and background separating it from surrounding content
- On desktop (1200px), the block renders as a single-column list of card-style items
- On mobile (375px), the block maintains the same single-column card layout
