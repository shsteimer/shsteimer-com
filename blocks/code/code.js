import { domEl, button } from '../../scripts/dom-helpers.js';
/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const codeContent = block.textContent.trim();
  block.innerHTML = '';
  block.append(
    domEl(
      'pre',
      domEl(
        'code',
        codeContent,
      ),
    ),
  );
  const copyButton = button({ role: 'button' }, 'Copy');
  block.append(copyButton);
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(codeContent);
  });
}
