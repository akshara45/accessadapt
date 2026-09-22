/**
 * Color Utilities for Accessibility Scanner
 * WCAG 2.1 Conforming Color Contrast & Relative Luminance calculations
 */

const NAMED_COLORS = {
  transparent: { r: 0, g: 0, b: 0, a: 0 },
  black: { r: 0, g: 0, b: 0, a: 1 },
  white: { r: 255, g: 255, b: 255, a: 1 },
  red: { r: 255, g: 0, b: 0, a: 1 },
  green: { r: 0, g: 128, b: 0, a: 1 },
  blue: { r: 0, g: 0, b: 255, a: 1 },
  yellow: { r: 255, g: 255, b: 0, a: 1 },
  cyan: { r: 0, g: 255, b: 255, a: 1 },
  magenta: { r: 255, g: 0, b: 255, a: 1 },
  gray: { r: 128, g: 128, b: 128, a: 1 },
  grey: { r: 128, g: 128, b: 128, a: 1 },
  lightgray: { r: 211, g: 211, b: 211, a: 1 },
  lightgrey: { r: 211, g: 211, b: 211, a: 1 },
  darkgray: { r: 169, g: 169, b: 169, a: 1 },
  darkgrey: { r: 169, g: 169, b: 169, a: 1 },
};

/**
 * Parses a CSS color string into an { r, g, b, a } object.
 * Supports: hex (#rgb, #rgba, #rrggbb, #rrggbbaa), rgb(), rgba(), and named colors.
 * Returns null if invalid.
 */
export function parseColor(colorStr) {
  if (!colorStr || typeof colorStr !== 'string') {
    return null;
  }

  const str = colorStr.trim().toLowerCase();

  if (NAMED_COLORS[str]) {
    return { ...NAMED_COLORS[str] };
  }

  // Handle Hex (#rgb, #rgba, #rrggbb, #rrggbbaa)
  if (str.startsWith('#')) {
    const hex = str.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 4) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: Math.round((parseInt(hex[3] + hex[3], 16) / 255) * 1000) / 1000,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 1000) / 1000,
      };
    }
  }

  // Handle rgb(...) / rgba(...)
  const rgbaMatch = str.match(
    /^rgba?\(\s*([\d.]+)\s*(?:,|\s)\s*([\d.]+)\s*(?:,|\s)\s*([\d.]+)(?:\s*(?:,|\/)\s*([\d.]+%?))?\s*\)$/
  );

  if (rgbaMatch) {
    let r = parseFloat(rgbaMatch[1]);
    let g = parseFloat(rgbaMatch[2]);
    let b = parseFloat(rgbaMatch[3]);
    let a = 1;

    if (rgbaMatch[4] !== undefined) {
      if (rgbaMatch[4].endsWith('%')) {
        a = parseFloat(rgbaMatch[4]) / 100;
      } else {
        a = parseFloat(rgbaMatch[4]);
      }
    }

    return {
      r: Math.min(255, Math.max(0, Math.round(r))),
      g: Math.min(255, Math.max(0, Math.round(g))),
      b: Math.min(255, Math.max(0, Math.round(b))),
      a: Math.min(1, Math.max(0, a)),
    };
  }

  return null;
}

/**
 * Converts an 8-bit sRGB color channel value (0-255) to linear luminance value (0-1).
 * Following WCAG 2.1 relative luminance definition.
 */
export function rgbToLinear(channel) {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

/**
 * Calculates relative luminance of an sRGB color (R, G, B in 0-255 range).
 * Returns a float between 0 (pure black) and 1 (pure white).
 */
export function calculateRelativeLuminance(r, g, b) {
  const R = rgbToLinear(r);
  const G = rgbToLinear(g);
  const B = rgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates the WCAG contrast ratio between two relative luminance values.
 * Ratio = (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter luminance.
 * Returns a number between 1.0 and 21.0, rounded to 2 decimal places.
 */
export function calculateContrastRatio(luminance1, luminance2) {
  if (typeof luminance1 !== 'number' || typeof luminance2 !== 'number') {
    return null;
  }
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Alpha-blends a semi-transparent foreground color over an opaque background color.
 * Resulting RGB = alpha * FG + (1 - alpha) * BG
 */
export function blendColors(fgColor, bgColor) {
  const alpha = fgColor.a !== undefined ? fgColor.a : 1;
  if (alpha >= 1) {
    return { r: fgColor.r, g: fgColor.g, b: fgColor.b, a: 1 };
  }
  if (alpha <= 0) {
    return { r: bgColor.r, g: bgColor.g, b: bgColor.b, a: 1 };
  }

  return {
    r: Math.round(alpha * fgColor.r + (1 - alpha) * bgColor.r),
    g: Math.round(alpha * fgColor.g + (1 - alpha) * bgColor.g),
    b: Math.round(alpha * fgColor.b + (1 - alpha) * bgColor.b),
    a: 1,
  };
}

/**
 * Traverses up the DOM tree from the given element to determine its effective background color.
 * Blends translucent backgrounds with ancestor backgrounds.
 * Falls back to white (#ffffff) if root background is transparent.
 *
 * LIMITATIONS:
 * - Complex CSS gradients (linear-gradient, radial-gradient) cannot be precisely reduced to a single solid color.
 * - Background images are not analyzed for pixel color.
 * - CSS backdrop-filter, mix-blend-mode, and complex positioned overlays are not evaluated.
 */
export function getEffectiveBackground(element) {
  const fallback = { r: 255, g: 255, b: 255, a: 1 };
  if (!element || typeof window === 'undefined') {
    return fallback;
  }

  const layers = [];
  let current = element;

  while (current && current !== document.documentElement) {
    try {
      const style = window.getComputedStyle(current);
      const bg = parseColor(style.backgroundColor);

      if (bg && bg.a > 0) {
        layers.push(bg);
        // If layer is fully opaque, we don't need to look higher
        if (bg.a === 1) {
          break;
        }
      }
    } catch {
      break;
    }
    current = current.parentElement;
  }

  // Also check documentElement
  if (document.documentElement) {
    try {
      const rootStyle = window.getComputedStyle(document.documentElement);
      const rootBg = parseColor(rootStyle.backgroundColor);
      if (rootBg && rootBg.a > 0) {
        layers.push(rootBg);
      }
    } catch {
      // ignore
    }
  }

  // Composite layers from bottom (highest ancestor / fallback) to top (innermost element)
  let composite = { ...fallback };
  for (let i = layers.length - 1; i >= 0; i--) {
    composite = blendColors(layers[i], composite);
  }

  return composite;
}
