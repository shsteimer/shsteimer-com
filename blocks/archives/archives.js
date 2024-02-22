import ffetch from '../../scripts/ffetch.js';
import {
  div, ul, li, h2, a,
} from '../../scripts/dom-helpers.js';
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  const structured = {
    Categories: {},
    Tags: {},
    Date: {},
  };

  const results = ffetch('/query-index.json')
    .filter((p) => p.template && p.template.toLowerCase() === 'post');
  // eslint-disable-next-line no-restricted-syntax
  for await (const res of results) {
    const {
      category, tags, date,
    } = res;

    const byCat = structured.Categories[category] || [];
    byCat.push(res);
    structured.Categories[category] = byCat;

    JSON.parse(tags).forEach((tag) => {
      const byTag = structured.Tags[tag] || [];
      byTag.push(res);
      structured.Tags[tag] = byTag;
    });

    const d = new Date(0);
    d.setUTCSeconds(date);

    const byYear = structured.Date[d.getFullYear()] || [];
    byYear.push(res);
    structured.Date[d.getFullYear()] = byYear;
  }

  block.innerHTML = '';
  Object.keys(structured).forEach((group) => {
    const el = div(
      { class: 'archive-group' },
      h2(group),
      div(
        { class: 'archive-group-inner' },
        ul({ class: 'group-list' }),
      ),
    );
    const list = el.querySelector('ul');
    Object.keys(structured[group]).forEach((subGroup) => {
      const posts = structured[group][subGroup];
      const listItem = li(
        { id: `sub-group-${toClassName(group)}-${toClassName(subGroup)}`, 'aria-expanded': 'false' },
        a(
          {
            role: 'button',
            'aria-controls': `sub-group-${toClassName(group)}-${toClassName(subGroup)}`,
            class: 'sub-group-controller',
            href: `/blog/archives#${toClassName(group)}:${toClassName(subGroup)}`,
          },
          `${subGroup} (${posts.length})`,
        ),
        div({ class: 'expander' }, ul({ class: 'sub-group-list' })),
      );
      const subList = listItem.querySelector('ul');
      list.append(listItem);

      posts.forEach((post) => {
        subList.append(
          li(
            a(
              { href: post.path },
              post.title,
            ),
          ),
        );
      });
    });
    block.append(el);
  });

  block.querySelectorAll('.sub-group-controller').forEach((controller) => {
    if (block.classList.contains('simple')) {
      controller.removeAttribute('role');
      controller.removeAttribute('aria-controls');
    } else {
      controller.addEventListener('click', (e) => {
        e.preventDefault();
        const controls = block.querySelector(`#${controller.getAttribute('aria-controls')}`);
        const expanded = controls.getAttribute('aria-expanded') === 'true';
        controls.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    }
  });

  const { hash } = window.location;
  if (hash && hash.includes(':')) {
    const splitHash = hash.substring(1).split(':');
    const target = block.querySelector(`#sub-group-${splitHash[0]}-${splitHash[1]}`);
    if (target) {
      target.setAttribute('aria-expanded', true);
    }
  }
}
