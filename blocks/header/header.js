import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { div, nav } from '../../scripts/dom-helpers.js';

const decorateNav = (navSection) => {
  if (navSection) {
    const navList = navSection.querySelector('ul');
    const seach = navSection.querySelector('.icon-search');
    const navEl = nav({ id: 'nav' });
    navEl.append(navList);
    navEl.append(seach);
    navSection.replaceChildren(navEl);
  }
};

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/fragments/nav';
  const fragment = await loadFragment(navPath);

  // decorate header DOM
  const header = div({ class: 'header-container' });
  const sections = ['nav', 'brand'];
  let sectionCount = 0;
  while (fragment.firstElementChild) {
    const section = fragment.firstElementChild;
    section.classList.add(`header-${sections[sectionCount]}`);
    header.append(section);
    sectionCount += 1;
  }

  const navSection = header.querySelector('.header-nav');
  decorateNav(navSection);

  block.append(header);
}
