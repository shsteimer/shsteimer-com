/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const pars = block.querySelectorAll('p');
  const bq = document.createElement('blockquote');

  bq.append(...pars);

  block.replaceChildren(bq);
}
