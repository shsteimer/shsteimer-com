import { renderBlock } from '../../scripts/faintly.js';

/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  await renderBlock(block);

  block.querySelector('.copy-code').addEventListener('click', () => {
    navigator.clipboard.writeText(block.textContent.trim());
  });
}
