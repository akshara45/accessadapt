// AccessAdapt - Webpage Adaptation Module
// Handles personalized accessibility changes on webpages.

const STYLE_ID = "accessadapt-adaptation-styles";

function getStyleElement() {
  let style = document.getElementById(STYLE_ID);

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  return style;
}

function applyHighContrast() {
  const style = getStyleElement();

  style.textContent += `
    html[data-accessadapt-contrast="true"] body {
      background: #000 !important;
      color: #fff !important;
    }

    html[data-accessadapt-contrast="true"] body * {
      border-color: #fff !important;
    }

    html[data-accessadapt-contrast="true"] a {
      color: #00ffff !important;
    }

    html[data-accessadapt-contrast="true"] button,
    html[data-accessadapt-contrast="true"] input,
    html[data-accessadapt-contrast="true"] textarea,
    html[data-accessadapt-contrast="true"] select {
      background: #000 !important;
      color: #fff !important;
      border: 2px solid #fff !important;
    }
  `;

  document.documentElement.setAttribute(
    "data-accessadapt-contrast",
    "true"
  );
}

function applyLargeText() {
  const style = getStyleElement();

  style.textContent += `
    html[data-accessadapt-large-text="true"] body {
      font-size: 120% !important;
    }

    html[data-accessadapt-large-text="true"] p,
    html[data-accessadapt-large-text="true"] li,
    html[data-accessadapt-large-text="true"] label,
    html[data-accessadapt-large-text="true"] button,
    html[data-accessadapt-large-text="true"] input,
    html[data-accessadapt-large-text="true"] textarea,
    html[data-accessadapt-large-text="true"] select {
      font-size: 120% !important;
    }
  `;

  document.documentElement.setAttribute(
    "data-accessadapt-large-text",
    "true"
  );
}

function applySpacing() {
  const style = getStyleElement();

  style.textContent += `
    html[data-accessadapt-spacing="true"] body {
      line-height: 1.6 !important;
      letter-spacing: 0.05em !important;
      word-spacing: 0.12em !important;
    }

    html[data-accessadapt-spacing="true"] p,
    html[data-accessadapt-spacing="true"] li {
      margin-bottom: 1em !important;
    }
  `;

  document.documentElement.setAttribute(
    "data-accessadapt-spacing",
    "true"
  );
}

function applyReduceMotion() {
  const style = getStyleElement();

  style.textContent += `
    html[data-accessadapt-motion="true"] *,
    html[data-accessadapt-motion="true"] *::before,
    html[data-accessadapt-motion="true"] *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  `;

  document.documentElement.setAttribute(
    "data-accessadapt-motion",
    "true"
  );
}

function restoreAdaptations() {
  document.documentElement.removeAttribute(
    "data-accessadapt-contrast"
  );

  document.documentElement.removeAttribute(
    "data-accessadapt-large-text"
  );

  document.documentElement.removeAttribute(
    "data-accessadapt-spacing"
  );

  document.documentElement.removeAttribute(
    "data-accessadapt-motion"
  );

  const style = document.getElementById(STYLE_ID);

  if (style) {
    style.remove();
  }
}

function applyAdaptation(adaptationType) {
  switch (adaptationType) {
    case "high_contrast":
    case "low_contrast":
      applyHighContrast();
      break;

    case "large_text":
    case "small_text":
      applyLargeText();
      break;

    case "improve_spacing":
    case "tight_spacing":
      applySpacing();
      break;

    case "reduce_motion":
    case "excessive_motion":
      applyReduceMotion();
      break;

    case "restore":
      restoreAdaptations();
      break;

    default:
      console.warn(
        "AccessAdapt: Unknown adaptation type:",
        adaptationType
      );
  }
}

export {
  applyHighContrast,
  applyLargeText,
  applySpacing,
  applyReduceMotion,
  restoreAdaptations,
  applyAdaptation
};
