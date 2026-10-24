import { useState } from 'react';
import StatusBar from '../components/StatusBar.jsx';
import ProfileTabs from '../components/ProfileTabs.jsx';
import MoodListItem from '../components/MoodListItem.jsx';
import PeriodSelect from '../components/PeriodSelect.jsx';

export default function Moods({ navigate, onOpenEntry }) {
  const [period, setPeriod] = useState('week');
  return <section className="screen moods-history-screen" aria-labelledby="moods-heading">
    <StatusBar />
    <h1 id="moods-heading" className="sr-only" tabIndex={-1}>Your moods</h1>
    <ProfileTabs active="moods" navigate={navigate} compact />
    <div className="moods-period-row"><PeriodSelect id="history-period" value={period} onChange={setPeriod} /></div>
    <div className="screen-scroll moods-history-scroll" role="region" tabIndex={0} aria-label="Sample mood entries">
      {Array.from({ length: 7 }, (_, index) => <MoodListItem key={index} index={index} onOpen={onOpenEntry} navigate={navigate} />)}
      <p className="sr-only" aria-live="polite">Illustrative entries for {period === 'week' ? 'this week' : period === 'today' ? 'today' : period === 'month' ? 'this month' : 'all time'}.</p>
    </div>
  </section>;
}
