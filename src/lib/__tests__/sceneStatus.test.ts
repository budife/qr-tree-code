import { describe, it, expect } from 'vitest';
import { sceneErrorMessage, WEBGL_ERROR_MESSAGE } from '../sceneStatus';

describe('sceneErrorMessage', () => {
  it('explains a missing WebGL context in plain language', () => {
    const error = new Error('THREE.WebGLRenderer: Error creating WebGL context.');
    expect(sceneErrorMessage(error)).toBe(WEBGL_ERROR_MESSAGE);
  });

  it('falls back to a reload hint for unrelated failures', () => {
    expect(sceneErrorMessage(new Error('boom'))).toBe('Gagal menyiapkan tampilan 3D. Muat ulang halaman untuk mencoba lagi.');
    expect(sceneErrorMessage('kaboom')).toBe('Gagal menyiapkan tampilan 3D. Muat ulang halaman untuk mencoba lagi.');
  });
});
