import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import EntryPaper from '../components/EntryPaper.jsx';
import { useEntryPageTurn } from '../hooks/useEntryPageTurn.js';

export default function Entry({ navigate, draft, today = false, openOnMount = false, onShare, onFirstAid, backScreen = 'calendar' }) {
  const [replay, setReplay] = useState(0);
  const book = useEntryPageTurn({ today, draft, navigate, openOnMount });
  return <section className={`screen entry-book ${today ? 'flow-screen entry-book-today' : ''}`} aria-labelledby="entry-heading" aria-busy={book.turning} data-page-turn-renderer={book.rendererMode} {...book.bindings}>
    <EntryPaper ref={book.currentPaper} draft={draft} today={today} replay={replay} skipFill={book.landed} onReplay={() => { book.allowFill(); setReplay((value) => value + 1); }} onFirstAid={onFirstAid} onShare={onShare} />
    <canvas data-html2canvas-ignore="true" ref={book.canvas} className="page-turn-canvas" width="393" height="852" aria-hidden="true" />
    <div data-html2canvas-ignore="true" data-page-turn-overlay ref={book.fallbackLayer} className="paper-fallback-layer" aria-hidden="true" />
    <div data-html2canvas-ignore="true" className="entry-book-chrome">
      <StatusBar light />
      <Header title={today ? 'Sep 28, 2026' : 'Sep 08, 2026'} onBack={() => navigate(today ? 'core' : backScreen)} backLabel={today ? 'Back to Core' : backScreen === 'profile' ? 'Back to Profile' : backScreen === 'moods' ? 'Back to Moods' : backScreen === 'diary' ? 'Back to Diary' : 'Back to Calendar'} onForward={today ? undefined : book.turn} forwardLabel="Next entry" rightAction={today ? <button className="icon-button" aria-label="Edit entry" disabled><Pencil size={18} strokeWidth={1} aria-hidden="true" /></button> : undefined} light />
      <nav className="book-pagination" aria-label="Entry pages">
        <div className="book-pagination-row">
          <button className="icon-button" aria-label="Previous entry" disabled={!today || book.turning} onClick={book.turn}><ChevronLeft size={18} strokeWidth={1} /></button>
          <span className="book-page-number" aria-live="polite" aria-label={`Entry ${today ? 2 : 1} of 2`}>{today ? '02' : '01'} <i>/</i> 02</span>
          <button className="icon-button" aria-label="Turn to next entry" disabled={today || book.turning} onClick={book.turn}><ChevronRight size={18} strokeWidth={1} /></button>
        </div>
        <span className="book-swipe-hint">Swipe to turn</span>
      </nav>
    </div>
    {createPortal(<div className="entry-capture-stage" aria-hidden="true" inert>
      <EntryPaper ref={book.nextPaper} draft={draft} today={!today} preview />
    </div>, document.body)}
  </section>;
}
