import { domEl } from '../../scripts/dom-helpers.js';
/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const bq = domEl(
    'blockquote',
    ...block.querySelectorAll('p'),
  );
  block.replaceChildren(bq);
}
