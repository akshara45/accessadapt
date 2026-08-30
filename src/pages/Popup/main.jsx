import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { Brand } from '../../components/Brand';
import { Toggle } from '../../components/Toggle';
import { getProfile } from '../../features/profiles/profileData';
import { getAccessibilityState, saveAccessibilityState } from '../../services/storageService';
import '../../styles/global.css';
import './popup.css';

function Popup() {
  const [state, setState] = useState(null);

  useEffect(() => { getAccessibilityState().then(setState); }, []);

  async function updateEnabled(enabled) {
    const next = { ...state, enabled };
    setState(next);
    await saveAccessibilityState(next);
  }

  if (!state) return <main className="popup-shell"><p>Loading AccessAdapt…</p></main>;
  const profile = getProfile(state.selectedProfile);

  return (
    <main className="popup-shell">
      <Brand />
      <p className="intro">Make websites more comfortable to read and use, your way.</p>
      <section className="control-card" aria-label="Accessibility controls">
        <Toggle checked={state.enabled} onChange={updateEnabled} label="Accessibility support" />
      </section>
      <section className="profile-summary">
        <span className="eyebrow">CURRENT PROFILE</span>
        <strong>{profile.name}</strong>
        <p>{profile.description}</p>
      </section>
      <button className="button button-primary" type="button">Scan this page <span aria-hidden="true">→</span></button>
      <button className="button button-secondary" type="button" onClick={() => chrome.runtime.openOptionsPage()}>Settings</button>
      <p className="day-note">Day 1 foundation · Page scanning arrives soon.</p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<Popup />);
