export default function MoodListItem({ index = 4, navigate, className = '', onOpen, artwork, label }) {
  return <button className={`mood-list-item ${className}`} onClick={onOpen || (() => navigate('entry'))} aria-label={label || `Open saved mood entry ${index + 1}`}>
    <img src={artwork || `/assets/profile/mood-${index}.svg`} alt="" width="54" height="54" />
    <span className="mood-list-copy"><span className="mood-list-title">Lorem ipsum dolor sit amet</span><span className="mood-list-excerpt">Lorem ipsum dolor sit amet, consectetur aliqua adipiscing elit, sed do eiusmod tempor incididunt...</span></span>
    <span className="mood-list-time">Yesterday</span>
  </button>;
}
