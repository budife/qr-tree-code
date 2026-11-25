import {
  BLOSSOM_SWATCHES,
  SEASONS,
  type Palette,
  type SeasonId,
} from '../scene/palette';

/** Season defines the setting; the first blossom swatch defines the foliage tones. */
export function resolvePalette(season: SeasonId): Palette {
  const base = SEASONS[season];
  const swatch = BLOSSOM_SWATCHES[0];

  return {
    ...base,
    leaf: [...swatch.leaf],
    qrLeaf: [...swatch.qr],
    hedge: [...swatch.hedge],
  };
}
