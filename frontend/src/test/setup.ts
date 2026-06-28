import "@testing-library/jest-dom";

beforeEach(() => {
  localStorage.clear();
  // Reset URL state so filters from previous tests don't bleed through
  window.history.replaceState(null, "", "/");
});
