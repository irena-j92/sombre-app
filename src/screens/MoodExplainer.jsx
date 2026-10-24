import { useEffect } from 'react';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import { ANALYSIS_DURATION_MS, moodById } from '../data/checkIn.js';

export default function MoodExplainer({ navigate, draft }) {
  const mood = moodById(draft.mood);
  useEffect(() => {
    const timer = window.setTimeout(() => navigate('todays-entry', { replace: true }), ANALYSIS_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return <section className={`screen flow-screen mood-explainer-screen entry-surface-${draft.mood} explainer-surface-${draft.mood}`} aria-labelledby="explainer-heading">
    <StatusBar light />
    <Header title={draft.mode === 'type' ? 'Preparing . . .' : 'Analyzing . . .'} onBack={() => navigate('check-in')} backLabel="Back to Check in" light />
    <div className="mood-definition">
      <div className="definition-label"><h1 id="explainer-heading" tabIndex={-1}>{mood.label}</h1><span className="pronunciation">{mood.pronunciation}</span></div>
      <p className="definition-copy">{mood.definition}</p>
      <p className="sr-only" role="status">{draft.mode === 'type' ? 'Preparing your entry…' : 'Preparing your voice preview…'}</p>
    </div>
    <div className="gradient-footer" aria-hidden="true" />
  </section>;
}
