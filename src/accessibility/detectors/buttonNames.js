/**
 * Button Accessible-Name Detector
 * Inspects <button>, [role="button"], and input action buttons.
 * Determines accessible name from visible text, aria-label, aria-labelledby,
 * child images with alt, SVG titles, or title attributes.
 */

import { isVisible, isDecorative } from '../utils/dom.js';
import { getUniqueSelector } from '../utils/selectors.js';

/**
 * Calculates whether a button element has an accessible name.
 */
function hasAccessibleName(button) {
  // 1. Check aria-labelledby
  const ariaLabelledby = button.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const ids = ariaLabelledby.trim().split(/\s+/);
    const hasValidRef = ids.some((id) => {
      const el = document.getElementById(id);
      return el && el.textContent.trim().length > 0;
    });
    if (hasValidRef) return true;
  }

  // 2. Check aria-label
  const ariaLabel = button.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return true;
  }

  // 3. For input[type="button" | "submit" | "reset"]
  if (button.tagName.toLowerCase() === 'input') {
    const val = button.getAttribute('value');
    if (val && val.trim().length > 0) {
      return true;
    }
  }

  // 4. Check visible text content
  const visibleText = (button.innerText || button.textContent || '').trim();
  if (visibleText.length > 0) {
    return true;
  }

  // 5. Check child images with non-empty alt text
  const childImgs = button.querySelectorAll('img');
  for (let img of childImgs) {
    const alt = img.getAttribute('alt');
    if (alt && alt.trim().length > 0) {
      return true;
    }
    const imgAria = img.getAttribute('aria-label');
    if (imgAria && imgAria.trim().length > 0) {
      return true;
    }
  }

  // 6. Check child SVGs with title or aria-label
  const childSvgs = button.querySelectorAll('svg');
  for (let svg of childSvgs) {
    const title = svg.querySelector('title');
    if (title && title.textContent.trim().length > 0) {
      return true;
    }
    const svgAria = svg.getAttribute('aria-label');
    if (svgAria && svgAria.trim().length > 0) {
      return true;
    }
  }

  // 7. Fallback title attribute on button itself
  const title = button.getAttribute('title');
  if (title && title.trim().length > 0) {
    return true;
  }

  return false;
}

export function detectButtonNames(root = document) {
  const issues = [];
  const buttons = root.querySelectorAll('button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"]');
  const seenSelectors = new Set();

  buttons.forEach((btn) => {
    // Skip invisible or decorative buttons
    if (!isVisible(btn) || isDecorative(btn)) {
      return;
    }

    if (!hasAccessibleName(btn)) {
      const selector = getUniqueSelector(btn);
      if (seenSelectors.has(selector)) return;
      seenSelectors.add(selector);

      issues.push({
        type: 'BUTTON_NO_NAME',
        severity: 'high',
        selector,
        element: btn.tagName.toLowerCase(),
        message: 'Button does not have an accessible name',
        details: {
          tagName: btn.tagName.toLowerCase(),
          role: btn.getAttribute('role') || 'button',
          childIconCount: btn.querySelectorAll('svg, i, span').length,
        },
        domElement: btn,
      });
    }
  });

  return issues;
}
