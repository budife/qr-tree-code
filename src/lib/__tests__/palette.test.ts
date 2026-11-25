import { describe, it, expect } from 'vitest';
import { resolvePalette } from '../palette';
import { SEASONS, SEASON_ORDER } from '../../scene/palette';

describe('resolvePalette', () => {
  it.each(SEASON_ORDER)('returns the full season palette for %s', (season) => {
    const palette = resolvePalette(season);
    const expected = SEASONS[season];

    expect(palette).toEqual(expected);
    expect(palette.id).toBe(season);
    expect(palette.leaf).toEqual(expected.leaf);
    expect(palette.qrLeaf).toEqual(expected.qrLeaf);
    expect(palette.hedge).toEqual(expected.hedge);
    expect(palette.bark).toBe(expected.bark);
    expect(palette.ground).toBe(expected.ground);
    expect(palette.moduleDark).toBe(expected.moduleDark);
    expect(palette.moduleLight).toBe(expected.moduleLight);
  });
});
