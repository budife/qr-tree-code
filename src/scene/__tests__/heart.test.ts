import { describe, it, expect } from 'vitest';
import { heartPolygon, heartContains } from '../heart';

function inside(x: number, y: number, poly: Array<{ x: number; y: number }>) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) {
      hit = !hit;
    }
  }
  return hit;
}

describe('heartPolygon', () => {
  const points = heartPolygon(360);

  it('traces the classic heart bounds', () => {
    expect(Math.max(...points.map((p) => p.x))).toBeCloseTo(16, 0);
    expect(Math.min(...points.map((p) => p.x))).toBeCloseTo(-16, 0);
    expect(Math.min(...points.map((p) => p.y))).toBeCloseTo(-17, 0);
  });

  it('fully contains the square plot, including the concave notch', () => {
    const scale = 2.4;
    const offset = -2;
    const poly = points.map((p) => ({
      x: (scale * p.x) / 16,
      y: (scale * (p.y - offset)) / 16,
    }));
    for (const f of [-1, -0.5, 0, 0.5, 1]) {
      for (const g of [-1, -0.5, 0, 0.5, 1]) expect(inside(f, g, poly)).toBe(true);
    }
  });
});

describe('heartContains', () => {
  it('keeps the heart upright: point down, notch up', () => {
    expect(heartContains(0, -0.5)).toBe(true);
    expect(heartContains(0, 0.5)).toBe(false);
    expect(heartContains(0.8, 0.3)).toBe(true);
  });
});
