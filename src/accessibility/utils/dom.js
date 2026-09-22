/**
 * DOM Utility Helpers for Accessibility Scanner
 */

const IGNORED_TAGS = new Set([
  'script',
  'style',
  'noscript',
  'template',
  'svg',
  'path',
  'symbol',
  'use',
]);

/**
 * Determines whether an element is currently visible in the DOM.
 * Checks display, visibility, opacity, hidden attributes, and dimensional bounding rect.
 */
export function isVisible(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();
  if (IGNORED_TAGS.has(tagName)) {
    return false;
  }

  if (element.hasAttribute('hidden')) {
    return false;
  }

  // Modern browser checkVisibility API when available
  if (typeof element.checkVisibility === 'function') {
    try {
      if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) {
        return false;
      }
    } catch {
      // Fallback to manual check
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const style = window.getComputedStyle(element);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.visibility === 'collapse' ||
        parseFloat(style.opacity) === 0
      ) {
        return false;
      }

      // Check bounding rect for zero dimensions (ignore elements positioned offscreen but rendered)
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

/**
 * Checks if an element is explicitly marked as decorative or ignored by assistive technologies.
 */
export function isDecorative(element) {
  if (!element) return false;

  const role = element.getAttribute('role');
  if (role === 'presentation' || role === 'none') {
    return true;
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return true;
  }

  return false;
}

/**
 * Checks if an element has non-empty visible text content.
 */
export function getDirectText(element) {
  if (!element) return '';
  let directText = '';
  for (let node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      directText += node.textContent;
    }
  }
  return directText.trim();
}
