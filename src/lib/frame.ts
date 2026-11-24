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
