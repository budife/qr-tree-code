import type { SeasonId } from '../scene/palette';

/** Northern-hemisphere default used until the visitor picks a season. */
export function seasonForMonth(month: number): SeasonId {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

export function currentSeason(date = new Date()): SeasonId {
  return seasonForMonth(date.getMonth());
}
