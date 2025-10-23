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

## Process

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

### 7. Document Block (If Applicable)

- Most blocks are simple and self-contained and only need code comments for documentation
- If a block is especially complex (has many variants, or especially complex code) consider adding a brief README.md in the block folder
- Keep any README documentation very brief so it can be consumed at a glance

## Reference Materials

- `resources/js-guidelines.md`
- `resources/css-guidelines.md`
