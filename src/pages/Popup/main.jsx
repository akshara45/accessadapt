import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';

import { Brand } from '../../components/Brand';
import { Toggle } from '../../components/Toggle';
import { getProfile } from '../../features/profiles/profileData';

import {
  getAccessibilityState,
  saveAccessibilityState
} from '../../services/storageService';

import { generateSuggestions } from '../../features/scanner/suggestionEngine';

import '../../styles/global.css';
import './popup.css';

function Popup() {
  const [state, setState] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    getAccessibilityState().then(setState);
  }, []);

  async function updateEnabled(enabled) {
    const next = {
      ...state,
      enabled
    };

    setState(next);
    await saveAccessibilityState(next);
  }

  async function scanPage() {
    setScanning(true);
    setScanResult(null);
    setSuggestions([]);

    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      const tab = tabs[0];

      if (!tab?.id) {
        throw new Error('No active tab found');
      }

      const result = await chrome.tabs.sendMessage(tab.id, {
        type: 'SCAN_PAGE'
      });

      setScanResult(result);

      if (result && result.details) {
        const newSuggestions = generateSuggestions(
          result.details,
          state.selectedProfile
        );

        setSuggestions(newSuggestions);
      }
    } catch (error) {
      console.error(error);

      setScanResult({
        error: 'Unable to scan this page.'
      });
    }

    setScanning(false);
  }

  if (!state) {
    return (
      <main className="popup-shell">
        <p>Loading AccessAdapt…</p>
      </main>
    );
  }

  const profile = getProfile(state.selectedProfile);

  return (
    <main className="popup-shell">

      <Brand />

      <p className="intro">
        Make websites more comfortable to read and use, your way.
      </p>

      <section
        className="control-card"
        aria-label="Accessibility controls"
      >
        <Toggle
          checked={state.enabled}
          onChange={updateEnabled}
          label="Accessibility support"
        />
      </section>

      <section className="profile-summary">
        <span className="eyebrow">
          CURRENT PROFILE
        </span>

        <strong>
          {profile.name}
        </strong>

        <p>
          {profile.description}
        </p>
      </section>

      <button
        className="button button-primary"
        type="button"
        onClick={scanPage}
        disabled={scanning}
      >
        {scanning ? 'Scanning…' : 'Scan this page'}

        {!scanning && (
          <span aria-hidden="true">
            {' '}→
          </span>
        )}
      </button>

      <button
        className="button button-secondary"
        type="button"
        onClick={() => chrome.runtime.openOptionsPage()}
      >
        Settings
      </button>

      {/* SCAN RESULTS */}

      {scanResult && (
        <section className="scan-result">

          {scanResult.error ? (
            <p>
              {scanResult.error}
            </p>
          ) : (
            <>
              <strong>
                Scan complete
              </strong>

              <p>
                Found {scanResult.issues} accessibility issue
                {scanResult.issues !== 1 ? 's' : ''}.
              </p>

              {scanResult.issues > 0 && (
                <div className="issue-list">

                  {scanResult.details.map(
                    (issue, index) => (
                      <div
                        className="issue-item"
                        key={index}
                      >
                        <strong>
                          ⚠ {issue.type}
                        </strong>

                        <p>
                          {issue.message}
                        </p>

                        <small>
                          Element: {issue.element}
                        </small>
                      </div>
                    )
                  )}

                </div>
              )}

              {scanResult.issues === 0 && (
                <p>
                  ✓ No accessibility issues detected.
                </p>
              )}
            </>
          )}

        </section>
      )}

      {/* SMART SUGGESTIONS */}

      {suggestions.length > 0 && (
        <section className="suggestions">

          <strong>
            💡 Smart Suggestions
          </strong>

          {suggestions.map(
            (suggestion, index) => (
              <div
                className="suggestion-item"
                key={index}
              >
                <strong>
                  {suggestion.feature}
                </strong>

                <p>
                  {suggestion.message}
                </p>
              </div>
            )
          )}

        </section>
      )}

      <p className="day-note">
        Accessibility scanner · Smart suggestions
      </p>

    </main>
  );
}

createRoot(
  document.getElementById('root')
).render(
  <Popup />
);