---
block: quote
fixture: /drafts/fixtures/quote/basic.plain.html
tags: [content, responsive]
---

## Load and decoration

- The block loads and decorates without console errors
- The quote text renders inside a `<blockquote>` element

## Visual presentation

- A decorative open-quote character appears before the quote text
- The blockquote has a visible left border accent
- The blockquote has a distinct background color differentiating it from the page background

## Quote with attribution

- When a quote has a second paragraph (attribution line), both the quote text and attribution render inside the blockquote
- Both paragraphs are visible

## Accessibility

- The quote content is announced as a blockquote in the accessibility tree

## Responsive layout

- On mobile (375px), both quote patterns render correctly with no content overflow or layout issues
