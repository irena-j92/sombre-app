import { ChevronDown } from 'lucide-react';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import { calendarDays } from '../data/calendar.js';
import { collectionGradients } from '../data/collection.js';

export default function Calendar({ navigate, onOpenEntry }) {
  return <section className="screen calendar-screen collection-screen" aria-labelledby="calendar-heading">
    <StatusBar />
    <Header title="2026" onBack={() => navigate('profile')} backLabel="Back to Profile" />
    <h1 id="calendar-heading" tabIndex={-1} className="sr-only">Your mood calendar</h1>
    <div className="collection-date" aria-label="Tuesday, September 29, 2026">
      <span className="collection-number">29</span>
      <span className="collection-month">September <ChevronDown size={20} strokeWidth={1} aria-hidden="true" /></span>
      <span className="collection-weekday">Tue</span>
    </div>
    <div className="calendar-body" role="grid" aria-label="September mood calendar">
      <div className="calendar-week-labels" role="row">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span role="columnheader" key={index}>{day}</span>)}</div>
      {Array.from({ length: 5 }, (_, row) => <div className="calendar-row" role="row" key={row}>
        {calendarDays.slice(row * 7, row * 7 + 7).map((day) => <div className={`calendar-cell cell-${day.kind}`} role="gridcell" aria-label={collectionGradients[day.index] ? `Logged mood — tile ${day.index + 1}` : undefined} key={day.index} style={collectionGradients[day.index] ? { background: collectionGradients[day.index] } : undefined}>
          {day.index === 5 ? <button className="calendar-entry-button" aria-label="Open entry — first row, sixth rectangle" onClick={onOpenEntry} />
            : !collectionGradients[day.index] && <span className={day.kind === 'future' ? 'empty-dash' : 'empty-dot'} aria-label={day.kind === 'future' ? 'Future day' : 'No entry'} />}
        </div>)}
      </div>)}
    </div>
  </section>;
}
