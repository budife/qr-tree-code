import * as THREE from 'three';
import { moduleToWorld, QUIET_ZONE, type QrMatrix } from './qr';
import { CELL } from './constants';
import { makeRng } from './rng';
import { heartPolygon } from './heart';
import type { Palette } from './palette';

export interface PlotMeshes {
  group: THREE.Group;
  tiles: THREE.InstancedMesh;
  hedge: THREE.InstancedMesh;
  slab: THREE.Mesh;
  applyPalette: (p: Palette) => void;
}

const HEART_DEPTH = 0.9;
/** Heart half-width as a multiple of the QR plot width. */
const HEART_SCALE = 1.2;
/** Full heart width as a multiple of the QR plot width. */
export const HEART_EXTENT = HEART_SCALE * 2;
/** Raw heart units: pushes the concave notch outside the square grid. */
const HEART_OFFSET = -2;
const HEDGE_BLADES = 1800;

/** Heart outline in the XY plane; the scene rotates it flat onto XZ. */
function heartShapePoints(plotUnits: number, segments = 180) {
  return heartPolygon(segments).map((p) => ({
    x: (plotUnits * HEART_SCALE * p.x) / 16,
    y: (plotUnits * HEART_SCALE * (p.y - HEART_OFFSET)) / 16,
  }));
}

/**
 * The foundation is a heart, while the QR modules stay a square grid in its
 * centre. The grid and its quiet zone are untouched, so scanners still work.
 */
export function buildPlot(qr: QrMatrix, palette: Palette): PlotMeshes {
  const group = new THREE.Group();
  const plotUnits = qr.plot * CELL;

  // ---- heart-shaped base slab ------------------------------------------
  const outline = heartShapePoints(plotUnits);
  const shape = new THREE.Shape();
  shape.moveTo(outline[0].x, outline[0].y);
  for (let i = 1; i < outline.length; i++) shape.lineTo(outline[i].x, outline[i].y);
  shape.closePath();

  const slabGeo = new THREE.ExtrudeGeometry(shape, {
    depth: HEART_DEPTH,
    bevelEnabled: false,
    curveSegments: 1,
  });
  slabGeo.rotateX(-Math.PI / 2);
  slabGeo.translate(0, -HEART_DEPTH, 0);
  const slabMat = new THREE.MeshLambertMaterial({ color: palette.slab });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  slab.receiveShadow = true;
  group.add(slab);

  // ---- module tiles ----------------------------------------------------
  const tileGeo = new THREE.BoxGeometry(CELL, 0.3, CELL);
  // Colour comes from instanceColor alone; setting vertexColors would define
  // USE_COLOR and multiply by a missing per-vertex attribute (i.e. black).
  const tileMat = new THREE.MeshLambertMaterial();
  const total = qr.plot * qr.plot;
  const tiles = new THREE.InstancedMesh(tileGeo, tileMat, total);
  tiles.receiveShadow = true;
  tiles.instanceMatrix.setUsage(THREE.StaticDrawUsage);

  const m = new THREE.Matrix4();
  const darkFlags: boolean[] = new Array(total);
  let i = 0;

  for (let py = 0; py < qr.plot; py++) {
    for (let px = 0; px < qr.plot; px++) {
      const qx = px - QUIET_ZONE;
      const qy = py - QUIET_ZONE;
      const inside = qx >= 0 && qy >= 0 && qx < qr.size && qy < qr.size;
      const dark = inside ? qr.dark[qy * qr.size + qx] : false;
      darkFlags[i] = dark;

      const { x, z } = moduleToWorld(px, py, qr.plot, CELL);
      // Dark modules stand a little proud of the light field.
      m.makeTranslation(x, dark ? -0.06 : -0.14, z);
      tiles.setMatrixAt(i, m);
      i++;
    }
  }
  tiles.instanceMatrix.needsUpdate = true;
  group.add(tiles);

  // ---- hedge rim follows the heart, outside the quiet zone -------------
  const hedge = buildHedge(plotUnits, palette);
  group.add(hedge);

  const applyPalette = (p: Palette) => {
    slabMat.color.set(p.slab);
    const dark = new THREE.Color(p.moduleDark);
    const light = new THREE.Color(p.moduleLight);
    for (let k = 0; k < total; k++) tiles.setColorAt(k, darkFlags[k] ? dark : light);
    if (tiles.instanceColor) tiles.instanceColor.needsUpdate = true;
    paintHedge(hedge, p);
  };

  applyPalette(palette);

  return { group, tiles, hedge, slab, applyPalette };
}

function buildHedge(plotUnits: number, palette: Palette) {
  const rng = makeRng(0x5eed1eaf);
  const geo = new THREE.BoxGeometry(0.16, 1, 0.16);
  geo.translate(0, 0.5, 0);
  const mat = new THREE.MeshLambertMaterial();
  const mesh = new THREE.InstancedMesh(geo, mat, HEDGE_BLADES);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // Shape y becomes world -z after the slab rotation; use the same contour.
  const contour = heartShapePoints(plotUnits, 360).map((p) => ({ x: p.x, z: -p.y }));
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();

  for (let k = 0; k < HEDGE_BLADES; k++) {
    const idx = Math.floor((k / HEDGE_BLADES) * contour.length + rng() * 2) % contour.length;
    const edge = contour[idx];
    pos.set(edge.x + (rng() - 0.5) * 0.7, -0.28, edge.z + (rng() - 0.5) * 0.7);

    e.set((rng() - 0.5) * 0.5, rng() * Math.PI, (rng() - 0.5) * 0.5);
    q.setFromEuler(e);
    scl.set(1, 0.7 + rng() * 1.1, 1);
    m.compose(pos, q, scl);
    mesh.setMatrixAt(k, m);
  }
  mesh.instanceMatrix.needsUpdate = true;
  paintHedge(mesh, palette);
  return mesh;
}

function paintHedge(mesh: THREE.InstancedMesh, palette: Palette) {
  const rng = makeRng(0xc0ffee);
  const colors = palette.hedge.map((c) => new THREE.Color(c));
  for (let k = 0; k < mesh.count; k++) {
    mesh.setColorAt(k, colors[Math.floor(rng() * colors.length)]);
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}
