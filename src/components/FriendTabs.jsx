const tabs = [['Overview', 'friend-profile'], ['Space', 'friend-space'], ['Moods', 'friend-moods'], ['Shared', 'friend-shared']];

export default function FriendTabs({ friend, active, navigate, compact = false }) {
  return <nav className={`profile-section-tabs friend-section-tabs ${compact ? 'friend-compact-tabs' : ''} ${active === 'friend-space' ? 'friend-space-tabs' : ''}`} aria-label={`${friend.name}’s profile sections`}>
    {tabs.map(([label, route]) => <button key={route} aria-current={active === route ? 'page' : undefined} onClick={() => navigate(route, { friendId: friend.id })}>{label}</button>)}
  </nav>;
}
