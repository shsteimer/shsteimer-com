// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadCSS, loadScript } from './aem.js';

const runDelayed = async () => {
  // Core Web Vitals RUM collection
  sampleRUM('cwv');

  if (document.querySelector('.code:not(.gist)')) {
    await loadCSS('../../libs/highlight/styles/github-dark.min.css');
    await loadScript('../../libs/highlight/highlight.min.js');
    // eslint-disable-next-line no-undef
    hljs.highlightAll();
  }
};

// add more delayed functionality here
runDelayed();
