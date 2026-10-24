export const clampProgress = (value) => Math.max(0, Math.min(1, value));

export function turnProgress(distance, width) {
  return clampProgress(distance / Math.max(1, width * 0.9));
}

/** A deliberate drag or quick flick commits; a short slow drag returns to rest. */
export function shouldCommitTurn(distance, width, velocity) {
  return turnProgress(distance, width) >= 0.3 || (distance >= 24 && velocity > 0.45);
}
