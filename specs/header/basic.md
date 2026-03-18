---
block: header
fixture: /drafts/fixtures/header/basic.plain.html
tags: [content, interactive, responsive]
---

## Load and decoration

- The header loads and decorates without console errors
- The header loads its nav content from the path specified in the page's `nav` metadata field

## Brand and navigation

- The header displays a brand link from the first section of the nav fragment
- The header renders navigation links from the fragment's list items
- Navigation links that are not the search icon render as anchor elements

## Search

- The search form is not visible when the `<header>` lacks the `with-search` class

## Hamburger menu

- On mobile (375px), a hamburger button is visible
- The nav starts collapsed and the nav list is not visible
- Clicking the hamburger button expands the nav and the nav list becomes visible
- Clicking the hamburger button again collapses the nav
- On desktop (1200px), the hamburger button is not visible

## Accessibility

- The hamburger button is announced as a button in the accessibility tree with a descriptive label
- The nav's expanded/collapsed state is communicated to assistive technology
- The hamburger button's accessible label updates to reflect the current state (e.g., "Open navigation" vs "Close navigation")

## Layout

- The header is fixed to the top of the viewport
- On desktop (1200px), brand and nav links are displayed in a single row
- On mobile (375px), the expanded nav shows links in a vertical list below the brand
