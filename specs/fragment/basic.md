---
block: fragment
fixture: /drafts/fixtures/fragment/basic.plain.html
tags: [content, responsive]
---

## Tracer bullet

- The block loads and decorates without console errors
- The fragment content from the referenced path replaces the block markup

## Fragment content rendering

- The heading from the fragment content is visible on the page
- The paragraph text from the fragment content is visible on the page
- Links authored in the fragment content are rendered and functional

## Section integration

- The fragment content is rendered within a decorated section (has the `section` class)
- The parent section gains the `fragment-container` class after decoration
- The fragment content sections are nested inside the fragment wrapper

## CSS behavior

- Nested sections inside the fragment wrapper have no extra left/right padding
- The first nested section has no extra top padding
- The last nested section has no extra bottom padding

## Accessibility

- The fragment content is accessible in the accessibility tree with its heading and link text

## Responsive layout

- On mobile (375px), the fragment content renders correctly with no overflow
