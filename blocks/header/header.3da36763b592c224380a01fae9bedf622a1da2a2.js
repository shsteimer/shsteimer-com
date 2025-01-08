import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getOrigin } from '../../scripts/utils.js';
import { renderBlock } from '../../scripts/faintly.js';

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

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/fragments/nav';
  const fragment = await loadFragment(navPath);

  const brand = fragment.firstElementChild;
  const nav = brand.nextElementSibling;

  await renderBlock(block, {
    fragment,
    brandLinks: () => brand.querySelectorAll('a'),
    navItems: () => nav.querySelector('ul').querySelectorAll('li'),
    searchIcon: ({ item }) => item.querySelector('.icon-search'),
    notSearch: ({ item }) => !item.querySelector('.icon-search'),
  });

  const navEl = block.querySelector('nav');
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

  const searchForm = block.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => e.preventDefault());

    const searchInput = searchForm.querySelector('input');
    searchInput.addEventListener('keyup', () => {
      debounce(() => {
        const q = searchInput.value;
        window.postMessage({ executeSearch: true, q }, getOrigin());
      }, 300);
    });
  }
}
