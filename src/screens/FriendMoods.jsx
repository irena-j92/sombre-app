import StatusBar from '../components/StatusBar.jsx';
import FriendTabs from '../components/FriendTabs.jsx';
import MoodListItem from '../components/MoodListItem.jsx';

export default function FriendMoods({ friend, navigate, onOpenNote }) {
  return <section className="screen friend-moods-screen" aria-labelledby="friend-moods-heading">
    <StatusBar /><h1 id="friend-moods-heading" tabIndex={-1} className="sr-only">{friend.name}’s shared moods</h1>
    <FriendTabs friend={friend} active="friend-moods" navigate={navigate} compact />
    <div className="screen-scroll friend-moods-scroll" role="region" tabIndex={0} aria-label={`${friend.name}’s public sample moods`}>
      {Array.from({ length: 6 }, (_, index) => <MoodListItem key={index} index={index} className="friend-mood-row" artwork={`/assets/friends/mood-${index}.svg`} label={`Open ${friend.name}’s shared mood ${index + 1}`} onOpen={() => onOpenNote(friend.id, `public-${index + 1}`, 'friend-moods')} />)}
    </div>
  </section>;
}
