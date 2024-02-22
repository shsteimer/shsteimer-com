import { getMetadata } from '../../scripts/aem.js';
import decorateBlog from '../blog/blog.js';
import { createPostDate } from '../../blocks/posts/posts.js';

export default async function decorateTemplate(doc) {
  decorateBlog(doc);
  doc.body.classList.add('blog');

  const pubDate = getMetadata('publication-date');
  const dateStamp = Date.parse(pubDate) / 1000;
  const datePar = createPostDate({
    date: dateStamp,
    category: getMetadata('category'),
  });
  doc.querySelector('main h1').after(datePar);
}
