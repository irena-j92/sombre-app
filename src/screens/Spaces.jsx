import { useState } from 'react';
import { BadgeCheck, Search } from 'lucide-react';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import FriendFinder from '../components/FriendFinder.jsx';
import { activity, getFriend, sampleExcerpt, sampleTitle, suggestedFriends } from '../data/friends.js';

export default function Spaces({ navigate, connections, onToggleConnection, readActivity, onRead, onOpenNote }) {
  const [finder, setFinder] = useState(false);
  const openFriend = (id) => { setFinder(false); navigate('friend-profile', { friendId: id }); };
  return <section className="screen social-spaces-screen" aria-labelledby="social-spaces-heading">
    <StatusBar /><Header title="Spaces" onBack={() => navigate('core')} />
    <h1 id="social-spaces-heading" className="sr-only" tabIndex={-1}>Spaces</h1>
    <div className="screen-scroll social-spaces-scroll" role="region" tabIndex={0} aria-label="Spaces activity">
      <section className="spaces-suggested" aria-labelledby="suggested-heading">
        <h2 id="suggested-heading">Suggested</h2>
        <div className="suggested-people">
          <button className="suggested-person add-friends" onClick={() => setFinder(true)}><span className="add-friends-circle"><Search size={21} strokeWidth={.8} /></span><span>Add<br />friends</span></button>
          {suggestedFriends.map((friend) => <button key={friend.id} className="suggested-person" aria-label={`Open ${friend.name}’s profile`} onClick={() => openFriend(friend.id)}>
            <img src={friend.avatar} alt="" width="50" height="50" /><span className="suggested-name">{friend.name}{friend.id === 'maurizio' ? <BadgeCheck size={12} fill="#164cff" stroke="white" strokeWidth={1.5} /> : friend.id === 'kierra' ? '🌸' : ''}</span><span className="suggested-handle">{friend.handle}</span>
          </button>)}
        </div>
      </section>
      <div className="profile-section-band" />
      <h2 className="spaces-latest-heading">Latest</h2>
      <div className="spaces-activity-list">
        {activity.map((item) => {
          const friend = getFriend(item.friendId); const unread = item.unread && !readActivity.has(item.id);
          return <article className={`spaces-activity-row ${unread ? 'is-unread' : ''}`} key={item.id}>
            {unread && <span className="activity-unread-dot" aria-label="Unread" />}
            <button className="activity-avatar" aria-label={`Open ${friend.name}’s profile`} onClick={() => openFriend(friend.id)}><img src={friend.avatar} width="56" height="56" alt="" /></button>
            <button className="activity-note" aria-label={`Open ${friend.name}’s note, ${item.time}${unread ? ', unread' : ''}`} onClick={() => { onRead(item.id); onOpenNote(friend.id, item.noteId, 'spaces'); }}>
              <span className="activity-note-title">{sampleTitle}</span><span className="activity-note-excerpt">{sampleExcerpt}</span><span className="activity-note-time">{item.time}</span>
            </button>
          </article>;
        })}
      </div>
    </div>
    {finder && <FriendFinder connections={connections} onToggle={onToggleConnection} onOpen={openFriend} onClose={() => setFinder(false)} />}
  </section>;
}
