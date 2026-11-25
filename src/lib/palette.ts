import {
  SEASONS,
  type Palette,
  type SeasonId,
} from '../scene/palette';

/** Season defines the palette — each season has its own complete colour set. */
export function resolvePalette(season: SeasonId): Palette {
  return SEASONS[season];
}
