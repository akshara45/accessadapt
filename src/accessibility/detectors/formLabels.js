/**
 * Form Label Detector
 * Inspects form controls (input, textarea, select) for accessible labels.
 * Checks associated <label for="...">, wrapping <label>, aria-label, aria-labelledby, and title.
 * Disallows placeholder text as a replacement for a label.
 */

import { isVisible, isDecorative } from '../utils/dom.js';
import { getUniqueSelector } from '../utils/selectors.js';

const EXCLUDED_INPUT_TYPES = new Set([
  'hidden',
  'submit',
  'reset',
  'button',
  'image',
]);

/**
 * Checks whether a form control has an accessible label.
 */
function hasAccessibleLabel(element) {
  // 1. Check aria-labelledby (highest priority)
  const ariaLabelledby = element.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const ids = ariaLabelledby.trim().split(/\s+/);
    const hasValidRef = ids.some((id) => {
      const referencedEl = document.getElementById(id);
      return referencedEl && referencedEl.textContent.trim().length > 0;
    });
    if (hasValidRef) return true;
  }

  // 2. Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return true;
  }

  // 3. Check explicit label: <label for="...">
  if (element.id && element.id.trim()) {
    try {
      const label = document.querySelector(`label[for="${CSS.escape(element.id.trim())}"]`);
      if (label && label.textContent.trim().length > 0) {
        return true;
      }
    } catch {
      // ignore query selector escape error
    }
  }

  // 4. Check wrapping label: <label><input ... /> Label Text</label>
  const wrappingLabel = element.closest('label');
  if (wrappingLabel) {
    // Clone label to check text without the element's own value
    const clone = wrappingLabel.cloneNode(true);
    clone.querySelectorAll('input, textarea, select').forEach((c) => c.remove());
    if (clone.textContent.trim().length > 0) {
      return true;
    }
  }

  // 5. Fallback title attribute
  const title = element.getAttribute('title');
  if (title && title.trim().length > 0) {
    return true;
  }

  return false;
}

export function detectFormLabels(root = document) {
  const issues = [];
  const controls = root.querySelectorAll('input, textarea, select');
  const seenSelectors = new Set();

  controls.forEach((control) => {
    const tagName = control.tagName.toLowerCase();
    const inputType = (control.getAttribute('type') || 'text').toLowerCase();

    // Skip excluded input types (hidden, submit, reset, button, image)
    if (tagName === 'input' && EXCLUDED_INPUT_TYPES.has(inputType)) {
      return;
    }

    // Skip hidden or decorative controls
    if (!isVisible(control) || isDecorative(control)) {
      return;
    }

    if (!hasAccessibleLabel(control)) {
      const selector = getUniqueSelector(control);
      if (seenSelectors.has(selector)) return;
      seenSelectors.add(selector);

      issues.push({
        type: 'MISSING_FORM_LABEL',
        severity: 'high',
        selector,
        element: tagName,
        message: 'Form control does not have an accessible label',
        details: {
          controlType: tagName,
          inputType: tagName === 'input' ? inputType : null,
          hasPlaceholder: Boolean(control.getAttribute('placeholder')),
          placeholderNote: control.getAttribute('placeholder')
            ? 'Placeholder is present but is not an accessible label'
            : null,
        },
        domElement: control,
      });
    }
  });

  return issues;
}
