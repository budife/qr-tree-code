import * as THREE from 'three';
import { buildQr } from './qr';
import { MODULE_HEIGHT } from './constants';
import { rasterMatrix } from '../share/heartQr';

export interface Badge {
  mesh: THREE.Mesh;
  setOpacity: (v: number) => void;
  dispose: () => void;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** A normal square QR overlaid at the heart's centre so the scene stays scannable. */
export function buildBadge(text: string, darkHex: string, lightHex: string, size: number): Badge {
  const qr = buildQr(text);
  const raster = rasterMatrix(qr, hexToRgb(darkHex), hexToRgb(lightHex), 4);

  // DataTexture starts at the bottom-left; flip rows so the code reads upright.
  const pixels = new Uint8ClampedArray(raster.data.length);
  for (let y = 0; y < raster.width; y++) {
    const from = y * raster.width * 4;
    const to = (raster.width - 1 - y) * raster.width * 4;
    pixels.set(raster.data.subarray(from, from + raster.width * 4), to);
  }

  const texture = new THREE.DataTexture(pixels, raster.width, raster.width, THREE.RGBAFormat);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  const geometry = new THREE.PlaneGeometry(size, size);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = MODULE_HEIGHT + 0.02;
  mesh.visible = false;

  return {
    mesh,
    setOpacity: (v) => {
      material.opacity = v;
      mesh.visible = v > 0.05;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
