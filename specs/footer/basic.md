---
block: footer
fixture: /drafts/fixtures/footer/basic.plain.html
tags: [content, responsive]
---

## Load and decoration

- The footer loads and decorates without console errors
- The footer loads its fragment content from the path specified in the page's `footer` metadata field

## Social links

- The footer renders social icon links (mastodon, github, rss)
- Each social link has a `title` attribute derived from the icon name (e.g., "Visit mastodon")

## Copyright

- The footer displays copyright text with the current year replacing the `{year}` placeholder
- The literal string `{year}` does not appear in the rendered output

## Layout

- On desktop (1200px), social links and copyright text are displayed side by side
- The footer has a visible top and bottom border
- On mobile (375px), the footer content remains readable with no overflow
