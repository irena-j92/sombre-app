import { useCallback, useState } from 'react';
import StatusBar from '../components/StatusBar.jsx';
import { Header } from '../components/Navigation.jsx';
import Modal from '../components/Modal.jsx';
import { sampleCapsuleMessage } from '../data/diary.js';

export default function TimeCapsuleReady({ navigate, draft }) {
  const [opened, setOpened] = useState(false);
  const closeCapsule = useCallback(() => setOpened(false), []);
  return <section className="screen flow-screen time-capsule-ready-screen" aria-labelledby="capsule-ready-heading">
    <StatusBar />
    <Header title="Time Capsule" onBack={() => navigate('time-capsule-compose')} backLabel="Back to time capsule editor" />
    <h1 id="capsule-ready-heading" tabIndex={-1}>Ready when you are</h1>
    <p className="capsule-ready-subtitle">A message you saved for this moment</p>
    <img className="capsule-artwork" src="/assets/diary/blue-capsule.svg" alt="A softly glowing blue and white time capsule" width="232" height="312" />
    <div className="capsule-details"><h2>For a difficult day</h2><p>Saved by you • 28 September</p></div>
    <p className="capsule-invitation">You can open it now, or come back another time.</p>
    <div className="capsule-ready-actions">
      <button onClick={() => setOpened(true)}>Open capsule</button>
      <button disabled>Remind me later</button>
    </div>
    {opened && <Modal title="For a difficult day" onClose={closeCapsule}><p className="capsule-open-message">{draft.text.trim() || sampleCapsuleMessage}</p></Modal>}
  </section>;
}
