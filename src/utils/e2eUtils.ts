import type { Page } from "@playwright/test";

/* ************
  Helpers for the Playwright tests (*.e2e.spec.ts), which run against the development Storybook
  ************ */

export const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

// Returns the bounding rect of the first element matching the selector, in page coordinates
export const getRect = (page: Page, selector: string): Promise<{ top: number; bottom: number; left: number; right: number }> =>
  page
    .locator(selector)
    .first()
    .evaluate(el => {
      const { top, bottom, left, right } = el.getBoundingClientRect();
      return { top, bottom, left, right };
    });

// Waits two frames after scrolling, since the browser applies the CSS anchor positions and visibility in the next frame
export const setScroll = (page: Page, position: { top?: number; left?: number }) =>
  page.getByTestId("scroller").evaluate(
    (el, { top, left }) =>
      new Promise(resolve => {
        if (top !== undefined) el.scrollTop = top;
        if (left !== undefined) el.scrollLeft = left;
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
    position,
  );

// Checks whether the overlay is painted, by hit testing its visible center. position-visibility hides it without changing its style.
export const isPainted = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate(el => {
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(rect.left + rect.width / 2, 1), window.innerWidth - 1);
      const y = Math.min(Math.max(rect.top + rect.height / 2, 1), window.innerHeight - 1);
      return el.contains(document.elementFromPoint(x, y));
    });
