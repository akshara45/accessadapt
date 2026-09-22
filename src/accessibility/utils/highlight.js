/**
 * Visual Highlighting Utilities for Detected Accessibility Issues
 * Provides non-destructive, removable visual highlights.
 */

const HIGHLIGHT_STYLE_ID = 'accessadapt-highlight-styles';
const HIGHLIGHT_CLASS = 'accessadapt-detected-issue';

function ensureHighlightStyles() {
  if (typeof document === 'undefined') return;

  let styleEl = document.getElementById(HIGHLIGHT_STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = HIGHLIGHT_STYLE_ID;
    styleEl.textContent = `
      .${HIGHLIGHT_CLASS} {
        outline: 3px solid #e53e3e !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 8px rgba(229, 62, 62, 0.6) !important;
      }
    `;
    (document.head || document.documentElement).appendChild(styleEl);
  }
}

/**
 * Applies visual highlight outline to detected elements.
 * Can take an array of issues or elements with data-accessadapt-id.
 */
export function highlightIssues(issues = []) {
  if (typeof document === 'undefined') return;

  ensureHighlightStyles();

  if (Array.isArray(issues) && issues.length > 0) {
    issues.forEach((issue) => {
      let el = issue.element;
      if (!el && issue.id) {
        el = document.querySelector(`[data-accessadapt-id="${CSS.escape(issue.id)}"]`);
      }
      if (el && el.classList) {
        el.classList.add(HIGHLIGHT_CLASS);
      }
    });
  } else {
    // Highlight all elements with data-accessadapt-id
    const elements = document.querySelectorAll('[data-accessadapt-id]');
    elements.forEach((el) => {
      el.classList.add(HIGHLIGHT_CLASS);
    });
  }
}

/**
 * Removes all visual issue highlights and cleans up injected highlight styles.
 */
export function clearHighlights() {
  if (typeof document === 'undefined') return;

  const highlightedElements = document.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
  highlightedElements.forEach((el) => {
    el.classList.remove(HIGHLIGHT_CLASS);
  });

  const styleEl = document.getElementById(HIGHLIGHT_STYLE_ID);
  if (styleEl) {
    styleEl.remove();
  }
}

/**
 * Checks whether highlights are currently active on the page.
 */
export function areHighlightsActive() {
  if (typeof document === 'undefined') return false;
  return document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).length > 0;
}
