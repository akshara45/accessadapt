/**
 * Motion & Animation Detector
 * Detects potentially distracting or vestibular-triggering animations:
 * - Continuous / infinite CSS animations
 * - Autoplay video / audio
 * - Legacy <marquee> tags
 * - Animated GIF images
 *
 * Excludes subtle interactive hover/focus transitions.
 */

import { isVisible, isDecorative } from '../utils/dom.js';
import { getUniqueSelector } from '../utils/selectors.js';

export function detectMotion(root = document) {
  const issues = [];
  const seenSelectors = new Set();

  // 1. Detect <marquee> elements
  const marquees = root.querySelectorAll('marquee');
  marquees.forEach((el) => {
    const selector = getUniqueSelector(el);
    if (!seenSelectors.has(selector)) {
      seenSelectors.add(selector);
      issues.push({
        type: 'MOTION_DETECTED',
        severity: 'high',
        selector,
        element: 'marquee',
        message: 'Marquee element detected which causes continuous scrolling motion',
        details: {
          mediaType: 'marquee',
        },
        domElement: el,
      });
    }
  });

  // 2. Detect Autoplay Video Elements
  const videos = root.querySelectorAll('video');
  videos.forEach((video) => {
    if (!isVisible(video) || isDecorative(video)) return;

    const isAutoplay = video.hasAttribute('autoplay') || !video.paused;
    if (isAutoplay) {
      const selector = getUniqueSelector(video);
      if (!seenSelectors.has(selector)) {
        seenSelectors.add(selector);
        issues.push({
          type: 'MOTION_DETECTED',
          severity: 'medium',
          selector,
          element: 'video',
          message: 'Autoplay video detected which may distract or trigger motion sensitivity',
          details: {
            mediaType: 'video',
            autoplay: true,
            hasControls: video.hasAttribute('controls'),
          },
          domElement: video,
        });
      }
    }
  });

  // 3. Detect Animated GIF images
  const gifImages = root.querySelectorAll('img[src*=".gif" i]');
  gifImages.forEach((img) => {
    if (!isVisible(img) || isDecorative(img)) return;
    const selector = getUniqueSelector(img);
    if (!seenSelectors.has(selector)) {
      seenSelectors.add(selector);
      issues.push({
        type: 'MOTION_DETECTED',
        severity: 'low',
        selector,
        element: 'img',
        message: 'Animated GIF detected; animated graphics cannot easily be paused by the user',
        details: {
          mediaType: 'gif',
          src: img.getAttribute('src'),
        },
        domElement: img,
      });
    }
  });

  // 4. Detect Infinite or Continuous CSS Animations
  // We query elements that commonly host animations or have animated classes
  const candidates = root.querySelectorAll('*');
  let animatedCount = 0;
  const MAX_ANIMATED_REPORTS = 5; // Cap to avoid flooding on particle effects

  for (let el of candidates) {
    if (animatedCount >= MAX_ANIMATED_REPORTS) break;
    if (!isVisible(el) || isDecorative(el)) continue;

    // Ignore extension UI or scripts/styles
    if (el.id?.startsWith('accessadapt-') || el.className?.toString().includes('accessadapt-')) {
      continue;
    }

    try {
      const style = window.getComputedStyle(el);
      const animName = style.animationName;
      const animDuration = style.animationDuration;
      const animIteration = style.animationIterationCount;

      const hasActiveAnimation =
        animName &&
        animName !== 'none' &&
        animDuration !== '0s';

      const isInfinite = animIteration === 'infinite';

      // Parse duration
      const durationSeconds = parseFloat(animDuration) || 0;

      // Report infinite animations or long running animations (> 5s)
      if (hasActiveAnimation && (isInfinite || durationSeconds >= 5)) {
        const selector = getUniqueSelector(el);
        if (!seenSelectors.has(selector)) {
          seenSelectors.add(selector);
          animatedCount++;
          issues.push({
            type: 'MOTION_DETECTED',
            severity: isInfinite ? 'medium' : 'low',
            selector,
            element: el.tagName.toLowerCase(),
            message: `CSS animation detected (${animName}, ${animIteration} iterations) that may cause motion sensitivity`,
            details: {
              animationName: animName,
              animationDuration: animDuration,
              animationIterationCount: animIteration,
            },
            domElement: el,
          });
        }
      }
    } catch {
      // ignore
    }
  }

  return issues;
}
