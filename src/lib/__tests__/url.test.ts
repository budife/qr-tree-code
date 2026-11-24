import { describe, it, expect } from 'vitest';
import { DEFAULT_URL, normalizeLink } from '../url';

describe('normalizeLink', () => {
  it('falls back to the default link for blank input', () => {
    expect(normalizeLink('')).toBe(DEFAULT_URL);
    expect(normalizeLink('   ')).toBe(DEFAULT_URL);
  });

  it('prepends https:// when the protocol is missing', () => {
    expect(normalizeLink('example.com/path')).toBe('https://example.com/path');
  });

  it('keeps an explicit http(s) link unchanged after trimming', () => {
    expect(normalizeLink(' http://foo.test/x ')).toBe('http://foo.test/x');
    expect(normalizeLink('HTTPS://Bar.test')).toBe('HTTPS://Bar.test');
  });
});
