import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';

import { Brand } from '../../components/Brand';
import { Toggle } from '../../components/Toggle';

import { getProfile } from '../../features/profiles/profileData';
import {
  getAccessibilityState,
  saveAccessibilityState,
} from '../../services/storageService';

import { getRecommendations } from '../../features/recommendations/recommendationEngine';

import '../../styles/global.css';
import './popup.css';

function Popup() {
  const [state, setState] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // -------------------------
  // LOAD ACCESSIBILITY STATE
  // -------------------------

  useEffect(() => {
    getAccessibilityState().then((data) => {
      setState(data);

      // Open onboarding only the first time
      if (!data.onboardingCompleted) {
        chrome.tabs.create({
          url: chrome.runtime.getURL('onboarding.html'),
        });
      }
    });
  }, []);

  // -------------------------
  // ENABLE / DISABLE SUPPORT
  // -------------------------

  async function updateEnabled(enabled) {
    const next = {
      ...state,
      enabled,
    };

    setState(next);
    await saveAccessibilityState(next);
  }

  // -------------------------
  // SCAN CURRENT PAGE
  // -------------------------

  async function scanPage() {
    setScanning(true);
    setScanResult(null);
    setSuggestions([]);

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        throw new Error('No active tab found');
      }

      const result = await chrome.tabs.sendMessage(tab.id, {
        type: 'SCAN_PAGE',
      });

      setScanResult(result);

      // -------------------------
      // GENERATE RECOMMENDATIONS
      // -------------------------

      if (result?.details) {
        const recommendations = getRecommendations(
          result.details,
          state.userSettings
        );

        setSuggestions(recommendations);
      }
    } catch (error) {
      console.error(error);

      setScanResult({
        error: 'Unable to scan this page.',
      });
    } finally {
      setScanning(false);
    }
  }

  // -------------------------
  // LOADING
  // -------------------------

  if (!state) {
    return (
      <main className="popup-shell">
        <p>Loading AccessAdapt…</p>
      </main>
    );
  }

  const profile = getProfile(state.selectedProfile);

  // -------------------------
  // POPUP UI
  // -------------------------

  return (
    <main className="popup-shell">
      <Brand />

      <p className="intro">
        Make websites more comfortable to read and use, your way.
      </p>

      {/* Accessibility toggle */}
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

      {/* Current profile */}
      <section className="profile-summary">
        <span className="eyebrow">CURRENT PROFILE</span>

        <strong>{profile.name}</strong>

        <p>{profile.description}</p>
      </section>

      {/* Scan button */}
      <button
        className="button button-primary"
        type="button"
        onClick={scanPage}
        disabled={scanning}
      >
        {scanning ? 'Scanning…' : 'Scan this page'}

        {!scanning && (
          <span aria-hidden="true">→</span>
        )}
      </button>

      {/* Settings button */}
      <button
        className="button button-secondary"
        type="button"
        onClick={() => chrome.runtime.openOptionsPage()}
      >
        Settings
      </button>

      {/* -------------------------
          SCAN RESULTS
      ------------------------- */}

      {scanResult && (
        <section className="scan-result">
          {scanResult.error ? (
            <p>{scanResult.error}</p>
          ) : (
            <>
              <strong>Scan complete</strong>

              <p>
                Found {scanResult.issues} accessibility issue
                {scanResult.issues !== 1 ? 's' : ''}.
              </p>

              {scanResult.issues > 0 && (
                <div className="issue-list">
                  {scanResult.details.map((issue, index) => (
                    <div
                      className="issue-item"
                      key={`${issue.id}-${index}`}
                    >
                      <strong>
                        ⚠ {issue.id.replaceAll('_', ' ')}
                      </strong>

                      <p>{issue.message}</p>

                      <small>
                        Severity: {issue.severity}
                      </small>

                      <small>
                        Element: {issue.element}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {scanResult.issues === 0 && (
                <p>✓ No accessibility issues detected.</p>
              )}
            </>
          )}
        </section>
      )}

      {/* -------------------------
          SMART RECOMMENDATIONS
      ------------------------- */}

      {suggestions.length > 0 && (
        <section className="suggestions">
          <strong>💡 Smart Suggestions</strong>

          {suggestions.map((suggestion, index) => (
            <div
              className="suggestion-item"
              key={`${suggestion.id}-${index}`}
            >
              <strong>{suggestion.title}</strong>

              <p>{suggestion.reason}</p>
            </div>
          ))}
        </section>
      )}

      {/* Footer */}
      <p className="day-note">
        Accessibility scanner · Smart suggestions
      </p>
    </main>
  );
}

createRoot(
  document.getElementById('root')
).render(<Popup />);