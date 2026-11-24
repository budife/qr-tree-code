import { describe, it, expect } from 'vitest';
import { seasonForMonth, currentSeason } from '../season';

describe('seasonForMonth', () => {
  it('maps each northern-hemisphere month to its season', () => {
    const expected = [
      'winter', 'winter', 'spring', 'spring', 'spring',
      'summer', 'summer', 'summer', 'autumn', 'autumn',
      'autumn', 'winter',
    ];
    expected.forEach((season, month) => expect(seasonForMonth(month)).toBe(season));
  });
});

describe('currentSeason', () => {
  it('reads the month from the injected date', () => {
    expect(currentSeason(new Date(2026, 10, 24))).toBe('autumn');
    expect(currentSeason(new Date(2026, 5, 24))).toBe('summer');
  });
});
