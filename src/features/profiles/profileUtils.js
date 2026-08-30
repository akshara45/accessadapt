import { getProfile } from './profileData';

export function createProfileSettings(profileId) {
  return { ...getProfile(profileId).settings };
}

export function normalizeSettings(settings, profileId) {
  return { ...createProfileSettings(profileId), ...settings };
}
