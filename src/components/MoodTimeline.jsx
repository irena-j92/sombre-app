import { chartGradients } from '../data/moods.js';

const positions = [0, 34.1667, 68.3333, 102.5, 136.667, 170.833, 205, 239, 263, 297, 331];

export default function MoodTimeline({ navigate }) {
  return <figure className="report-timeline" aria-label="Sample mood timeline from August 25 to September 4">
    <button className="timeline-open" aria-label="Open this week’s entries in Calendar" onClick={() => navigate('calendar')}>
      <div className="report-timeline-bars" aria-hidden="true">{chartGradients.map((gradient, index) => <span key={index} style={{ background: gradient || 'transparent', left: positions[index] }} />)}</div>
    </button>
    <figcaption><span>Aug 25</span><span>Sep 04</span></figcaption>
  </figure>;
}
