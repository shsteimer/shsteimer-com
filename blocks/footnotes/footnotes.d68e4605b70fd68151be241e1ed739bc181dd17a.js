import { renderBlock, renderElement } from '../../scripts/faintly.js';

/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const context = {
    footnotes: block.querySelectorAll(':scope > div > div'),
  };

  await renderBlock(block, context);

  block.querySelectorAll('.footnote-back-link').forEach((link) => {
    if (link.previousElementSibling && link.previousElementSibling.tagName === 'P') {
      link.previousElementSibling.append(link);
    }
  });

  document.querySelectorAll('.icon-footnote').forEach(async (icon, i) => {
    const fnLink = await renderElement({
      template: {
        name: 'footnote-link',
        path: context.template.path,
      },
      itemNumber: i + 1,
    });
    icon.replaceWith(fnLink);
  });
}
