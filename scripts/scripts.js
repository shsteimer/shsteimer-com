import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  loadCSS,
  toClassName,
  getMetadata,
  loadSection,
  loadSections,
  waitForFirstImage,
} from './aem.js';
import {
  checkDomain,
  rewriteLinkUrl,
} from './utils.js';

/* AEM experimentation config */
const experimentationConfig = {
  isProd: () => {
    const { hostname } = window.location;
    return hostname.includes('.ups.com') || hostname.includes('aem.live');
  },
  audiences: {
    mobile: () => window.innerWidth < 600,
    desktop: () => window.innerWidth >= 600,
  },
};

let showExperimentationOverlay;
let runExperimentation;
async function initExperimentation() {
  const isExperimentationEnabled = document.head.querySelector('[name^="experiment"],[name^="campaign-"],[name^="audience-"],[property^="campaign:"],[property^="audience:"]')
  || [...document.querySelectorAll('.section-metadata div')].some((d) => d.textContent.match(/Experiment|Campaign|Audience/i));
  if (isExperimentationEnabled) {
    // eslint-disable-next-line import/no-relative-packages
    const expModule = await import('../plugins/experimentation/src/index.js');
    if (expModule && expModule.loadEager && expModule.loadLazy) {
      runExperimentation = expModule.loadEager;
      showExperimentationOverlay = expModule.loadLazy;
    }
  }
}
const expInit = initExperimentation();

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

function buildCodeBlocks(container) {
  container.querySelectorAll('pre code').forEach((code) => {
    // ignore if inside a code block
    if (code.closest('.code')) return;

    const pre = code.parentNode;
    const block = buildBlock('code', [[pre.cloneNode(true)]]);
    pre.before(block);
    pre.remove();
  });

  container.querySelectorAll('a[href^="https://gist.github.com"]').forEach((gistLink) => {
    // ignore if inside a code block
    if (gistLink.closest('.code')) return;

    const block = buildBlock('code', [[gistLink.cloneNode(true)]]);
    const parent = gistLink.parentNode;
    if (parent.tagName === 'P') {
      parent.before(block);
      parent.remove();
    } else {
      gistLink.before(block);
      gistLink.remove();
    }
  });
}

function buildFragmentBlocks(container) {
  container.querySelectorAll('a[href*="/fragments/"]:only-child').forEach((a) => {
    // ignore if inside a fragment block
    if (a.closest('.fragment')) return;

    // skip links to other sites JIC
    const domainCheck = checkDomain(a.href);
    if (domainCheck.isExternal) return;

    const parent = a.parentNode;
    const fragment = buildBlock('fragment', [[a.cloneNode(true)]]);
    if (parent.tagName === 'P') {
      parent.before(fragment);
      parent.remove();
    } else {
      a.before(fragment);
      a.remove();
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildFragmentBlocks(main);
    buildCodeBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function decorateLink(a) {
  rewriteLinkUrl(a);
}

function decorateLinks(main) {
  main.querySelectorAll('a').forEach(decorateLink);
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateSections(main);
  buildAutoBlocks(main);
  decorateBlocks(main);
  decorateIcons(main);
  decorateLinks(main);
}

async function decorateTemplate(doc) {
  const templateName = toClassName(getMetadata('template'));
  if (!templateName) return;

  try {
    const cssLoaded = loadCSS(`${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`);
    const decorationComplete = new Promise((resolve) => {
      (async () => {
        try {
          const mod = await import(
            `${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.js`
          );
          if (mod.default) {
            await mod.default(doc);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('failed to load module for template', error);
        }
        resolve();
      })();
    });
    await Promise.all([cssLoaded, decorationComplete]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('failed to decorate template', error);
  }
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';

  await expInit;
  if (runExperimentation) {
    await runExperimentation(doc, experimentationConfig);
  }

  decorateTemplateAndTheme();
  await decorateTemplate(doc);
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  const lazyPromises = [];

  lazyPromises.push(loadHeader(doc.querySelector('header')));
  lazyPromises.push(loadFooter(doc.querySelector('footer')));

  lazyPromises.push(loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`));
  lazyPromises.push(loadFonts());

  await Promise.allSettled(lazyPromises);

  if (showExperimentationOverlay) {
    showExperimentationOverlay(doc, experimentationConfig);
  }
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
