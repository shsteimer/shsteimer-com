/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  // Extract the image from the first row
  const rows = block.querySelectorAll(':scope > div');
  const imageRow = rows[0];
  const contentRow = rows[1];

  // Get the picture element and set it as background
  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      // Set the image as a background using CSS variable
      block.style.setProperty('--hero-bg-image', `url(${img.src})`);
    }
  }

  // Create content container with heading and optional description
  const contentDiv = document.createElement('div');
  contentDiv.className = 'hero-content';

  if (contentRow) {
    const heading = contentRow.querySelector('h1');
    const description = contentRow.querySelector('p');

    if (heading) {
      contentDiv.append(heading);
    }
    if (description) {
      contentDiv.append(description);
    }
  }

  // Replace block content with the new structure
  block.replaceChildren(contentDiv);
}

