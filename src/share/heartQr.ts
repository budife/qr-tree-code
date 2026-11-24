import { buildQr, QUIET_ZONE, type QrMatrix } from '../scene/qr';
import { heartContains } from '../scene/heart';
import { quarterTurn } from '../scene/quarterTurn';

export interface HeartQrRaster {
  width: number;
  data: Uint8ClampedArray<ArrayBuffer>;
  stride: number;
  badge: { x: number; y: number; size: number };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rasterMatrix(
  qr: QrMatrix,
  dark: [number, number, number],
  light: [number, number, number],
  scale: number,
) {
  const width = qr.plot * scale;
  const data = new Uint8ClampedArray(width * width * 4);
  for (let py = 0; py < width; py++) {
    const my = Math.floor(py / scale) - QUIET_ZONE;
    for (let px = 0; px < width; px++) {
      const mx = Math.floor(px / scale) - QUIET_ZONE;
      const inside = mx >= 0 && my >= 0 && mx < qr.size && my < qr.size;
      const c = inside && qr.dark[my * qr.size + mx] ? dark : light;
      const o = (py * width + px) * 4;
      data[o] = c[0];
      data[o + 1] = c[1];
      data[o + 2] = c[2];
      data[o + 3] = 255;
    }
  }
  return { width, data };
}

/**
 * Decorative QR whose dark modules are clipped to a heart, with a normal
 * square QR badge in the middle so the image can still be scanned.
 */
export function heartQrWithBadge(
  text: string,
  darkHex: string,
  lightHex: string,
  scale = 8,
  badgeFraction = 0.34,
): HeartQrRaster {
  const qr = buildQr(text);
  const width = (qr.size + QUIET_ZONE * 2) * scale;
  const data = new Uint8ClampedArray(width * width * 4);
  const dark = hexToRgb(darkHex);
  const light = hexToRgb(lightHex);
  const half = (qr.size - 1) / 2;

  for (let py = 0; py < width; py++) {
    const my = Math.floor(py / scale) - QUIET_ZONE;
    for (let px = 0; px < width; px++) {
      const mx = Math.floor(px / scale) - QUIET_ZONE;
      const inQr = mx >= 0 && my >= 0 && mx < qr.size && my < qr.size;
      const nx = (mx - half) / half;
      const ny = -(my - half) / half;
      const rot = inQr ? quarterTurn(qr.size, mx, my) : null;
      const on = !!rot && qr.dark[rot.y * qr.size + rot.x] && heartContains(nx, ny);
      const c = on ? dark : light;
      const o = (py * width + px) * 4;
      data[o] = c[0];
      data[o + 1] = c[1];
      data[o + 2] = c[2];
      data[o + 3] = 255;
    }
  }

  const target = width * badgeFraction;
  const badgeScale = Math.max(1, Math.floor(target / qr.plot));
  const size = qr.plot * badgeScale;
  const x = Math.round((width - size) / 2);
  const y = Math.round((width - size) / 2);
  const badge = rasterMatrix(qr, dark, light, badgeScale);

  for (let row = 0; row < size; row++) {
    const from = row * size * 4;
    const to = ((y + row) * width + x) * 4;
    data.set(badge.data.subarray(from, from + size * 4), to);
  }

  return { width, data, stride: width, badge: { x, y, size } };
}
