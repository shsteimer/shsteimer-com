---
block: footnotes
fixture: /drafts/fixtures/footnotes/basic.plain.html
tags: [content, responsive]
---

## Tracer bullet

- The block loads and decorates without console errors
- The footnotes block renders an ordered list with list items

## Footnote list rendering

- The ordered list contains exactly 3 list items matching the 3 authored footnote entries
- Each list item has an `id` attribute following the pattern `fn-{number}` (e.g., `fn-1`, `fn-2`, `fn-3`)
- The first footnote displays its plain text content
- The second footnote contains a link to `https://example.com`

## Back-links

- Each footnote list item contains a back-link with class `footnote-back-link`
- Each back-link's `href` points to the corresponding footnote reference anchor (e.g., `#fn-ref-1`)
- Each back-link contains screen-reader-only text "Back to Content"
- The back-link is appended inside the last paragraph of its footnote (not as a standalone element)

## Footnote reference links

- Each `.icon-footnote` span in the content above is replaced with a clickable footnote reference link
- The footnote reference links display sequential numbers in brackets: `[1]`, `[2]`, `[3]`
- Each reference link has an `id` following the pattern `fn-ref-{number}` (e.g., `fn-ref-1`)
- Each reference link's `href` points to the corresponding footnote anchor (e.g., `#fn-1`)
- The reference links have the class `footnote-link`

## Visual presentation

- The footnotes block text is rendered in a smaller font size than body text
- The footnote reference links are displayed as superscript text
- The footnote reference links have no text decoration (no underline)
- The back-links display a return arrow character (↩) after the link text

## Accessibility

- The footnotes ordered list is announced as a list in the accessibility tree
- Each footnote reference link provides a title attribute for context
- The back-links contain screen-reader-only text describing their purpose

## Responsive layout

- On mobile (375px), the footnotes block renders correctly with no content overflow
