import { decorateSections, getMetadata, loadCSS } from '../../scripts/aem.js';
import decorateBlog from '../blog/blog.js';
import { renderElement } from '../../scripts/faintly.js';
import { formatPostDate, categoryHash } from '../../blocks/posts/posts.js';

/**
 * decorate the template
 * @param {Document} doc the document
 */
export default async function decorateTemplate(doc) {
  await loadCSS(`${window.hlx.codeBasePath}/templates/blog/blog.css`);
  decorateBlog(doc);
  doc.body.classList.add('blog');

  const main = doc.querySelector('main');
  const pubDate = getMetadata('publication-date');
  const dateStamp = Date.parse(pubDate) / 1000;

  const datePlaceholder = doc.createElement('div');
  await renderElement(datePlaceholder, {
    template: {
      name: 'post-date',
      path: `${window.hlx.codeBasePath}/blocks/posts/posts.html`,
    },
    item: {
      category: getMetadata('category'),
      date: dateStamp,
    },
    formatPostDate,
    categoryHash,
  });
  main.querySelector('h1').after(datePlaceholder.firstElementChild);

  const article = doc.createElement('article');
  article.className = 'section-container';
  main.prepend(article);
  main.querySelectorAll(':scope > div').forEach((section) => {
    article.append(section);
  });
  decorateSections(article);
}
