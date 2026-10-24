export const PAGE_ASPECT = 852 / 393;
export const CURL_RADIUS = 0.075;

/** World-space fold starts at the bottom outer corner, then sweeps diagonally. */
export function cornerFrame(progress, grabY = 0.25) {
  const p = Math.max(0, Math.min(1, progress));
  const tilt = 0.36 + (0.5 - grabY) * 0.16;
  const nx = Math.cos(tilt), ny = -Math.sin(tilt);
  const start = nx + 0.016;
  const end = ny * PAGE_ASPECT - Math.PI * CURL_RADIUS - 0.08;
  return { nx, ny, fold: start + (end - start) * p };
}

export function cornerPoint(u, v, progress, direction = 1, grabY = 0.25) {
  const { nx, ny, fold } = cornerFrame(progress, grabY);
  const x = direction > 0 ? u : 1 - u;
  const y = v * PAGE_ASPECT;
  const q = nx * x + ny * y;
  const radius = CURL_RADIUS * (1.18 - 0.76 * v);
  const distance = Math.max(0, q - fold);
  const angle = Math.min(distance / radius, Math.PI);
  let rolled = q;
  if (q > fold) rolled = distance > Math.PI * radius ? fold - (distance - Math.PI * radius) : fold + radius * Math.sin(angle);
  const delta = rolled - q;
  const px = x + nx * delta;
  return { x: direction > 0 ? px : 1 - px, y: y + ny * delta, z: radius * (1 - Math.cos(angle)), angle, nx, ny };
}
