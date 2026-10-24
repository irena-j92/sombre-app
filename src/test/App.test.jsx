import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.jsx';
import { MOOD_TRANSITION_MS } from '../data/checkIn.js';

beforeEach(() => window.history.replaceState(null, '', '/'));
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
const openAt = (route) => { window.history.replaceState(null, '', `/#/${route}`); return render(<App />); };

describe('Sombre first screen flow', () => {
  it('holds the splash for three seconds, then opens Core directly', () => {
    vi.useFakeTimers();
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('Opening Sombre');
    act(() => vi.advanceTimersByTime(2999));
    expect(screen.getByRole('status')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your Core');
    expect(window.location.hash).toBe('#/core');
  });

  it('connects Core, Profile and the return to Core', () => {
    openAt('core');
    fireEvent.click(screen.getByRole('button', { name: 'Open your profile' }));
    expect(screen.getByRole('heading', { name: 'Clara' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#/profile');
    fireEvent.click(screen.getByRole('button', { name: 'Back to Core' }));
    expect(window.location.hash).toBe('#/core');
    expect(document.activeElement).toHaveTextContent('Your Core');
  });

  it.each(['start', 'intro'])('redirects the retired %s link to Core', (route) => {
    openAt(route);
    expect(screen.getByRole('heading', { name: 'Your Core' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#/core');
    expect(screen.queryByRole('button', { name: 'Begin' })).not.toBeInTheDocument();
  });

  it('redirects retired onboarding screens reached through browser history', () => {
    openAt('profile');
    act(() => {
      window.history.replaceState(null, '', '/#/intro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(window.location.hash).toBe('#/core');
    expect(screen.getByRole('heading', { name: 'Your Core' })).toBeInTheDocument();
  });

  it('syncs the visible screen when browser history changes', () => {
    openAt('profile');
    act(() => {
      window.history.replaceState(null, '', '/#/core');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByRole('heading', { name: 'Your Core' })).toBeInTheDocument();
  });

  it('supports native period selection and announces the sample context', () => {
    openAt('core');
    const period = screen.getByRole('combobox', { name: 'Mood period' });
    expect(period).toHaveValue('week');
    fireEvent.change(period, { target: { value: 'month' } });
    expect(period).toHaveValue('month');
    expect(screen.getByText('You have logged in 5 times so far this month')).toBeInTheDocument();
  });

  it('keeps the fixed frame proportional on a narrower phone viewport', () => {
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 320 });
    const { container } = openAt('core');
    expect(container.querySelector('.frame-slot')).toHaveStyle({ width: '320px' });
    expect(container.querySelector('.app-frame').style.transform).toBe(`scale(${320 / 393})`);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
  });
});

describe('Calendar and new entry flow', () => {
  it('opens the Calendar from the profile graph and the Entry from its sixth top-row tile', () => {
    openAt('profile');
    fireEvent.click(screen.getByRole('button', { name: 'Open this week’s entries in Calendar' }));
    expect(screen.getByRole('heading', { name: 'Your mood calendar' })).toBeInTheDocument();
    const cells = screen.getAllByRole('gridcell');
    expect(cells).toHaveLength(35);
    const entryButton = screen.getByRole('button', { name: 'Open entry — first row, sixth rectangle' });
    expect(cells[5]).toContainElement(entryButton);
    fireEvent.click(entryButton);
    expect(screen.getByRole('heading', { name: 'Calm session' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to Calendar' }));
    expect(window.location.hash).toBe('#/calendar');
  });

  it('runs the angry Voice sequence only after choosing Voice, then opens Today’s Entry', () => {
    vi.useFakeTimers();
    const { container } = openAt('core');
    fireEvent.click(screen.getByRole('button', { name: 'Log a mood' }));
    expect(screen.getByRole('heading', { name: /How are you feeling/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Choose angry' }));
    expect(screen.getByRole('heading', { name: 'You’ve picked angry' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(MOOD_TRANSITION_MS));
    expect(screen.getByRole('button', { name: 'Voice' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Type' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Voice' }));
    expect(screen.getByRole('timer')).toHaveTextContent('00:00');
    expect(container.querySelectorAll('.recording-wave-column')).toHaveLength(16);
    const initialLitRows = container.querySelectorAll('.dot-field-live .is-lit').length;
    act(() => vi.advanceTimersByTime(280));
    expect(container.querySelectorAll('.dot-field-live .is-lit').length).not.toBe(initialLitRows);
    act(() => vi.advanceTimersByTime(1720));
    expect(screen.getByRole('timer')).toHaveTextContent('00:02');
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByRole('heading', { name: 'angry' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Preparing your voice preview');
    act(() => vi.advanceTimersByTime(3199));
    expect(window.location.hash).toBe('#/mood-explainer');
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('heading', { name: 'Intense moment' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#/todays-entry');
    fireEvent.click(screen.getByRole('button', { name: 'Back to Core' }));
    expect(window.location.hash).toBe('#/core');
  });

  it('cancels the voice timer when backing out and restores the new-entry origin', () => {
    vi.useFakeTimers();
    openAt('profile');
    fireEvent.click(screen.getByRole('button', { name: 'Log a mood' }));
    fireEvent.click(screen.getByRole('button', { name: 'Choose angry' }));
    expect(screen.getByRole('heading', { name: 'You’ve picked angry' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(MOOD_TRANSITION_MS));
    fireEvent.click(screen.getByRole('button', { name: 'Voice' }));
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.click(screen.getByRole('button', { name: 'Back to Mood Picker' }));
    act(() => vi.advanceTimersByTime(15000));
    expect(window.location.hash).toBe('#/mood-picker');
    fireEvent.click(screen.getByRole('button', { name: 'Back to previous screen' }));
    expect(window.location.hash).toBe('#/profile');
  });

  it('accepts a typed note and carries it through to the private entry', () => {
    vi.useFakeTimers();
    openAt('mood-picker');
    fireEvent.click(screen.getByRole('button', { name: 'Choose angry' }));
    expect(screen.getByRole('heading', { name: 'You’ve picked angry' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(MOOD_TRANSITION_MS));
    fireEvent.click(screen.getByRole('button', { name: 'Type' }));
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox', { name: 'What’s on your mind?' }), { target: { value: 'I need a quiet moment after today.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('status')).toHaveTextContent('Preparing your entry');
    act(() => vi.advanceTimersByTime(3200));
    expect(screen.getByText('“I need a quiet moment after today.”')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Intense moment' })).toHaveTextContent('Private');
  });

  it('cancels the analysis transition if the user leaves the explainer', () => {
    vi.useFakeTimers();
    openAt('mood-explainer');
    fireEvent.click(screen.getByRole('button', { name: 'Back to Check in' }));
    act(() => vi.advanceTimersByTime(10000));
    expect(window.location.hash).toBe('#/check-in');
    expect(screen.getByRole('button', { name: 'Voice' })).toBeInTheDocument();
  });
});


describe('Updated mood transition, First Aid and Share', () => {
  it('shows the selection before Check In and cancels the transition on Back', () => {
    vi.useFakeTimers();
    openAt('mood-picker');
    fireEvent.click(screen.getByRole('button', { name: 'Choose angry' }));
    expect(window.location.hash).toBe('#/transition');
    expect(screen.queryByRole('button', { name: 'Voice' })).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(MOOD_TRANSITION_MS - 1));
    expect(window.location.hash).toBe('#/transition');
    fireEvent.click(screen.getByRole('button', { name: 'Back to Mood Picker' }));
    act(() => vi.advanceTimersByTime(10000));
    expect(window.location.hash).toBe('#/mood-picker');
    expect(screen.queryByRole('button', { name: 'Voice' })).not.toBeInTheDocument();
  });

  it('uses a short reduced-motion transition without making the user wait for the bounce', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
    openAt('mood-picker');
    fireEvent.click(screen.getByRole('button', { name: 'Choose angry' }));
    act(() => vi.advanceTimersByTime(160));
    expect(window.location.hash).toBe('#/check-in');
    expect(screen.getByRole('button', { name: 'Voice' })).toBeInTheDocument();
  });

  it('opens First Aid, keeps exercises inactive, and skips to Core', () => {
    openAt('todays-entry');
    fireEvent.click(screen.getByRole('button', { name: 'Open First Aid' }));
    expect(window.location.hash).toBe('#/first-aid');
    expect(screen.getByRole('heading', { name: /Here are some/ })).toBeInTheDocument();
    for (const name of ['4-7-8 breathing', 'Wring out towel', 'The wall push', '5-4-3-2-1 grounding', 'Walk or stair climb']) {
      const exercise = screen.getByRole('button', { name });
      expect(exercise).toBeDisabled();
      fireEvent.click(exercise);
      expect(window.location.hash).toBe('#/first-aid');
    }
    expect(screen.getByRole('button', { name: 'Menu' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(screen.getByRole('heading', { name: 'Your Core' })).toBeInTheDocument();
  });

  it.each(['profile', 'calendar', 'mood-picker', 'transition', 'check-in', 'mood-explainer', 'spaces', 'first-aid', 'diary', 'time-capsule-compose', 'time-capsule-ready'])('keeps the menu inactive on %s', (route) => {
    vi.useFakeTimers();
    openAt(route);
    const menu = screen.getByRole('button', { name: 'Menu' });
    expect(menu).toBeDisabled();
    fireEvent.click(menu);
    expect(window.location.hash).toBe(`#/${route}`);
  });

  it('opens Share and returns to the same typed entry with Close or Escape', () => {
    vi.useFakeTimers();
    openAt('check-in');
    fireEvent.click(screen.getByRole('button', { name: 'Type' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'A quiet moment, just for me.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    act(() => vi.advanceTimersByTime(3200));
    fireEvent.click(screen.getByRole('button', { name: 'Share today’s entry' }));
    expect(window.location.hash).toBe('#/share');
    expect(screen.getByText('@patchsketch')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Save sample profile card' })).toHaveAttribute('download', 'sombre-profile-card.png');
    fireEvent.click(screen.getByRole('button', { name: 'Close Share' }));
    expect(screen.getByText('“A quiet moment, just for me.”')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Share today’s entry' }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(window.location.hash).toBe('#/todays-entry');
    expect(screen.getByText('“A quiet moment, just for me.”')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open First Aid' }));
    fireEvent.click(screen.getByRole('button', { name: 'Back to today’s entry' }));
    expect(screen.getByText('“A quiet moment, just for me.”')).toBeInTheDocument();
  });
});


it('keeps the updated entry edit icon inactive', () => {
  openAt('todays-entry');
  const edit = screen.getByRole('button', { name: 'Edit entry' });
  expect(edit).toBeDisabled();
  fireEvent.click(edit);
  expect(window.location.hash).toBe('#/todays-entry');
});
