/* eslint-disable no-console */
import { promises as fs } from 'fs';
import crypto from 'crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';

const locations = [
  'scripts',
  'styles',
  'templates',
  'blocks',
];

async function processLocations(fileFilter, processFile) {
  const promises = locations.map(async (location) => {
    const files = (await fs.readdir(location, {
      recursive: true,
    })).filter(fileFilter);

    const filePromises = files.map(async (file) => {
      const fullFile = `${location}/${file}`;
      await processFile(fullFile);
    });
    await Promise.all(filePromises);
  });

  await Promise.all(promises);
}

async function copyFileHash(file) {
  const contents = await fs.readFile(file, 'utf-8');
  const shasum = crypto.createHash('sha1');
  shasum.update(contents);
  const hash = shasum.digest('hex');
  const extensionIndex = file.lastIndexOf('.');
  const extension = file.slice(extensionIndex + 1);
  const versionedFile = `${file.slice(0, (extension.length + 1) * -1)}.${hash}.${extension}`;
  await fs.copyFile(file, versionedFile);

  return versionedFile;
}

function isVersioned(file) {
  const parts = file.split('/');
  const last = parts[parts.length - 1];
  const nameSegs = last.split('.');
  return nameSegs.length === 3 && nameSegs[1].match(/^[0-9abcdef]+$/);
}

async function fsExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function clean() {
  await processLocations((file) => file.endsWith('.js') && isVersioned(file), async (file) => {
    console.log(`deleting versioned js: ${file}`);
    await fs.rm(`${file}`);
  });
  await processLocations((file) => file.endsWith('.css') && isVersioned(file), async (file) => {
    console.log(`deleting versioned css: ${file}`);
    await fs.rm(`${file}`);
  });

  // revert head.html
  const headContents = await fs.readFile('head.html', 'utf-8');
  const headDom = new JSDOM(headContents);

  const importMap = headDom.window.document.querySelector('script[type="importmap"]');
  if (importMap) importMap.remove();

  const scriptEls = headDom.window.document.querySelectorAll('script');
  scriptEls.forEach((script) => {
    const src = script.getAttribute('src');
    if (src && isVersioned(src)) {
      const parts = src.split('.');
      parts.splice(parts.length - 2, 1);
      const unversioned = parts.join('.');
      console.log(`reverting versioned js: ${src} -> ${unversioned}`);
      script.setAttribute('src', unversioned);
    }
  });

  const styleEls = headDom.window.document.querySelectorAll('link[rel="stylesheet"]');
  styleEls.forEach((style) => {
    const href = style.getAttribute('href');
    if (href && isVersioned(href)) {
      const parts = href.split('.');
      parts.splice(parts.length - 2, 1);
      const unversioned = parts.join('.');
      console.log(`reverting versioned js: ${href} -> ${unversioned}`);
      style.setAttribute('href', unversioned);
    }
  });

  const newHeadContents = headDom.window.document.documentElement.querySelector('head').innerHTML;
  fs.writeFile('head.html', newHeadContents);

  const exists = await fsExists('scripts/style-import-map.json');
  if (exists) {
    await fs.rm('scripts/style-import-map.json');
  }
}

async function build() {
  await clean();

  const scriptImportMap = {};
  await processLocations((file) => file.endsWith('.js') && !isVersioned(file), async (file) => {
    console.log(`creating versioned js for: ${file}`);
    const updated = await copyFileHash(file);
    scriptImportMap[`/${file}`] = `/${updated}`;
  });

  const styleImportMap = {};
  await processLocations((file) => file.endsWith('.css') && !isVersioned(file), async (file) => {
    console.log(`creating versioned css for: ${file}`);
    const updated = await copyFileHash(file);
    styleImportMap[`/${file}`] = `/${updated}`;
  });

  const headContents = await fs.readFile('head.html', 'utf-8');
  const headDom = new JSDOM(headContents);

  const scriptEls = headDom.window.document.querySelectorAll('script');
  const importMap = headDom.window.document.createElement('script');
  importMap.type = 'importmap';
  importMap.textContent = JSON.stringify({
    imports: {
      ...scriptImportMap,
    },
  }, null, 2);
  scriptEls[0].before(importMap);

  scriptEls.forEach((script) => {
    const src = script.getAttribute('src');
    if (src && scriptImportMap[src]) {
      script.setAttribute('src', scriptImportMap[src]);
    }
  });

  const styleEls = headDom.window.document.querySelectorAll('link[rel="stylesheet"]');
  styleEls.forEach((style) => {
    const href = style.getAttribute('href');
    if (href && styleImportMap[href]) {
      style.setAttribute('href', styleImportMap[href]);
    }
  });

  const newHeadContents = headDom.window.document.documentElement.querySelector('head').innerHTML;
  await fs.writeFile('head.html', newHeadContents);

  await fs.writeFile('scripts/style-import-map.json', JSON.stringify(styleImportMap, null, 2));
}

async function run(args) {
  if (args.includes('--clean')) {
    await clean();
  } else {
    await build();
  }
}

run(process.argv.slice(2));
