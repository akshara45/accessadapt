export function generateSuggestions(issues, profileId) {
  const suggestions = [];

  const hasIssue = (type) =>
    issues.some((issue) => issue.type === type);

  // Low Vision
  if (profileId === 'low-vision') {
    if (hasIssue('Missing alt text')) {
      suggestions.push({
        feature: 'Text-to-Speech',
        message:
          'Some images do not have alternative text. Text-to-Speech can help you access page content.'
      });
    }

    suggestions.push({
      feature: 'High Contrast',
      message:
        'High Contrast can improve visibility and readability for low-vision users.'
    });
  }

  // Dyslexia
  if (profileId === 'dyslexia') {
    if (hasIssue('Missing headings')) {
      suggestions.push({
        feature: 'Reading Assistance',
        message:
          'This page has no clear headings. Reading assistance can make the content easier to follow.'
      });
    }

    suggestions.push({
      feature: 'Reading Layout',
      message:
        'Increased spacing and a clearer font can make this page easier to read.'
    });
  }

  // Reading Difficulty
  if (profileId === 'reading-difficulty') {
    if (hasIssue('Missing headings')) {
      suggestions.push({
        feature: 'Reading Assistance',
        message:
          'This page has no clear headings. A calmer reading layout may make the content easier to follow.'
      });
    }

    suggestions.push({
      feature: 'Reduced Motion',
      message:
        'Reduced Motion can make the page more comfortable to read.'
    });
  }

  // Color Vision
  if (profileId === 'color-vision') {
    suggestions.push({
      feature: 'High Contrast',
      message:
        'High Contrast can make important page elements easier to distinguish.'
    });
  }

  // Interactive elements
  if (
    hasIssue('Missing form label') ||
    hasIssue('Missing accessible name')
  ) {
    suggestions.push({
      feature: 'Focus Highlight',
      message:
        'Some interactive elements may be difficult to identify. Focus Highlight can make keyboard navigation clearer.'
    });
  }

  return suggestions;
}