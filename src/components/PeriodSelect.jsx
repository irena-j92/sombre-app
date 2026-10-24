import { ChevronDown } from 'lucide-react';
import { periods } from '../data/moods.js';

export default function PeriodSelect({ value, onChange, id = 'mood-period' }) {
  return <div className="period-select">
    <select id={id} aria-label="Mood period" value={value} onChange={(event) => onChange(event.target.value)}>
      {periods.map((period) => <option value={period.id} key={period.id}>{period.label}</option>)}
    </select>
    <ChevronDown size={12} strokeWidth={1} aria-hidden="true" />
  </div>;
}
