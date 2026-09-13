# Technical Details: Frontend, Profiles, and Storage

## Technology stack

AccessAdapt uses Chrome Extension Manifest V3, React, JavaScript, Vite, HTML, CSS, and `chrome.storage.local`. React builds the user interfaces; Vite bundles extension entry points; Chrome Storage persists local preference data.

## Frontend structure

```text
src/
├── components/                 Shared UI controls
├── pages/Popup/                Toolbar popup
├── pages/Settings/             Preference-management interface
├── pages/Onboarding/           First-run profile selection
├── features/profiles/          Profile data and normalisation helpers
└── services/storageService.js  Local storage boundary
```

## React and Vite implementation

Each page mounts a React root into its corresponding HTML entry file. Component state manages immediate UI feedback, while asynchronous storage-service calls restore and persist the durable accessibility state. Vite builds popup, Settings, onboarding, and extension script entry points for the packaged extension.

## Accessibility profile system

Profiles are data objects rather than hard-coded UI branches. Each profile includes a stable ID, display name, description, and settings. Profile utilities create a safe settings copy and merge stored settings with profile defaults.

### Conceptual profile schema

```text
Profile
├── profileName
├── description
└── settings
    ├── fontSize
    ├── fontFamily
    ├── lineHeight
    ├── letterSpacing
    ├── wordSpacing
    ├── contrast
    ├── reduceMotion
    └── focusHighlight
```

## Storage schema

The exact implementation stores a complete accessibility state. The following is a conceptual representation:

```text
accessAdaptProfile
├── selectedProfile
├── enabled
├── onboardingCompleted
└── preferences
    ├── fontSize
    ├── fontFamily
    ├── lineHeight
    ├── letterSpacing
    ├── wordSpacing
    ├── contrast
    ├── reduceMotion
    └── focusHighlight
```

## Storage service and preference updates

`storageService` wraps `chrome.storage.local`. It retrieves default-safe state, normalises preference values, validates the selected profile, and writes updates. Selecting a profile creates that profile's settings as the current editable preferences. Settings controls update local React state; saving writes the updated state to local storage.

## Accessibility configuration

The profile settings define the visual and interaction configuration consumed by the frontend and webpage-facing extension layer. Font and spacing values support reading comfort; contrast, reduced motion, and focus highlighting support visual clarity and keyboard navigation.

## Permissions, security, and privacy

The frontend relies on the Manifest V3 `storage` permission for preferences and the `tabs` permission for popup interactions with the active tab. Preferences remain in the browser's local extension storage. No account, password, API key, or external personal-data service is required for this module.

## Error handling

Default state is supplied when storage is unavailable. Unknown stored profile IDs fall back safely to the Standard profile. Preference normalisation merges available saved values with profile defaults, allowing newer fields to be introduced without breaking older saved data.

## Maintainability and extensibility

Centralised profile data, a dedicated storage service, and reusable UI components reduce duplication. Additional profiles or preferences can be introduced by extending the profile schema and Settings controls while preserving the same storage and UI interaction pattern.

## Summary

The frontend implementation provides a React-based, Vite-built profile and preference system with local, privacy-conscious persistence through `chrome.storage.local`.
