function getPriority(severity) {
  const priorities = {
    critical: 100,
    high: 80,
    medium: 60,
    low: 40,
  };

  return priorities[severity] ?? 50;
}

function findIssue(issues, issueId) {
  return issues.find((issue) => issue.id === issueId);
}

export function getRecommendations(issues = [], profileSettings = {}) {
  const recommendations = [];

  const lowContrast = findIssue(issues, 'low_contrast');
  if (lowContrast && profileSettings.contrast) {
    recommendations.push({
      id: 'enable_high_contrast',
      title: 'Enable High Contrast',
      priority: getPriority(lowContrast.severity),
      reason:
        'This page has low contrast, and your profile prefers stronger contrast.',
      adaptation: {
        type: 'set_setting',
        setting: 'contrast',
        value: true,
      },
    });
  }

  const smallText = findIssue(issues, 'small_text');
  if (smallText && profileSettings.fontSize > 100) {
    recommendations.push({
      id: 'increase_text_size',
      title: 'Increase Text Size',
      priority: getPriority(smallText.severity),
      reason:
        'This page has small text, and your profile uses a larger reading size.',
      adaptation: {
        type: 'set_setting',
        setting: 'fontSize',
        value: profileSettings.fontSize,
      },
    });
  }

  const tightSpacing = findIssue(issues, 'tight_spacing');
  if (
    tightSpacing &&
    (profileSettings.letterSpacing > 0 ||
      profileSettings.wordSpacing > 0 ||
      profileSettings.lineHeight > 1.5)
  ) {
    recommendations.push({
      id: 'increase_reading_spacing',
      title: 'Increase Reading Spacing',
      priority: getPriority(tightSpacing.severity),
      reason:
        'This page has tight spacing, and your profile prefers a more comfortable reading layout.',
      adaptation: {
        type: 'set_settings',
        settings: {
          letterSpacing: profileSettings.letterSpacing,
          wordSpacing: profileSettings.wordSpacing,
          lineHeight: profileSettings.lineHeight,
        },
      },
    });
  }

  const excessiveMotion = findIssue(issues, 'excessive_motion');
  if (excessiveMotion && profileSettings.reduceMotion) {
    recommendations.push({
      id: 'reduce_motion',
      title: 'Reduce Motion',
      priority: getPriority(excessiveMotion.severity),
      reason:
        'This page contains animation, and your profile prefers reduced motion.',
      adaptation: {
        type: 'set_setting',
        setting: 'reduceMotion',
        value: true,
      },
    });
  }

  const focusIssue =
    findIssue(issues, 'missing_accessible_name') ||
    findIssue(issues, 'missing_form_label');

  if (focusIssue && profileSettings.focusHighlight) {
    recommendations.push({
      id: 'enable_focus_highlight',
      title: 'Enable Focus Highlight',
      priority: getPriority(focusIssue.severity),
      reason:
        'Some page controls may be hard to identify, so stronger keyboard focus can help.',
      adaptation: {
        type: 'set_setting',
        setting: 'focusHighlight',
        value: true,
      },
    });
  }

  const missingAltText = findIssue(issues, 'missing_alt_text');
  if (missingAltText) {
    recommendations.push({
      id: 'missing_alt_text_warning',
      title: 'Images Need Alternative Text',
      priority: getPriority(missingAltText.severity),
      reason:
        'Some images have no alternative text. The website author should fix this.',
      informational: true,
    });
  }

  return recommendations
    .sort((first, second) => second.priority - first.priority)
    .slice(0, 4);
}
