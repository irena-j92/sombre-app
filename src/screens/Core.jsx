import { useState } from 'react';
import StatusBar from '../components/StatusBar.jsx';
import PeriodSelect from '../components/PeriodSelect.jsx';
import MoodTimeline from '../components/MoodTimeline.jsx';
import { periods } from '../data/moods.js';

const words = ['safe', 'comfort', 'steady', 'quiet', 'feeling', 'exhausted', 'worry'];

export default function Core({ navigate }) {
  const [period, setPeriod] = useState('week');
  return <section className="screen core-screen report-core-screen" aria-label="Core home screen">
    <StatusBar />
    <header className="core-report-header">
      <button className="core-profile-button" aria-label="Open your profile" onClick={() => navigate('profile')}><img src="/assets/profile/clara-small.svg" width="24" height="24" alt="" /></button>
      <PeriodSelect value={period} onChange={setPeriod} />
    </header>
    <div className="screen-scroll report-core-scroll" role="region" aria-label="Core report" tabIndex={0}>
      <h1 className="sr-only" tabIndex={-1}>Your Core</h1>
      <section className="core-week-overview" aria-label="Sample mood overview">
        <h2>Welcome back, Clara!</h2>
        <p>You have logged in 5 times so far {period === 'week' ? 'this week' : period === 'today' ? 'today' : period === 'month' ? 'this month' : 'in total'}</p>
        <MoodTimeline navigate={navigate} />
        <span className="sr-only" aria-live="polite">{periods.find((item) => item.id === period).description}</span>
      </section>
      <div className="profile-section-band" />
      <section className="core-week-report" aria-label="Sample emotional report">
        <p className="report-eyebrow">Your latest report is ready.</p>
        <p className="report-prose">This week you moved through deep inner tides, balancing moments of sharp friction with deeply intentional stillness. Though subtle tensions often surfaced beneath the routine, you continually anchored yourself in a quiet, steady presence.</p>
        <p className="report-words-heading">Your most used words were:</p>
        <ul className="report-words">{words.map((word) => <li key={word}>{word}</li>)}</ul>
        <img className="core-organic-kernel" src="/assets/profile/core-kernel.svg" width="300" height="301" alt="Calm and anxious. An organic grainy gold, lilac and orange mood gradient with labels for centered, serene, apprehensive, overwhelmed and placid." />
      </section>
    </div>
  </section>;
}
