import {
  detectAccessibility,
  highlightDetectedIssues,
  clearDetectedIssuesHighlights,
  getHighlightStatus,
} from '../accessibility/detector';

const STYLE_ID = 'accessadapt-styles';

// -------------------------
// GET ACCESSIBILITY SETTINGS
// -------------------------

async function getAccessibilityProfile() {
  const data = await chrome.storage.local.get([
    'enabled',
    'selectedProfile',
    'userSettings',
  ]);

  // Do nothing if accessibility support is disabled
  if (!data.enabled) {
    return null;
  }

  return data.userSettings || null;
}

// -------------------------
// APPLY ACCESSIBILITY PROFILE
// -------------------------

async function applyAccessibilityProfile() {
  const settings = await getAccessibilityProfile();

  if (!settings) {
    return;
  }

  let style = document.getElementById(STYLE_ID);

  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;

    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.documentElement.appendChild(style);
    }
  }

  style.textContent = `
    /* Font size */
    body {
      font-size: ${settings.fontSize}% !important;
    }

    /* Reading preferences */
    body {
      font-family: ${settings.fontFamily} !important;
      letter-spacing: ${settings.letterSpacing}em !important;
      word-spacing: ${settings.wordSpacing}em !important;
      line-height: ${settings.lineHeight} !important;
    }

    /* Contrast enhancement */
    ${
      settings.contrast
        ? `
          body {
            filter: contrast(1.15) !important;
          }
        `
        : ''
    }

    /* Reduce animations */
    ${
      settings.reduceMotion
        ? `
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        `
        : ''
    }

    /* Focus highlight */
    ${
      settings.focusHighlight
        ? `
          *:focus {
            outline: 3px solid #315cba !important;
            outline-offset: 3px !important;
          }
        `
        : ''
    }
  `;
}


// -------------------------
// ACCESSIBILITY SCANNER & MESSAGE LISTENER
// -------------------------

function scanPage(options = {}) {
  return detectAccessibility(options);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SCAN_PAGE') {
    const results = scanPage(message.options || {});
    sendResponse(results);
    return true;
  }

  if (message.type === 'HIGHLIGHT_ISSUES') {
    sendResponse(highlightDetectedIssues());
    return true;
  }

  if (message.type === 'CLEAR_HIGHLIGHTS') {
    sendResponse(clearDetectedIssuesHighlights());
    return true;
  }

  if (message.type === 'GET_HIGHLIGHT_STATUS') {
    sendResponse(getHighlightStatus());
    return true;
  }

  if (message.type === 'APPLY_PROFILE') {
    applyAccessibilityProfile();
    sendResponse({ success: true });
    return true;
  }

  return true;
});

// -------------------------
// INITIALIZE
// -------------------------

function initializeContentScript() {
  if (
    document.documentElement.dataset
      .accessadaptContentScript
  ) {
    return;
  }

  document.documentElement.dataset.accessadaptContentScript =
    'ready';

  applyAccessibilityProfile();
}

initializeContentScript();