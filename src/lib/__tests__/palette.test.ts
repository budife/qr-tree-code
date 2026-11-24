import { describe, it, expect } from 'vitest';
import { resolvePalette } from '../palette';
import { SEASONS, SEASON_ORDER, BLOSSOM_SWATCHES } from '../../scene/palette';

describe('resolvePalette', () => {
  it.each(SEASON_ORDER)('applies the chosen blossom to %s', (season) => {
    for (const swatch of BLOSSOM_SWATCHES) {
      const palette = resolvePalette(season, swatch.id);
      const base = SEASONS[season];

      expect(palette.leaf).toEqual([...swatch.leaf]);
      expect(palette.qrLeaf).toEqual([...swatch.qr]);
      expect(palette.hedge).toEqual([...swatch.hedge]);
      expect(palette.slab).toBe(base.slab);
      expect(palette.ground).toBe(base.ground);
      expect(palette.moduleLight).toBe(base.moduleLight);
      expect(palette.bark).toBe(base.bark);
    }
  });

  it('falls back to the first swatch for an unknown blossom', () => {
    expect(resolvePalette('autumn', 'nope' as never).leaf).toEqual([...BLOSSOM_SWATCHES[0].leaf]);
  });
});
