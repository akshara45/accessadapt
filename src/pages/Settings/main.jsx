import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { Brand } from '../../components/Brand';
import { Toggle } from '../../components/Toggle';
import { PROFILE_OPTIONS } from '../../features/profiles/profileData';
import { getAccessibilityState, saveAccessibilityState, selectAccessibilityProfile } from '../../services/storageService';
import '../../styles/global.css';
import './settings.css';

function Settings() {
  const [state, setState] = useState(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { getAccessibilityState().then(setState); }, []);
  if (!state) return <main className="settings-page"><p>Loading settings…</p></main>;

  async function changeProfile(profileId) {
    const nextState = await selectAccessibilityProfile(profileId);
    setState(nextState);
  }
  function changeSetting(key, value) {
    setState((current) => ({ ...current, userSettings: { ...current.userSettings, [key]: value } }));
  }
  async function save() {
    await saveAccessibilityState(state);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  const settings = state.userSettings;
  return (
    <main className="settings-page">
      <header><Brand compact /><p>Choose a profile, then tailor the basics to your reading needs.</p></header>
      <section aria-labelledby="profiles-heading">
        <h1 id="profiles-heading">Accessibility profiles</h1>
        <div className="profile-grid">
          {PROFILE_OPTIONS.map((profile) => (
            <button key={profile.id} className={`profile-card ${state.selectedProfile === profile.id ? 'selected' : ''}`} onClick={() => changeProfile(profile.id)}>
              <strong>{profile.name}</strong><span>{profile.description}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="settings-card" aria-labelledby="preferences-heading">
        <h2 id="preferences-heading">Reading preferences</h2>
        <label className="range-setting">Font size <output>{settings.fontSize}%</output><input type="range" min="80" max="150" value={settings.fontSize} onChange={(event) => changeSetting('fontSize', Number(event.target.value))} /></label>
        <label className="range-setting">Text spacing <output>{settings.letterSpacing}em</output><input type="range" min="0" max="0.12" step="0.01" value={settings.letterSpacing} onChange={(event) => changeSetting('letterSpacing', Number(event.target.value))} /></label>
        <label className="range-setting">Line height <output>{settings.lineHeight}</output><input type="range" min="1.2" max="2" step="0.1" value={settings.lineHeight} onChange={(event) => changeSetting('lineHeight', Number(event.target.value))} /></label>
        <Toggle label="Contrast enhancement" checked={settings.contrast} onChange={(value) => changeSetting('contrast', value)} />
        <Toggle label="Reduce animations" checked={settings.reduceMotion} onChange={(value) => changeSetting('reduceMotion', value)} />
      </section>
      <button className="button button-primary save-button" type="button" onClick={save}>{saved ? 'Settings saved' : 'Save settings'}</button>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<Settings />);
