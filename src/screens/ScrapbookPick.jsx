import { useState } from 'react';
import { LockKeyhole, Plus } from 'lucide-react';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import Modal from '../components/Modal.jsx';
import { diaryStories } from '../data/diary.js';

const tabs = ['All', 'Stories', 'Logbook'];

export default function ScrapbookPick({ navigate, onOpenEntry }) {
  const [selected, setSelected] = useState('Stories');
  const [openedStory, setOpenedStory] = useState(null);
  const selectByKey = (event, index) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setSelected(tabs[next]);
    document.getElementById(`diary-tab-${tabs[next]}`)?.focus();
  };
  return <section className="screen flow-screen scrapbook-screen" aria-labelledby="diary-heading">
    <StatusBar />
    <Header title="Diary" onBack={() => navigate('core')} />
    <h1 id="diary-heading" className="sr-only" tabIndex={-1}>Diary</h1>
    <div className="diary-scroll" role="region" aria-label="Your diary collection" tabIndex={0}>
     <div className="diary-content">
      <img className="scrapbook-collage" src="/assets/diary/scrapbook-collage.svg" alt="A gradient scrapbook with mountain and flamingo photos and layered paper keepsakes" width="320" height="368" />
      <button className="scrapbook-cover" aria-label="New diary entry" onClick={() => navigate('new-diary-entry')}>
        <span className="scrapbook-add" aria-hidden="true"><Plus size={18} strokeWidth={1.5} /></span>
      </button>
      <div className="diary-tabs" role="tablist" aria-label="Diary collections">
      {tabs.map((tab, index) => <button key={tab} id={`diary-tab-${tab}`} role="tab" aria-selected={selected === tab} aria-controls="diary-collection" tabIndex={selected === tab ? 0 : -1} onClick={() => setSelected(tab)} onKeyDown={(event) => selectByKey(event, index)}>{tab}</button>)}
      <button role="tab" disabled aria-selected="false"><LockKeyhole size={14} strokeWidth={1.25} aria-hidden="true" />Personal</button>
      </div>
      <div className="diary-collection" role="tabpanel" id="diary-collection" aria-labelledby={`diary-tab-${selected}`}>
       <ul className="diary-entry-list">
        {selected !== 'Logbook' && diaryStories.map((story, index) => <li key={story.id}>
          <button className="diary-entry-row" aria-label={`Read story ${index + 1}: ${story.title}`} onClick={() => setOpenedStory(story)}>
            <img src="/assets/diary/story-mood.svg" alt="" width="52" height="52" />
            <span className="diary-entry-copy"><span className="diary-entry-title">{story.title}</span><span className="diary-entry-preview">{story.preview}</span></span>
            <span className="diary-entry-date">Yesterday</span>
          </button>
        </li>)}
        {selected !== 'Stories' && <li><button className="diary-entry-row" aria-label="Read mood entry: Calm session" onClick={onOpenEntry}>
          <img src="/assets/profile/mood-0.svg" alt="" width="52" height="52" />
          <span className="diary-entry-copy"><span className="diary-entry-title">Calm session</span><span className="diary-entry-preview">A quiet moment to return to yourself.</span></span>
          <span className="diary-entry-date">Sep 08</span>
        </button></li>}
       </ul>
      </div>
     </div>
    </div>
    {openedStory && <Modal title={openedStory.title} onClose={() => setOpenedStory(null)}><p className="diary-preview-label">Illustrative story • Yesterday</p><p>{openedStory.text}</p></Modal>}
  </section>;
}
