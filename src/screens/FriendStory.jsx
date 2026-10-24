import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Share2, X } from 'lucide-react';
import StatusBar from '../components/StatusBar.jsx';
import Modal from '../components/Modal.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { mayaStories, STORY_DURATION_MS } from '../data/stories.js';

export default function FriendStory({ onClose }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [userPaused, setUserPaused] = useState(reducedMotion);
  const [held, setHeld] = useState(false);
  const [suspended, setSuspended] = useState(() => document.hidden);
  const [sharing, setSharing] = useState(false);
  const [copyState, setCopyState] = useState('');
  const current = useRef(0);
  const elapsedTime = useRef(0);
  const gesture = useRef(null);
  const story = mayaStories[index];
  const last = index === mayaStories.length - 1;
  const paused = userPaused || held || suspended || sharing;
  const go = useCallback((next) => {
    if (next >= mayaStories.length) { onClose(); return; }
    current.current = Math.max(0, next);
    elapsedTime.current = 0;
    setElapsed(0);
    setIndex(current.current);
  }, [onClose]);

  useEffect(() => {
    if (reducedMotion) setUserPaused(true);
  }, [reducedMotion]);
  useEffect(() => {
    // All artwork is local; warming it prevents a blank frame on fast taps.
    mayaStories.forEach((slide) => { const image = new Image(); image.src = slide.artwork; });
    const visibility = () => setSuspended(document.hidden);
    const blur = () => setSuspended(true);
    const focus = () => setSuspended(document.hidden);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', blur);
    window.addEventListener('focus', focus);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', blur);
      window.removeEventListener('focus', focus);
    };
  }, []);
  useEffect(() => {
    if (paused || last) return;
    let previousTick = Date.now();
    const timer = window.setInterval(() => {
      if (current.current === mayaStories.length - 1) return;
      const now = Date.now();
      elapsedTime.current = Math.min(STORY_DURATION_MS, elapsedTime.current + Math.max(0, Math.min(now - previousTick, 250)));
      previousTick = now;
      if (elapsedTime.current >= STORY_DURATION_MS) go(current.current + 1);
      else setElapsed(elapsedTime.current);
    }, 50);
    return () => window.clearInterval(timer);
  }, [index, paused, last, go]);
  useEffect(() => {
    const keyDown = (event) => {
      if (sharing || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); go(current.current + 1); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); go(current.current - 1); }
      else if (event.code === 'Space' || event.key === ' ') {
        if (event.target.closest?.('button, input, textarea')) return;
        event.preventDefault(); setUserPaused((value) => !value);
      }
    };
    document.addEventListener('keydown', keyDown);
    return () => document.removeEventListener('keydown', keyDown);
  }, [go, onClose, sharing]);

  const pointerDown = (event) => {
    if ((event.button !== 0 && event.button !== undefined) || event.target.closest('button, a')) return;
    gesture.current = { x: event.clientX, y: event.clientY, time: Date.now() };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setHeld(true);
  };
  const pointerUp = (event) => {
    const start = gesture.current;
    gesture.current = null; setHeld(false);
    if (!start) return;
    const dx = event.clientX - start.x; const dy = event.clientY - start.y;
    if (dy > 75 && Math.abs(dx) < 80) { onClose(); return; }
    if (Math.abs(dx) > 45 && Math.abs(dy) < 80) { go(current.current + (dx < 0 ? 1 : -1)); return; }
    if (Math.abs(dx) > 12 || Math.abs(dy) > 12 || Date.now() - start.time > 220) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    go(current.current + ((event.clientX - bounds.left) / (bounds.width || 393) < .32 ? -1 : 1));
  };
  const shareText = mayaStories.map((slide, position) => `${position + 1}. ${slide.title}\n${slide.text}`).join('\n\n');
  const copy = async () => {
    try { await navigator.clipboard.writeText(shareText); setCopyState('Story copied to clipboard.'); }
    catch { setCopyState('Select and copy the story text below.'); }
  };
  const progress = last ? 345 : story.progress + (mayaStories[index + 1].progress - story.progress) * elapsed / STORY_DURATION_MS;
  return <section className="screen relationship-story-screen" aria-label="Clara and Maya’s story" onPointerDown={pointerDown} onPointerUp={pointerUp} onPointerCancel={() => { gesture.current = null; setHeld(false); }} onContextMenu={(event) => event.preventDefault()}>
    <StatusBar light />
    <div className={`relationship-story-progress ${last ? 'is-complete' : ''}`} role="progressbar" aria-label="Story progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress / 345 * 100)} aria-valuetext={`Story ${index + 1} of ${mayaStories.length}: ${story.title}`}><span style={{ transform: `scaleX(${progress / 345})` }} /></div>
    <div className="relationship-story-copy" key={index} role="group" aria-label={`Story ${index + 1} of ${mayaStories.length}`} aria-live="polite" aria-atomic="true">
      <h1 className="sr-only" tabIndex={-1}>{story.title}</h1><blockquote className="sr-only">{story.text}</blockquote><img className="relationship-story-art" src={story.artwork} alt="" aria-hidden="true" draggable="false" />
    </div>
    <div className="relationship-story-tools">
      <button className="story-icon-control" aria-label="Close story" title="Close story" onClick={onClose}><X size={17} strokeWidth={1.25} /></button>
      <button className="story-icon-control" aria-label={last ? 'Replay story' : userPaused ? 'Play story' : 'Pause story'} title={last ? 'Replay story' : userPaused ? 'Play story' : 'Pause story'} onClick={() => { if (last) { go(0); setUserPaused(false); } else setUserPaused((value) => !value); }}>{last ? <RotateCcw size={16} strokeWidth={1.25} /> : userPaused ? <Play size={15} strokeWidth={1.25} /> : <Pause size={15} strokeWidth={1.25} />}</button>
    </div>
    {last ? <>
      <button className="story-share-button story-icon-control" aria-label="Share story" onClick={() => { setCopyState(''); setSharing(true); }}><Share2 size={16} strokeWidth={1.25} /></button>
      <button className="story-close-button" onClick={onClose}>Close</button>
    </> : <button className="story-next-button" aria-label="Next story" onClick={() => go(index + 1)}>Next<ChevronRight size={11} strokeWidth={1} /></button>}
    <button className="sr-only story-previous-control" aria-label="Previous story" disabled={index === 0} onClick={() => go(index - 1)}><ChevronLeft size={17} strokeWidth={1.25} /></button>
    <span className="sr-only">Tap right to continue, tap left to go back, hold to pause, or swipe down to close. Arrow keys navigate; Space pauses.</span>
    {sharing && <Modal title="Share your story" onClose={() => setSharing(false)}><p>Copy the story text. Nothing is sent automatically.</p><label className="sr-only" htmlFor="relationship-story-share">Story text</label><textarea id="relationship-story-share" className="friend-copy-text" rows={7} readOnly value={shareText} /><button className="friend-outline-button friend-save-note" onClick={copy}>Copy story text</button><p role="status">{copyState}</p></Modal>}
  </section>;
}
