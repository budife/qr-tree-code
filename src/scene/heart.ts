export interface HeartPoint {
  x: number;
  y: number;
}

/** Classic parametric heart, raw coordinates before scaling. */
export function heartPoint(t: number): HeartPoint {
  return {
    x: 16 * Math.sin(t) ** 3,
    y: 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t),
  };
}

/** Closed outline in counter-clockwise order, ready for THREE.Shape. */
export function heartPolygon(segments = 180): HeartPoint[] {
  const points: HeartPoint[] = [];
  for (let i = 0; i < segments; i++) {
    points.push(heartPoint((i / segments) * Math.PI * 2));
  }

  let area = 0;
  for (let i = 0, j = segments - 1; i < segments; j = i++) {
    area += points[j].x * points[i].y - points[i].x * points[j].y;
  }
  if (area < 0) points.reverse();

  return points;
}

const NORMALISED = heartPolygon(180).map((p) => ({ x: p.x / 16, y: p.y / 16 }));

/** Point-in-outline test on the normalised heart (roughly -1..1). */
export function heartContains(x: number, y: number) {
  let hit = false;
  for (let i = 0, j = NORMALISED.length - 1; i < NORMALISED.length; j = i++) {
    const a = NORMALISED[i];
    const b = NORMALISED[j];
    if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) {
      hit = !hit;
    }
  }
  return hit;
}
