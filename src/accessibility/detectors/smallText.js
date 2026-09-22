/**
 * Small Text Detector
 * Inspects visible text elements for font-sizes below a configurable threshold.
 * Avoids duplicate nested reports and invisible text.
 * NOTE: Small text is an accessibility reading warning based on threshold, not a strict WCAG violation.
 */

import { isVisible, isDecorative, getDirectText } from '../utils/dom.js';
import { getUniqueSelector } from '../utils/selectors.js';

export const DEFAULT_SMALL_TEXT_THRESHOLD = 12; // pixels

export function detectSmallText(root = document, options = {}) {
  const threshold = options.threshold ?? DEFAULT_SMALL_TEXT_THRESHOLD;
  const issues = [];
  const candidateTags = 'p, span, li, a, button, label, h1, h2, h3, h4, h5, h6, td, th, caption, blockquote, figcaption, small, dt, dd';
  const elements = root.querySelectorAll(candidateTags);

  const flaggedElements = new Set();
  const seenSelectors = new Set();

  elements.forEach((element) => {
    // 1. Skip hidden or decorative elements
    if (!isVisible(element) || isDecorative(element)) {
      return;
    }

    // 2. Ensure element has visible text
    const text = element.textContent.trim();
    if (!text) {
      return;
    }

    // 3. Avoid duplicate nested reporting if an ancestor was already flagged
    let ancestor = element.parentElement;
    let hasFlaggedAncestor = false;
    while (ancestor && ancestor !== document.body) {
      if (flaggedElements.has(ancestor)) {
        hasFlaggedAncestor = true;
        break;
      }
      ancestor = ancestor.parentElement;
    }
    if (hasFlaggedAncestor) {
      return;
    }

    // 4. Measure computed font size
    let fontSize = 0;
    try {
      const style = window.getComputedStyle(element);
      fontSize = parseFloat(style.fontSize) || 0;
    } catch {
      return;
    }

    if (fontSize > 0 && fontSize < threshold) {
      const selector = getUniqueSelector(element);
      if (seenSelectors.has(selector)) return;
      seenSelectors.add(selector);
      flaggedElements.add(element);

      issues.push({
        type: 'SMALL_TEXT',
        severity: 'medium',
        selector,
        element: element.tagName.toLowerCase(),
        message: `Text may be difficult to read (${fontSize}px is below ${threshold}px threshold)`,
        details: {
          fontSize: `${fontSize}px`,
          threshold: `${threshold}px`,
          textSnippet: text.length > 50 ? text.slice(0, 47) + '...' : text,
        },
        domElement: element,
      });
    }
  });

  return issues;
}
