// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadCSS, loadScript } from './aem.js';

const highlightCode = async () => {
  const codeEls = [...document.querySelectorAll('code')].filter((code) => {
    const codeBlock = code.closest('.code');
    if (codeBlock && codeBlock.classList.contains('gist')) {
      return false;
    }

    return true;
  });
  if (codeEls.length > 0) {
    await Promise.all([
      loadCSS('../../libs/highlight/styles/github-dark.min.css'),
      loadScript('../../libs/highlight/highlight.min.js'),
    ]);
    codeEls.forEach((codeEl) => {
      // eslint-disable-next-line no-undef
      hljs.highlightElement(codeEl);
    });
  }
};

const runDelayed = async () => {
  // Core Web Vitals RUM collection
  sampleRUM('cwv');

  await highlightCode();
};

// add more delayed functionality here
runDelayed();
