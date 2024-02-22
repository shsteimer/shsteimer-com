// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadCSS, loadScript } from './aem.js';

const highlightCode = async () => {
  if (document.querySelector('.code:not(.gist)')) {
    await Promise.all([
      loadCSS('../../libs/highlight/styles/github-dark.min.css'),
      loadScript('../../libs/highlight/highlight.min.js'),
    ]);
    // eslint-disable-next-line no-undef
    hljs.highlightAll();
  }
};

const runDelayed = async () => {
  // Core Web Vitals RUM collection
  sampleRUM('cwv');

  await highlightCode();
};

// add more delayed functionality here
runDelayed();
