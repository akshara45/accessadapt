# Frontend and Personalization Architecture

## Overview

This document describes the AccessAdapt architecture within the frontend, onboarding, profile, preference, and local-storage scope. These components provide the user-facing personalization foundation and expose consistent profile data to the rest of the extension.

```text
User
 ↓
Frontend UI
 ↓
Onboarding / Profile Selection
 ↓
Profile Data
 ↓
Settings / Preferences
 ↓
Storage Service
 ↓
chrome.storage.local
```

## Frontend architecture and UI layer

React pages provide the popup, Settings page, and onboarding experience. Shared UI components, such as branding and toggle controls, keep repeated interactions visually and behaviourally consistent. Vite builds these entry pages for the Manifest V3 extension.

## Onboarding system

Onboarding is the first-run entry point. It presents the available profiles, records the selected profile, and marks the onboarding flow as completed. This creates a clear path from a new user to a saved accessibility configuration.

## Accessibility profile system

Profile data is defined separately from UI components. Each profile has an identifier, name, description, and settings object. The available profiles are Standard, Low Vision, Dyslexia, Reading Difficulty, and Color Vision. Keeping data centralised makes the profile set easy to review, reuse, and extend.

## Settings and preference management

Settings displays the active profile and exposes preference controls. Profile selection restores the associated preset configuration; manual updates refine individual values. The page then saves the complete accessibility state through the storage service.

## Chrome Storage interaction

The storage service is the only frontend-facing layer that reads and writes `chrome.storage.local`. It provides default state, validates selected profile identifiers, normalises missing preference fields, saves state, changes profiles, and returns the selected profile with its current settings.

## Component interaction and data flow

```text
Popup / Settings / Onboarding
          ↓ user action
     Storage Service
          ↓ read or write
 chrome.storage.local
          ↓ restored state
 Popup / Settings / webpage-facing extension layer
```

The popup loads the current state to display the active profile. Onboarding and Settings select profiles and save preferences. A webpage-facing extension layer can retrieve the same stored settings, so the user's visual preferences remain consistent across extension views and webpages.

## Modularity, maintainability, and extensibility

- **Modularity:** profile definitions, profile utilities, storage access, pages, and shared components have distinct responsibilities.
- **Maintainability:** one storage service prevents duplicate browser-storage logic; normalisation protects existing saved settings as new fields are added.
- **Extensibility:** adding a profile is primarily a profile-data change. New preferences can be added to profile defaults, Settings controls, and storage normalisation without redesigning page structure.

## Summary

The frontend/personalization architecture provides a reusable user-preference pipeline: select a profile, refine settings, save locally, and retrieve consistent state wherever the extension needs it.
