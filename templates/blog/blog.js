import { buildBlock, decorateSections } from '../../scripts/aem.js';

/**
 * decorate the template
 * @param {Document} doc the document
 */
export default async function decorateTemplate(doc) {
  if (!doc.querySelector('.archives')) {
    const sidebar = doc.createElement('div');
    const archives = buildBlock('archives', '');
    archives.classList.add('simple');
    sidebar.append(archives);

    const main = doc.querySelector('main');
    const aside = doc.createElement('aside');
    aside.className = 'section-container';
    main.append(aside);
    aside.append(sidebar);

    decorateSections(aside);
  }
}
