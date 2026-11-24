import { describe, it, expect } from 'vitest';
import { fitView } from '../framing';
import { buildQr } from '../../scene/qr';
import { CELL, HEDGE_RING } from '../../scene/constants';

const viewport = { width: 420, height: 800, dockPx: 200 };

describe('fitView', () => {
  it('zooms out in step with a denser QR so it keeps the same on-screen size', () => {
    const small = fitView(20, 20, viewport);
    const large = fitView(40, 40, viewport);
    expect(large.half / small.half).toBeCloseTo(2);
    expect(large.shift / small.shift).toBeCloseTo(2);
  });

  it('keeps the content clear of the dock', () => {
    const fit = fitView(20, 20, viewport);
    expect(fit.shift).toBeGreaterThan(0);
    expect(fit.shift).toBeLessThan(fit.half);
  });

  it('frames real short and long payloads at the same scale', () => {
    const scale = (text: string) => {
      const rim = (buildQr(text).plot + HEDGE_RING * 2) * CELL;
      return fitView(rim / 2, rim / 2, viewport).half / rim;
    };
    expect(scale('https://a.co')).toBeCloseTo(scale('https://example.com/a/very/long/path/with/many/segments'), 6);
  });
});
