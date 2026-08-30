import { DEFAULT_PROFILE_ID, getProfile, isProfileId } from '../features/profiles/profileData';
import { createProfileSettings, normalizeSettings } from '../features/profiles/profileUtils';

const DEFAULT_STATE = {
  enabled: true,
  selectedProfile: DEFAULT_PROFILE_ID,
  userSettings: createProfileSettings(DEFAULT_PROFILE_ID),
};

function getStorage() {
  return globalThis.chrome?.storage?.local;
}

export async function getAccessibilityState() {
  const storage = getStorage();
  if (!storage) return DEFAULT_STATE;

  const saved = await storage.get(DEFAULT_STATE);
  const selectedProfile = isProfileId(saved.selectedProfile) ? saved.selectedProfile : DEFAULT_PROFILE_ID;
  return {
    enabled: saved.enabled,
    selectedProfile,
    userSettings: normalizeSettings(saved.userSettings, selectedProfile),
  };
}

export async function saveAccessibilityState(state) {
  const storage = getStorage();
  if (!storage) return;
  await storage.set(state);
}

export async function selectAccessibilityProfile(profileId) {
  const selectedProfile = isProfileId(profileId) ? profileId : DEFAULT_PROFILE_ID;
  const currentState = await getAccessibilityState();
  const nextState = {
    ...currentState,
    selectedProfile,
    userSettings: createProfileSettings(selectedProfile),
  };

  await saveAccessibilityState(nextState);
  return nextState;
}

export async function getSelectedAccessibilityProfile() {
  const state = await getAccessibilityState();
  const profile = getProfile(state.selectedProfile);

  return {
    ...profile,
    settings: state.userSettings,
  };
}

export { DEFAULT_STATE };
