export const PROFILE_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Balanced defaults for everyday browsing.',
    settings: {
      fontSize: 100,
      fontFamily: 'system-ui, sans-serif',
      letterSpacing: 0,
      wordSpacing: 0,
      lineHeight: 1.5,
      contrast: false,
      reduceMotion: false,
      focusHighlight: false,
    },
  },
  {
    id: 'low-vision',
    name: 'Low Vision',
    description: 'Larger, easier-to-read text with stronger contrast.',
    settings: {
      fontSize: 125,
      fontFamily: 'Arial, Helvetica, sans-serif',
      letterSpacing: 0.02,
      wordSpacing: 0.08,
      lineHeight: 1.75,
      contrast: true,
      reduceMotion: false,
      focusHighlight: true,
    },
  },
  {
    id: 'dyslexia',
    name: 'Dyslexia',
    description: 'More breathing room between letters and lines.',
    settings: {
      fontSize: 110,
      fontFamily: 'Verdana, Arial, sans-serif',
      letterSpacing: 0.06,
      wordSpacing: 0.1,
      lineHeight: 1.8,
      contrast: false,
      reduceMotion: false,
      focusHighlight: true,
    },
  },
  {
    id: 'reading-difficulty',
    name: 'Reading Difficulty',
    description: 'A calmer reading layout with reduced motion.',
    settings: {
      fontSize: 115,
      fontFamily: 'Arial, Helvetica, sans-serif',
      letterSpacing: 0.03,
      wordSpacing: 0.08,
      lineHeight: 1.85,
      contrast: false,
      reduceMotion: true,
      focusHighlight: true,
    },
  },
  {
    id: 'color-vision',
    name: 'Color Vision',
    description: 'Clearer contrast for color-dependent information.',
    settings: {
      fontSize: 105,
      fontFamily: 'system-ui, sans-serif',
      letterSpacing: 0.01,
      wordSpacing: 0.04,
      lineHeight: 1.65,
      contrast: true,
      reduceMotion: false,
      focusHighlight: true,
    },
  },
];

export const DEFAULT_PROFILE_ID = 'standard';

export function getProfile(profileId) {
  return PROFILE_OPTIONS.find((profile) => profile.id === profileId) ?? PROFILE_OPTIONS[0];
}

export function isProfileId(profileId) {
  return PROFILE_OPTIONS.some((profile) => profile.id === profileId);
}
