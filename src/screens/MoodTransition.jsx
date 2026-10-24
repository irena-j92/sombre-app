import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { MOOD_TRANSITION_MS, moodById } from '../data/checkIn.js';

export default function MoodTransition({ navigate, draft }) {
  const root = useRef(null);
  const reducedMotion = useReducedMotion();
  const mood = moodById(draft.mood);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (reducedMotion) return;
      const timeline = gsap.timeline();
      timeline.to('.transition-orb', { y: -389, scale: 1.08, duration: 0.75, ease: 'power2.out' }, 0.15)
        .to('.transition-orb', { y: -325, scale: 1.03, duration: 0.28, ease: 'power2.inOut' })
        .to('.transition-orb', { y: -346.5, scale: 1000 / 535, filter: 'blur(0px)', duration: 0.87, ease: 'power2.inOut' })
        .to('.transition-orb-fill', { opacity: 1, duration: 0.75, ease: 'power2.inOut' }, 1.18)
        .to('.transition-copy', { opacity: 0, duration: 0.2 }, 1.12)
        .to('.transition-chrome .status-bar, .transition-chrome .icon-button', { color: '#ffffff', duration: 0.25 }, 1.7)
        .to('.transition-chrome .dots-grid i', { backgroundColor: '#ffffff', duration: 0.25 }, 1.7)
        .to(root.current, { '--transition-rule': '#ffffff33', duration: 0.25 }, 1.7);
    }, root);
    const timer = window.setTimeout(() => navigate('check-in', { replace: true }), reducedMotion ? 160 : MOOD_TRANSITION_MS);
    return () => { window.clearTimeout(timer); context.revert(); };
  }, [navigate, reducedMotion]);

  return <section ref={root} className={`screen flow-screen mood-transition-screen ${reducedMotion ? 'is-reduced' : ''}`} aria-labelledby="transition-heading">
    <div className="transition-orb" style={{ background: mood.orb }} aria-hidden="true">
      <div className={`transition-orb-fill ${draft.mood === 'angry' ? 'angry-transition-fill' : ''}`} style={draft.mood === 'angry' ? undefined : { background: mood.orb }} />
    </div>
    <div className="transition-chrome">
      <StatusBar />
      <Header onBack={() => navigate('mood-picker', { replace: true })} backLabel="Back to Mood Picker" />
    </div>
    <h1 id="transition-heading" className="transition-copy" tabIndex={-1}>You’ve picked {mood.label}</h1>
  </section>;
}
