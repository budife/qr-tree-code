import { describe, it, expect } from 'vitest';
import { resolvePalette } from '../palette';
import { SEASONS, SEASON_ORDER, BLOSSOM_SWATCHES } from '../../scene/palette';

describe('resolvePalette', () => {
  it.each(SEASON_ORDER)('uses first blossom swatch for %s', (season) => {
    const palette = resolvePalette(season);
    const base = SEASONS[season];
    const swatch = BLOSSOM_SWATCHES[0];

    expect(palette.leaf).toEqual([...swatch.leaf]);
    expect(palette.qrLeaf).toEqual([...swatch.qr]);
    expect(palette.hedge).toEqual([...swatch.hedge]);
    expect(palette.slab).toBe(base.slab);
    expect(palette.ground).toBe(base.ground);
    expect(palette.moduleLight).toBe(base.moduleLight);
    expect(palette.bark).toBe(base.bark);
  });
});
