import {
  BLOSSOM_SWATCHES,
  SEASONS,
  type BlossomId,
  type Palette,
  type SeasonId,
} from '../scene/palette';

/** Season defines the setting; the blossom swatch defines the foliage tones. */
export function resolvePalette(season: SeasonId, blossom: BlossomId): Palette {
  const base = SEASONS[season];
  const swatch = BLOSSOM_SWATCHES.find((s) => s.id === blossom) ?? BLOSSOM_SWATCHES[0];

  return {
    ...base,
    leaf: [...swatch.leaf],
    qrLeaf: [...swatch.qr],
    hedge: [...swatch.hedge],
  };
}
