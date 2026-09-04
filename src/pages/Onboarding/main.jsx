import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { PROFILE_OPTIONS } from '../../features/profiles/profileData';
import {
  saveAccessibilityState,
  getAccessibilityState,
  selectAccessibilityProfile,
} from '../../services/storageService';
import './onboarding.css';

function Onboarding() {
  const [selectedProfile, setSelectedProfile] = useState('standard');
  const [loading, setLoading] = useState(false);

  async function continueSetup() {
    setLoading(true);

    const currentState = await getAccessibilityState();

    const profileState = await selectAccessibilityProfile(selectedProfile);

    await saveAccessibilityState({
      ...currentState,
      ...profileState,
      onboardingCompleted: true,
    });

    // Close the onboarding tab/window after setup
    window.close();
  }

  return (
    <main className="onboarding-page">
      <section className="onboarding-card">
        <div className="onboarding-header">
          <h1>Welcome to AccessAdapt 👋</h1>

          <p>
            Let's personalize your browsing experience.
            Choose the accessibility profile that best suits your needs.
          </p>
        </div>

        <div className="profile-grid">
          {PROFILE_OPTIONS.map((profile) => {
            const selected = selectedProfile === profile.id;

            return (
              <button
                key={profile.id}
                type="button"
                className={`profile-card ${selected ? 'selected' : ''}`}
                onClick={() => setSelectedProfile(profile.id)}
              >
                <strong>{profile.name}</strong>

                <span>{profile.description}</span>

                {selected && (
                  <small>✓ Selected</small>
                )}
              </button>
            );
          })}
        </div>

        <button
          className="continue-button"
          type="button"
          onClick={continueSetup}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<Onboarding />);