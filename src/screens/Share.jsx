import { useEffect } from 'react';
import { X } from 'lucide-react';
import StatusBar from '../components/StatusBar.jsx';

export default function Share({ navigate, backScreen = 'todays-entry' }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') navigate(backScreen, { replace: true }); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, backScreen]);

  return <section className="screen share-screen" aria-labelledby="share-heading">
    <StatusBar />
    <h1 id="share-heading" className="sr-only" tabIndex={-1}>Share</h1>
    <figure className="share-profile-card" aria-label="Sample Sombre profile card">
      <img className="share-qr-artwork" src="/assets/share-qr.png" alt="Sample gradient QR artwork with profile photo" width="232" height="232" />
      <figcaption>@patchsketch</figcaption>
    </figure>
    <div className="share-tray" aria-label="Sharing options">
      <button className="icon-button share-close" aria-label="Close Share" onClick={() => navigate(backScreen, { replace: true })}><X size={22} strokeWidth={1.25} aria-hidden="true" /></button>
      <div className="share-targets">
        {['Instagram', 'X', 'Whatsapp', 'Messages'].map((name) => <button className="share-target" disabled key={name}><span aria-hidden="true" />{name}</button>)}
        <a className="share-target" href="/assets/sombre-profile-card.png" download="sombre-profile-card.png" aria-label="Save sample profile card"><span aria-hidden="true" />Save</a>
        <button className="share-target" disabled><span aria-hidden="true" />More</button>
      </div>
    </div>
  </section>;
}
