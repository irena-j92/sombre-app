import { useState } from 'react';
import StatusBar from '../components/StatusBar.jsx';
import FriendTabs from '../components/FriendTabs.jsx';
import PeriodSelect from '../components/PeriodSelect.jsx';
import { sampleExcerpt, sampleTitle, sharedSamples } from '../data/friends.js';

export default function FriendShared({ friend, navigate, notes, connected, onToggleConnection, onCompose, onOpenNote }) {
  const [period, setPeriod] = useState('week');
  const drafts = notes.filter((note) => note.friendId === friend.id).map((note) => ({ ...note, author: 'you', time: 'Now', ageDays: 0, local: true }));
  const timeline = connected
    ? [...drafts.filter((note) => !note.replyTo), ...sharedSamples.flatMap((sample) => [sample, ...drafts.filter((note) => note.replyTo === sample.id).map((note) => ({ ...note, child: true }))])]
    : drafts;
  const items = timeline.filter((note) => period !== 'today' || note.ageDays === 0);
  return <section className="screen friend-shared-screen" aria-labelledby="friend-shared-heading">
    <StatusBar /><h1 id="friend-shared-heading" className="sr-only" tabIndex={-1}>Notes shared with {friend.name}</h1>
    <FriendTabs friend={friend} active="friend-shared" navigate={navigate} compact />
    <div className="moods-period-row"><PeriodSelect id="shared-period" value={period} onChange={setPeriod} /></div>
    <div className="screen-scroll friend-shared-scroll" role="region" tabIndex={0} aria-label={`Notes with ${friend.name}`}>
      {items.length ? <div className="friend-shared-list">{items.map((item, index) => <article key={item.id} className={`friend-shared-row ${item.child ? 'is-thread-reply' : ''} ${item.canReply ? 'has-reply' : ''} ${item.child && items[index + 1]?.child ? 'has-next-thread-reply' : ''} ${item.local ? 'is-local-note' : ''}`}>
        <img src={item.author === 'you' ? '/assets/friends/clara-plain.svg' : friend.id === 'maya' ? '/assets/friends/maya-plain.svg' : friend.avatar} width="52" height="52" alt={item.author === 'you' ? 'Clara' : friend.name} />
        <button className="shared-note-open" aria-label={`Open ${item.local ? 'your draft' : item.author === 'you' ? 'Clara’s note' : `${friend.name}’s note`}, ${item.time}`} onClick={() => onOpenNote(friend.id, item.id, 'friend-shared')}><span className="shared-note-title">{item.title || sampleTitle}</span><span className="shared-note-excerpt">{item.text || sampleExcerpt}</span><span className="shared-note-time">{item.time}</span>{item.local && <span className="shared-draft-label">Draft</span>}</button>
        {item.canReply && <button className="shared-reply-button" onClick={() => onCompose(item.id)}>Reply</button>}
      </article>)}</div> : <div className="friend-shared-empty"><h2>A little space for two</h2><p>Add {friend.name} to start a shared space in this preview.</p><button className="friend-outline-button" onClick={() => onToggleConnection(friend.id)}>Add friend</button></div>}
    </div>
  </section>;
}
