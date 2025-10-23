---
name: Building Blocks
description: Guide for creating new AEM Edge Delivery blocks or modifying existing blocks. Use this skill whenever you are creating a new block from scratch or making significant changes to existing blocks that involve JavaScript decoration, CSS styling, or content model changes.
---

# Building Blocks

This skill guides you through creating new AEM Edge Delivery blocks or modifying existing ones, following Content Driven Development (CDD) principles. Blocks are the reusable building blocks of AEM sites - each transforms authored content into rich, interactive experiences through JavaScript decoration and CSS styling. This skill covers the complete development process: understanding content models, implementing decoration logic, applying styles, and maintaining code quality standards.

## Related Skills

- **content-driven-development**: Reference when working with content models
- **block-collection-and-party**: Use to find similar blocks for patterns
- **[testing-skill-tbd]**: Use after implementation for unit testing

## When to Use This Skill

- Creating a new block from scratch
- Making significant modifications to existing blocks
- When changes involve both JavaScript decoration and CSS
- Skip for minor CSS tweaks or simple isolated bug fixes

## Prerequisites

Before starting, gather the following from the user:

1. **Block name**: What should the block be called?
2. **Block purpose and functionality**: What should this block do? What problem does it solve?
3. **Content model**: How will authors structure content for this block? Are there any variants needed?

## Process Overview

1. Understand the Content Model (existing content or CDD approach)
2. Find Similar Blocks (for patterns and reuse)
3. Create or Modify Block Structure (files and directories)
4. Implement JavaScript Decoration (DOM transformation)
5. Add CSS Styling (scoped, responsive styles)
6. Test the Implementation (local testing, linting)
7. Document Block (developer and author-facing docs)

## Detailed Process

### 1. Understand the Content Model

**Determine content availability and approach:**

```
Does existing content for this block exist?
│
├─ YES → Ask: "What are the path(s) to the page(s) with this content?"
│         │
│         └─ Use that content for development and testing
│            Proceed to step 2
│
└─ NO → Ask: "Do you want to follow Content Driven Development principles and create content first, or proceed with defining the content model now?"
         │
         ├─ Create content first (CDD approach - ✅ Recommended)
         │   └─ Use the content-driven-development skill
         │       Then return to this skill at step 2
         │
         └─ Define content model now (⚠️ Not recommended)
             └─ Remind: "You will need to create content in the CMS before a PR can be raised"
                 Ask user to describe the content structure
                 Create static HTML in drafts/ folder for testing
                 Remind: Restart dev server with --html-folder drafts flag
                 Proceed to step 2
```

### 2. Find Similar Blocks

**For new blocks or major modifications:**

1. Search the codebase for similar blocks that might provide useful patterns or code we can re-use
2. Use the **block-collection-and-party** skill to find relevant reference blocks

Review the implementation patterns in similar blocks to inform your approach.

**For minor modifications to existing blocks:** Skip to step 3.

### 3. Create or Modify Block Structure

**For new blocks:**

1. Create directory: `blocks/{block-name}/`
2. Create files: `{block-name}.js` and `{block-name}.css`
3. Use the boilerplate structure (or reference templates in `resources/` if helpful):
   - JS file exports a default `decorate(block)` function (can be async if needed)
   - CSS file targets the `.{block-name}` class

**For existing blocks:**

1. Locate the existing block directory in `blocks/{block-name}/`
2. Review the current implementation before making changes
3. Understand the existing decoration logic and styles

### 4. Implement JavaScript Decoration

Follow patterns and conventions in `resources/js-guidelines.md`:

- Use DOM APIs to transform the initial block HTML structure
- Keep decoration logic focused and single-purpose
- Handle variants appropriately (check block.classList for variant classes)
- Follow established patterns from similar blocks

**Read `resources/js-guidelines.md` for detailed examples, code standards, and best practices.**

### 5. Add CSS Styling

Follow patterns and conventions in `resources/css-guidelines.md`:

- All CSS selectors must be scoped to the block (start with `.{block-name}`)
- Use BEM-like naming within the block scope
- Leverage CSS custom properties for theming
- Write mobile-first responsive styles
- Keep specificity low
- Follow established patterns from similar blocks

**Read `resources/css-guidelines.md` for detailed examples, code standards, and best practices.**

### 6. Test the Implementation

- View the block in the local dev server
- Test all variants and content patterns
- Verify responsive behavior
- Check accessibility basics
- **Run linting:** `npm run lint` (fix any issues with `npm run lint:fix`)
- For unit testing guidance, see the **[testing-skill-tbd]** skill

### 7. Document Block

Blocks require two types of documentation:

#### Developer Documentation

- Most blocks are simple and self-contained and only need code comments for documentation
- If a block is especially complex (has many variants, or especially complex code) consider adding a brief README.md in the block folder
- Keep any README documentation very brief so it can be consumed at a glance

#### Author-Facing Documentation

Author-facing documentation helps content authors understand how to use the block in the CMS. This documentation typically exists as draft/library content in the CMS itself, not in the codebase.

**When author documentation is needed:**

Almost all blocks should have author-facing documentation. The only exceptions are:
- Deprecated blocks that should no longer be used but can't be removed yet
- Special-purpose blocks used very infrequently on a need-to-know basis
- Auto-blocked blocks that shouldn't be used directly by authors

**Maintaining author documentation:**

Author documentation must be kept in sync with the block implementation:
- Update when variants are added, removed, or modified
- Update when the content structure changes
- Update when block behavior or functionality changes

**Where author documentation lives:**

Different projects use different approaches for author documentation:

1. **Sidekick Library** (Google Drive/SharePoint authoring):
   - Uses https://github.com/adobe/franklin-sidekick-library
   - Check for `/tools/sidekick/library.html` in the codebase
   - If present, guide user to add/update block documentation in the library

2. **Document Authoring (DA) Library**:
   - Uses https://docs.da.live/administrators/guides/setup-library
   - Different implementation than Sidekick Library
   - If in use, guide user to update block documentation in DA library

3. **Universal Editor (UE) projects**:
   - Often skip dedicated author documentation libraries
   - May use inline help or other mechanisms

4. **Simple documentation pages**:
   - Some projects maintain documentation under `/drafts` or `/docs`
   - Pages contain authoring guides and block examples

**What to include in author documentation:**

The specific content of author documentation varies by project. As an agent:
1. Identify that author documentation needs to be created or updated
2. Determine which documentation approach the project uses (check for `/tools/sidekick/library.html` as a signal)
3. Guide the user on what aspects of the block should be documented based on the changes made
4. Provide specific guidance based on the project's documentation approach

## Reference Materials

- `resources/js-guidelines.md`
- `resources/css-guidelines.md`
