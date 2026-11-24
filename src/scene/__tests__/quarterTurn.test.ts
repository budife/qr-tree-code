import { describe, it, expect } from 'vitest';
import { quarterTurn } from '../quarterTurn';

describe('quarterTurn', () => {
  it('rotates module coordinates a quarter turn clockwise', () => {
    expect(quarterTurn(21, 0, 0)).toEqual({ x: 0, y: 20 });
    expect(quarterTurn(21, 20, 0)).toEqual({ x: 0, y: 0 });
    expect(quarterTurn(21, 0, 20)).toEqual({ x: 20, y: 20 });
  });

  it('returns to the original coordinate after four turns', () => {
    let p = { x: 3, y: 7 };
    for (let i = 0; i < 4; i++) p = quarterTurn(21, p.x, p.y);
    expect(p).toEqual({ x: 3, y: 7 });
  });
});
