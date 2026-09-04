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
// HELPER: CHECK COLOR CONTRAST
// -------------------------

function getRelativeLuminance(color) {
  if (!color) {
    return null;
  }

  const rgbMatch = color.match(
  /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
);

  if (!rgbMatch) {
    return null;
  }

  const rgb = [
    Number(rgbMatch[1]),
    Number(rgbMatch[2]),
    Number(rgbMatch[3]),
  ];

  const values = rgb.map((value) => {
    const normalized = value / 255;

    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return (
    0.2126 * values[0] +
    0.7152 * values[1] +
    0.0722 * values[2]
  );
}

function getContrastRatio(element) {
  const styles = window.getComputedStyle(element);

  const textColor = styles.color;
  const backgroundColor = styles.backgroundColor;

  const foregroundLuminance = getRelativeLuminance(textColor);
  const backgroundLuminance = getRelativeLuminance(backgroundColor);

  if (
    foregroundLuminance === null ||
    backgroundLuminance === null
  ) {
    return null;
  }

  const lighter = Math.max(
    foregroundLuminance,
    backgroundLuminance
  );

  const darker = Math.min(
    foregroundLuminance,
    backgroundLuminance
  );

  return (lighter + 0.05) / (darker + 0.05);
}

// -------------------------
// ACCESSIBILITY SCANNER
// -------------------------

function scanPage() {
  const issues = [];

  // -------------------------
  // Missing alt text
  // -------------------------

  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        id: 'missing_alt_text',
        severity: 'high',
        element: 'Image',
        message: 'Image does not have alt text.',
      });
    }
  });

  // -------------------------
  // Missing page title
  // -------------------------

  if (!document.title.trim()) {
    issues.push({
      id: 'missing_page_title',
      severity: 'medium',
      element: 'Page',
      message: 'The page does not have a title.',
    });
  }

  // -------------------------
  // Missing headings
  // -------------------------

  if (
    document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6'
    ).length === 0
  ) {
    issues.push({
      id: 'missing_headings',
      severity: 'medium',
      element: 'Page',
      message: 'No headings were found on this page.',
    });
  }

  // -------------------------
  // Missing form labels
  // -------------------------

  document
    .querySelectorAll(
      'input:not([type="hidden"]), textarea, select'
    )
    .forEach((element) => {
      const id = element.getAttribute('id');

      const label =
        id &&
        document.querySelector(`label[for="${id}"]`);

      const ariaLabel =
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby');

      if (!label && !ariaLabel) {
        issues.push({
          id: 'missing_form_label',
          severity: 'high',
          element: element.tagName.toLowerCase(),
          message:
            'Form control does not have an accessible label.',
        });
      }
    });

  // -------------------------
  // Missing accessible names
  // -------------------------

  document
    .querySelectorAll('a, button')
    .forEach((element) => {
      const text = element.textContent.trim();

      const ariaLabel =
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby');

      const title = element.getAttribute('title');

      if (!text && !ariaLabel && !title) {
        issues.push({
          id: 'missing_accessible_name',
          severity: 'high',
          element: element.tagName.toLowerCase(),
          message:
            'Interactive element has no accessible name.',
        });
      }
    });

  // -------------------------
  // Small text
  // -------------------------

  document
    .querySelectorAll('p, span, li, a, button, label')
    .forEach((element) => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);

      if (
        fontSize &&
        fontSize < 12 &&
        element.textContent.trim()
      ) {
        issues.push({
          id: 'small_text',
          severity: 'medium',
          element: element.tagName.toLowerCase(),
          message:
            'Text is smaller than 12px and may be difficult to read.',
        });
      }
    });

  // -------------------------
  // Tight spacing
  // -------------------------

  document
    .querySelectorAll('p, li, article, section')
    .forEach((element) => {
      const styles = window.getComputedStyle(element);

      const lineHeight = parseFloat(styles.lineHeight);
      const fontSize = parseFloat(styles.fontSize);
      const letterSpacing = parseFloat(styles.letterSpacing);
      const wordSpacing = parseFloat(styles.wordSpacing);

      const lineHeightRatio =
        fontSize && lineHeight
          ? lineHeight / fontSize
          : null;

      const hasTightLineHeight =
        lineHeightRatio !== null &&
        lineHeightRatio < 1.2;

      const hasNegativeLetterSpacing =
        !Number.isNaN(letterSpacing) &&
        letterSpacing < 0;

      const hasNegativeWordSpacing =
        !Number.isNaN(wordSpacing) &&
        wordSpacing < 0;

      if (
        hasTightLineHeight ||
        hasNegativeLetterSpacing ||
        hasNegativeWordSpacing
      ) {
        issues.push({
          id: 'tight_spacing',
          severity: 'medium',
          element: element.tagName.toLowerCase(),
          message:
            'Text spacing may be too tight for comfortable reading.',
        });
      }
    });

  // -------------------------
  // Excessive motion
  // -------------------------

  let motionDetected = false;

  document.querySelectorAll('*').forEach((element) => {
    if (motionDetected) {
      return;
    }

    const styles = window.getComputedStyle(element);

    const animationName = styles.animationName;
    const animationDuration = styles.animationDuration;
    const transitionDuration = styles.transitionDuration;

    const hasAnimation =
      animationName &&
      animationName !== 'none' &&
      animationDuration !== '0s';

    const hasTransition =
      transitionDuration &&
      transitionDuration !== '0s';

    if (hasAnimation || hasTransition) {
      motionDetected = true;
    }
  });

  if (motionDetected) {
    issues.push({
      id: 'excessive_motion',
      severity: 'medium',
      element: 'Page',
      message:
        'The page contains animations or transitions that may cause excessive motion.',
    });
  }

  // -------------------------
  // Low contrast
  // -------------------------

  let lowContrastDetected = false;

  document
    .querySelectorAll('p, span, li, a, button, label, h1, h2, h3, h4, h5, h6')
    .forEach((element) => {
      if (lowContrastDetected) {
        return;
      }

      if (!element.textContent.trim()) {
        return;
      }

      const contrastRatio = getContrastRatio(element);

      if (contrastRatio !== null && contrastRatio < 4.5) {
        lowContrastDetected = true;
      }
    });

  if (lowContrastDetected) {
    issues.push({
      id: 'low_contrast',
      severity: 'high',
      element: 'Text',
      message:
        'Some text may have insufficient color contrast.',
    });
  }

  // -------------------------
  // RETURN SCAN RESULT
  // -------------------------

  return {
    issues: issues.length,
    details: issues,
  };
}

// -------------------------
// MESSAGE FROM POPUP
// -------------------------

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.type === 'SCAN_PAGE') {
      sendResponse(scanPage());
    }

    return true;
  }
);

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