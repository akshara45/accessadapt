# AccessAdapt

AccessAdapt is a personalized, adaptive web accessibility assistant for Chrome and Edge. It will learn a person's accessibility preferences, analyze the webpages they visit, and recommend adaptations that are relevant to that individual—not merely report generic issues.

## Problem statement

Conventional accessibility checkers can identify problems on a webpage, but they do not necessarily consider whether a particular problem affects the person using the site. AccessAdapt is designed to bridge that gap: an issue is evaluated alongside the user's own preferences before an adaptation is recommended.

## Proposed solution

```text
User preferences
→ Personalized profile
→ Website analysis
→ Accessibility issue detection
→ Personalized recommendation
→ User-controlled adaptation
```

The recommendation layer will compare a detected issue and its details with stored user preferences. This keeps the scanner independent from profile rules and makes new recommendations extensible.

## Key features

- Personalized onboarding for first-time preference setup (planned)
- Reusable user accessibility profile and persistent local preferences
- Reliable, incremental accessibility scanning (planned)
- Personalized recommendations based on both detected issues and user preferences (planned)
- User-controlled webpage adaptations with apply, dismiss, and restore actions (planned)
- Chrome Storage persistence for selected profile, enabled state, and reading preferences

## Example use case

If a webpage has a contrast ratio below `4.5:1` and the user has chosen high contrast, AccessAdapt will identify low contrast and recommend enabling High Contrast mode. The reason is tied to the stored preference: *low contrast was detected and the user prefers high contrast*.

This is one extensible rule, not a special-case design. The same model will support examples such as small text plus a larger-text preference, excessive animation plus a reduced-motion preference, and poor spacing plus an increased-spacing preference.

## System workflow

```text
First launch
→ Preference setup / onboarding
→ Personalized profile creation and storage
→ User visits a webpage
→ Accessibility scan
→ Issue detection
→ Profile matching and personalized recommendation
→ User applies or dismisses a recommendation
→ Webpage adaptation, with restore / undo available
```

## Technology stack

- Chrome/Edge Extension (Manifest V3)
- React, JavaScript, CSS, and Vite
- Chrome Storage API

## Folder structure

```text
src/
├── components/       # Shared UI elements
├── pages/
│   ├── Popup/        # Extension popup
│   ├── Settings/     # Full settings page
│   └── Onboarding/   # Planned first-launch preference setup
├── features/
│   ├── scanner/      # Future scanner module
│   ├── profiles/     # Reusable profile data and helpers
│   ├── recommendations/ # Planned issue-to-preference matching
│   ├── adaptation/   # Planned reversible webpage changes
│   ├── suggestions/  # Existing future suggestion placeholder
│   └── captions/     # Future caption module
├── services/         # Chrome Storage API access
├── content/          # Content-script foundation
├── utils/            # Future shared, pure utilities
└── styles/           # Shared styles
```

## Planned architecture

1. **Onboarding** collects first-launch choices such as high contrast, larger text, increased spacing, increased line height, reduced motion, and color-vision assistance.
2. **Profiles** store those choices as reusable preference data alongside a general profile such as Standard, Low Vision, Dyslexia, Reading Difficulty, or Color Vision.
3. **Storage** persists the profile and user settings locally through the Chrome Storage API.
4. **Scanner** reports small, reliable accessibility issues and detection details; it does not decide which adaptation to use.
5. **Recommendation engine** compares scanner output with profile preferences and returns relevance, recommended adaptation, and a human-readable reason.
6. **Adaptation engine** will apply approved changes through the content script and retain enough original state to restore them.
7. **Popup and Settings** will show profile information, recommendations, controls to apply/dismiss/restore, and preference editing.

For example, a future recommendation-engine input might contain `issue: "low_contrast"`, `value: "3.2:1"`, and `highContrast: true`; its output can recommend High Contrast and explain why. New rules can be added to that engine without rewriting scanner checks.

## Setup

```bash
npm install
```

## Build

```bash
npm run build
```

The extension files are created in `dist/`.

## Load in Chrome or Edge

1. Run `npm run build`.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose this project's `dist` folder.


## Future scope

- More reliable accessibility checks, added incrementally
- More personalized adaptation and recommendation rules
- More advanced recommendation logic, including optional AI-assisted recommendations
- Live captions
- Support for more browsers
