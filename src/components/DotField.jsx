import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const entryHeights = [4, 4, 2, 4, 4, 2, 4, 4, 2];
const tallHeights = [16, 4, 2, 2, 2, 2, 2];
const todayHeights = [16, 4, 2, 2, 4, 2, 2, 2, 2];
// A repeatable visual waveform; no microphone or sentiment inference is performed.
const waveform = [
  [3, 6, 4, 5, 8, 5, 5, 5, 3, 8, 8, 5, 5, 8, 5, 3],
  [4, 7, 3, 6, 5, 8, 4, 6, 4, 5, 7, 3, 8, 6, 4, 5],
  [5, 4, 6, 3, 7, 5, 8, 4, 6, 3, 5, 8, 4, 7, 6, 3],
  [3, 5, 8, 4, 6, 3, 5, 7, 4, 8, 6, 5, 3, 4, 7, 5],
  [6, 3, 5, 7, 4, 6, 3, 8, 5, 4, 7, 6, 5, 3, 8, 4],
];

/** Entry rows fill bottom-up; recording columns grow around a shared center line. */
export default function DotField({ variant = 'entry', active = false, replayKey = 0 }) {
  const [phase, setPhase] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (variant !== 'live' || !active || reducedMotion) return;
    const timer = window.setInterval(() => setPhase((value) => (value + 1) % waveform.length), 280);
    return () => window.clearInterval(timer);
  }, [active, variant, reducedMotion]);

  if (variant === 'live') return <div className="dot-field dot-field-live recording-waveform" aria-hidden="true">
    {waveform[active ? phase : 0].map((height, column) => <div className="recording-wave-column" key={column}>
      {Array.from({ length: height }, (_, row) => <i className="recording-wave-dot is-lit" key={row} />)}
    </div>)}
  </div>;

  const heights = variant === 'today' ? todayHeights : variant === 'tall' ? tallHeights : entryHeights;
  return <div key={replayKey} className={`dot-field dot-field-${variant} ${active ? 'is-active' : ''}`} aria-hidden="true">
    {heights.map((height, group) => <div className="dot-group" key={group}>
      {Array.from({ length: height }, (_, row) => <div className="dot-row is-lit" key={row} style={{ '--row': row, '--group': group }}>
        <i /><i /><i />
      </div>)}
    </div>)}
  </div>;
}
