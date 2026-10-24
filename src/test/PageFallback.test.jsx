import { expect, it } from 'vitest';
import { createFallbackPageTurnEngine } from '../lib/pageTurn/fallback.js';

it('renders a segmented paper turn in both directions and removes it on disposal', () => {
  const container = document.createElement('div');
  const frame = { toDataURL: () => 'data:image/png;base64,example' };
  const engine = createFallbackPageTurnEngine(container);
  engine.setPages(frame, frame, 1);
  const strips = [...container.querySelectorAll('.paper-fallback-strip')];
  expect(strips).toHaveLength(576);
  engine.render(0.5);
  expect(strips.some((strip) => /rotate3d\([^)]*,[1-9]/.test(strip.style.transform))).toBe(true);
  engine.render(1);
  expect(strips.every((strip) => parseFloat(strip.style.transform.match(/translate3d\(([^p]+)/)[1]) < -14)).toBe(true);
  engine.setPages(frame, frame, -1);
  engine.render(1);
  expect(strips.every((strip) => parseFloat(strip.style.transform.match(/translate3d\(([^p]+)/)[1]) > 393)).toBe(true);
  engine.dispose();
  expect(container.children).toHaveLength(0);
});
