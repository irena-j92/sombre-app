import { useState } from 'react';
import Modal from './Modal.jsx';

export default function FriendComposer({ friend, reply = false, replyTo, onSave, onClose }) {
  const [title, setTitle] = useState(reply ? 'A little reply' : 'A note for you');
  const [text, setText] = useState('');
  return <Modal title={reply ? `Reply to ${friend.name}` : `A note for ${friend.name}`} onClose={onClose}>
    <form className="friend-note-form" onSubmit={(event) => { event.preventDefault(); if (text.trim()) onSave({ title: title.trim() || 'A note for you', text: text.trim(), replyTo }); }}>
      <p className="friend-preview-hint">Saved only in this preview. Nothing is sent.</p>
      <label htmlFor="friend-note-title">Title</label><input id="friend-note-title" maxLength={60} value={title} onChange={(event) => setTitle(event.target.value)} />
      <label htmlFor="friend-note-message">Your note</label><textarea id="friend-note-message" placeholder="A little appreciation, a shared memory…" maxLength={2000} rows={5} value={text} onChange={(event) => setText(event.target.value)} />
      <button className="friend-outline-button friend-save-note" disabled={!text.trim()} type="submit">Save {reply ? 'reply' : 'note'}</button>
    </form>
  </Modal>;
}
