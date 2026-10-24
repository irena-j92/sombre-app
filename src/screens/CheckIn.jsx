import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import StatusBar from '../components/StatusBar.jsx';
import { Header, PrimaryButton } from '../components/Navigation.jsx';
import DotField from '../components/DotField.jsx';
import { VOICE_DURATION_MS, moodById } from '../data/checkIn.js';

export default function CheckIn({ navigate, draft, onDraftChange, onComplete }) {
  const [mode, setMode] = useState('choose');
  const [seconds, setSeconds] = useState(0);
  const [note, setNote] = useState(draft.note);
  useEffect(() => {
    if (mode !== 'voice') return;
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    const finish = window.setTimeout(() => onComplete('voice', ''), VOICE_DURATION_MS);
    return () => { window.clearInterval(interval); window.clearTimeout(finish); };
  }, [mode, onComplete]);

  const chooseVoice = () => { onDraftChange({ mode: 'voice', note: '' }); setSeconds(0); setMode('voice'); };
  const counter = `00:${String(seconds).padStart(2, '0')}`;

  return <section className={`screen flow-screen check-in-screen mood-surface-${draft.mood}`} style={draft.mood === 'angry' ? undefined : { background: moodById(draft.mood).orb }} aria-labelledby="checkin-heading">
    <StatusBar light />
    <Header title="Record Mood" onBack={() => navigate('mood-picker')} backLabel="Back to Mood Picker" light />
    <h1 id="checkin-heading" className="sr-only" tabIndex={-1}>Check in</h1>
    <div className="voice-assistant-badge"><Sparkles size={16} fill="currentColor" strokeWidth={1} aria-hidden="true" />Voice Assistant · preview</div>
    {mode === 'choose' && <div className="input-choice-panel">
      <p>How would you like to check in?</p>
      <div className="input-choices flex justify-center gap-4">
        <button onClick={chooseVoice}>Voice</button>
        <button onClick={() => { onDraftChange({ mode: 'type' }); setMode('type'); }}>Type</button>
      </div>
    </div>}
    {mode === 'voice' && <div className="recording-panel">
      <span className="recording-counter" role="timer" aria-label={`${seconds} seconds`}>{counter}</span>
      <p className="recording-caption">Voice preview</p>
    </div>}
    {mode === 'type' && <form className="typed-checkin" onSubmit={(event) => { event.preventDefault(); if (note.trim()) onComplete('type', note.trim()); }}>
      <label htmlFor="checkin-note">What’s on your mind?</label>
      <textarea id="checkin-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Start wherever you are…" maxLength={3000} autoFocus />
      <PrimaryButton type="submit" disabled={!note.trim()}>Continue</PrimaryButton>
      <button type="button" className="switch-input-link" onClick={() => setMode('choose')}>Choose another way</button>
    </form>}
    {mode === 'voice' && <DotField variant="live" active />}
    <div className="gradient-footer" aria-hidden="true" />
  </section>;
}
