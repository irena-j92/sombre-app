import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import { moodOptions } from '../data/checkIn.js';

export default function MoodPicker({ onBack, onChoose }) {
  return <section className="screen flow-screen mood-picker-screen" aria-labelledby="picker-heading">
    <StatusBar />
    <Header title="Choose Mood" onBack={onBack} backLabel="Back to previous screen" />
    <h1 id="picker-heading" tabIndex={-1}>How are you feeling right now?</h1>
    <div className="mood-choice-grid grid grid-cols-2">
      {moodOptions.map((mood) => <button className="mood-choice" style={{ background: mood.orb }} key={mood.id} onClick={() => onChoose(mood.id)} aria-label={`Choose ${mood.label}`}><span>{mood.label}</span></button>)}
    </div>
    <div className="frame-footer" aria-hidden="true" />
  </section>;
}
