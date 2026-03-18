---
block: posts
fixture: /drafts/fixtures/posts/basic.plain.html
tags: [content, interactive, responsive]
---

## Load and decoration

- The block loads and decorates without console errors
- The block renders a list of posts sourced from the query index
- In the default state (no search query), at most 5 posts are shown

## Post content

- Each post item displays a title, publication date, category, description, and a "Read More..." link
- The post title links to the post's URL path
- The "Read More..." link also links to the post's URL path
- The publication date is formatted as "DayName, Month Day, Year" (e.g., "Wednesday, March 18, 2026")
- The category links to `/blog/archives` with an anchor matching the category name

## Link hover states

- Hovering a post title changes the link color
- Hovering a category link changes its underline from dotted to solid

## Search integration

- When the block loads, the `<header>` element receives the `with-search` CSS class
- After a search message is sent (`window.postMessage({ executeSearch: true, q: '<term>' })`), the rendered posts update to show only matching results
- After a search message is sent with a term that matches no posts, the block displays "No Results Found" in place of the post list

## Responsive layout

- On desktop (1200px), posts are displayed as a vertical list with visible spacing between items
- On mobile (375px), the same single-column layout is maintained
