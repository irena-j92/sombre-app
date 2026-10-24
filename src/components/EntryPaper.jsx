import { forwardRef } from 'react';
import { BriefcaseMedical, LockKeyhole, Play, Share2 } from 'lucide-react';
import DotField from './DotField.jsx';

const EntryPaper = forwardRef(function EntryPaper({ draft, today, replay = 0, onReplay, onFirstAid, onShare, preview = false, skipFill = false }, ref) {
  const title = today ? draft.mood === 'angry' ? 'Intense moment' : 'A moment for you' : 'Calm session';
  const text = today ? draft.mode === 'type' && draft.note ? draft.note : 'Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' : 'I took the longer way home. The air was cool, and for a few minutes I wasn’t rushing.';
  const headingId = preview ? 'preview-entry-heading' : 'entry-heading';
  return <div ref={ref} data-fill={skipFill ? 'off' : 'on'} className={`entry-paper entry-screen ${today ? `todays-entry-screen entry-surface-${draft.mood}` : 'saved-entry-screen'}`}>
    <div className="entry-privacy-row flex items-center justify-between">
      <span className="entry-private-badge"><LockKeyhole color="#fff" size={12} strokeWidth={1.5} />Private</span>
      <div className="entry-actions flex gap-2">
        <button className="entry-action-button" aria-label="Open First Aid" onClick={onFirstAid} disabled={preview} tabIndex={preview ? -1 : undefined}><BriefcaseMedical size={16} strokeWidth={1.25} aria-hidden="true" /></button>
        <button className="entry-action-button" aria-label={today ? 'Share today’s entry' : 'Share saved entry'} onClick={onShare} disabled={preview} tabIndex={preview ? -1 : undefined}><Share2 size={15} strokeWidth={1.25} aria-hidden="true" /></button>
      </div>
    </div>
    <div className="entry-body">
      <div className="entry-title-row flex items-center gap-3"><h1 id={headingId} tabIndex={-1}>{title}</h1>
        <button className="entry-play" aria-label="Replay entry dot visualization" onClick={onReplay} tabIndex={preview ? -1 : undefined}><Play size={14} fill="#fff" color="#fff" strokeWidth={0} /></button>
      </div>
      <p className="entry-quote">“{text}”</p>
    </div>
    <DotField variant={today ? 'today' : 'entry'} replayKey={replay} />
    <div className="gradient-footer" aria-hidden="true" />
  </div>;
});
export default EntryPaper;
