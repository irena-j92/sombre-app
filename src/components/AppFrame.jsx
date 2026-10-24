import { useEffect, useState } from 'react';

export default function AppFrame({ children }) {
  const [scale, setScale] = useState(() => Math.min(1, window.innerWidth / 393));
  useEffect(() => {
    const resize = () => setScale(Math.min(1, window.innerWidth / 393));
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <main className="app-stage min-h-dvh grid place-items-center bg-[#f7f7f7]">
      <div className="frame-slot" style={{ width: 393 * scale, height: 852 * scale }}>
        <div className="app-frame relative overflow-hidden bg-white text-[#111]" style={{ transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </main>
  );
}
