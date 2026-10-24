import { useState } from 'react';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import FriendTabs from '../components/FriendTabs.jsx';
import MoodListItem from '../components/MoodListItem.jsx';
import Modal from '../components/Modal.jsx';

export default function FriendProfile({ friend, navigate, connected, onToggleConnection, onCompose, onOpenNote }) {
  const [connectionDialog, setConnectionDialog] = useState(false);
  return <section className="screen friend-profile-screen" aria-labelledby="friend-profile-name">
    <StatusBar /><Header onBack={() => navigate('spaces')} backLabel="Back to Spaces" />
    <div className="screen-scroll friend-profile-scroll" role="region" tabIndex={0} aria-label={`${friend.name}’s profile`}>
      <section className="friend-profile-identity">
        <h1 id="friend-profile-name" tabIndex={-1}>{friend.name}</h1><span className="friend-profile-handle">{friend.handle}</span><p>{friend.spaces} Spaces</p>
        <img src={friend.portrait || friend.avatar} className="friend-profile-portrait" width="58" height="58" alt={friend.name} />
        <div className="friend-profile-actions">
          <button className={`friend-connect-button ${connected ? 'is-connected' : ''}`} onClick={() => connected ? setConnectionDialog(true) : onToggleConnection(friend.id)}>{connected ? 'Friends' : 'Add friend'}</button>
          <button className="friend-outline-button" onClick={onCompose}>Leave a note</button>
        </div>
      </section>
      <FriendTabs friend={friend} active="friend-profile" navigate={navigate} />
      <section className="friend-overview-report" aria-label="Illustrative relationship report">
        <p className="friend-compatibility">Your compatibility with {friend.name} is <strong>EXCELLENT.</strong></p>
        <p>{`While ${friend.name} brings energy, creative flair, and a fresh
perspective, you tend to bring clarity, structure,
and thoughtful organization to the dynamic.
Together, you balance each other’s ${friend.id === 'maya' ? 'natural sisterly' : 'natural'}
tendencies.`}</p>
        <p>{`You and ${friend.name} likely communicate with high
candor. While you may occasionally butt heads
over differing priorities—with you focusing on
practical steps and ${friend.name} leaning into intuition—
your shared history gives you a strong foundation
of trust.`}</p>
      </section>
      <div className="profile-section-band" />
      <MoodListItem className="friend-recent-mood" artwork="/assets/friends/mood-0.svg" label={`Open ${friend.name}’s recent mood`} onOpen={() => onOpenNote(friend.id, 'public-1', 'friend-profile')} />
      <div className="profile-section-band" /><div className="friend-profile-tail" />
    </div>
    {connectionDialog && <Modal title={`You and ${friend.name}`} onClose={() => setConnectionDialog(false)}><p>You’re friends in this preview. Connection changes stay here.</p><button className="friend-outline-button friend-save-note" onClick={() => { onToggleConnection(friend.id); setConnectionDialog(false); }}>Remove friend</button></Modal>}
  </section>;
}
