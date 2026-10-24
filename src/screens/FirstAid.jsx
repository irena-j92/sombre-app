import { ChevronRight } from 'lucide-react';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';

const exercises = ['4-7-8 breathing', 'Wring out towel', 'The wall push', '5-4-3-2-1 grounding', 'Walk or stair climb'];

export default function FirstAid({ navigate, draft, backScreen = 'todays-entry' }) {
  return <section className={`screen flow-screen first-aid-screen entry-surface-${draft.mood}`} aria-labelledby="first-aid-heading">
    <StatusBar light />
    <Header onBack={() => navigate(backScreen)} backLabel={backScreen === 'entry' ? 'Back to saved entry' : backScreen === 'friend-note' ? 'Back to friend’s note' : 'Back to today’s entry'} light />
    <button className="skip-first-aid" onClick={() => navigate('core', { replace: true })}>Skip<ChevronRight size={10} strokeWidth={1.25} aria-hidden="true" /></button>
    <h1 id="first-aid-heading" tabIndex={-1}>Here are some<br />exercises to help you</h1>
    <div className="first-aid-exercises" aria-label="Exercises">
      {exercises.map((exercise) => <button key={exercise} disabled>{exercise}</button>)}
    </div>
    <div className="gradient-footer" aria-hidden="true" />
  </section>;
}
