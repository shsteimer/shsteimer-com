import {
  ol, li, a, span,
} from '../../scripts/dom-helpers.js';
/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const list = ol();
  block.querySelectorAll(':scope > div > div').forEach((footnote, i) => {
    const target = document.querySelector('.icon-footnote');
    if (target) {
      const fnLink = a(
        {
          id: `fn-ref-${i + 1}`,
          href: `#fn-${i + 1}`,
          class: 'footnote-link',
          title: footnote.textContent,
        },
        `[${i + 1}]`,
      );
      target.replaceWith(fnLink);
    }

    const item = li({ id: `fn-${i + 1}` });
    item.append(...footnote.childNodes);
    item.append(
      a(
        { href: `#fn-ref-${i + 1}`, class: 'footnote-back-link' },
        span(
          { class: 'sr-only' },
          'Back to Content',
        ),
      ),
    );
    list.append(item);
  });

  block.replaceChildren(list);
}
