import { div } from '../../scripts/dom-helpers.js';
import { buildBlock } from '../../scripts/aem.js';

export default async function decorateTemplate(doc) {
  if (!doc.querySelector('.archives')) {
    const sidebar = div();
    const archives = buildBlock('archives', '');
    archives.classList.add('simple');
    sidebar.append(archives);
    doc.querySelector('main').append(sidebar);
  }
}
