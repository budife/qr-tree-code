/** Rotate a module coordinate a quarter turn clockwise within a square matrix. */
export function quarterTurn(size: number, x: number, y: number) {
  return { x: y, y: size - 1 - x };
}
