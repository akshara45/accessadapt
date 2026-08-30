import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { Brand } from '../../components/Brand';
import { Toggle } from '../../components/Toggle';
import { PROFILE_OPTIONS } from '../../features/profiles/profileData';
import {
  getAccessibilityState,
  saveAccessibilityState,
  selectAccessibilityProfile,
} from '../../services/storageService';
import '../../styles/global.css';
import './settings.css';

function Settings() {
  const [state, setState] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAccessibilityState().then(setState);
  }, []);

  if (!state) {
    return (
      <main className="settings-page">
        <p>Loading settings…</p>
      </main>
    );
  }

  async function changeProfile(profileId) {
    const nextState = await selectAccessibilityProfile(profileId);
    setState(nextState);
  }

  function changeSetting(key, value) {
    setState((current) => ({
      ...current,
      userSettings: {
        ...current.userSettings,
        [key]: value,
      },
    }));
  }

  async function save() {
    await saveAccessibilityState(state);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  const settings = state.userSettings;

  return (
    <main className="settings-page">

      {/* Header */}
      <header className="settings-header">
        <Brand />

        <div className="header-content">
          <h1>Accessibility settings</h1>
          <p>
            Personalize your browsing experience with settings designed
            around your reading needs.
          </p>
        </div>
      </header>

      {/* Accessibility Profiles */}
      <section aria-labelledby="profiles-heading">

        <div className="section-heading">
          <h2 id="profiles-heading">Accessibility profile</h2>
          <p>Select the profile that best matches your needs.</p>
        </div>

        <div className="profile-grid">
          {PROFILE_OPTIONS.map((profile) => {
            const isSelected =
              state.selectedProfile === profile.id;

            return (
              <button
                key={profile.id}
                type="button"
                className={`profile-card ${
                  isSelected ? 'selected' : ''
                }`}
                onClick={() => changeProfile(profile.id)}
              >
                <div className="profile-card-top">

                  <span
                    className="profile-icon"
                    aria-hidden="true"
                  >
                    {profile.id === 'standard' && 'S'}
                    {profile.id === 'low-vision' && 'V'}
                    {profile.id === 'dyslexia' && 'D'}
                    {profile.id === 'reading-difficulty' && 'R'}
                    {profile.id === 'color-vision' && 'C'}
                  </span>

                  {isSelected && (
                    <span className="selected-badge">
                      Selected
                    </span>
                  )}

                </div>

                <strong>{profile.name}</strong>

                <span className="profile-description">
                  {profile.description}
                </span>
              </button>
            );
          })}
        </div>

      </section>

      {/* Reading Preferences */}
      <section
        className="settings-card"
        aria-labelledby="preferences-heading"
      >

        <div className="section-heading">
          <h2 id="preferences-heading">
            Reading preferences
          </h2>

          <p>
            Fine-tune the way content appears while browsing.
          </p>
        </div>

        <div className="preference-list">

          {/* Font Size */}
          <label className="range-setting">
            <div className="setting-label">
              <span>Font size</span>
              <output>{settings.fontSize}%</output>
            </div>

            <input
              type="range"
              min="80"
              max="150"
              value={settings.fontSize}
              onChange={(event) =>
                changeSetting(
                  'fontSize',
                  Number(event.target.value)
                )
              }
            />
          </label>

          {/* Text Spacing */}
          <label className="range-setting">
            <div className="setting-label">
              <span>Text spacing</span>
              <output>
                {settings.letterSpacing}em
              </output>
            </div>

            <input
              type="range"
              min="0"
              max="0.12"
              step="0.01"
              value={settings.letterSpacing}
              onChange={(event) =>
                changeSetting(
                  'letterSpacing',
                  Number(event.target.value)
                )
              }
            />
          </label>

          {/* Line Height */}
          <label className="range-setting">
            <div className="setting-label">
              <span>Line height</span>
              <output>{settings.lineHeight}</output>
            </div>

            <input
              type="range"
              min="1.2"
              max="2"
              step="0.1"
              value={settings.lineHeight}
              onChange={(event) =>
                changeSetting(
                  'lineHeight',
                  Number(event.target.value)
                )
              }
            />
          </label>

          {/* Toggles */}
          <div className="toggle-section">

            <Toggle
              label="Contrast enhancement"
              checked={settings.contrast}
              onChange={(value) =>
                changeSetting('contrast', value)
              }
            />

            <Toggle
              label="Reduce animations"
              checked={settings.reduceMotion}
              onChange={(value) =>
                changeSetting(
                  'reduceMotion',
                  value
                )
              }
            />

          </div>

        </div>

        {/* Save */}
        <div className="settings-footer">

          <p>
            Your accessibility preferences are saved
            locally.
          </p>

          <button
            className="button button-primary save-button"
            type="button"
            onClick={save}
          >
            {saved ? '✓ Settings saved' : 'Save settings'}
          </button>

        </div>

      </section>

    </main>
  );
}

createRoot(
  document.getElementById('root')
).render(<Settings />);