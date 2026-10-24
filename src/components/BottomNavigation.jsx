import { navigationIcons } from '../data/navigation.js';

const destinations = { home: 'core', spaces: 'spaces', diary: 'diary', you: 'profile' };
const items = [navigationIcons[0], navigationIcons[1], { id: 'log', label: 'Log a mood', center: 197.03 }, navigationIcons[2], navigationIcons[3]];

export default function BottomNavigation({ active, navigate, onNewEntry }) {
  return <nav className="main-navigation" aria-label="Main navigation">
    {items.map((icon) => <button key={icon.id} className={icon.id === 'log' ? 'main-navigation-create' : 'main-navigation-destination'} style={{ left: icon.center - 22 }} title={icon.label} aria-current={active === icon.id ? 'page' : undefined} onClick={icon.id === 'log' ? onNewEntry : () => navigate(destinations[icon.id])}>
      {icon.id === 'log' ? <span className="main-navigation-orb" aria-hidden="true" /> : <svg width="28" height="28" viewBox={icon.viewBox} fill="none" aria-hidden="true">{icon.paths.map((path, index) => <path {...path} key={index} />)}</svg>}
      <span className="sr-only">{icon.label}</span>
    </button>)}
  </nav>;
}
