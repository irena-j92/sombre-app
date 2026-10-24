import StatusBar from '../components/StatusBar.jsx';
import FriendTabs from '../components/FriendTabs.jsx';
import { relationshipTraits, storyText } from '../data/friends.js';

export default function FriendSpace({ friend, navigate, onOpenStory }) {
  return <section className="screen friend-space-screen" aria-labelledby="friend-space-heading">
    <StatusBar /><h1 id="friend-space-heading" tabIndex={-1} className="sr-only">Your space with {friend.name}</h1>
    <FriendTabs friend={friend} active="friend-space" navigate={navigate} compact />
    <div className="screen-scroll friend-space-scroll" role="region" tabIndex={0} aria-label={`Shared space with ${friend.name}`}>
      <section className="friend-space-hero" aria-labelledby="relationship-palette-name">
        <div className="friend-space-kernel"><img src="/assets/friends/relationship-kernel.svg" width="242" height="248" alt="An organic grainy green, olive, pink and peach relationship gradient" /><span>Clara<br />&amp;<br />{friend.name}</span></div>
        <h2 id="relationship-palette-name">Sunlit Meadow Bloom</h2><p>{storyText}</p>
        <button className="friend-outline-button friend-story-button" onClick={onOpenStory}>View story</button>
      </section>
      <div className="profile-section-band" />
      <ul className="friend-space-traits">{relationshipTraits.map(([title, copy], index) => <li key={title}><img src={`/assets/friends/trait-${index}.svg`} width="54" height="54" alt="" /><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ul>
    </div>
  </section>;
}
