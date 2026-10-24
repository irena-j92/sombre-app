import { useEffect } from 'react';
import StatusBar from '../components/StatusBar.jsx';
import SplashGradient from '../components/SplashGradient.jsx';

export default function Splash({ navigate }) {
  useEffect(() => {
    const timer = window.setTimeout(() => navigate('core', { replace: true }), 3000);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return <section className="screen splash-screen" aria-label="Sombre is opening">
    <SplashGradient />
    <div className="splash-grain" aria-hidden="true" />
    <StatusBar light />
    <h1 className="splash-wordmark"><img src="/assets/sombre-wordmark.svg" alt="sombre" /></h1>
    <p className="sr-only" role="status">A little room for how you feel. Opening Sombre…</p>
  </section>;
}
