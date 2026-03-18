---
block: code
fixture: /drafts/fixtures/code/basic.plain.html
tags: [content, interactive, responsive]
---

## Load and decoration

- The block loads and decorates without console errors
- Inline `<pre><code>` elements in the page content are auto-blocked into code blocks

## Inline code rendering

- The authored code text is displayed inside the code block
- The code block has a dark background with light-colored text
- A "Copy" button is visible in the code block

## Copy interaction

- Clicking the "Copy" button copies the code text to the clipboard

## Accessibility

- The code content is announced as code in the accessibility tree
- The "Copy" button is announced as a button in the accessibility tree

## Responsive layout

- On desktop (1200px), the code block is horizontally centered with a max width
- On mobile (375px), the code block fills the available width with no overflow
