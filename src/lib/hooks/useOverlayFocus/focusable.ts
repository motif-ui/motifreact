export const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

const isVisible = (el: HTMLElement) => el.offsetParent !== null && !el.closest("[inert]");

/** The elements in the container that Tab can reach, in the document order */
export const getFocusables = (container: ParentNode) =>
  Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(isVisible);
