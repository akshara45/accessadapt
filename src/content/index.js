import {
  if (message.type === 'APPLY_ADAPTATION') {
    applyAdaptation(message.adaptationType);

    sendResponse({
      success: true,
      adaptation: message.adaptationType,
    });
    return true;
  }

  if (message.type === 'RESTORE_ADAPTATIONS') {
    restoreAdaptations();

    sendResponse({
      success: true,
      restored: true,
    });
    return true;
  }

  if (message.type === 'APPLY_PROFILE') {
    applyAccessibilityProfile();
    sendResponse({ success: true });
    return true;
  }
    return true;
  }

  return true;
});

// -------------------------
// INITIALIZE
// -------------------------

function initializeContentScript() {
  if (
    document.documentElement.dataset
      .accessadaptContentScript
  ) {
    return;
  }

  document.documentElement.dataset.accessadaptContentScript =
    'ready';

  applyAccessibilityProfile();
}

initializeContentScript();
