---
block: archives
fixture: /drafts/fixtures/archives/simple.plain.html
tags: [content, responsive]
---

## Load and decoration

- The block loads and decorates without console errors
- The block replaces its empty authored content with archive groups fetched from the query index

## Structure

- The block renders Categories, Date, and Tags groups, but the Tags group is not visible
- Only Categories and Date groups are visible to the user, each with an h2 heading

## Sub-group controllers

- Sub-group controllers do not have a role attribute
- Sub-group controllers do not have an aria-controls attribute
- Sub-group controllers do not display a chevron indicator

## Sub-group interaction

- Sub-group controllers are rendered as links but are not interactive buttons
- The expand/collapse CSS mechanism still applies, so sub-group post lists are collapsed by default

## Visual appearance

- Sub-group items use a bullet-list (disc) layout instead of bordered card layout
- Each group's inner content area has a visible border and background
- Group headings use a smaller font size than the default variant
- On desktop (1200px), the block renders as a single-column bulleted list layout
- On mobile (375px), the simple variant container has a dashed top border
