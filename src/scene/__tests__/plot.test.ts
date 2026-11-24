import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { buildQr } from '../qr';
import { buildPlot, HEART_EXTENT } from '../plot';
import { SEASONS } from '../palette';

describe('buildPlot', () => {
  it('uses a heart-shaped foundation wider than the square QR plot', () => {
    const qr = buildQr('https://example.com');
    const plot = buildPlot(qr, SEASONS.spring);

    expect(plot.slab.geometry.type).toBe('ExtrudeGeometry');
    plot.slab.geometry.computeBoundingBox();
    const box = plot.slab.geometry.boundingBox!;
    expect(box.max.x - box.min.x).toBeCloseTo(qr.plot * HEART_EXTENT, 0);
    expect(box.max.z - box.min.z).toBeGreaterThan(qr.plot);
  });

  it('keeps the square module grid and the quiet zone clear of grass', () => {
    const qr = buildQr('https://example.com');
    const plot = buildPlot(qr, SEASONS.spring);
    expect(plot.tiles.count).toBe(qr.plot * qr.plot);

    const matrix = new THREE.Matrix4();
    const point = new THREE.Vector3();
    for (let i = 0; i < plot.hedge.count; i++) {
      plot.hedge.getMatrixAt(i, matrix);
      point.setFromMatrixPosition(matrix);
      expect(Math.max(Math.abs(point.x), Math.abs(point.z))).toBeGreaterThan(qr.plot / 2);
    }
  });
});
