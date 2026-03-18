---
block: post
fixture: /drafts/fixtures/templates/post.plain.html
tags: [layout, content, responsive]
---

## Load and decoration

- The template loads and decorates without console errors
- The page body has both `blog` and `post` classes

## Publication date

- A publication date and category appear below the post title
- The date is formatted as "DayName, Month Day, Year" (e.g., "Thursday, September 18, 2025")
- The category links to the archives page

## Post content

- The post title is visually prominent with a distinct color
- Links within the post body have a dotted underline

## Sidebar

- An archives sidebar is present (inherited from the blog template)

## Layout

- On desktop (1200px), the post content and sidebar are displayed in a two-column layout
- On mobile (375px), the layout stacks vertically with post content above the sidebar

## Accessibility

- The post content is wrapped in an article element announced as an article in the accessibility tree
- The post heading is announced as a level-1 heading
