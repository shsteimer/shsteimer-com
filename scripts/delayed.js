// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadCSS, loadScript } from './aem.js';

const runDelayed = async () => {
  // Core Web Vitals RUM collection
  sampleRUM('cwv');

  if (document.querySelector('.code:not(.gist)')) {
    await loadCSS('../../libs/highlight/styles/atom-one-dark.css');
    await loadScript('../../libs/highlight/highlight.js');
    hljs.highlightAll();
  }
};

// add more delayed functionality here
runDelayed();
