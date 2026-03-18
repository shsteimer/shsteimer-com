---
block: archives
fixture: /drafts/fixtures/archives/basic.plain.html
tags: [content, interactive, responsive]
---

## Load and decoration

- The block loads and decorates without console errors
- The block replaces its empty authored content with archive groups fetched from the query index

## Structure

- The block renders three top-level groups: Categories, Date, and Tags — each with an h2 heading
- Each group contains a list of sub-group items showing a label and post count in parentheses

## Ordering

- Date sub-groups are sorted by year descending (newest year first)
- Categories sub-groups are sorted by post count descending (most posts first)
- Tags sub-groups are sorted by post count descending (most posts first)

## Expand and collapse

- Each sub-group controller has role="button", an aria-controls attribute, and aria-expanded="false" by default
- Clicking a sub-group controller toggles aria-expanded from "false" to "true"
- Clicking the same controller again toggles aria-expanded back to "false"
- When a sub-group is expanded, its post links become visible

## Post links

- Each expanded sub-group contains a list of post links
- Each post link displays the post title and links to the post's URL path

## Visual appearance

- Each sub-group list item has a visible border and background separating it from surrounding content
- Sub-group controllers display a chevron indicator on the right side
- On desktop (1200px), the block renders as a single-column layout with card-style sub-group items
- On mobile (375px), the block maintains the same single-column card layout
