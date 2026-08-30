// Day 1 foundation: later iterations will apply saved preferences and scan this page.
function initializeContentScript() {
  if (document.documentElement.dataset.accessadaptContentScript) return;
  document.documentElement.dataset.accessadaptContentScript = 'ready';
}

initializeContentScript();
