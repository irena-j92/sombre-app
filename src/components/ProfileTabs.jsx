const tabs = [{ label: 'Overview', route: 'profile' }, { label: 'Space', route: 'personal-space' }, { label: 'Moods', route: 'moods' }];

export default function ProfileTabs({ active, navigate, compact = false }) {
  return <nav className={`profile-section-tabs ${compact ? 'compact-profile-tabs' : ''}`} aria-label="Profile sections">
    {tabs.map((tab) => <button key={tab.route} aria-current={active === tab.route ? 'page' : undefined} onClick={() => navigate(tab.route)}>{tab.label}</button>)}
    <button disabled>{compact ? 'Shared' : 'Settings'}</button>
  </nav>;
}
