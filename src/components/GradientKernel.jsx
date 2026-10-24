/** Exact radial palette from the supplied Core.svg; size is shared with Profile. */
export default function GradientKernel({ size = 220, palette = 'week' }) {
  return <div className={`gradient-kernel kernel-${palette}`} style={{ width: size, height: size }} role="img" aria-label="Mood gradient blending warm ochre, lilac pink and orange" />;
}
