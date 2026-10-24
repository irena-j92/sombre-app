import { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import { diaryGradients } from '../data/diary.js';

function EditorTray({ navigate, draft, onChange, capsule, focusEditor }) {
  const toolLabels = ['Type a message', 'Draw', 'Add a sticker', capsule ? 'Add a photo' : 'Add music', capsule ? 'Add music' : 'More entry tools'];
  return <div className="diary-editor-tray">
    <div className="editor-collection-row"><span>Latest Moods</span><button onClick={() => navigate('diary')}>View Collection<ChevronRight size={12} strokeWidth={1.25} aria-hidden="true" /></button></div>
    <div className="editor-mood-palette" role="group" aria-label="Mood gradients">
      {diaryGradients.map((gradient, index) => <button key={index} aria-label={`Use mood gradient ${index + 1}`} aria-pressed={draft.gradient === index} onClick={() => onChange({ ...draft, gradient: index })}><span style={{ background: gradient }} aria-hidden="true" /></button>)}
    </div>
    <div className="diary-editor-tools" aria-label="Entry tools">
      {toolLabels.map((label, index) => <button key={label} aria-label={label} onClick={index === 0 ? focusEditor : undefined} disabled={index !== 0}><img src={`/assets/diary/${capsule ? 'capsule' : 'entry'}-tool-${index}.svg`} width="28" height="28" alt="" /></button>)}
    </div>
  </div>;
}

export default function DiaryEditor({ navigate, draft, onChange, capsule = false }) {
  const editor = useRef(null);
  const selectedGradient = diaryGradients[draft.gradient];
  const lightHeader = Boolean(selectedGradient && draft.gradient === 7);
  const archive = <button className={`icon-button diary-archive-button ${lightHeader ? 'is-light' : ''}`} aria-label="Open time capsule" onClick={() => navigate('time-capsule-compose')}><img src="/assets/diary/archive.svg" width="22" height="22" alt="" /></button>;
  return <section className={`screen flow-screen diary-editor-screen ${capsule ? 'capsule-composer' : 'story-composer'} ${selectedGradient ? 'has-story-gradient' : ''} ${lightHeader ? 'has-dark-gradient' : ''}`} style={selectedGradient ? { backgroundImage: selectedGradient } : undefined} aria-labelledby="diary-editor-heading">
    <div className="diary-editor-ambient" aria-hidden="true" />
    <StatusBar light={lightHeader} />
    <Header title={capsule ? 'Time Capsule' : 'New Entry'} onBack={() => navigate(capsule ? 'new-diary-entry' : 'diary')} backLabel={capsule ? 'Back to New Entry' : 'Back to Diary'} rightAction={capsule ? undefined : archive} light={lightHeader} />
    {capsule ? <>
      <button className="capsule-calendar-button" aria-label="Open saved time capsule" onClick={() => navigate('time-capsule-ready')}><img src="/assets/diary/capsule-calendar.svg" width="24" height="24" alt="" /></button>
      <h1 id="diary-editor-heading" tabIndex={-1}>For a future you</h1>
      <p className="capsule-editor-subtitle">Leave something kind for later</p>
    </> : <>
      <h1 id="diary-editor-heading" className="sr-only" tabIndex={-1}>New Entry</h1>
      <span className="story-category">Stories</span>
    </>}
    <textarea ref={editor} className="diary-writing-area" aria-label={capsule ? 'Message for a future you' : 'Your story'} placeholder={capsule ? '' : 'Tap anywhere to start'} value={draft.text} maxLength={4000} onChange={(event) => onChange({ ...draft, text: event.target.value })} />
    <EditorTray navigate={navigate} draft={draft} onChange={onChange} capsule={capsule} focusEditor={() => editor.current?.focus()} />
  </section>;
}
