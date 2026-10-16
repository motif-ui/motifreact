import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { getRect, openStory, scrollPage, setScroll, waitForAnimations, waitForFrames } from "../../../../utils/e2eUtils";

// Behavior tests of the picker positioning in a real browser, on the scenes in InputDate.e2e.story.tsx. Chromium
// supports CSS anchor positioning, so the CSS path is covered here.

test.use({ viewport: { width: 1000, height: 700 } });

const picker = "[data-testid=Picker]";
const input = "[data-mtf-component=mtf-input-text]";
const corners = ["topLeft", "topRight", "bottomLeft", "bottomRight"] as const;

/** Opens the picker of the input in the corner and returns the rects of both */
const openInCorner = async (page: Page, corner: string) => {
  const anchor = `[data-testid=${corner}] ${input}`;
  await page.locator(`${anchor} input`).click();
  await expect(page.locator(picker)).toBeVisible();
  await waitForFrames(page);
  return { inputRect: await getRect(page, anchor), pickerRect: await getRect(page, picker) };
};

const expectInViewport = (page: Page, rect: Awaited<ReturnType<typeof getRect>>) => {
  const { width, height } = page.viewportSize()!;
  expect(rect.left).toBeGreaterThanOrEqual(0);
  expect(rect.top).toBeGreaterThanOrEqual(0);
  expect(rect.right).toBeLessThanOrEqual(width);
  expect(rect.bottom).toBeLessThanOrEqual(height);
};

test.describe("InputDate in the corners of the screen", () => {
  test.beforeEach(async ({ page }) => openStory(page, "e2e-inputdate--corners"));

  for (const corner of corners) {
    test(`opens the picker of the ${corner} input in the screen, on the side of the input that has room for it`, async ({ page }) => {
      const { inputRect, pickerRect } = await openInCorner(page, corner);
      expectInViewport(page, pickerRect);

      // the bottom inputs have no room below them, so the picker opens above
      if (corner.startsWith("top")) {
        expect(pickerRect.top).toBeGreaterThanOrEqual(inputRect.bottom);
        expect(pickerRect.top - inputRect.bottom).toBeLessThan(10);
      } else {
        expect(pickerRect.bottom).toBeLessThanOrEqual(inputRect.top);
        expect(inputRect.top - pickerRect.bottom).toBeLessThan(10);
      }
      // the right inputs have no room at their right, so the picker is aligned with their right edge
      if (corner.endsWith("Left")) expect(pickerRect.left).toBeCloseTo(inputRect.left, 0);
      else expect(pickerRect.right).toBeCloseTo(inputRect.right, 0);
    });
  }

  test("keeps the open picker in the screen when the window gets narrower", async ({ page }) => {
    await openInCorner(page, "topRight");
    await page.setViewportSize({ width: 360, height: 700 });
    await waitForFrames(page);
    expectInViewport(page, await getRect(page, picker));
  });
});

for (const viewport of [
  { width: 375, height: 667 },
  { width: 320, height: 568 },
]) {
  test.describe(`InputDate on a ${viewport.width}px wide mobile screen`, () => {
    test.use({ viewport, hasTouch: true, isMobile: true });

    for (const corner of corners) {
      test(`opens the picker of the ${corner} input in the screen without covering the input`, async ({ page }) => {
        await openStory(page, "e2e-inputdate--corners");
        const { inputRect, pickerRect } = await openInCorner(page, corner);
        expectInViewport(page, pickerRect);
        expect(pickerRect.top >= inputRect.bottom || pickerRect.bottom <= inputRect.top).toBe(true);
      });
    }
  });
}

test("InputDate in a scrolling container opens the picker aligned with the input and follows it while scrolling", async ({ page }) => {
  await openStory(page, "e2e-inputdate--scrolling-container");
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

test("InputDate in a modal keeps the picker at the input when the page behind the modal is scrolled", async ({ page }) => {
  await openStory(page, "e2e-inputdate--in-modal");
  await page.locator(`${input} input`).click();
  await expect(page.locator(picker)).toBeVisible();
  await waitForAnimations(page);
  const offset = async () => (await getRect(page, picker)).top - (await getRect(page, input)).bottom;
  const before = await offset();

  await scrollPage(page, 300);
  expect(await offset()).toBeCloseTo(before, 0);
  await expect(page.locator(picker)).toBeVisible();
});
