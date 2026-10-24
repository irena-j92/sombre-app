import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.jsx';
import { diaryGradients } from '../data/diary.js';

beforeEach(() => window.history.replaceState(null, '', '/#/core'));
afterEach(() => vi.useRealTimers());
const mainNavigation = () => within(screen.getByRole('navigation', { name: 'Main navigation' }));

describe('Diary and capsule navigation', () => {
  it('connects Diary, the cover plus, archive, and calendar in the supplied order', () => {
    render(<App />);
    const navigation = mainNavigation();
    expect(navigation.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(navigation.getByRole('button', { name: 'Spaces' })).toBeEnabled();
    fireEvent.click(navigation.getByRole('button', { name: 'Diary' }));
    expect(window.location.hash).toBe('#/diary');
    expect(mainNavigation().getByRole('button', { name: 'Diary' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: 'New diary entry' }));
    expect(window.location.hash).toBe('#/new-diary-entry');
    expect(screen.getByRole('textbox', { name: 'Your story' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open time capsule' }));
    expect(window.location.hash).toBe('#/time-capsule-compose');
    expect(screen.getByRole('heading', { name: 'For a future you' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open saved time capsule' }));
    expect(window.location.hash).toBe('#/time-capsule-ready');
    expect(screen.getByRole('heading', { name: 'Ready when you are' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to time capsule editor' }));
    fireEvent.click(screen.getByRole('button', { name: 'Back to New Entry' }));
    fireEvent.click(screen.getByRole('button', { name: 'Back to Diary' }));
    expect(window.location.hash).toBe('#/diary');
  });

  it('keeps story and capsule drafts separate and preserves selected gradients across navigation', () => {
    window.history.replaceState(null, '', '/#/new-diary-entry');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Type a message' }));
    expect(screen.getByRole('textbox', { name: 'Your story' })).toHaveFocus();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'A small story from today.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Use mood gradient 2' }));
    expect(screen.getByRole('region', { name: 'New Entry' })).toHaveStyle({ backgroundImage: diaryGradients[1] });
    fireEvent.click(screen.getByRole('button', { name: 'Open time capsule' }));
    expect(screen.getByRole('textbox')).toHaveValue('');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'You can take this day at your own pace.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Open saved time capsule' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open capsule' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('You can take this day at your own pace.');
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to time capsule editor' }));
    expect(screen.getByRole('textbox')).toHaveValue('You can take this day at your own pace.');
    fireEvent.click(screen.getByRole('button', { name: 'Back to New Entry' }));
    expect(screen.getByRole('textbox')).toHaveValue('A small story from today.');
    expect(screen.getByRole('button', { name: 'Use mood gradient 2' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('region', { name: 'New Entry' })).toHaveStyle({ backgroundImage: diaryGradients[1] });
    fireEvent.click(screen.getByRole('button', { name: 'Use mood gradient 8' }));
    expect(screen.getByRole('region', { name: 'New Entry' })).toHaveStyle({ backgroundImage: diaryGradients[7] });
    expect(screen.getByRole('textbox')).toHaveValue('A small story from today.');
  });

  it('connects all icon destinations in the visual keyboard order', () => {
    render(<App />);
    expect(mainNavigation().getAllByRole('button').map((button) => button.textContent.trim())).toEqual(['Home', 'Spaces', 'Log a mood', 'Diary', 'You']);
    fireEvent.click(mainNavigation().getByRole('button', { name: 'Spaces' }));
    expect(screen.getByRole('heading', { name: 'Spaces', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Suggested' })).toBeInTheDocument();
    expect(mainNavigation().getByRole('button', { name: 'Spaces' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(mainNavigation().getByRole('button', { name: 'You' }));
    expect(screen.getByRole('heading', { name: 'Clara' })).toBeInTheDocument();
    expect(mainNavigation().getByRole('button', { name: 'You' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(mainNavigation().getByRole('button', { name: 'Home' }));
    expect(screen.getByRole('heading', { name: 'Your Core' })).toBeInTheDocument();
    fireEvent.click(mainNavigation().getByRole('button', { name: 'Log a mood' }));
    expect(screen.getByRole('heading', { name: 'How are you feeling right now?' })).toBeInTheDocument();
  });

  it('cancels the voice flow when Diary is selected from the bottom navigation', () => {
    vi.useFakeTimers();
    window.history.replaceState(null, '', '/#/check-in');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Voice' }));
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.click(mainNavigation().getByRole('button', { name: 'Diary' }));
    act(() => vi.advanceTimersByTime(12000));
    expect(window.location.hash).toBe('#/diary');
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  });

  it('supports keyboard collection selection and returning from the collection button', () => {
    window.history.replaceState(null, '', '/#/diary');
    render(<App />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Stories' }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Logbook' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Logbook' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'diary-tab-Logbook');
    fireEvent.click(screen.getByRole('button', { name: 'New diary entry' }));
    fireEvent.click(screen.getByRole('button', { name: 'View Collection' }));
    expect(window.location.hash).toBe('#/diary');
  });

  it('filters the supplied story collection and opens the logbook with a return to Diary', () => {
    window.history.replaceState(null, '', '/#/diary');
    render(<App />);
    expect(screen.getAllByRole('button', { name: /^Read story/ })).toHaveLength(3);
    expect(screen.queryByRole('button', { name: 'Read mood entry: Calm session' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'All', exact: true }));
    expect(within(screen.getByRole('tabpanel')).getAllByRole('button')).toHaveLength(4);
    fireEvent.click(screen.getByRole('tab', { name: 'Logbook' }));
    expect(screen.queryByRole('button', { name: /^Read story/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Read mood entry: Calm session' }));
    expect(window.location.hash).toBe('#/entry');
    fireEvent.click(screen.getByRole('button', { name: 'Back to Diary' }));
    expect(window.location.hash).toBe('#/diary');
  });

  it('reads a sample story without disclosing a private composing draft and restores focus on close', () => {
    window.history.replaceState(null, '', '/#/new-diary-entry');
    render(<App />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'A private draft, separate from samples.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Back to Diary' }));
    const firstStory = screen.getByRole('button', { name: /^Read story 1:/ });
    firstStory.focus();
    fireEvent.click(firstStory);
    expect(screen.getByRole('dialog')).toHaveTextContent('Illustrative story');
    expect(screen.getByRole('dialog')).not.toHaveTextContent('A private draft');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(firstStory).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'New diary entry' }));
    expect(screen.getByRole('textbox')).toHaveValue('A private draft, separate from samples.');
  });

  it('applies the capsule gradient independently and previews only the capsule message', () => {
    window.history.replaceState(null, '', '/#/new-diary-entry');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Use mood gradient 2' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Story only.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Open time capsule' }));
    fireEvent.click(screen.getByRole('button', { name: 'Use mood gradient 3' }));
    expect(screen.getByRole('region', { name: 'For a future you' })).toHaveStyle({ backgroundImage: diaryGradients[2] });
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'A little kindness for later.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Open saved time capsule' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open capsule' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('A little kindness for later.');
    expect(screen.getByRole('dialog')).not.toHaveTextContent('Story only.');
    fireEvent.click(screen.getByRole('button', { name: 'Close', exact: true }));
    expect(screen.getByRole('button', { name: 'Remind me later' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Back to time capsule editor' }));
    expect(screen.getByRole('button', { name: 'Use mood gradient 3' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Back to New Entry' }));
    expect(screen.getByRole('button', { name: 'Use mood gradient 2' })).toHaveAttribute('aria-pressed', 'true');
  });
});


it('keeps icon navigation available during the bounce and cancels the timed handoff when leaving', () => {
  vi.useFakeTimers();
  render(<App />);
  fireEvent.click(mainNavigation().getByRole('button', { name: 'Log a mood' }));
  fireEvent.click(screen.getByRole('button', { name: 'Choose angry' }));
  expect(window.location.hash).toBe('#/transition');
  expect(mainNavigation().getByRole('button', { name: 'Log a mood' })).toHaveAttribute('aria-current', 'page');
  act(() => vi.advanceTimersByTime(1000));
  fireEvent.click(mainNavigation().getByRole('button', { name: 'Spaces' }));
  act(() => vi.advanceTimersByTime(10000));
  expect(window.location.hash).toBe('#/spaces');
  expect(screen.queryByRole('button', { name: 'Voice' })).not.toBeInTheDocument();
});
