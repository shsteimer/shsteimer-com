import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import {
  div, nav, button, span, form, input, label,
} from '../../scripts/dom-helpers.js';
import { getOrigin } from '../../scripts/utils.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

const closeOnEscape = (e) => {
  if (e.code === 'Escape') {
    const navEl = document.getElementById('nav');
    if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(navEl);
      navEl.querySelector('.nav-hamburger button').focus();
    }
  }
};

const toggleMenu = (navEl, forceExpanded = null) => {
  const expanded = forceExpanded !== null ? !forceExpanded : navEl.getAttribute('aria-expanded') === 'true';
  const hamburgerButton = navEl.querySelector('.nav-hamburger button');
  navEl.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  hamburgerButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
};

let tId;
function debounce(method, delay) {
  clearTimeout(tId);
  tId = setTimeout(() => {
    method();
  }, delay);
}

const decorateNav = (navSection, brandSection) => {
  if (navSection) {
    const navList = navSection.querySelector('ul');
    navList.classList.add('nav-list');
    const navEl = nav(
      { id: 'nav', 'aria-expanded': 'false' },
      div(
        { class: 'nav-hamburger' },
        button(
          { type: 'button', 'aria-controls': 'nav', 'aria-label': 'Open navigation' },
          span({ class: 'nav-hamburger-icon' }),
        ),
      ),
    );
    navEl.append(navList);
    navSection.before(navEl);
    navSection.remove();

    // hamburger for mobile
    const hamburger = navEl.querySelector('.nav-hamburger');
    hamburger.addEventListener('click', () => toggleMenu(navEl));

    // prevent mobile nav behavior on window resize
    toggleMenu(navEl, isDesktop.matches);
    isDesktop.addEventListener('change', () => {
      navEl.classList.add('no-transition');
      toggleMenu(navEl, isDesktop.matches);
      setTimeout(() => {
        navEl.classList.remove('no-transition');
      }, 1000);
    });

    const searchIcon = navEl.querySelector('.icon-search');
    if (searchIcon) {
      const searchForm = form(
        { class: 'search-form' },
        div(
          { class: 'field-wrapper' },
          label({ for: 'search-input', class: 'sr-only' }, 'Search'),
          input({ placeholder: 'Search', id: 'search-input' }),
          searchIcon.cloneNode(true),
        ),
      );
      navEl.querySelector('.icon-search').replaceWith(searchForm);
      searchForm.addEventListener('submit', (e) => e.preventDefault());

      const searchInput = searchForm.querySelector('input');
      searchInput.addEventListener('keyup', () => {
        debounce(() => {
          const q = searchInput.value;
          window.postMessage({ executeSearch: true, q }, getOrigin());
        }, 300);
      });
    }

    if (brandSection) {
      const brandLinks = brandSection.querySelectorAll('a');
      const brandWrapper = div({ class: 'nav-brand' });
      brandWrapper.append(...brandLinks);
      navEl.append(brandWrapper);
      brandSection.remove();
    }
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
  const navContainer = div({ class: 'nav-container' });
  const sections = ['brand', 'nav'];
  let sectionCount = 0;
  while (fragment.firstElementChild) {
    const section = fragment.firstElementChild;
    section.classList.add(`header-${sections[sectionCount]}`);
    navContainer.append(section);
    sectionCount += 1;
  }

  const navSection = navContainer.querySelector('.header-nav');
  const brandSection = navContainer.querySelector('.header-brand');
  decorateNav(navSection, brandSection);

  block.append(navContainer);
}
