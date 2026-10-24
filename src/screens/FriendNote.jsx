import { useState } from 'react';
import { BriefcaseMedical, Globe, LockKeyhole, Share2 } from 'lucide-react';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import Modal from '../components/Modal.jsx';

export default function FriendNote({ note, friend, onBack, backLabel, onFirstAid }) {
  const [sharing, setSharing] = useState(false);
  const [copyState, setCopyState] = useState('');
  const shareText = note ? `${note.title}\n\n${note.text}` : '';
  const copy = async () => {
    try { await navigator.clipboard.writeText(shareText); setCopyState('Copied to clipboard.'); }
    catch { setCopyState('Select and copy the text below.'); }
  };
  return <section className="screen friend-note-screen" aria-labelledby="friend-note-heading">
    <StatusBar light /><Header title={note?.date || 'Note'} onBack={onBack} backLabel={backLabel} rightAction={<span />} light />
    <span className="friend-note-visibility">{note?.visibility === 'Public' ? <Globe size={14} strokeWidth={1} /> : <LockKeyhole size={14} strokeWidth={1} />}{note?.visibility || 'Private'}</span>
    {note && <div className="friend-note-actions"><button aria-label="Open First Aid" onClick={onFirstAid}><BriefcaseMedical size={18} strokeWidth={1.25} /></button><button aria-label="Share friend’s note" onClick={() => { setCopyState(''); setSharing(true); }}><Share2 size={16} strokeWidth={1.25} /></button></div>}
    <div className="friend-note-body" role="region" aria-label="Note content" tabIndex={0}><h1 id="friend-note-heading" tabIndex={-1}>{note?.title || 'This note isn’t available'}</h1><p>{note ? `“${note.text}”` : 'Drafts stay in this preview and clear when the page is reloaded. Go back to explore the sample notes.'}</p></div>
    {sharing && <Modal title="Share this note" onClose={() => setSharing(false)}><p>Copy just this note. Your private entries stay private.</p><label className="sr-only" htmlFor="share-note-text">Note text to copy</label><textarea id="share-note-text" className="friend-copy-text" value={shareText} readOnly rows={6} /><button className="friend-outline-button friend-save-note" onClick={copy}>Copy note</button><p role="status">{copyState}</p></Modal>}
    <span className="sr-only">{note?.draft ? 'Local draft visible only in this preview.' : `Illustrative note shared by ${note?.author || friend.name}.`}</span>
  </section>;
}
