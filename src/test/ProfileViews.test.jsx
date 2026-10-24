import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import App from '../App.jsx';

beforeEach(() => window.history.replaceState(null, '', '/#/profile'));
const sections = () => within(screen.getByRole('navigation', { name: 'Profile sections' }));

it('connects Overview, Space and Moods, including history restoration and active navigation', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Clara' })).toBeInTheDocument();
  expect(sections().getByRole('button', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
  expect(sections().getByRole('button', { name: 'Settings' })).toBeDisabled();
  fireEvent.click(sections().getByRole('button', { name: 'Space', exact: true }));
  expect(window.location.hash).toBe('#/personal-space');
  expect(screen.getByRole('heading', { name: 'Warm Golden Hour' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Uplifting & creative' })).toBeInTheDocument();
  expect(sections().getByRole('button', { name: 'Space', exact: true })).toHaveAttribute('aria-current', 'page');
  fireEvent.click(sections().getByRole('button', { name: 'Moods' }));
  expect(window.location.hash).toBe('#/moods');
  expect(screen.getAllByRole('button', { name: /Open saved mood entry/ })).toHaveLength(7);
  expect(sections().getByRole('button', { name: 'Shared' })).toBeDisabled();
  expect(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('button', { name: 'You' })).toHaveAttribute('aria-current', 'page');
  act(() => {
    window.history.replaceState(null, '', '/#/personal-space');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  expect(sections().getByRole('button', { name: 'Space', exact: true })).toHaveAttribute('aria-current', 'page');
});

it('changes the local review prompt through the pager and swipe', () => {
  const { container } = render(<App />);
  expect(screen.getByText('What moments in life have brought you the most happiness?')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Review card 2' }));
  expect(screen.getByText('What is one small thing that helped you feel at ease?')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Review card 2' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent(container.querySelector('.review-deck'), new MouseEvent('pointerdown', { clientX: 300, bubbles: true }));
  fireEvent(container.querySelector('.review-deck'), new MouseEvent('pointerup', { clientX: 100, bubbles: true }));
  expect(screen.getByRole('button', { name: 'Review card 3' })).toHaveAttribute('aria-pressed', 'true');
});

it('opens the updated Note from Moods and returns there from Share and First Aid', () => {
  window.history.replaceState(null, '', '/#/moods');
  const { container } = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Open saved mood entry 1' }));
  expect(screen.getByRole('heading', { name: 'Calm session' })).toBeInTheDocument();
  expect(screen.getByText('Sep 08, 2026')).toBeInTheDocument();
  expect(container.querySelectorAll('.saved-entry-screen .dot-group')).toHaveLength(9);
  fireEvent.click(screen.getByRole('button', { name: 'Share saved entry' }));
  fireEvent.click(screen.getByRole('button', { name: 'Close Share' }));
  expect(window.location.hash).toBe('#/entry');
  fireEvent.click(screen.getByRole('button', { name: 'Open First Aid' }));
  fireEvent.click(screen.getByRole('button', { name: 'Back to saved entry' }));
  expect(window.location.hash).toBe('#/entry');
  fireEvent.click(screen.getByRole('button', { name: 'Back to Moods' }));
  expect(window.location.hash).toBe('#/moods');
});

it('returns to Moods after canceling a new mood log', () => {
  window.history.replaceState(null, '', '/#/moods');
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Log a mood' }));
  fireEvent.click(screen.getByRole('button', { name: 'Back to previous screen' }));
  expect(screen.getByRole('heading', { name: 'Your moods' })).toBeInTheDocument();
});
