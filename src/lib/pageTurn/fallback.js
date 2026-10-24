import { gsap } from 'gsap';
import { cornerFrame, cornerPoint, PAGE_ASPECT } from './geometry.js';

/** The same diagonal corner geometry, composited without a WebGL context. */
export function createFallbackPageTurnEngine(container) {
  const under = document.createElement('div');
  under.className = 'paper-fallback-under';
  const shadow = document.createElement('div');
  shadow.className = 'paper-fallback-shadow';
  const sheet = document.createElement('div');
  sheet.className = 'paper-fallback-sheet';
  const columns = 18, rows = 32;
  const width = 393 / columns, height = 852 / rows;
  const tiles = [];
  for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
    const strip = document.createElement('div'); strip.className = 'paper-fallback-strip';
    const front = document.createElement('div'); front.className = 'paper-fallback-front';
    front.style.backgroundPosition = `${-col * width}px ${-row * height}px`;
    const back = document.createElement('div'); back.className = 'paper-fallback-back';
    strip.style.width = `${width + 0.5}px`; strip.style.height = `${height + 0.5}px`;
    strip.append(front, back); sheet.append(strip);
    tiles.push({ strip, front, u: (col + 0.5) / columns, v: 1 - (row + 0.5) / rows });
  }
  under.append(shadow); container.replaceChildren(under, sheet);
  const progress = { value: 0 };
  let direction = 1, grabY = 0.25, tween;
  function render(value = progress.value) {
    progress.value = Math.max(0, Math.min(1, value));
    const { nx, ny, fold } = cornerFrame(progress.value, grabY);
    tiles.forEach(({ strip, front, u, v }) => {
      const p = cornerPoint(u, v, progress.value, direction, grabY);
      const x = p.x * 393 - width / 2;
      const y = (1 - p.y / PAGE_ASPECT) * 852 - height / 2;
      strip.style.transform = `translate3d(${x}px,${y}px,${p.z * 393}px) rotate3d(${-p.ny},${-p.nx * direction},0,${p.angle * 180 / Math.PI}deg)`;
      front.style.filter = `brightness(${1 - Math.sin(p.angle) * 0.15})`;
    });
    let x = (fold - ny * PAGE_ASPECT / 2) / nx;
    if (direction < 0) x = 1 - x;
    shadow.style.left = `${x * 393}px`;
    shadow.style.top = '426px';
    shadow.style.height = '2200px';
    shadow.style.bottom = 'auto';
    shadow.style.transform = `translate(-50%,-50%) rotate(${Math.atan2(-ny, nx * direction) * 180 / Math.PI}deg)`;
    shadow.style.opacity = `${Math.sin(progress.value * Math.PI) * 0.28}`;
  }
  return {
    type: 'css',
    setPages(front, next, nextDirection, nextGrabY = 0.25) {
      tween?.kill(); direction = nextDirection; grabY = nextGrabY;
      const image = `url("${front.toDataURL('image/png')}")`;
      tiles.forEach((tile) => { tile.front.style.backgroundImage = image; });
      under.style.backgroundImage = `url("${next.toDataURL('image/png')}")`;
      render(0);
    },
    render,
    settle(target, { duration = 0.82, direct, onComplete } = {}) {
      tween?.kill();
      tween = gsap.to(progress, { value: target, duration, ease: direct ? 'power2.inOut' : 'power2.out', onUpdate: () => render(), onComplete });
    },
    cancel() { tween?.kill(); },
    dispose() { tween?.kill(); container.replaceChildren(); },
  };
}
