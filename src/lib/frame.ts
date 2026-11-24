export interface CameraState {
  morph: number;
  /** Morph value the camera was last framed for. */
  lastMorph: number;
  force: boolean;
}

/**
 * A rebuild changes the scene's extent even when the view angle has not moved.
 * Rebuilds reset `lastMorph` to -1 so the camera is refitted on the next frame.
 */
export function shouldUpdateCamera({ morph, lastMorph, force }: CameraState): boolean {
  return force || morph !== lastMorph;
}

export interface FrameState {
  morph: number;
  morphTarget: number;
  dirty: boolean;
  frame: number;
}

/**
 * The render loop can skip drawing once the code is settled and no UI change
 * has invalidated the frame. Tree view still renders every frame because the
 * drifting motes animate there.
 */
export function shouldRenderFrame({ morph, morphTarget, dirty, frame }: FrameState): boolean {
  return frame < 2 || morph !== morphTarget || morph < 0.999 || dirty;
}
