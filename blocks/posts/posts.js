import ffetch from '../../scripts/ffetch.js';
import {
  p, ul, li, h2, a,
} from '../../scripts/dom-helpers.js';
import { toClassName } from '../../scripts/aem.js';
import { getOrigin } from '../../scripts/utils.js';

export function createPostDate(post) {
  const d = new Date(0);
  d.setUTCSeconds(post.date);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dateFormatted = `${days[d.getUTCDay()]}, ${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

  return p({ class: 'post-date' }, `Posted on ${dateFormatted} in `, a({ href: `/blog/archives#categories:${toClassName(post.category)}` }, post.category));
}

let lastQ;
async function renderResults(block, results, q = '') {
  if (lastQ === q.trim()) return;
  lastQ = q.trim();

  const render = async () => {
    const posts = block.querySelector('.posts-list') || ul({ class: 'posts-list' });
    posts.innerHTML = '';
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

    if (q.trim()) {
      if (block.querySelector('.posts-list:empty')) {
        block.querySelector('.posts-list:empty').append(li({ class: 'post-item' }, 'No Results Found'));
      } else {
        block.querySelectorAll('.post-item').forEach((item) => {
          const regex = new RegExp(q.trim(), 'idg');
          const title = item.querySelector('h2');
          title.innerHTML = title.innerHTML.replaceAll(regex, (match) => `<mark>${match}</mark>`);

          const category = item.querySelector('.post-date a');
          category.innerHTML = category.innerHTML.replaceAll(regex, (match) => `<mark>${match}</mark>`);

          const description = item.querySelector('.post-description');
          description.innerHTML = description.innerHTML.replaceAll(regex, (match) => `<mark>${match}</mark>`);
        });
      }
    }
  };
  if (!document.startViewTransition) {
    await render();
  } else {
    document.startViewTransition(() => render());
  }
}

async function renderInitialResults(block) {
  const results = ffetch('/query-index.json')
    .filter((page) => page.template && page.template.toLowerCase() === 'post')
    .limit(5);

  renderResults(block, results);
}

/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  block.innerHTML = '';
  renderInitialResults(block);

  // search interaction
  const header = document.querySelector('header');
  if (header) {
    header.classList.add('with-search');
  }

  window.addEventListener('message', (msg) => {
    if (msg.origin === getOrigin() && msg.data && msg.data.executeSearch) {
      const { q } = msg.data;
      if (!q.trim()) {
        renderInitialResults(block);
        return;
      }
      const regex = new RegExp(q.trim(), 'idg');
      const searchResults = ffetch('/query-index.json').filter((page) => {
        const isPost = page.template && page.template.toLowerCase() === 'post';
        if (!isPost) return false;

        return regex.test(page.title)
          || regex.test(page.description)
          || regex.test(page.category);
      });

      renderResults(block, searchResults, q);
    }
  });
}
