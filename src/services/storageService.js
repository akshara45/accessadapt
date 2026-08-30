import { DEFAULT_PROFILE_ID } from '../features/profiles/profileData';
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
  return {
    enabled: saved.enabled,
    selectedProfile: saved.selectedProfile,
    userSettings: normalizeSettings(saved.userSettings, saved.selectedProfile),
  };
}

export async function saveAccessibilityState(state) {
  const storage = getStorage();
  if (!storage) return;
  await storage.set(state);
}

export { DEFAULT_STATE };
