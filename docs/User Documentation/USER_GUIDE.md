# AccessAdapt User Guide

## Introduction

AccessAdapt is a personalized web-accessibility extension for Chrome and other Chromium-based browsers. It helps users configure a comfortable browsing experience through accessibility profiles and saved preferences.

## What AccessAdapt does

Rather than providing a single fixed display mode, AccessAdapt connects a user's preferences with accessibility support for the webpages they visit. The completed experience follows this flow:

```text
User → Onboarding → Profile selection → Saved preferences → Webpage analysis
     → Personalized recommendations → User-controlled adaptation → Revert
```

## Supported browser and installation

AccessAdapt supports Chrome and Chromium-based browsers with Manifest V3 support, including Microsoft Edge.

1. Run `npm install` and `npm run build` in the project folder.
2. Open `chrome://extensions` or `edge://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select the generated `dist` folder.
5. Pin AccessAdapt from the browser toolbar if convenient.

## First-time onboarding

On first use, AccessAdapt opens a welcome page. Choose the profile that most closely matches your needs and select **Continue**. The choice is saved locally and becomes the starting point for your browsing preferences. You can change it later in Settings.

## Accessibility profiles

| Profile | Best suited for | Typical configuration |
| --- | --- | --- |
| Standard | Everyday browsing | Balanced text, spacing, contrast, and motion defaults. |
| Low Vision | Users who benefit from stronger visual readability | Larger text, increased spacing, stronger contrast, and visible focus. |
| Dyslexia | Users who benefit from a clearer reading layout | Readable font choice with increased letter, word, and line spacing. |
| Reading Difficulty | Users who prefer a calmer, easier-to-follow layout | Larger text, generous spacing, focus support, and reduced motion. |
| Color Vision | Users who benefit from clearer visual distinction | Contrast enhancement and clear focus indication. |

## Accessibility preferences

Profiles provide starting values for the following preferences:

- Font size and font family
- Line height
- Letter spacing and word spacing
- Contrast enhancement
- Reduced motion
- Focus highlighting

These preferences support a personalized experience while allowing users to refine settings for their own comfort.

## Using Settings

Open the extension popup and choose **Settings**. On the Settings page you can:

1. Select a different accessibility profile.
2. Adjust font size, text spacing, and line height.
3. Turn contrast enhancement or reduced motion on or off.
4. Select **Save settings** to store your current preferences.

Changing a profile applies that profile's preset settings. Manual changes let you further personalize the selected profile.

## Persistent preferences and privacy

AccessAdapt stores the selected profile, enabled state, onboarding completion state, and preferences with `chrome.storage.local`. Settings remain available after reopening the popup, refreshing a webpage, or restarting the browser. Preferences are stored on the local browser profile; AccessAdapt does not require an account for this personalization flow.

## Personalized accessibility experience

The selected profile and preferences are available to the extension's user interface and webpage support layer. When accessibility support is enabled, saved choices such as text size, spacing, contrast, reduced motion, and focus highlighting are used to present content more comfortably. Profile information also provides the personalization context for relevant accessibility recommendations.

## Troubleshooting

**The extension does not appear:** confirm Developer mode is enabled and reload the unpacked `dist` folder.

**Settings do not appear to change:** open Settings, confirm the correct profile, save changes, then refresh the webpage.

**The wrong profile is shown:** select the intended profile in Settings; the selection is saved locally.

**The popup does not open:** reload the extension from the browser extensions page, then open the popup again.

## Summary

AccessAdapt gives users control over a persistent, profile-based accessibility experience. Onboarding establishes a starting profile, Settings enables refinement, and local browser storage keeps preferences available across sessions.
