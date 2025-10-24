import {
  describe, it, expect, beforeEach,
} from 'vitest';
import { checkDomain, linkTextIncludesHref } from '../../scripts/utils.js';

describe('checkDomain', () => {
  describe('production domains', () => {
    it('should identify production domain', () => {
      const result = checkDomain('https://www.shsteimer.com/path/to/page');
      expect(result.isProd).toBe(true);
      expect(result.isKnown).toBe(true);
      expect(result.isExternal).toBe(false);
      expect(result.isHlx).toBe(false);
      expect(result.isLocal).toBe(false);
      expect(result.isPreview).toBe(false);
    });

    it('should not identify subdomain as production (www is required)', () => {
      // blog.shsteimer.com doesn't include www.shsteimer.com
      const result = checkDomain('https://blog.shsteimer.com/path');
      expect(result.isProd).toBe(false);
      expect(result.isKnown).toBe(false);
      expect(result.isExternal).toBe(true);
    });
  });

  describe('AEM domains', () => {
    it('should identify hlx.page domain', () => {
      const result = checkDomain('https://main--repo--owner.hlx.page/path');
      expect(result.isHlx).toBe(true);
      expect(result.isKnown).toBe(true);
      expect(result.isExternal).toBe(false);
      expect(result.isPreview).toBe(true);
      expect(result.isProd).toBe(false);
      expect(result.isLocal).toBe(false);
    });

    it('should identify hlx.live domain', () => {
      const result = checkDomain('https://main--repo--owner.hlx.live/path');
      expect(result.isHlx).toBe(true);
      expect(result.isKnown).toBe(true);
      expect(result.isExternal).toBe(false);
      expect(result.isPreview).toBe(false);
      expect(result.isProd).toBe(false);
      expect(result.isLocal).toBe(false);
    });

    it('should identify aem.page domain', () => {
      const result = checkDomain('https://main--repo--owner.aem.page/path');
      expect(result.isHlx).toBe(true);
      expect(result.isKnown).toBe(true);
      expect(result.isPreview).toBe(true);
      expect(result.isExternal).toBe(false);
    });

    it('should identify aem.live domain', () => {
      const result = checkDomain('https://main--repo--owner.aem.live/path');
      expect(result.isHlx).toBe(true);
      expect(result.isKnown).toBe(true);
      expect(result.isPreview).toBe(false);
      expect(result.isExternal).toBe(false);
    });
  });

  describe('localhost', () => {
    it('should identify localhost', () => {
      const result = checkDomain('http://localhost:3000/path');
      expect(result.isLocal).toBe(true);
      expect(result.isKnown).toBe(true);
      expect(result.isPreview).toBe(true);
      expect(result.isExternal).toBe(false);
      expect(result.isProd).toBe(false);
      expect(result.isHlx).toBe(false);
    });

    it('should identify localhost without port', () => {
      const result = checkDomain('http://localhost/path');
      expect(result.isLocal).toBe(true);
      expect(result.isKnown).toBe(true);
      expect(result.isPreview).toBe(true);
    });
  });

  describe('external domains', () => {
    it('should identify external domain', () => {
      const result = checkDomain('https://example.com/path');
      expect(result.isExternal).toBe(true);
      expect(result.isKnown).toBe(false);
      expect(result.isProd).toBe(false);
      expect(result.isHlx).toBe(false);
      expect(result.isLocal).toBe(false);
      expect(result.isPreview).toBe(false);
    });

    it('should identify another external domain', () => {
      const result = checkDomain('https://adobe.com/products');
      expect(result.isExternal).toBe(true);
      expect(result.isKnown).toBe(false);
    });
  });

  describe('URL input handling', () => {
    it('should accept string URLs', () => {
      const result = checkDomain('https://www.shsteimer.com');
      expect(result.isProd).toBe(true);
    });

    it('should accept URL objects', () => {
      const url = new URL('https://www.shsteimer.com/path');
      const result = checkDomain(url);
      expect(result.isProd).toBe(true);
    });
  });

  describe('caching', () => {
    it('should cache results for same hostname', () => {
      // First call
      const result1 = checkDomain('https://www.shsteimer.com/page1');
      // Second call with same hostname but different path
      const result2 = checkDomain('https://www.shsteimer.com/page2');

      // Both should return same result object (cached)
      expect(result1).toBe(result2);
    });

    it('should not cache different hostnames', () => {
      const result1 = checkDomain('https://www.shsteimer.com');
      const result2 = checkDomain('https://example.com');

      expect(result1).not.toBe(result2);
    });
  });
});

describe('linkTextIncludesHref', () => {
  let link;

  beforeEach(() => {
    // Create a fresh link element for each test
    link = document.createElement('a');
  });

  it('should return true when text content includes href', () => {
    link.href = 'https://example.com';
    link.textContent = 'Visit https://example.com for more info';

    expect(linkTextIncludesHref(link)).toBe(true);
  });

  it('should return false when text content does not include href', () => {
    link.href = 'https://example.com';
    link.textContent = 'Click here';

    expect(linkTextIncludesHref(link)).toBe(false);
  });

  it('should return true for exact match', () => {
    link.href = 'https://example.com/path';
    link.textContent = 'https://example.com/path';

    expect(linkTextIncludesHref(link)).toBe(true);
  });

  it('should return true for partial match in longer text', () => {
    link.href = '/path/to/page';
    link.textContent = 'Check out /path/to/page for details';

    expect(linkTextIncludesHref(link)).toBe(true);
  });

  it('should return false for empty text content', () => {
    link.href = 'https://example.com';
    link.textContent = '';

    expect(linkTextIncludesHref(link)).toBe(false);
  });

  it('should handle relative URLs', () => {
    link.href = '/relative/path';
    link.textContent = 'Go to /relative/path';

    expect(linkTextIncludesHref(link)).toBe(true);
  });
});
