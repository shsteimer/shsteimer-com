import { getMetadata } from '../../scripts/aem.js';
import decorateBlog from '../blog/blog.js';
import { p } from '../../scripts/dom-helpers.js';

export default async function decorateTemplate(doc) {
  decorateBlog(doc);
  doc.body.classList.add('blog');

  const pubDate = getMetadata('publication-date');
  const asDate = new Date(pubDate);
  const datePar = p({ class: 'post-date' }, `Posted on ${asDate.toDateString()} in ${getMetadata('category')}`);
  doc.querySelector('main h1').after(datePar);
}
