---
block: header
fixture: /drafts/fixtures/header/with-search.plain.html
tags: [content, interactive]
---

## Search visibility

- When the `<header>` has the `with-search` class, the search form is visible
- The search input is a text field with a placeholder

## Search interaction

- Typing in the search input dispatches a `postMessage` with `{ executeSearch: true, q: '<term>' }` after a debounce
- The search form does not navigate or reload the page on submit
