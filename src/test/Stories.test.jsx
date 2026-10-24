import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import App from '../App.jsx';
import { mayaStories, STORY_DURATION_MS } from '../data/stories.js';

beforeEach(() => window.history.replaceState(null, '', '/#/friend-story/maya'));
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const heading = () => screen.getByRole('heading', { level: 1 });
const next = () => fireEvent.click(screen.getByRole('button', { name: 'Next story' }));
const pointer = (target, type, x, y) => fireEvent(target, new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 }));

it('uses the order encoded by the supplied SVG progress bars', () => {
  const widths = mayaStories.map((story) => {
    const svg = readFileSync(resolve('design/references/increment-10', `${story.title}.svg`), 'utf8');
    const xml = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const filled = [...xml.querySelectorAll('rect[y="67"]')].find((rect) => !rect.hasAttribute('opacity'));
    const width = Number(filled.getAttribute('width'));
    expect(story.progress).toBe(width);
    return width;
  });
  expect(widths).toEqual([...widths].sort((a, b) => a - b));
  expect(mayaStories[0].title).toBe('Zero Days Apart 👶');
  expect(mayaStories.at(-1).title).toBe('Bottom Line 🤍');
});

it('opens Maya’s immersive viewer from View Story and hides the bottom navigation', () => {
  window.history.replaceState(null, '', '/#/friend-space/maya');
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'View story' }));
  expect(window.location.hash).toBe('#/friend-story/maya');
  expect(heading()).toHaveTextContent('Zero Days Apart');
  expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument();
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', expect.stringContaining('Story 1 of 11'));
  fireEvent.click(screen.getByRole('button', { name: 'Close story' }));
  expect(window.location.hash).toBe('#/friend-space/maya');
  expect(screen.getByRole('heading', { name: 'Sunlit Meadow Bloom' })).toBeInTheDocument();
});

it('visits every story in order and holds the final page until Close or Replay', () => {
  vi.useFakeTimers();
  render(<App />);
  mayaStories.forEach((story, index) => {
    expect(heading()).toHaveTextContent(story.title);
    if (index < mayaStories.length - 1) next();
  });
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  act(() => vi.advanceTimersByTime(STORY_DURATION_MS * 3));
  expect(heading()).toHaveTextContent('Bottom Line');
  fireEvent.click(screen.getByRole('button', { name: 'Replay story' }));
  expect(heading()).toHaveTextContent('Zero Days Apart');
  for (let index = 1; index < mayaStories.length; index++) next();
  fireEvent.click(screen.getByRole('button', { name: 'Close', exact: true }));
  expect(window.location.hash).toBe('#/friend-space/maya');
});

it('auto-advances, pauses without losing reading time, then resumes', () => {
  vi.useFakeTimers();
  render(<App />);
  act(() => vi.advanceTimersByTime(3000));
  const before = screen.getByRole('progressbar').getAttribute('aria-valuenow');
  fireEvent.click(screen.getByRole('button', { name: 'Pause story' }));
  act(() => vi.advanceTimersByTime(20000));
  expect(heading()).toHaveTextContent('Zero Days Apart');
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', before);
  fireEvent.click(screen.getByRole('button', { name: 'Play story' }));
  act(() => vi.advanceTimersByTime(STORY_DURATION_MS - 3050));
  expect(heading()).toHaveTextContent('Zero Days Apart');
  act(() => vi.advanceTimersByTime(50));
  expect(heading()).toHaveTextContent('Quietly Twin-Coded');
});

it('supports tap back/forward, horizontal swipe, hold-to-pause and swipe-down exit', () => {
  vi.useFakeTimers();
  const { container } = render(<App />);
  const viewer = container.querySelector('.relationship-story-screen');
  pointer(viewer, 'pointerdown', 300, 400); pointer(viewer, 'pointerup', 300, 400);
  expect(heading()).toHaveTextContent('Quietly Twin-Coded');
  pointer(viewer, 'pointerdown', 30, 400); pointer(viewer, 'pointerup', 30, 400);
  expect(heading()).toHaveTextContent('Zero Days Apart');
  pointer(viewer, 'pointerdown', 300, 400); pointer(viewer, 'pointerup', 100, 400);
  expect(heading()).toHaveTextContent('Quietly Twin-Coded');
  pointer(viewer, 'pointerdown', 200, 400);
  act(() => vi.advanceTimersByTime(15000));
  pointer(viewer, 'pointerup', 200, 400);
  expect(heading()).toHaveTextContent('Quietly Twin-Coded');
  act(() => vi.advanceTimersByTime(STORY_DURATION_MS));
  expect(heading()).toHaveTextContent('The Three-Word Diagnosis');
  pointer(viewer, 'pointerdown', 200, 300); pointer(viewer, 'pointerup', 200, 450);
  expect(window.location.hash).toBe('#/friend-space/maya');
});

it('pauses when hidden or unfocused and cleans the timer when leaving', () => {
  vi.useFakeTimers();
  const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  render(<App />);
  act(() => vi.advanceTimersByTime(2000));
  act(() => { hidden.mockReturnValue(true); document.dispatchEvent(new Event('visibilitychange')); });
  act(() => vi.advanceTimersByTime(20000));
  expect(heading()).toHaveTextContent('Zero Days Apart');
  act(() => { hidden.mockReturnValue(false); document.dispatchEvent(new Event('visibilitychange')); });
  act(() => vi.advanceTimersByTime(STORY_DURATION_MS - 2000));
  expect(heading()).toHaveTextContent('Quietly Twin-Coded');
  fireEvent(window, new Event('blur'));
  act(() => vi.advanceTimersByTime(20000));
  expect(heading()).toHaveTextContent('Quietly Twin-Coded');
  fireEvent(window, new Event('focus'));
  fireEvent.click(screen.getByRole('button', { name: 'Close story' }));
  act(() => vi.advanceTimersByTime(30000));
  expect(window.location.hash).toBe('#/friend-space/maya');
  expect(vi.getTimerCount()).toBe(0);
});

it('supports keyboard navigation and starts reduced motion in manual mode', () => {
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
  render(<App />);
  act(() => vi.advanceTimersByTime(30000));
  expect(heading()).toHaveTextContent('Zero Days Apart');
  expect(screen.getByRole('button', { name: 'Play story' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'ArrowRight' });
  expect(heading()).toHaveTextContent('Quietly Twin-Coded');
  fireEvent.click(screen.getByRole('button', { name: 'Previous story' }));
  expect(heading()).toHaveTextContent('Zero Days Apart');
  fireEvent.keyDown(document, { key: ' ', code: 'Space' });
  act(() => vi.advanceTimersByTime(STORY_DURATION_MS));
  expect(heading()).toHaveTextContent('Quietly Twin-Coded');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(window.location.hash).toBe('#/friend-space/maya');
});

it('copies only the supplied story and Escape closes Share before the viewer', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
  render(<App />);
  for (let index = 1; index < mayaStories.length; index++) next();
  fireEvent.click(screen.getByRole('button', { name: 'Share story' }));
  const dialog = within(screen.getByRole('dialog'));
  expect(dialog.getByRole('textbox', { name: 'Story text' }).value).toContain('1. Zero Days Apart');
  fireEvent.click(dialog.getByRole('button', { name: 'Copy story text' }));
  await act(async () => {});
  expect(writeText).toHaveBeenCalledWith(expect.stringContaining('11. Bottom Line'));
  expect(dialog.getByRole('status')).toHaveTextContent('Story copied to clipboard.');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(window.location.hash).toBe('#/friend-story/maya');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(window.location.hash).toBe('#/friend-space/maya');
});

it('does not assign Maya’s life story to other friends', () => {
  window.history.replaceState(null, '', '/#/friend-story/eli');
  render(<App />);
  expect(window.location.hash).toBe('#/friend-space/eli');
  expect(screen.queryByRole('heading', { name: 'Zero Days Apart 👶' })).not.toBeInTheDocument();
});
