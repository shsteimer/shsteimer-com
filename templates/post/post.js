import decorateBlog from '../blog/blog.js';

export default async function decorateTemplate(doc) {
  decorateBlog(doc);
  doc.body.classList.add('blog');
}
