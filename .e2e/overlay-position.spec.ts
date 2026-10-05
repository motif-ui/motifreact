import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

// Behavior tests of the anchored overlay positioning in a real browser. jsdom has no layout and no CSS anchor positioning,
// so the unit tests can only check the generated styles. Chromium supports CSS anchor positioning, so the CSS path is covered here.

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

type Rect = { top: number; bottom: number; left: number; right: number };

const getRect = (page: Page, selector: string): Promise<Rect> =>
  page
    .locator(selector)
    .first()
    .evaluate(el => {
      const { top, bottom, left, right } = el.getBoundingClientRect();
      return { top, bottom, left, right };
    });

// Waits two frames after scrolling, since the browser applies the CSS anchor positions and visibility in the next frame
const setScroll = (page: Page, position: { top?: number; left?: number }) =>
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
const isPainted = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate(el => {
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(rect.left + rect.width / 2, 1), window.innerWidth - 1);
      const y = Math.min(Math.max(rect.top + rect.height / 2, 1), window.innerHeight - 1);
      return el.contains(document.elementFromPoint(x, y));
    });

test.use({ viewport: { width: 1000, height: 700 } });

test.describe("Popover in a scrolling container", () => {
  const popover = "[data-testid=popover]";
  const anchor = "button:has-text('Anchor')";

  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl("components-popover--scrolling-container-for-e-2-e"));
    await setScroll(page, { left: 300 });
    await page.locator(anchor).click();
    await expect(page.locator(popover)).toHaveClass(/visible/);
  });

  test("follows the anchor with CSS anchor positioning", async ({ page }) => {
    const positionAnchor = await page.locator(popover).evaluate(el => el.style.getPropertyValue("position-anchor"));
    expect(positionAnchor).not.toBe("");

    const anchorBefore = await getRect(page, anchor);
    const popoverBefore = await getRect(page, popover);
    await setScroll(page, { left: 250 });
    const anchorAfter = await getRect(page, anchor);
    const popoverAfter = await getRect(page, popover);

    expect(anchorAfter.left - anchorBefore.left).toBeCloseTo(50, 0);
    expect(popoverAfter.left - anchorAfter.left).toBeCloseTo(popoverBefore.left - anchorBefore.left, 0);
    expect(popoverAfter.top - anchorAfter.bottom).toBeCloseTo(popoverBefore.top - anchorBefore.bottom, 0);
  });

  test("keeps its placement when the screen edge is reached while scrolling", async ({ page }) => {
    const offsetBefore = (await getRect(page, popover)).left - (await getRect(page, anchor)).left;
    await setScroll(page, { left: 100 });

    const popoverRect = await getRect(page, popover);
    expect(popoverRect.right).toBeGreaterThan(1000);
    expect(popoverRect.left - (await getRect(page, anchor)).left).toBeCloseTo(offsetBefore, 0);
    await expect(page.locator(popover)).toHaveClass(/bottomLeft/);
  });

  test("is hidden while the anchor is clipped by the container and shown again when it is scrolled back", async ({ page }) => {
    await expect.poll(() => isPainted(page, popover)).toBe(true);

    await setScroll(page, { top: 120 });
    await expect.poll(() => isPainted(page, popover)).toBe(false);
    // hidden, not closed
    await expect(page.locator(popover)).toHaveCount(1);

    await setScroll(page, { top: 0 });
    await expect.poll(() => isPainted(page, popover)).toBe(true);
  });
});

test("Popover shifted into the screen stays in it when its content grows", async ({ page }) => {
  const popover = "[data-testid=popover]";
  await page.goto(storyUrl("components-popover--growing-content-for-e-2-e"));
  await page.getByRole("button", { name: "Anchor" }).click();
  await expect(page.locator(popover)).toHaveClass(/visible/);
  expect((await getRect(page, popover)).left).toBeGreaterThanOrEqual(0);

  await page.getByRole("button", { name: "Grow" }).click();
  const grown = await getRect(page, popover);
  expect(grown.right - grown.left).toBeGreaterThan(500);
  expect(grown.left).toBeGreaterThanOrEqual(0);
});

test.describe("InputDateRange in a scrolling container", () => {
  const picker = "[data-testid=Picker]";
  const input = "[data-mtf-component=mtf-input-text]";

  test("opens the picker aligned with the input and follows it while scrolling", async ({ page }) => {
    await page.goto(storyUrl("components-inputdaterange--scrolling-container-for-e-2-e"));
    await page.locator(`${input} input`).click();
    await expect(page.locator(picker)).toBeVisible();

    const inputRect = await getRect(page, input);
    const pickerRect = await getRect(page, picker);
    expect(pickerRect.left).toBeCloseTo(inputRect.left, 0);
    expect(pickerRect.top).toBeGreaterThanOrEqual(inputRect.bottom);
    expect(pickerRect.top - inputRect.bottom).toBeLessThan(10);

    await setScroll(page, { top: 40 });
    const pickerAfter = await getRect(page, picker);
    expect(pickerRect.top - pickerAfter.top).toBeCloseTo(40, 0);
    await expect(page.locator(picker)).toBeVisible();
  });
});
