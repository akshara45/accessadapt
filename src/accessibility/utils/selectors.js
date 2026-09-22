/**
 * CSS Selector & Element Identification Utilities
 */

/**
 * Escapes CSS identifiers safely for querySelector.
 */
function escapeIdentifier(str) {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(str);
  }
  return str.replace(/([^\w-])/g, '\\$1');
}

/**
 * Generates a clean, unique CSS selector for a given DOM element.
 */
export function getUniqueSelector(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  // 1. If element has a valid unique ID
  if (element.id && typeof element.id === 'string' && element.id.trim()) {
    const id = element.id.trim();
    try {
      const escaped = '#' + escapeIdentifier(id);
      if (document.querySelectorAll(escaped).length === 1) {
        return escaped;
      }
    } catch {
      // Continue to path-based selector
    }
  }

  // 2. Build path upwards
  const path = [];
  let current = element;

  while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();

    // Check if body
    if (selector === 'body') {
      path.unshift('body');
      break;
    }

    // Include unique class if available
    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .trim()
        .split(/\s+/)
        .filter((c) => c && !c.startsWith('accessadapt-'));

      if (classes.length > 0) {
        const classSelector = '.' + escapeIdentifier(classes[0]);
        // If element + class is globally unique, we can stop here
        try {
          if (document.querySelectorAll(selector + classSelector).length === 1) {
            path.unshift(selector + classSelector);
            break;
          }
        } catch {
          // ignore
        }
        selector += classSelector;
      }
    }

    // Add :nth-of-type if there are multiple siblings of same tag
    if (current.parentElement) {
      const siblings = Array.from(current.parentElement.children).filter(
        (child) => child.tagName === current.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}

/**
 * Sets a stable data-accessadapt-id on the element for correlation with scan issues.
 */
export function assignElementId(element, issueId) {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('data-accessadapt-id', issueId);
  }
}

/**
 * Finds an element by its data-accessadapt-id attribute.
 */
export function getElementByAccessAdaptId(issueId) {
  if (!issueId || typeof document === 'undefined') return null;
  return document.querySelector(`[data-accessadapt-id="${CSS.escape(issueId)}"]`);
}
