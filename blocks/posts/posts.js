import ffetch from '../../scripts/ffetch.js';
import {
  p, ul, li, h2, a,
} from '../../scripts/dom-helpers.js';

export function createPostDate(post) {
  let d = post.date;
  if (!(d instanceof Date)) {
    d = new Date(0);
    d.setUTCSeconds(post.date);
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dateFormatted = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  return p({ class: 'post-date' }, `Posted on ${dateFormatted} in ${post.category}`);
}

export default async function decorate(block) {
  const results = ffetch('/query-index.json')
    .filter((page) => page.template && page.template.toLowerCase() === 'post')
    .limit(5);

  block.innerHTML = '';
  const posts = ul({ class: 'posts-list' });
  block.append(posts);
  // eslint-disable-next-line no-restricted-syntax
  for await (const res of results) {
    const d = new Date(0);
    d.setUTCSeconds(res.date);

    const post = li(
      { class: 'post-item' },
      a({ href: res.path, class: 'post-title' }, h2(res.title)),
      createPostDate(res),
      p({ class: 'post-description' }, res.description),
      a({ href: res.path }, 'Read More...'),
    );
    posts.append(post);
  }
}
