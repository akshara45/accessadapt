# Frontend and Personalization Test Plan

## Scope and environment

This plan covers the AccessAdapt frontend, onboarding, accessibility profiles, Settings, and `chrome.storage.local` interaction. It excludes webpage scanning, issue detection, recommendation generation, and adaptation-engine testing.

**Environment:** Chromium browser with Manifest V3 support, unpacked production build, React/Vite frontend, and local extension storage.

| Test ID | Test Area | Test Step | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- |
| FP-01 | Extension UI loading | Open the toolbar popup. | Popup renders without a blank screen. | To be recorded during validation. | Not run |
| FP-02 | First-time configuration | Open the extension with no saved state. | Onboarding is presented. | To be recorded during validation. | Not run |
| FP-03 | Onboarding | Choose a profile and continue. | Profile is saved and onboarding completes. | To be recorded during validation. | Not run |
| FP-04 | Profile display | Reopen popup after profile selection. | Selected profile name and description display. | To be recorded during validation. | Not run |
| FP-05 | Standard profile | Select Standard. | Balanced default preferences are loaded. | To be recorded during validation. | Not run |
| FP-06 | Low Vision profile | Select Low Vision. | Low Vision preset values load and save. | To be recorded during validation. | Not run |
| FP-07 | Dyslexia profile | Select Dyslexia. | Dyslexia preset values load and save. | To be recorded during validation. | Not run |
| FP-08 | Reading Difficulty profile | Select Reading Difficulty. | Reading Difficulty preset values load and save. | To be recorded during validation. | Not run |
| FP-09 | Color Vision profile | Select Color Vision. | Color Vision preset values load and save. | To be recorded during validation. | Not run |
| FP-10 | Profile selection | Switch between two profiles. | Active profile indicator changes correctly. | To be recorded during validation. | Not run |
| FP-11 | Profile saving | Change a profile and reopen Settings. | The same profile remains selected. | To be recorded during validation. | Not run |
| FP-12 | Settings page | Open Settings from the popup. | Settings page loads with stored values. | To be recorded during validation. | Not run |
| FP-13 | Font size | Change font size and save. | New value is stored. | To be recorded during validation. | Not run |
| FP-14 | Font family | Select a profile with a different font family. | Profile font-family value is available in preferences. | To be recorded during validation. | Not run |
| FP-15 | Line height | Change line height and save. | New value is stored. | To be recorded during validation. | Not run |
| FP-16 | Letter spacing | Change text spacing and save. | Letter-spacing value is stored. | To be recorded during validation. | Not run |
| FP-17 | Word spacing | Select a profile with word spacing. | Word-spacing value is retained in preferences. | To be recorded during validation. | Not run |
| FP-18 | Contrast | Toggle contrast enhancement and save. | Boolean value is stored. | To be recorded during validation. | Not run |
| FP-19 | Reduce Motion | Toggle reduced motion and save. | Boolean value is stored. | To be recorded during validation. | Not run |
| FP-20 | Focus Highlight | Select a focus-enabled profile. | Focus-highlight value is retained. | To be recorded during validation. | Not run |
| FP-21 | Preference persistence | Close and reopen the popup. | Saved preferences are restored. | To be recorded during validation. | Not run |
| FP-22 | Preference update | Save a manual setting change. | Latest value replaces prior stored value. | To be recorded during validation. | Not run |
| FP-23 | Profile + preference combination | Choose a profile, refine a preference, save. | Profile and refinement are both retained. | To be recorded during validation. | Not run |
| FP-24 | Storage retrieval | Read selected profile through storage service. | Valid profile and settings object are returned. | To be recorded during validation. | Not run |
| FP-25 | Missing preferences | Load state with an omitted preference field. | Default profile value fills the missing field. | To be recorded during validation. | Not run |
| FP-26 | Invalid profile handling | Load an unknown stored profile ID. | Standard profile is selected safely. | To be recorded during validation. | Not run |
| FP-27 | Storage update | Toggle accessibility support. | Enabled state is stored and restored. | To be recorded during validation. | Not run |
| FP-28 | Extension reload | Reload the extension in browser tools. | Saved preferences remain available. | To be recorded during validation. | Not run |
| FP-29 | UI interaction | Use profile cards, ranges, toggles, and Save. | Controls are responsive and consistent. | To be recorded during validation. | Not run |
| FP-30 | Complete frontend workflow | Onboard, select/refine/save/reopen settings. | End-to-end personalization state remains consistent. | To be recorded during validation. | Not run |

## Acceptance criteria

The frontend/personalization module passes when all 30 cases complete successfully, no unexpected UI error occurs, and stored settings remain consistent after reload.
