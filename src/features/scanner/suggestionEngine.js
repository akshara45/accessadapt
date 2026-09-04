export function generateSuggestions(details, selectedProfile) {
  const suggestions = [];

  if (!details || details.length === 0) {
    return suggestions;
  }

  // Check detected accessibility issues
  const hasMissingAltText = details.some(
    (issue) => issue.type === 'Missing alt text'
  );

  const hasMissingAccessibleName = details.some(
    (issue) => issue.type === 'Missing accessible name'
  );

  const hasMissingFormLabel = details.some(
    (issue) => issue.type === 'Missing form label'
  );

  const hasMissingHeadings = details.some(
    (issue) => issue.type === 'Missing headings'
  );

  const hasMissingPageTitle = details.some(
    (issue) => issue.type === 'Missing page title'
  );

  // 1. Focus Highlight
  if (hasMissingAccessibleName || hasMissingFormLabel) {
    suggestions.push({
      title: 'Focus Highlight',
      message:
        'Some interactive elements may be difficult to identify. Focus Highlight can make keyboard navigation clearer.',
      setting: 'focusHighlight',
      value: true,
    });
  }

  // 2. Improve Readability
  if (
    selectedProfile === 'low-vision' ||
    hasMissingHeadings
  ) {
    suggestions.push({
      title: 'Improve Readability',
      message:
        'Larger text and increased spacing can make this page easier to read.',
      setting: 'fontSize',
      value: 125,
    });
  }

  // 3. Dyslexia-Friendly Spacing
  if (selectedProfile === 'dyslexia') {
    suggestions.push({
      title: 'Dyslexia-Friendly Spacing',
      message:
        'Increased letter, word, and line spacing can make reading more comfortable.',
      setting: 'letterSpacing',
      value: 0.06,
    });
  }

  // 4. Calmer Reading Mode
  if (
    selectedProfile === 'reading-difficulty' ||
    hasMissingHeadings ||
    hasMissingPageTitle
  ) {
    suggestions.push({
      title: 'Calmer Reading Mode',
      message:
        'Reduced motion and increased line spacing can make the page easier to follow.',
      setting: 'reduceMotion',
      value: true,
    });
  }

  // 5. High Contrast
  if (selectedProfile === 'color-vision') {
    suggestions.push({
      title: 'High Contrast',
      message:
        'Higher contrast can make text and important information easier to distinguish.',
      setting: 'contrast',
      value: true,
    });
  }

  // 6. Missing Alt Text
  if (hasMissingAltText) {
    suggestions.push({
      title: 'Missing Image Descriptions',
      message:
        'Some images do not have alternative text. Adding alt text would improve accessibility for screen-reader users.',
      informational: true,
    });
  }

  // Maximum 4 suggestions
  return suggestions.slice(0, 4);
}