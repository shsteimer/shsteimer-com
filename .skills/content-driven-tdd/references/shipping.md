# Shipping: PR Workflow

## Committing

Stage specific files only — never use `git add .`:

```bash
# Block code
git add blocks/<block-name>/<block-name>.js blocks/<block-name>/<block-name>.css

# Specs (durable)
git add specs/<block-name>/

# Test fixtures (durable)
git add drafts/fixtures/<block-name>/

# Vitest unit tests (if written)
git add test/

# Core changes (if any)
git add scripts/scripts.js styles/styles.css
```

Do NOT commit:
- Playwright scripts (should already be deleted)
- Screenshots or a11y snapshots from testing
- Temp files in `drafts/tmp/`

## PR Description Template

```markdown
## Description
Brief description of changes

[If an issue exists]
Fix #<gh-issue-id>

Test URLs:

[Repeat for all relevant test urls]
- Before: https://main--{repo}--{owner}.aem.page/{path}
- After: https://{branch}--{repo}--{owner}.aem.page/{path}

[If only local fixture content (draft PR):]

This PR is currently a **draft** pending creation of CMS test content.

### Next Steps to Complete PR:

[add relevant steps here]
```

## Preview URLs

Construct from GitHub owner/repo and branch:

- **Production Preview**: `https://main--{repo}--{owner}.aem.page/`
- **Feature Preview**: `https://{branch}--{repo}--{owner}.aem.page/`

Get owner/repo: `gh repo view --json nameWithOwner`
Get branch: `git branch --show-current`

## Draft vs Regular PR

**Draft PR** when:
- Only local fixture content exists for new functionality
- User needs to create CMS content before final validation

**Regular PR** when:
- All test content exists in CMS and is previewable
- Changes only affect existing content

## Draft PR Workflow

1. Create PR as draft: `gh pr create --draft`
2. Include existing content preview links for regression testing
3. In PR description, describe fixture content used locally
4. Instruct user to create CMS content:
   - Open local fixture in browser: `http://localhost:3000/drafts/fixtures/<block>/basic`
   - Use AEM Sidekick → "View document source" → copy → paste into CMS
   - Preview the CMS content
5. User adds preview URL(s) to PR and marks ready for review
