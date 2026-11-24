import { describe, it, expect } from 'vitest';
import { shouldRenderFrame } from '../frame';

const state = (over: Partial<Parameters<typeof shouldRenderFrame>[0]>) => ({
  morph: 0,
  morphTarget: 0,
  dirty: false,
  frame: 10,
  ...over,
});

describe('shouldRenderFrame', () => {
  it('renders the first frames so the canvas is never blank', () => {
    expect(shouldRenderFrame(state({ frame: 0, morph: 1, morphTarget: 1 }))).toBe(true);
  });

  it('renders while the canopy is morphing', () => {
    expect(shouldRenderFrame(state({ morph: 0.4, morphTarget: 1 }))).toBe(true);
  });

  it('renders in tree view because drifting motes animate', () => {
    expect(shouldRenderFrame(state({ morph: 0, morphTarget: 0 }))).toBe(true);
  });

  it('skips a settled code view until something changes', () => {
    expect(shouldRenderFrame(state({ morph: 1, morphTarget: 1 }))).toBe(false);
    expect(shouldRenderFrame(state({ morph: 1, morphTarget: 1, dirty: true }))).toBe(true);
  });
});
