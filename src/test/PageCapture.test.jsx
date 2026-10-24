import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { captureEntryPaper } from '../lib/pageTurn/capture.js';
const htmlCapture = vi.hoisted(() => vi.fn());
vi.mock('html2canvas', () => ({ default: htmlCapture }));
let canvas;
let ctx;
let page;
beforeEach(() => {
  ctx = new Proxy({ measureText: (text) => ({ width: text.length * 8 }), createLinearGradient: () => ({ addColorStop() {} }) }, {
    get(target, name) { if (!(name in target)) target[name] = vi.fn(); return target[name]; },
  });
  canvas = { width: 0, height: 0, getContext: () => ctx };
  vi.spyOn(document, 'createElement').mockReturnValue(canvas);
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  page = { classList: { contains: (name) => name === 'todays-entry-screen' || name === 'entry-surface-angry' }, querySelector: (selector) => ({ textContent: selector === 'h1' ? 'Intense moment' : 'A quiet moment after today.' }) };
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

it('paints the actual entry text on native canvas if DOM capture rejects', async () => {
  htmlCapture.mockRejectedValueOnce(new Error('Embedded capture blocked'));
  const result = await captureEntryPaper(page);
  expect(result).toBe(canvas);
  expect(ctx.fillText).toHaveBeenCalledWith('Intense moment', 24, 261);
  expect(ctx.fillText).toHaveBeenCalledWith('A quiet moment after today.', 24, 297);
  expect(canvas.height).toBeGreaterThanOrEqual(852);
});

it('uses native capture if the embedded capture never resolves', async () => {
  vi.useFakeTimers();
  htmlCapture.mockImplementationOnce(() => new Promise(() => {}));
  const pending = captureEntryPaper(page);
  vi.advanceTimersByTime(1801);
  expect(await pending).toBe(canvas);
});

it('excludes WebGL canvases before the snapshot library can claim a 2D context', async () => {
  ctx.getImageData = () => ({ data: new Uint8ClampedArray([63,163,217,255]) });
  htmlCapture.mockResolvedValueOnce(canvas);
  await captureEntryPaper(page);
  const options = htmlCapture.mock.calls.at(-1)[1];
  expect(options.ignoreElements({ tagName: 'CANVAS' })).toBe(true);
  expect(options.ignoreElements({ tagName: 'DIV', hasAttribute: (name) => name === 'data-page-turn-overlay' })).toBe(true);
  expect(options.ignoreElements({ tagName: 'DIV', hasAttribute: () => false })).toBe(false);
});
