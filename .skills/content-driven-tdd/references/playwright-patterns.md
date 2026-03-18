# Playwright Patterns for TDD Loop

Playwright scripts are **session-scoped** — generated fresh from prose specs each session, run to verify every assertion in a real browser, then cleaned up. They are not committed to git, but they are not optional. Every code change must be verified through Playwright before it ships.

## Script Location

Write scripts to `test/tmp/` (gitignored):
- `testtest/tmp/test-<block>.js` or `test/tmp/test-<block>-<fixture>.js`
- Clean up after the TDD loop is complete

## Basic Script Template

Read the actual port from `aem up` startup output — do not hardcode 3000. Pass it via environment variable or read it from a known location.

```javascript
import { chromium } from 'playwright';

// Port is set from aem up output — do not hardcode 3000
const PORT = process.env.AEM_PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function test() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(`${BASE_URL}/drafts/fixtures/<block>/basic`);
  await page.waitForLoadState('networkidle');

  // Wait for block decoration to complete
  await page.waitForSelector('.<block-name>.block[data-block-status="loaded"]');

  // --- Assertions go here ---

  // Report console errors
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  }

  await browser.close();
}

test().catch(console.error);
```

Run with: `node test/tmp/test-<block>.js`

## Assertion Patterns

### Coded Checks (Hard Pass/Fail)

Use for structural and content assertions.

**Content presence:**
```javascript
const heading = await page.locator('.<block-name> h2').textContent();
console.log(`Heading text: "${heading}"`);
// Compare against expected authored content
```

**Element count:**
```javascript
const count = await page.locator('.<block-name> > div').count();
console.log(`Row count: ${count}`);
```

**Accessibility attributes:**
```javascript
const images = await page.locator('.<block-name> img').all();
for (const img of images) {
  const alt = await img.getAttribute('alt');
  console.log(`Image alt: "${alt}" — ${alt ? 'PASS' : 'FAIL: missing alt'}`);
}
```

**Interactive behavior:**
```javascript
// Click and verify state change
await page.locator('.<block-name> .trigger').first().click();
const expanded = await page.locator('.<block-name> .body').first().isVisible();
console.log(`Body visible after click: ${expanded ? 'PASS' : 'FAIL'}`);
```

### Screenshots (Visual Evaluation)

Use for layout, appearance, and responsive assertions. Take the screenshot, then evaluate it yourself.

**Block screenshot at specific viewport:**
```javascript
// Desktop
await page.setViewportSize({ width: 1200, height: 800 });
await page.locator('.<block-name>').first().screenshot({
  path: 'test/tmp/<block>-desktop.png',
});

// Mobile
await page.setViewportSize({ width: 375, height: 667 });
await page.locator('.<block-name>').first().screenshot({
  path: 'test/tmp/<block>-mobile.png',
});
```

**Full page for context:**
```javascript
await page.screenshot({ path: 'test/tmp/<block>-fullpage.png', fullPage: true });
```

After taking screenshots, read the image files and evaluate them against the prose assertions. Delete screenshots when done.

### A11y Snapshots (Semantic Structure)

Use for accessibility and semantic structure assertions. **The a11y tree is the source of truth for what assistive technology communicates to users.** Checking DOM attributes like `role` or `aria-expanded` is testing implementation — the a11y tree shows the actual result.

Use a11y snapshots instead of DOM attribute queries when asserting:
- What role an element is announced as (button, link, heading, etc.)
- Whether interactive state (expanded, pressed, checked) is communicated
- What accessible labels are announced
- Heading hierarchy and landmark structure

Use `locator.ariaSnapshot()` to capture the accessibility tree as a text representation. Scope the snapshot to the relevant element — don't snapshot the entire page when you only care about the header.

```javascript
// Snapshot a specific element
const snap = await page.locator('header').ariaSnapshot();
console.log(snap);
// Output:
// - banner:
//   - navigation:
//     - link "Test Home":
//       - /url: /
//     - button "Open navigation"
```

**Asserting against the snapshot:**

The snapshot is a plain text string. Use `includes()` to check for roles, names, and structure:

```javascript
const snap = await page.locator('header').ariaSnapshot();

// Check that hamburger is announced as a button with a label
const hasButton = snap.includes('button "Open navigation"');
console.log(`Hamburger announced as button: ${hasButton ? 'PASS' : 'FAIL'}`);

// After expanding, check that label updates
await hamburger.click();
await page.waitForTimeout(300);
const expandedSnap = await page.locator('header').ariaSnapshot();
const hasCloseLabel = expandedSnap.includes('button "Close navigation"');
console.log(`Label updates on expand: ${hasCloseLabel ? 'PASS' : 'FAIL'}`);

// Check semantic structure
const footerSnap = await page.locator('footer').ariaSnapshot();
const hasNamedLinks = footerSnap.includes('link "Visit mastodon"');
console.log(`Social links have a11y names: ${hasNamedLinks ? 'PASS' : 'FAIL'}`);

// Check blockquote semantics
const mainSnap = await page.locator('main').ariaSnapshot();
const hasBlockquote = mainSnap.includes('blockquote:');
console.log(`Blockquote in a11y tree: ${hasBlockquote ? 'PASS' : 'FAIL'}`);
```

**When to use DOM queries instead:** Content-level accessibility checks like "all images have alt text" are fine as DOM queries — you're checking authored content, not semantic behavior. But roles, states, labels, and structure belong in the a11y tree.

### Combined Approach

A single script often mixes all three for different assertions:

```javascript
// Structural check (coded)
const itemCount = await page.locator('.cards > div').count();
console.log(`Card count: ${itemCount} — ${itemCount === 3 ? 'PASS' : 'FAIL'}`);

// Visual check (screenshot for evaluation)
await page.setViewportSize({ width: 1200, height: 800 });
await page.locator('.cards').first().screenshot({
  path: '/tmp/cards-desktop.png',
});
// -> evaluate: "cards are displayed in a grid layout"

// Semantic check (a11y snapshot)
const a11y = await page.accessibility.snapshot();
// -> evaluate: "heading hierarchy is correct"
```

## Viewport Sizes

Standard viewports for responsive testing — these are mid-range representatives, not fixed breakpoints:

| Name | Width | Height | Range |
|------|-------|--------|-------|
| mobile | 375 | 667 | < 600px |
| tablet | 768 | 1024 | 600–899px |
| desktop | 1200 | 800 | 900px+ |

Breakpoint boundaries (599, 600, 601, 899, 900, 901) are where layout bugs most often appear. When investigating a responsive issue, test at those values rather than the mid-range defaults.

## End-of-Loop Summary

After the TDD loop completes (all assertions green), present a summary table to the user. This is not optional — it's the final checkpoint before moving to regression testing.

**Format:**

| # | Assertion | Result | Method |
|---|-----------|--------|--------|
| 1 | Footer loads without console errors | PASS | coded (console listener) |
| 2 | Footer loads from metadata-specified fragment path | PASS | coded (request intercept) |
| 3 | Social links have accessible title attributes | PASS | coded (DOM attribute) |
| 4 | Copyright displays current year, no literal {year} | PASS | coded (text content) |
| 5 | Social and copyright side by side on desktop | PASS | screenshot (1200px) |
| 6 | Footer readable on mobile, no overflow | PASS | screenshot (375px) |

**Method column values:**
- `coded` — hard pass/fail from a Playwright check. Add a parenthetical for the specific technique: `(DOM query)`, `(DOM attribute)`, `(visibility check)`, `(text content)`, `(computed style)`, `(request intercept)`, `(console listener)`, `(element count)`.
- `screenshot` — visual evaluation of a captured image. Include viewport width.
- `a11y snapshot` — evaluation of the accessibility tree.

**Result column values:**
- `PASS` — the assertion was verified and the expected behavior was confirmed.
- `FAIL` — the assertion was verified and the expected behavior was not observed.
- `UNVERIFIED` — the assertion could not be conclusively evaluated. Use this when a screenshot is too small or ambiguous to judge, when a coded check doesn't actually test what the assertion claims, or when any other factor prevents a confident determination. **Never report PASS for an assertion you did not actually verify.** An unverified assertion reported as PASS is worse than a failure — it creates false confidence and hides gaps in coverage. When an assertion is UNVERIFIED, either fix the evaluation method (re-take the screenshot at a better scope, switch to a coded check, etc.) and re-evaluate, or flag it honestly so the user can decide how to proceed.

**Why this matters:** Writing down the method forces intentional choices about *how* each assertion is verified. A `coded (DOM query)` on a conditionally-hidden element is a signal to reconsider — should it be `coded (visibility check)` instead? The table makes these choices explicit and reviewable.

**When to present:** Once, at the end of the TDD loop — not after every red-green cycle. If multiple spec files were tested in the same session, present one table per spec.

## Tips

- **Wait for decoration.** Blocks are decorated asynchronously. Always wait for `[data-block-status="loaded"]` before asserting.
- **Scope queries to the block.** Use `.block-name` prefix, not global selectors.
- **One script per TDD cycle.** Extend the script as you add assertions, don't create a new file each time.
- **Log clearly.** Print assertion name, expected vs actual, PASS/FAIL. Makes evaluation faster.
- **Clean up.** Delete scripts and screenshots when the session ends.
- **Evaluate screenshots honestly.** When you take a screenshot to verify an assertion, you must actually confirm the expected behavior is visible in the image. If the screenshot is too small, too zoomed out, or otherwise ambiguous — do not report PASS. Either re-take the screenshot scoped to the relevant element, switch to a coded check (e.g., `computed style` for CSS property changes), or report UNVERIFIED. Screenshots of an entire block to verify a single link's hover underline style will not work — scope the screenshot to the element, or better yet, use `getComputedStyle()` for CSS property assertions.
- **DOM queries pass on hidden elements.** `count()`, `getAttribute()`, `textContent()`, and similar DOM queries succeed on elements that are hidden via CSS (`display: none`, `visibility: hidden`, off-screen positioning). This means a structural assertion like "the form exists and has a label" will pass even when the form is invisible to the user. If the behavior you're asserting only matters when the element is visible, either verify visibility first (`isVisible()`) or place the assertion in a test/fixture where the element is actually shown. Conversely, use DOM queries intentionally for asserting what's in the DOM regardless of visibility — for example, verifying that a hidden element has correct `aria-*` attributes.
