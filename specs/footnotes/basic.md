---
block: footnotes
fixture: /drafts/fixtures/footnotes/basic.plain.html
tags: [content, responsive]
---

## Load and decoration

- The block loads and decorates without console errors
- The footnotes block renders an ordered list with list items
- The ordered list contains exactly 3 list items matching the 3 authored footnote entries

## Footnote content

- The first footnote displays its plain text content
- The second footnote contains a link to `https://example.com`

## Back-links

- Each footnote contains a back-link that navigates back to the corresponding reference point in the content
- Each back-link displays a return arrow character (↩)

## Footnote reference links

- Each footnote icon in the content above is replaced with a clickable footnote reference link
- The footnote reference links display sequential numbers in brackets: `[1]`, `[2]`, `[3]`
- Clicking a reference link navigates to the corresponding footnote in the list

## Visual presentation

- The footnotes block text is rendered in a smaller font size than body text
- The footnote reference links are displayed as superscript text
- The footnote reference links have no text decoration (no underline)

## Accessibility

- The footnotes ordered list is announced as a list in the accessibility tree
- Each footnote reference link is announced with a descriptive name in the accessibility tree
- The back-links contain screen-reader-only text describing their purpose ("Back to Content")

## Responsive layout

- On mobile (375px), the footnotes block renders correctly with no content overflow
