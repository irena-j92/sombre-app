import { useCallback, useEffect, useState } from 'react';

const screens = new Set(['splash', 'core', 'spaces', 'personal-space', 'profile', 'moods', 'calendar', 'entry', 'mood-picker', 'transition', 'check-in', 'mood-explainer', 'todays-entry', 'first-aid', 'share', 'diary', 'new-diary-entry', 'time-capsule-compose', 'time-capsule-ready', 'friend-profile', 'friend-space', 'friend-moods', 'friend-shared', 'friend-note', 'friend-story']);
export const friendScreens = new Set(['friend-profile', 'friend-space', 'friend-moods', 'friend-shared', 'friend-note', 'friend-story']);
const retiredScreens = new Set(['start', 'intro']);
const safeId = (value, fallback) => /^[a-z0-9-]+$/.test(value || '') ? value : fallback;
const readRoute = () => {
  const [requested, friend, note] = window.location.hash.replace(/^#\/?/, '').split('/');
  const screen = retiredScreens.has(requested) ? 'core' : screens.has(requested) ? requested : 'splash';
  return { screen, friendId: safeId(friend, 'maya'), noteId: safeId(note, 'public-1') };
};

/** Hash routes keep the prototype portable; friend links retain their subject. */
export function useScreen() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const sync = () => {
      const next = readRoute();
      if (retiredScreens.has(window.location.hash.replace(/^#\/?/, ''))) window.history.replaceState(null, '', '#/core');
      setRoute(next);
    };
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);

  const navigate = useCallback((next, { replace = false, friendId, noteId } = {}) => {
    if (!screens.has(next)) return;
    const current = readRoute();
    const friend = safeId(friendId || current.friendId, 'maya');
    const note = safeId(noteId, 'public-1');
    const path = friendScreens.has(next) ? `${next}/${friend}${next === 'friend-note' ? `/${note}` : ''}` : next;
    window.history[replace ? 'replaceState' : 'pushState'](null, '', `#/${path}`);
    setRoute({ screen: next, friendId: friend, noteId: note });
  }, []);
  return { ...route, navigate };
}
