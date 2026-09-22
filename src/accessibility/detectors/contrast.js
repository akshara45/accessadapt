/**
 * Color Contrast Ratio Detector
 * WCAG 2.1 Level AA conformance check:
 * - Normal text: 4.5:1
 * - Large text (>= 24px, or >= 18.66px bold): 3.0:1
 *
 * Uses getEffectiveBackground() to resolve transparent and blended ancestor backgrounds.
 * Limitations: Gradients, image backgrounds, and backdrop filters are noted in documentation.
 */

import { isVisible, isDecorative } from '../utils/dom.js';
import { getUniqueSelector } from '../utils/selectors.js';
import {
  parseColor,
  calculateRelativeLuminance,
  calculateContrastRatio,
  getEffectiveBackground,
  blendColors,
} from '../utils/colors.js';

/**
 * Determines whether text qualifies as WCAG "large text":
 * - >= 24px (18pt)
 * - >= 18.66px (14pt) with bold weight (>= 700)
 */
function isLargeText(fontSizePx, fontWeight) {
  const isBold =
    fontWeight === 'bold' ||
    fontWeight === 'bolder' ||
    parseInt(fontWeight, 10) >= 700;

  if (fontSizePx >= 24) {
    return true;
  }
  if (fontSizePx >= 18.66 && isBold) {
    return true;
  }
  return false;
}

export function detectContrast(root = document) {
  const issues = [];
  const candidateTags = 'p, span, li, a, button, label, h1, h2, h3, h4, h5, h6, dt, dd, th, td, caption, blockquote';
  const elements = root.querySelectorAll(candidateTags);

  const seenSelectors = new Set();
  const flaggedElements = new Set();

  elements.forEach((element) => {
    // 1. Skip invisible or decorative elements
    if (!isVisible(element) || isDecorative(element)) {
      return;
    }

    // 2. Ensure non-empty text
    const text = element.textContent.trim();
    if (!text) {
      return;
    }

    // 3. Avoid duplicate nested reporting if parent has identical colors and was already flagged
    let ancestor = element.parentElement;
    let skipNested = false;
    while (ancestor && ancestor !== document.body) {
      if (flaggedElements.has(ancestor)) {
        skipNested = true;
        break;
      }
      ancestor = ancestor.parentElement;
    }
    if (skipNested) {
      return;
    }

    try {
      const style = window.getComputedStyle(element);
      const parsedFg = parseColor(style.color);
      if (!parsedFg) {
        return;
      }

      // Resolve effective background
      const effectiveBg = getEffectiveBackground(element);

      // If foreground has alpha < 1, blend it over effective background
      const finalFg = blendColors(parsedFg, effectiveBg);

      const fgLuminance = calculateRelativeLuminance(finalFg.r, finalFg.g, finalFg.b);
      const bgLuminance = calculateRelativeLuminance(effectiveBg.r, effectiveBg.g, effectiveBg.b);

      const contrastRatio = calculateContrastRatio(fgLuminance, bgLuminance);
      if (contrastRatio === null) {
        return;
      }

      const fontSizePx = parseFloat(style.fontSize) || 16;
      const fontWeight = style.fontWeight || '400';
      const largeText = isLargeText(fontSizePx, fontWeight);
      const requiredRatio = largeText ? 3.0 : 4.5;

      if (contrastRatio < requiredRatio) {
        const selector = getUniqueSelector(element);
        if (seenSelectors.has(selector)) return;
        seenSelectors.add(selector);
        flaggedElements.add(element);

        const textColorStr = `rgb(${finalFg.r}, ${finalFg.g}, ${finalFg.b})`;
        const bgColorStr = `rgb(${effectiveBg.r}, ${effectiveBg.g}, ${effectiveBg.b})`;

        issues.push({
          type: 'LOW_CONTRAST',
          severity: 'high',
          selector,
          element: element.tagName.toLowerCase(),
          message: `Text has insufficient color contrast (${contrastRatio}:1, minimum ${requiredRatio}:1 required)`,
          details: {
            contrastRatio,
            requiredRatio,
            textColor: textColorStr,
            backgroundColor: bgColorStr,
            fontSize: `${fontSizePx}px`,
            fontWeight,
            isLargeText: largeText,
            textSnippet: text.length > 50 ? text.slice(0, 47) + '...' : text,
          },
          domElement: element,
        });
      }
    } catch {
      // ignore getComputedStyle errors on detached elements
    }
  });

  return issues;
}
