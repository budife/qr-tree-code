export const WEBGL_ERROR_MESSAGE =
  '3D tampilan tidak tersedia di perangkat ini. Browser Anda mungkin tidak mendukung WebGL.';

const GENERIC_ERROR_MESSAGE = 'Gagal menyiapkan tampilan 3D. Muat ulang halaman untuk mencoba lagi.';

/** Turns a scene-construction failure into a message a visitor can act on. */
export function sceneErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return /webgl/i.test(message) ? WEBGL_ERROR_MESSAGE : GENERIC_ERROR_MESSAGE;
}
