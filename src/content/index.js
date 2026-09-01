const STYLE_ID = 'accessadapt-styles';

async function getAccessibilityProfile() {
  const data = await chrome.storage.local.get([
    'enabled',
    'selectedProfile',
    'userSettings'
  ]);

  // If accessibility support is turned off, do nothing
  if (data.enabled === false) {
    return null;
  }

  return data.userSettings || null;
}

async function applyAccessibilityProfile() {
  const settings = await getAccessibilityProfile();

  if (!settings) return;

  let style = document.getElementById(STYLE_ID);

  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    html {
      font-size: ${settings.fontSize}% !important;
    }

    body,
    body * {
      font-family: ${settings.fontFamily} !important;
      letter-spacing: ${settings.letterSpacing}em !important;
      word-spacing: ${settings.wordSpacing}em !important;
      line-height: ${settings.lineHeight} !important;
    }

    ${
      settings.contrast
        ? `
          body {
            filter: contrast(1.15) !important;
          }
        `
        : ''
    }

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


// =========================
// ACCESSIBILITY SCANNER
// =========================

function scanPage() {
  const issues = [];

  // 1. Missing alt text
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'Missing alt text',
        element: 'Image',
        message: 'Image does not have alt text.'
      });
    }
  });

  // 2. Missing page title
  if (!document.title.trim()) {
    issues.push({
      type: 'Missing page title',
      element: 'Page',
      message: 'The page does not have a title.'
    });
  }

  // 3. Missing headings
  if (
    document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6'
    ).length === 0
  ) {
    issues.push({
      type: 'Missing headings',
      element: 'Page',
      message: 'No headings were found on this page.'
    });
  }

  // 4. Missing form labels
  document
    .querySelectorAll(
      'input:not([type="hidden"]), textarea, select'
    )
    .forEach((element) => {
      const id = element.getAttribute('id');

      const label =
        id && document.querySelector(`label[for="${id}"]`);

      const ariaLabel =
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby');

      if (!label && !ariaLabel) {
        issues.push({
          type: 'Missing form label',
          element: element.tagName.toLowerCase(),
          message: 'Form control does not have an accessible label.'
        });
      }
    });

  // 5. Missing accessible names
  document.querySelectorAll('a, button').forEach((element) => {
    const text = element.textContent.trim();

    const ariaLabel =
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby');

    const title = element.getAttribute('title');

    if (!text && !ariaLabel && !title) {
      issues.push({
        type: 'Missing accessible name',
        element: element.tagName.toLowerCase(),
        message: 'Interactive element has no accessible name.'
      });
    }
  });

  return {
    issues: issues.length,
    details: issues
  };
}


// =========================
// MESSAGE FROM POPUP
// =========================

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.type === 'SCAN_PAGE') {
      sendResponse(scanPage());
    }

    return true;
  }
);


// =========================
// INITIALIZE
// =========================

function initializeContentScript() {
  if (
    document.documentElement.dataset
      .accessadaptContentScript
  ) {
    return;
  }

  document.documentElement.dataset
    .accessadaptContentScript = 'ready';

  applyAccessibilityProfile();
}

initializeContentScript();