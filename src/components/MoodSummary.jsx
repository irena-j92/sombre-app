import { useState } from 'react';
import { placeholderSummary } from '../data/moods.js';

export default function MoodSummary({ context = 'This week', compact = false }) {
  const [expanded, setExpanded] = useState(false);
  return <section className={`mood-summary ${compact ? 'summary-compact' : ''}`} aria-label="Mood summary">
    <h2>Mostly anxious and calm</h2>
    <p className="summary-copy">{placeholderSummary}</p>
    {expanded && <p className="summary-detail" id="summary-detail">{context} is shown with sample data in this prototype. Your core will bring together the moods you choose to log. It is a reflection tool, not a medical assessment.</p>}
    <button className="text-link summary-link" aria-expanded={expanded} aria-controls={expanded ? 'summary-detail' : undefined} onClick={() => setExpanded((value) => !value)}>{expanded ? 'Read Less' : 'Read More'}</button>
  </section>;
}
