import ffetch from '../../scripts/ffetch.js';
import { renderBlock } from '../../scripts/faintly.js';
import { toClassName } from '../../scripts/aem.js';

const gatherData = async () => {
  const structured = {
    Categories: {},
    Date: {},
    Tags: {},
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

  structured.Date.orderedKeys = Object.keys(structured.Date).sort((yearA, yearB) => {
    const aNum = Number(yearA);
    const bNum = Number(yearB);

    // should never happen but JIC
    if (Number.isNaN(aNum) || Number.isNaN(bNum)) return 0;

    return bNum - aNum;
  });
  structured.Tags.orderedKeys = Object.keys(structured.Tags).sort((tagA, tagB) => {
    const aCount = structured.Tags[tagA].length;
    const bCount = structured.Tags[tagB].length;

    return bCount - aCount;
  });
  structured.Categories.orderedKeys = Object.keys(structured.Categories).sort((catA, catB) => {
    const aCount = structured.Categories[catA].length;
    const bCount = structured.Categories[catB].length;

    return bCount - aCount;
  });

  return structured;
};

/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const structured = await gatherData();
  await renderBlock(block, {
    archivedPosts: structured,
    groupClassName: ({ groupKey }) => toClassName(groupKey),
    subGroupClassName: ({ subgroup }) => toClassName(subgroup),
    posts: ({ group, subgroup }) => group[subgroup],
  });

  block.querySelectorAll('.sub-group-controller').forEach((controller) => {
    if (block.classList.contains('simple')) {
      controller.removeAttribute('role');
      controller.removeAttribute('aria-controls');
    } else {
      controller.addEventListener('click', (e) => {
        e.preventDefault();
        const expanded = controller.getAttribute('aria-expanded') === 'true';
        controller.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    }
  });

  const { hash } = window.location;
  if (hash) {
    const target = block.querySelector(hash);
    if (target) {
      target.setAttribute('aria-expanded', true);
    }
  }
}
