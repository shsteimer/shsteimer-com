import { loadCSS } from '../../scripts/aem.js';
import { renderBlock } from '../../scripts/faintly.js';

const jsonpGist = (url, callback) => {
  // Setup a unique name that cane be called & destroyed
  const callbackName = `jsonp_${Math.round(100000 * Math.random())}`;

  // Create the script tag
  const script = document.createElement('script');
  script.src = `${url}${(url.indexOf('?') >= 0 ? '&' : '?')}callback=${callbackName}`;

  // Define the function that the script will call
  window[callbackName] = (data) => {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  // Append to the document
  document.body.appendChild(script);
};

const gist = (element) => {
  const { href } = element;

  jsonpGist(href.replace('.js?', '.json?'), (data) => {
    loadCSS(data.stylesheet);
    element.insertAdjacentHTML('afterend', data.div);
    element.remove();
  });
};

/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  if (block.querySelector('a[href^="https://gist.github.com"]')) {
    block.classList.add('gist');
    gist(block.querySelector('a[href^="https://gist.github.com"]'));
    return;
  }
  await renderBlock(block);

  block.querySelector('.copy-code').addEventListener('click', () => {
    navigator.clipboard.writeText(block.textContent.trim());
  });
}
