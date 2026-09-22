/**
 * AccessAdapt Accessibility Detection Module
 * Main Coordinator: runs all category detectors, formats standardized issues,
 * tags DOM elements with stable accessadapt IDs, and returns serializable results.
 */

import { detectMissingAlt } from './detectors/missingAlt.js';
import { detectFormLabels } from './detectors/formLabels.js';
import { detectButtonNames } from './detectors/buttonNames.js';
import { detectSmallText } from './detectors/smallText.js';
import { detectContrast } from './detectors/contrast.js';
import { detectMotion } from './detectors/motion.js';
import { assignElementId } from './utils/selectors.js';
import { highlightIssues, clearHighlights, areHighlightsActive } from './utils/highlight.js';

// In-memory cache of the latest detected issues with their DOM elements
let lastScanIssues = [];

/**
 * Runs all accessibility detectors on the specified DOM root (defaults to document).
 *
 * @param {Object} options Configuration options (e.g. smallTextThreshold)
 * @returns {Object} Structured scan results with timestamp, url, issueCount, and issues array
 */
export function detectAccessibility(options = {}) {
  if (typeof document === 'undefined') {
    return {
      timestamp: Date.now(),
      url: '',
      issueCount: 0,
      issues: [],
      details: [],
    };
  }

  const root = options.root || document;

  // 1. Run all modular detectors
  const missingAltIssues = detectMissingAlt(root);
  const formLabelIssues = detectFormLabels(root);
  const buttonIssues = detectButtonNames(root);
  const smallTextIssues = detectSmallText(root, { threshold: options.smallTextThreshold });
  const contrastIssues = detectContrast(root);
  const motionIssues = detectMotion(root);

  // 2. Combine results
  const rawIssues = [
    ...missingAltIssues,
    ...formLabelIssues,
    ...buttonIssues,
    ...smallTextIssues,
    ...contrastIssues,
    ...motionIssues,
  ];

  // 3. Assign stable IDs and tag DOM elements
  const standardizedIssues = [];
  lastScanIssues = [];

  rawIssues.forEach((raw, index) => {
    const issueId = `accessadapt-issue-${String(index + 1).padStart(3, '0')}`;

    if (raw.domElement) {
      assignElementId(raw.domElement, issueId);
    }

    // Retain in-memory copy with DOM reference for highlighting
    lastScanIssues.push({
      id: issueId,
      domElement: raw.domElement,
    });

    // Create serializable issue object (strictly safe for Chrome messaging)
    standardizedIssues.push({
      id: issueId,
      type: raw.type,
      severity: raw.severity,
      selector: raw.selector,
      element: raw.element,
      message: raw.message,
      details: raw.details || {},
    });
  });

  const result = {
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    issueCount: standardizedIssues.length,
    issues: standardizedIssues,
    // Provide `details` as an alias for backwards compatibility with existing UI & recommendationEngine
    details: standardizedIssues,
  };

  return result;
}

/**
 * Highlights detected accessibility issues on the webpage.
 */
export function highlightDetectedIssues() {
  highlightIssues();
  return { success: true, highlighted: true };
}

/**
 * Clears any visual accessibility highlights from the webpage.
 */
export function clearDetectedIssuesHighlights() {
  clearHighlights();
  return { success: true, highlighted: false };
}

/**
 * Checks if highlights are active on the webpage.
 */
export function getHighlightStatus() {
  return { active: areHighlightsActive() };
}
