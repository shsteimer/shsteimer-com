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

async function revertDomFile(file) {
  const fileContents = await fs.readFile(file, 'utf-8');
  const dom = new JSDOM(fileContents);

  const importMap = dom.window.document.querySelector('script[type="importmap"]');
  if (importMap) importMap.remove();

  const scriptEls = dom.window.document.querySelectorAll('script');
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

  const styleEls = dom.window.document.querySelectorAll('link[rel="stylesheet"]');
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

  return dom;
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

  const exists = await fsExists('scripts/style-import-map.json');
  if (exists) {
    await fs.rm('scripts/style-import-map.json');
  }

  const headDom = await revertDomFile('head.html');
  const newHeadContents = headDom.window.document.documentElement.querySelector('head').innerHTML;
  await fs.writeFile('head.html', newHeadContents);

  const errorDom = await revertDomFile('404.html');
  const newErrorContents = errorDom.window.document.documentElement.outerHTML;
  await fs.writeFile('404.html', newErrorContents);
}

async function rewriteDomFile(file, scriptImportMap, styleImportMap) {
  const fileContents = await fs.readFile(file, 'utf-8');
  const dom = new JSDOM(fileContents);

  const scriptEls = dom.window.document.querySelectorAll('script');
  const importMap = dom.window.document.createElement('script');
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

  const styleEls = dom.window.document.querySelectorAll('link[rel="stylesheet"]');
  styleEls.forEach((style) => {
    const href = style.getAttribute('href');
    if (href && styleImportMap[href]) {
      style.setAttribute('href', styleImportMap[href]);
    }
  });

  return dom;
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
  await fs.writeFile('scripts/style-import-map.json', JSON.stringify(styleImportMap, null, 2));

  const headDom = await rewriteDomFile('head.html', scriptImportMap, styleImportMap);
  const newHeadContents = headDom.window.document.documentElement.querySelector('head').innerHTML;
  await fs.writeFile('head.html', newHeadContents);

  const errorDom = await rewriteDomFile('404.html', scriptImportMap, styleImportMap);
  const newErrorContents = errorDom.window.document.documentElement.outerHTML;
  await fs.writeFile('404.html', newErrorContents);
}

async function run(args) {
  if (args.includes('--clean')) {
    await clean();
  } else {
    await build();
  }
}

run(process.argv.slice(2));
