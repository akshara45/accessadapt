export const PROFILE_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Balanced defaults for everyday browsing.',
    settings: { fontSize: 100, letterSpacing: 0, lineHeight: 1.5, contrast: false, reduceMotion: false },
  },
  {
    id: 'low-vision',
    name: 'Low Vision',
    description: 'Larger, easier-to-read text with stronger contrast.',
    settings: { fontSize: 120, letterSpacing: 0.02, lineHeight: 1.7, contrast: true, reduceMotion: false },
  },
  {
    id: 'dyslexia',
    name: 'Dyslexia',
    description: 'More breathing room between letters and lines.',
    settings: { fontSize: 110, letterSpacing: 0.06, lineHeight: 1.8, contrast: false, reduceMotion: false },
  },
  {
    id: 'reading-difficulty',
    name: 'Reading Difficulty',
    description: 'A calmer reading layout with reduced motion.',
    settings: { fontSize: 115, letterSpacing: 0.02, lineHeight: 1.8, contrast: false, reduceMotion: true },
  },
  {
    id: 'color-vision',
    name: 'Color Vision',
    description: 'Clearer contrast for color-dependent information.',
    settings: { fontSize: 105, letterSpacing: 0, lineHeight: 1.6, contrast: true, reduceMotion: false },
  },
];

export const DEFAULT_PROFILE_ID = 'standard';

export function getProfile(profileId) {
  return PROFILE_OPTIONS.find((profile) => profile.id === profileId) ?? PROFILE_OPTIONS[0];
}
