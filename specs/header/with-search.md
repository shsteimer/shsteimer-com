---
block: header
fixture: /drafts/fixtures/header/with-search.plain.html
tags: [content, interactive]
---

## Search visibility

- When the `<header>` has the `with-search` class, the search form is visible
- The search icon list item renders as a search form
- The search input is a text field with a placeholder

## Accessibility

- The search input is announced with a descriptive label in the accessibility tree

## Search interaction

- Typing in the search input dispatches a `postMessage` with `{ executeSearch: true, q: '<term>' }` after a debounce
- The search form does not navigate or reload the page on submit
