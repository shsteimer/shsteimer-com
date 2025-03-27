import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // load footer fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta.footer || '/fragments/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  footer.className = 'footer-container';

  const sections = ['social', 'copyright'];
  let sectionCount = 0;
  while (fragment.firstElementChild) {
    const section = fragment.firstElementChild;
    section.classList.add(`footer-${sections[sectionCount]}`);
    footer.append(section);
    sectionCount += 1;
  }

  const social = footer.querySelector('.footer-social');
  if (social) {
    const socialLinks = social.querySelectorAll('a');
    socialLinks.forEach((link) => {
      const icon = link.querySelector('[data-icon-name]');
      if (icon) {
        link.title = `Visit ${icon.dataset.iconName}`;
      }
    });
    social.replaceChildren(...socialLinks);
  }

  const curYear = (new Date()).getFullYear();
  footer.innerHTML = footer.innerHTML.replace('{year}', curYear);

  block.append(footer);
}
