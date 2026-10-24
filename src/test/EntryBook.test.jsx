import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.jsx';

const mocked = vi.hoisted(() => ({
  renderer: { setPages: vi.fn(), render: vi.fn(), settle: vi.fn(), cancel: vi.fn(), dispose: vi.fn() },
  create: vi.fn(), capture: vi.fn(), fallback: vi.fn(),
}));
vi.mock('../lib/pageTurn/engine.js', () => ({ createPageTurnEngine: mocked.create }));
vi.mock('../lib/pageTurn/fallback.js', () => ({ createFallbackPageTurnEngine: mocked.fallback }));
vi.mock('../lib/pageTurn/capture.js', () => ({ captureEntryPaper: mocked.capture, paintEntryPaper: () => document.createElement('canvas'), paintBookCover: () => document.createElement('canvas') }));

const openBook = () => { window.history.replaceState(null, '', '/#/entry'); return render(<App />); };
const settleFinished = () => act(() => mocked.renderer.settle.mock.calls.at(-1)[1].onComplete());

beforeEach(() => {
  vi.clearAllMocks();
  mocked.create.mockReset().mockReturnValue(mocked.renderer);
  mocked.fallback.mockReturnValue({ ...mocked.renderer, type: 'css' });
  mocked.capture.mockImplementation(() => Promise.resolve(document.createElement('canvas')));
  vi.stubGlobal('WebGL2RenderingContext', function WebGL2RenderingContext() {});
  vi.stubGlobal('PointerEvent', class PointerEvent extends MouseEvent {
    constructor(type, options) { super(type, options); this.pointerId = options.pointerId ?? 1; this.isPrimary = true; }
  });
});
afterEach(() => vi.unstubAllGlobals());

async function ready() { await waitFor(() => expect(mocked.create).toHaveBeenCalledTimes(1)); }

describe('Book entry transitions', () => {
  it('turns the actual page, waits for the shader animation, and turns back using the same renderer', async () => {
    openBook();
    await ready();
    expect(screen.getByRole('region', { name: 'Calm session' }).querySelector('canvas')).toHaveAttribute('data-html2canvas-ignore', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Turn to next entry' }), { detail: 1 });
    await waitFor(() => expect(mocked.renderer.settle).toHaveBeenCalled());
    expect(mocked.renderer.setPages.mock.calls.at(-1)[2]).toBe(1);
    expect(screen.getByRole('region', { name: 'Calm session' })).toHaveAttribute('aria-busy', 'true');
    expect(window.location.hash).toBe('#/entry');
    settleFinished();
    expect(window.location.hash).toBe('#/todays-entry');
    expect(screen.getByRole('region', { name: 'Intense moment' }).querySelector('.entry-paper')).toHaveAttribute('data-fill', 'off');
    expect(screen.getByRole('heading', { name: 'Intense moment' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Turn to next entry' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Previous entry' }), { detail: 1 });
    await waitFor(() => expect(mocked.renderer.settle).toHaveBeenCalledTimes(2));
    expect(mocked.renderer.setPages.mock.calls.at(-1)[2]).toBe(-1);
    settleFinished();
    expect(window.location.hash).toBe('#/entry');
    expect(mocked.create).toHaveBeenCalledTimes(1);
  });

  it('follows a drag and returns an incomplete turn to the original entry', async () => {
    openBook();
    await ready();
    const paper = screen.getByRole('region', { name: 'Calm session' });
    let now = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    fireEvent.pointerDown(paper, { pointerId: 1, clientX: 370, clientY: 500, button: 0 });
    now = 1000;
    fireEvent.pointerMove(paper, { pointerId: 1, clientX: 290, clientY: 500 });
    await waitFor(() => expect(mocked.renderer.setPages).toHaveBeenCalled());
    expect(mocked.renderer.render.mock.calls.at(-1)[0]).toBeGreaterThan(0.2);
    fireEvent.pointerUp(paper, { pointerId: 1, clientX: 290, clientY: 500 });
    expect(mocked.renderer.settle.mock.calls.at(-1)[0]).toBe(0);
    settleFinished();
    expect(window.location.hash).toBe('#/entry');
    expect(paper).toHaveAttribute('aria-busy', 'false');
  });

  it('commits a deliberate swipe and cancels stale animation callbacks after leaving the book', async () => {
    const { unmount } = openBook();
    await ready();
    const paper = screen.getByRole('region', { name: 'Calm session' });
    fireEvent.pointerDown(paper, { pointerId: 1, clientX: 370, clientY: 500, button: 0 });
    fireEvent.pointerMove(paper, { pointerId: 1, clientX: 180, clientY: 500 });
    await waitFor(() => expect(mocked.renderer.setPages).toHaveBeenCalled());
    fireEvent.pointerUp(paper, { pointerId: 1, clientX: 180, clientY: 500 });
    expect(mocked.renderer.settle.mock.calls.at(-1)[0]).toBe(1);
    const complete = mocked.renderer.settle.mock.calls.at(-1)[1].onComplete;
    unmount();
    act(() => complete());
    expect(window.location.hash).toBe('#/entry');
    expect(mocked.renderer.dispose).toHaveBeenCalledTimes(1);
  });

  it('uses instant page navigation with reduced motion and keyboard arrows', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
    openBook();
    fireEvent.click(screen.getByRole('button', { name: 'Turn to next entry' }), { detail: 1 });
    expect(window.location.hash).toBe('#/todays-entry');
    fireEvent.keyDown(screen.getByRole('region', { name: 'Intense moment' }), { key: 'ArrowLeft' });
    expect(window.location.hash).toBe('#/entry');
    expect(mocked.create).not.toHaveBeenCalled();
  });

  it('keeps page navigation usable when WebGL initialization fails', async () => {
    mocked.create.mockImplementation(() => { throw new Error('WebGL unavailable'); });
    openBook();
    await waitFor(() => expect(mocked.create).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: 'Turn to next entry' }), { detail: 1 });
    await waitFor(() => expect(mocked.renderer.settle).toHaveBeenCalled());
    expect(mocked.fallback).toHaveBeenCalledTimes(1);
    expect(window.location.hash).toBe('#/entry');
    expect(screen.getByRole('region', { name: 'Calm session' })).toHaveAttribute('data-page-turn-renderer', 'css');
    settleFinished();
    expect(window.location.hash).toBe('#/todays-entry');
  });

  it('animates preview-generated clicks whose detail is zero', async () => {
    openBook(); await ready();
    fireEvent.click(screen.getByRole('button', { name: 'Turn to next entry' }), { detail: 0 });
    await waitFor(() => expect(mocked.renderer.settle).toHaveBeenCalled());
    expect(window.location.hash).toBe('#/entry');
    settleFinished();
    expect(window.location.hash).toBe('#/todays-entry');
  });

  it('opens the book with a turn when selecting an entry in Calendar', async () => {
    window.history.replaceState(null, '', '/#/calendar'); render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Open entry — first row, sixth rectangle' }));
    await waitFor(() => expect(mocked.renderer.settle).toHaveBeenCalled());
    expect(window.location.hash).toBe('#/entry');
    settleFinished();
    expect(window.location.hash).toBe('#/entry');
    expect(screen.getByRole('heading', { name: 'Calm session' })).toBeInTheDocument();
  });

  it('still animates when WebGL2 is missing entirely', async () => {
    vi.stubGlobal('WebGL2RenderingContext', undefined);
    openBook();
    await waitFor(() => expect(mocked.fallback).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: 'Turn to next entry' }), { detail: 1 });
    await waitFor(() => expect(mocked.renderer.settle).toHaveBeenCalled());
    expect(mocked.create).not.toHaveBeenCalled();
    expect(window.location.hash).toBe('#/entry');
    settleFinished();
    expect(window.location.hash).toBe('#/todays-entry');
  });
});
