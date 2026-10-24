/** The status strip belongs to the supplied frame artwork, not the browser chrome. */
export default function StatusBar({ light = false }) {
  return (
    <div className={`status-bar flex items-center justify-between ${light ? 'text-white' : 'text-[#111]'}`} aria-hidden="true">
      <span>10:56</span>
      <div className="flex items-center gap-[10px]">
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M1 3.8a9.2 9.2 0 0 1 12 0M3.3 6.3a5.7 5.7 0 0 1 7.4 0M5.7 8.7a2 2 0 0 1 2.6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="7" cy="10.5" r=".8" fill="currentColor"/></svg>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="m11.5.5-1-.2-4 3.2L2 2.2.8 3l3.8 2.1L2 7.8.4 7.5l-.4.7 2.4 1.1L3.5 12l.7-.4-.2-1.7 2.6-2.7L8.8 11l.8-1.2-1.3-4.5L11.5.5Z"/></svg>
        <svg width="19" height="12" viewBox="0 0 19 12" fill="none"><rect x=".5" y="1.5" width="16" height="9" rx=".7" stroke="currentColor"/><path d="M18 4v4" stroke="currentColor" strokeWidth="1.5"/><path d="M2 3h13v6H2z" fill="currentColor"/></svg>
      </div>
    </div>
  );
}
