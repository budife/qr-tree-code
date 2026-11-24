export interface Viewport {
  width: number;
  height: number;
  /** CSS pixels of the viewport covered by the control dock. */
  dockPx: number;
  margin?: number;
}

export interface Framing {
  /** Camera half-height needed to fit the content above the dock. */
  half: number;
  /** Upward camera shift so that usable strip is centred. */
  shift: number;
}

/**
 * Fits content into the strip above the dock. The result scales linearly with
 * the content extent, so a denser (physically larger) QR is zoomed out instead
 * of filling more of the screen.
 */
export function fitView(halfW: number, halfV: number, viewport: Viewport): Framing {
  const { width, height, dockPx, margin = 1.05 } = viewport;
  const dock = Math.min(dockPx + 18, height * 0.5);
  const usable = Math.max(height - dock, height * 0.4);
  const aspect = Math.max(width, 1) / Math.max(height, 1);
  const half = Math.max(halfV * (height / usable), halfW / aspect) * margin;
  return { half, shift: (half * dock) / height };
}
