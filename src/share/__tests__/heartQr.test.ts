import { describe, it, expect } from 'vitest';
import jsQR from 'jsqr';
import { heartQrWithBadge } from '../heartQr';

const LINKS = [
  'https://example.com',
  'https://budd.my.id/qr',
  'https://instagram.com/username?ref=qr-tree-code&utm_source=share',
];

describe('heartQrWithBadge', () => {
  it.each(LINKS)('keeps a scannable QR badge for %s', (link) => {
    const { data, stride, badge } = heartQrWithBadge(link, '#5e2340', '#fef5f9', 12, 0.4);
    const cropped = new Uint8ClampedArray(badge.size * badge.size * 4);
    for (let y = 0; y < badge.size; y++) {
      const from = ((badge.y + y) * stride + badge.x) * 4;
      cropped.set(data.subarray(from, from + badge.size * 4), y * badge.size * 4);
    }
    expect(jsQR(cropped, badge.size, badge.size)?.data).toBe(link);
  });
});
