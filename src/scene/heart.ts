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

