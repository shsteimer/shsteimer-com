import { renderBlock } from '../../scripts/faintly.js';
import ffetch from '../../scripts/ffetch.js';
import { toClassName } from '../../scripts/aem.js';
import { getOrigin } from '../../scripts/utils.js';

async function fetchPosts(q) {
  let limit = -1;
  let regex = new RegExp(q.trim(), 'idg');
  if (!q.trim()) {
    limit = 5;
    regex = undefined;
  }

  const results = await ffetch('/query-index.json')
    .filter((page) => {
      const isPost = page.template && page.template.toLowerCase() === 'post';
      if (!isPost) return false;

      if (!regex) return true;

      return regex.test(page.title)
      || regex.test(page.description)
      || regex.test(page.category);
    }).limit(limit).all();

  return results;
}

export function formatPostDate({ item }) {
  const d = new Date(0);
  d.setUTCSeconds(item.date);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dateFormatted = `${days[d.getUTCDay()]}, ${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

  return dateFormatted;
}

export function categoryHash({ item }) {
  return `sub-group-controller-categories-${toClassName(item.category)}`;
}

let transitionView = false;
let lastQ;
async function renderResults(block, q = '') {
  if (lastQ === q.trim()) return;
  lastQ = q.trim();

  const render = async () => {
    const posts = await fetchPosts(q);

    await renderBlock(block, {
      query: q,
      posts,
      noPosts: posts.length === 0,
      formatPostDate,
      categoryHash,
    });
  };

  if (document.startViewTransition && transitionView) {
    document.startViewTransition(() => render());
  } else {
    transitionView = true;
    await render();
  }
}

/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  await renderResults(block);

  // search interaction
  const header = document.querySelector('header');
  if (header) {
    header.classList.add('with-search');
  }

  window.addEventListener('message', (msg) => {
    if (msg.origin === getOrigin() && msg.data && msg.data.executeSearch) {
      const { q } = msg.data;
      renderResults(block, q);
    }
  });
}
