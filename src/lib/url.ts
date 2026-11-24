/** Link encoded when the visitor has not typed anything yet. */
export const DEFAULT_URL = 'https://example.com';

/**
 * Trims a pasted link and supplies a protocol when one is missing.
 * Blank input falls back to DEFAULT_URL so the scene always has a payload.
 */
export function normalizeLink(input: string): string {
  const value = input.trim();
  if (!value) return DEFAULT_URL;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}
