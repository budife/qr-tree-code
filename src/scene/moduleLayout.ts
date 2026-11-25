import { moduleToWorld, QUIET_ZONE, type QrMatrix } from './qr';
import { CELL, LEAVES_PER_MODULE, MODULE_HEIGHT } from './constants';

export interface LeafTarget {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
}

/** Relative leaf grid scale (designed for CELL=1, scales with CELL). */
const LEAF_GRID_SCALE = 1 / 3;  // 3 cols -> step of 1/3
const LEAF_GRID_SCALE_Z = 1 / 2; // 2 rows -> step of 1/2
const LEAF_SX = 0.38;            // leaf width relative to CELL
const LEAF_SZ = 0.56;            // leaf depth relative to CELL
const BLEED_TOLERANCE = 0.55;    // max bleed as fraction of CELL

/**
 * Where leaf `index` lands once the canopy has settled into the code.
 *
 * Leaves are handed out in runs of LEAVES_PER_MODULE, one run per dark module,
 * laid out as a flat 3x2 grid at a single uniform height. Keeping the run flat
 * and evenly lit is what makes each module binarise cleanly for a scanner.
 */
export function leafTarget(qr: QrMatrix, index: number): LeafTarget {
  const cell = qr.darkCells[Math.floor(index / LEAVES_PER_MODULE)];
  const slot = index % LEAVES_PER_MODULE;
  const gx = (slot % 3) - 1;
  const gz = Math.floor(slot / 3) - 0.5;

  const { x, z } = moduleToWorld(cell.x + QUIET_ZONE, cell.y + QUIET_ZONE, qr.plot, CELL);

  return {
    x: x + gx * CELL * LEAF_GRID_SCALE,
    y: MODULE_HEIGHT / 2,
    z: z + gz * CELL * LEAF_GRID_SCALE_Z,
    // Slightly oversized so neighbours knit together without a visible gap.
    sx: LEAF_SX * CELL,
    sy: MODULE_HEIGHT,
    sz: LEAF_SZ * CELL,
  };
}

/** Bleed tolerance for tests — scales with CELL. */
export const BLEED_LIMIT = BLEED_TOLERANCE * CELL;

/** Total leaves needed to fill every dark module of `qr`. */
export const leafCountFor = (qr: QrMatrix) => qr.darkCells.length * LEAVES_PER_MODULE;
