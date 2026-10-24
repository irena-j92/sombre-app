import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import App from '../App.jsx';

beforeEach(() => window.history.replaceState(null, '', '/#/spaces'));
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const openAt = (route) => { window.history.replaceState(null, '', `/#/${route}`); return render(<App />); };
const friendSections = () => within(screen.getByRole('navigation', { name: /[Pp]rofile sections/ }));
const mainNavigation = () => within(screen.getByRole('navigation', { name: 'Main navigation' }));

it('connects the Spaces feed to all four Maya views and keeps the personal Space under You', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Spaces' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Open Maya’s profile' }));
  expect(window.location.hash).toBe('#/friend-profile/maya');
  expect(screen.getByRole('heading', { name: 'Maya' })).toBeInTheDocument();
  expect(mainNavigation().getByRole('button', { name: 'Spaces' })).toHaveAttribute('aria-current', 'page');
  fireEvent.click(friendSections().getByRole('button', { name: 'Space', exact: true }));
  expect(screen.getByRole('heading', { name: 'Sunlit Meadow Bloom' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Unconditional comfort' })).toBeInTheDocument();
  fireEvent.click(friendSections().getByRole('button', { name: 'Moods' }));
  expect(screen.getAllByRole('button', { name: /Open Maya’s shared mood/ })).toHaveLength(6);
  fireEvent.click(friendSections().getByRole('button', { name: 'Shared' }));
  expect(screen.getByRole('button', { name: 'Reply' })).toBeEnabled();
  fireEvent.click(mainNavigation().getByRole('button', { name: 'You' }));
  fireEvent.click(friendSections().getByRole('button', { name: 'Space', exact: true }));
  expect(window.location.hash).toBe('#/personal-space');
  expect(screen.getByRole('heading', { name: 'Warm Golden Hour' })).toBeInTheDocument();
  expect(mainNavigation().getByRole('button', { name: 'You' })).toHaveAttribute('aria-current', 'page');
});

it('marks an activity read after viewing its public Note and returns to the feed', () => {
  render(<App />);
  expect(screen.getAllByLabelText('Unread')).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', { name: 'Open Lena’s note, 21:45, unread' }));
  expect(screen.getByRole('heading', { name: 'Awkward event' })).toBeInTheDocument();
  expect(screen.getByText('Public')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Back to Spaces' }));
  expect(screen.getAllByLabelText('Unread')).toHaveLength(1);
  expect(screen.getByRole('button', { name: 'Open Lena’s note, 21:45' })).toBeInTheDocument();
});

it('saves a local note as a draft for Maya without exposing it to another friend', () => {
  openAt('friend-profile/maya');
  fireEvent.click(screen.getByRole('button', { name: 'Leave a note' }));
  const dialog = within(screen.getByRole('dialog'));
  expect(dialog.getByRole('button', { name: 'Save note' })).toBeDisabled();
  fireEvent.change(dialog.getByRole('textbox', { name: 'Title' }), { target: { value: 'A good afternoon' } });
  fireEvent.change(dialog.getByRole('textbox', { name: 'Your note' }), { target: { value: 'Thank you for taking that slow walk with me.' } });
  fireEvent.click(dialog.getByRole('button', { name: 'Save note' }));
  expect(window.location.hash).toBe('#/friend-shared/maya');
  expect(screen.getByText('A good afternoon')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Open your draft, Now' }));
  expect(screen.getByRole('heading', { name: 'A good afternoon' })).toBeInTheDocument();
  expect(screen.getByText('Draft')).toBeInTheDocument();
  expect(screen.queryByText('Public')).not.toBeInTheDocument();
  act(() => { window.history.replaceState(null, '', '/#/friend-shared/nora'); window.dispatchEvent(new PopStateEvent('popstate')); });
  expect(screen.queryByText('A good afternoon')).not.toBeInTheDocument();
});

it('saves replies locally, filters Today, and preserves the chosen note through First Aid', () => {
  openAt('friend-shared/maya');
  expect(screen.getAllByRole('button', { name: /^Open .*note,/ })).toHaveLength(7);
  fireEvent.change(screen.getByRole('combobox', { name: 'Mood period' }), { target: { value: 'today' } });
  expect(screen.getAllByRole('button', { name: /^Open .*note,/ })).toHaveLength(5);
  fireEvent.click(screen.getByRole('button', { name: 'Reply' }));
  const dialog = within(screen.getByRole('dialog'));
  expect(dialog.getByRole('heading', { name: 'Reply to Maya' })).toBeInTheDocument();
  fireEvent.change(dialog.getByRole('textbox', { name: 'Your note' }), { target: { value: 'We can take it one moment at a time.' } });
  fireEvent.click(dialog.getByRole('button', { name: 'Save reply' }));
  expect(screen.getAllByRole('article')[1]).toHaveTextContent('We can take it one moment at a time.');
  expect(screen.getAllByRole('button', { name: 'Reply' })).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Open your draft, Now' }));
  const url = window.location.hash;
  fireEvent.click(screen.getByRole('button', { name: 'Open First Aid' }));
  fireEvent.click(screen.getByRole('button', { name: 'Back to friend’s note' }));
  expect(window.location.hash).toBe(url);
  expect(screen.getByText('“We can take it one moment at a time.”')).toBeInTheDocument();
});

it('searches the supplied people and handles empty search and local connections', () => {
  const { container } = render(<App />);
  const add = screen.getByRole('button', { name: /Add friends/ });
  add.focus(); fireEvent.click(add);
  const dialog = within(screen.getByRole('dialog'));
  const input = dialog.getByRole('searchbox', { name: 'Search friends' });
  input.focus(); fireEvent.change(input, { target: { value: 'unknown person' } });
  expect(input).toHaveFocus();
  expect(dialog.getByRole('heading', { name: 'No people found' })).toBeInTheDocument();
  expect(container.querySelector('.main-navigation').inert).toBe(true);
  fireEvent.change(input, { target: { value: 'maurizio96' } });
  fireEvent.click(dialog.getByRole('button', { name: 'Add maurizio to friends' }));
  expect(dialog.getByRole('button', { name: 'Remove maurizio from friends' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(add).toHaveFocus();
  expect(container.querySelector('.main-navigation').inert).toBeFalsy();
});

it('traps focus across form fields, retains focus during typing, and discards canceled drafts', () => {
  openAt('friend-profile/maya');
  const leave = screen.getByRole('button', { name: 'Leave a note' }); leave.focus(); fireEvent.click(leave);
  const dialog = within(screen.getByRole('dialog'));
  const message = dialog.getByRole('textbox', { name: 'Your note' }); message.focus();
  fireEvent.change(message, { target: { value: 'A temporary thought.' } });
  expect(message).toHaveFocus();
  const save = dialog.getByRole('button', { name: 'Save note' }); save.focus();
  fireEvent.keyDown(save, { key: 'Tab' });
  expect(dialog.getByRole('button', { name: 'Close' })).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(leave).toHaveFocus();
  fireEvent.click(leave);
  expect(screen.getByRole('textbox', { name: 'Your note' })).toHaveValue('');
});

it('retains friend identity in deep links, history, logging cancellation and relationship stories', () => {
  openAt('friend-space/eli');
  fireEvent.click(screen.getByRole('button', { name: 'View story' }));
  expect(window.location.hash).toBe('#/friend-note/eli/story');
  expect(screen.getByRole('heading', { name: 'Sunlit Meadow Bloom' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Log a mood' }));
  fireEvent.click(screen.getByRole('button', { name: 'Back to previous screen' }));
  expect(window.location.hash).toBe('#/friend-note/eli/story');
  act(() => { window.history.replaceState(null, '', '/#/friend-moods/eli'); window.dispatchEvent(new PopStateEvent('popstate')); });
  expect(screen.getByRole('heading', { name: 'Eli’s shared moods' })).toBeInTheDocument();
  fireEvent.click(friendSections().getByRole('button', { name: 'Overview' }));
  expect(screen.getByRole('heading', { name: 'Eli' })).toBeInTheDocument();
});

it('shows a missing-draft state after a fresh deep link instead of substituting private content', () => {
  openAt('friend-note/maya/draft-missing');
  expect(screen.getByRole('heading', { name: 'This note isn’t available' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Share friend’s note' })).not.toBeInTheDocument();
});

it('copies only the displayed public note through the sharing sheet', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
  openAt('friend-note/maya/public-1');
  fireEvent.click(screen.getByRole('button', { name: 'Share friend’s note' }));
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Copy note' }));
  await act(async () => {});
  expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Awkward event\n\nLorem ipsum'));
  expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard.');
  vi.unstubAllGlobals();
});

it('keeps the friend origin when the logging flow is restarted from its center button', () => {
  openAt('friend-moods/eli');
  fireEvent.click(mainNavigation().getByRole('button', { name: 'Log a mood' }));
  fireEvent.click(mainNavigation().getByRole('button', { name: 'Log a mood' }));
  fireEvent.click(screen.getByRole('button', { name: 'Back to previous screen' }));
  expect(window.location.hash).toBe('#/friend-moods/eli');
  expect(screen.getByRole('heading', { name: 'Eli’s shared moods' })).toBeInTheDocument();
});
