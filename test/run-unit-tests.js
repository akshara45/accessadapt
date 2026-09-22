/**
 * Unit Test Runner for AccessAdapt Accessibility Detection Module
 * Tests color utilities, relative luminance, contrast calculation,
 * issue schemas, and recommendation engine integration.
 */

import {
  parseColor,
  rgbToLinear,
  calculateRelativeLuminance,
  calculateContrastRatio,
  blendColors,
} from '../src/accessibility/utils/colors.js';

import { getRecommendations } from '../src/features/recommendations/recommendationEngine.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

function assertEqual(actual, expected, testName) {
  const match = JSON.stringify(actual) === JSON.stringify(expected);
  if (match) {
    passed++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${testName} (Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)})`);
  }
}

console.log('\n--- 1. Testing Color Parsing (parseColor) ---');
assertEqual(parseColor('#fff'), { r: 255, g: 255, b: 255, a: 1 }, '3-digit hex #fff');
assertEqual(parseColor('#000000'), { r: 0, g: 0, b: 0, a: 1 }, '6-digit hex #000000');
assertEqual(parseColor('rgb(255, 128, 0)'), { r: 255, g: 128, b: 0, a: 1 }, 'rgb(255, 128, 0)');
assertEqual(parseColor('rgba(100, 150, 200, 0.5)'), { r: 100, g: 150, b: 200, a: 0.5 }, 'rgba(100, 150, 200, 0.5)');
assertEqual(parseColor('white'), { r: 255, g: 255, b: 255, a: 1 }, 'Named color "white"');
assertEqual(parseColor('transparent'), { r: 0, g: 0, b: 0, a: 0 }, 'Named color "transparent"');
assertEqual(parseColor('invalid-color-xyz'), null, 'Invalid color returns null');

console.log('\n--- 2. Testing Relative Luminance (calculateRelativeLuminance) ---');
const whiteLum = calculateRelativeLuminance(255, 255, 255);
const blackLum = calculateRelativeLuminance(0, 0, 0);
assert(Math.abs(whiteLum - 1.0) < 0.0001, 'Pure white relative luminance is 1.0');
assert(Math.abs(blackLum - 0.0) < 0.0001, 'Pure black relative luminance is 0.0');

// sRGB conversion check
assert(rgbToLinear(0) === 0, 'rgbToLinear(0) is 0');
assert(Math.abs(rgbToLinear(255) - 1.0) < 0.0001, 'rgbToLinear(255) is 1.0');

console.log('\n--- 3. Testing Contrast Ratio (calculateContrastRatio) ---');
assertEqual(calculateContrastRatio(whiteLum, blackLum), 21, 'Black on White contrast ratio is 21.0');
assertEqual(calculateContrastRatio(whiteLum, whiteLum), 1, 'White on White contrast ratio is 1.0');

// Gray (#767676) on White (~ 4.54:1)
const grayColor = parseColor('#767676');
const grayLum = calculateRelativeLuminance(grayColor.r, grayColor.g, grayColor.b);
const grayOnWhiteRatio = calculateContrastRatio(whiteLum, grayLum);
assert(grayOnWhiteRatio >= 4.5, `Gray (#767676) on white passes normal text AA threshold: ${grayOnWhiteRatio}:1 >= 4.5`);

// Light gray (#ccc) on White (~ 1.6:1, fails AA)
const lightGray = parseColor('#cccccc');
const lightGrayLum = calculateRelativeLuminance(lightGray.r, lightGray.g, lightGray.b);
const lightGrayRatio = calculateContrastRatio(whiteLum, lightGrayLum);
assert(lightGrayRatio < 4.5, `Light gray (#ccc) on white fails AA: ${lightGrayRatio}:1 < 4.5`);

console.log('\n--- 4. Testing Alpha Blending (blendColors) ---');
const semiRed = { r: 255, g: 0, b: 0, a: 0.5 };
const white = { r: 255, g: 255, b: 255, a: 1 };
const blended = blendColors(semiRed, white);
assertEqual(blended, { r: 255, g: 128, b: 128, a: 1 }, '50% red over white produces pinkish red (255, 128, 128)');

console.log('\n--- 5. Testing Recommendation Engine Integration ---');
const standardIssues = [
  { id: 'accessadapt-issue-001', type: 'LOW_CONTRAST', severity: 'high', message: 'Low contrast' },
  { id: 'accessadapt-issue-002', type: 'SMALL_TEXT', severity: 'medium', message: 'Small text' },
  { id: 'accessadapt-issue-003', type: 'MOTION_DETECTED', severity: 'medium', message: 'Motion' },
  { id: 'accessadapt-issue-004', type: 'BUTTON_NO_NAME', severity: 'high', message: 'Button no name' },
  { id: 'accessadapt-issue-005', type: 'MISSING_ALT', severity: 'high', message: 'Missing alt' },
];

const lowVisionProfile = {
  contrast: true,
  fontSize: 125,
  reduceMotion: false,
  focusHighlight: true,
};

const recommendations = getRecommendations(standardIssues, lowVisionProfile);
assert(recommendations.length > 0, 'Recommendations generated for low-vision profile');
assert(recommendations.some((r) => r.id === 'enable_high_contrast'), 'Recommends high contrast mode');
assert(recommendations.some((r) => r.id === 'increase_text_size'), 'Recommends text size increase');
assert(recommendations.some((r) => r.id === 'enable_focus_highlight'), 'Recommends focus highlight');
assert(recommendations.some((r) => r.id === 'missing_alt_text_warning'), 'Recommends alt text warning');

// Test legacy ID backwards compatibility
const legacyIssues = [
  { id: 'low_contrast', severity: 'high', message: 'Low contrast' },
  { id: 'small_text', severity: 'medium', message: 'Small text' },
];
const legacyRecs = getRecommendations(legacyIssues, { contrast: true, fontSize: 120 });
assert(legacyRecs.some((r) => r.id === 'enable_high_contrast'), 'Legacy issue id "low_contrast" correctly mapped');
assert(legacyRecs.some((r) => r.id === 'increase_text_size'), 'Legacy issue id "small_text" correctly mapped');

console.log('\n========================================');
console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL UNIT TESTS PASSED SUCCESSFULLY! ✓\n');
}
