import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import Modal from './Modal.jsx';
import { friends } from '../data/friends.js';

export default function FriendFinder({ connections, onToggle, onOpen, onClose }) {
  const [query, setQuery] = useState('');
  const matches = friends.filter((friend) => `${friend.name} ${friend.handle}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <Modal title="Find your people" onClose={onClose}>
    <p className="friend-preview-hint">Explore the people in this preview.</p>
    <label className="sr-only" htmlFor="friend-search">Search friends</label>
    <input className="friend-search-input" id="friend-search" type="search" placeholder="Search name or username" value={query} onChange={(event) => setQuery(event.target.value)} />
    <div className="friend-search-results" aria-live="polite">
      {matches.length ? matches.map((friend) => <div className="friend-search-result" key={friend.id}>
        <button onClick={() => onOpen(friend.id)} aria-label={`Open ${friend.name}’s profile`}><img src={friend.avatar} width="40" height="40" alt="" /><span>{friend.name}<small>{friend.handle}</small></span></button>
        <button className="friend-search-connect" aria-label={`${connections.has(friend.id) ? 'Remove' : 'Add'} ${friend.name} ${connections.has(friend.id) ? 'from' : 'to'} friends`} aria-pressed={connections.has(friend.id)} onClick={() => onToggle(friend.id)}>{connections.has(friend.id) ? <Check size={17} strokeWidth={1.25} /> : <Plus size={17} strokeWidth={1.25} />}</button>
      </div>) : <div className="friend-search-empty"><h3>No people found</h3><p>Try another name or username.</p></div>}
    </div>
  </Modal>;
}
