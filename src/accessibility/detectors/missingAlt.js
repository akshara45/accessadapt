/**
 * Missing Alt Text Detector
 * Inspects <img> elements for missing alternative text.
 * Respects decorative images (alt="", role="presentation", role="none", aria-hidden="true").
 */

import { isVisible, isDecorative } from '../utils/dom.js';
import { getUniqueSelector } from '../utils/selectors.js';

export function detectMissingAlt(root = document) {
  const issues = [];
  const images = root.querySelectorAll('img');
  const seenSelectors = new Set();

  images.forEach((img) => {
    // 1. Skip hidden images or 0-dimension tracking pixels
    if (!isVisible(img)) {
      return;
    }

    // 2. Skip decorative images: role="presentation", role="none", aria-hidden="true"
    if (isDecorative(img)) {
      return;
    }

    // 3. Check for alt attribute presence
    const hasAltAttr = img.hasAttribute('alt');
    const altValue = img.getAttribute('alt');

    // If alt is present and is empty string (alt=""), it is intentionally decorative per WCAG
    if (hasAltAttr && altValue.trim() === '') {
      return;
    }

    // Check aria-label or aria-labelledby as accessible name override
    const ariaLabel = img.getAttribute('aria-label');
    const ariaLabelledby = img.getAttribute('aria-labelledby');
    if (ariaLabel?.trim() || ariaLabelledby?.trim()) {
      return;
    }

    // Missing alt attribute entirely
    if (!hasAltAttr) {
      const selector = getUniqueSelector(img);
      if (seenSelectors.has(selector)) return;
      seenSelectors.add(selector);

      issues.push({
        type: 'MISSING_ALT',
        severity: 'high',
        selector,
        element: 'img',
        message: 'Image is missing alternative text',
        details: {
          src: img.getAttribute('src') || img.currentSrc || null,
          hasAlt: false,
          altValue: null,
        },
        domElement: img,
      });
    }
  });

  return issues;
}
