import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import ProfileTabs from '../components/ProfileTabs.jsx';
import MoodTimeline from '../components/MoodTimeline.jsx';
import MoodListItem from '../components/MoodListItem.jsx';
import ReviewCards from '../components/ReviewCards.jsx';

const traits = [
  ['Driven & grounded', 'You lead with authentic heart and high vitality, inspiring others through your steady strength and warm confidence.'],
  ['Empathetic & intuitive', 'Soft-spoken and deeply perceptive, you bring quiet elegance, emotional clarity, and gentle creativity to every connection.'],
  ['Wise & cultivated', 'Grounded in strong values, you offer thoughtful advice and project a timeless, cultivated stability people naturally trust.'],
  ['Uplifting & creative', 'A radiant presence, your warmth and easy optimism make those around you feel instantly relaxed, inspired, and valued.'],
];

export default function Profile({ navigate, space = false, onOpenEntry }) {
  return <section className={`screen profile-screen reference-profile-screen ${space ? 'personal-space-screen' : ''}`} aria-labelledby="profile-name">
    <StatusBar />
    <Header title="You" onBack={() => navigate('core')} />
    <div className="screen-scroll reference-profile-scroll" role="region" aria-label="Profile content" tabIndex={0}>
      <section className="reference-profile-identity">
        <h1 id="profile-name" tabIndex={-1}>Clara</h1>
        <span className="profile-handle">@patchsketch</span>
        <p>12 spaces</p>
        <img className="profile-clara-avatar" src="/assets/profile/clara.svg" width="64" height="64" alt="Clara" />
      </section>
      <ProfileTabs active={space ? 'personal-space' : 'profile'} navigate={navigate} />
      {space ? <>
        <section className="personal-space-summary" aria-labelledby="space-title">
          <img src="/assets/profile/emotional-space.svg" width="241" height="241" alt="Calm and anxious. A grainy organic mood palette of warm gold, lilac and orange, surrounded by centered, serene, apprehensive, overwhelmed, placid, restless and mindful." />
          <h2 id="space-title">Warm Golden Hour</h2>
          <p>This palette reveals a personality that is deeply grounded, creatively expressive, and effortlessly magnetic. You possess a unique balance of bold passion and gentle warmth, drawing people in with your natural authenticity and timeless grace.</p>
        </section>
        <div className="profile-section-band" />
        <ul className="space-traits">{traits.map(([title, description], index) => <li key={title}>
          <img src={`/assets/profile/trait-${index}.svg`} width="54" height="54" alt="" />
          <div><h3>{title}</h3><p>{description}</p></div>
        </li>)}</ul>
      </> : <>
        <div className="profile-chart-section"><MoodTimeline navigate={navigate} /></div>
        <div className="profile-section-band" />
        <MoodListItem onOpen={onOpenEntry} navigate={navigate} className="profile-recent-mood" />
        <div className="profile-section-band" />
        <ReviewCards />
      </>}
    </div>
  </section>;
}
