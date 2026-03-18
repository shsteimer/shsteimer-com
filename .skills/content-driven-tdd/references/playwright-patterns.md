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

Use for semantic and accessibility assertions.

```javascript
const snapshot = await page.accessibility.snapshot();
console.log(JSON.stringify(snapshot, null, 2));

// Or save to file for analysis
const fs = await import('fs');
await fs.promises.writeFile(
  'test/tmp/<block>-a11y.json',
  JSON.stringify(snapshot, null, 2),
);
```

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

## Tips

- **Wait for decoration.** Blocks are decorated asynchronously. Always wait for `[data-block-status="loaded"]` before asserting.
- **Scope queries to the block.** Use `.block-name` prefix, not global selectors.
- **One script per TDD cycle.** Extend the script as you add assertions, don't create a new file each time.
- **Log clearly.** Print assertion name, expected vs actual, PASS/FAIL. Makes evaluation faster.
- **Clean up.** Delete scripts and screenshots when the session ends.
- **DOM queries pass on hidden elements.** `count()`, `getAttribute()`, `textContent()`, and similar DOM queries succeed on elements that are hidden via CSS (`display: none`, `visibility: hidden`, off-screen positioning). This means a structural assertion like "the form exists and has a label" will pass even when the form is invisible to the user. If the behavior you're asserting only matters when the element is visible, either verify visibility first (`isVisible()`) or place the assertion in a test/fixture where the element is actually shown. Conversely, use DOM queries intentionally for asserting what's in the DOM regardless of visibility — for example, verifying that a hidden element has correct `aria-*` attributes.
