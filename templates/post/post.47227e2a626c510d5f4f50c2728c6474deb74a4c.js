import { decorateSections, getMetadata, loadCSS } from '../../scripts/aem.js';
import decorateBlog from '../blog/blog.js';
import { createPostDate } from '../../blocks/posts/posts.js';
import { domEl } from '../../scripts/dom-helpers.js';

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
  const datePar = createPostDate({
    date: dateStamp,
    category: getMetadata('category'),
  });
  main.querySelector('h1').after(datePar);

  const article = domEl('article', { class: 'section-container' });
  main.prepend(article);
  main.querySelectorAll(':scope > div').forEach((section) => {
    article.append(section);
  });
  decorateSections(article);
}
