import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ArrowButton({ direction = 'left', label, onClick }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  return <button className="icon-button" aria-label={label} onClick={onClick}><Icon size={20} strokeWidth={1} aria-hidden="true" /></button>;
}

export function MoreButton() {
  return (
    <button className="icon-button more-button" type="button" disabled aria-label="Menu" title="Menu">
      <span className="dots-grid" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span>
    </button>
  );
}

export function Avatar({ size = 68, onClick }) {
  const image = <img className="avatar-image" src="/assets/zoey.jpg" alt={onClick ? '' : 'Zoey'} width={size} height={size} />;
  return onClick
    ? <button className="avatar-button" aria-label="Open your profile" onClick={onClick}>{image}</button>
    : <div className="avatar" style={{ width: size, height: size }}>{image}</div>;
}

export function Header({ title, onBack, backLabel = 'Back to Core', onForward, forwardLabel = 'Next entry', rightAction, light = false, children }) {
  return <header className={`app-header flex items-center justify-between ${light ? 'header-light' : ''}`}>
    {onBack ? <ArrowButton label={backLabel} onClick={onBack} /> : children}
    <div className="header-title">{title}</div>
    {rightAction ?? (onForward ? <ArrowButton direction="right" label={forwardLabel} onClick={onForward} /> : <MoreButton />)}
  </header>;
}

export function PrimaryButton({ children, onClick, ...props }) {
  return <button className="primary-button w-full bg-[#111] text-white transition-colors hover:bg-[#292929] active:bg-black" onClick={onClick} {...props}>{children}</button>;
}
