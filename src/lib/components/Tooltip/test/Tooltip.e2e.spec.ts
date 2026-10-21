import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { getRect, openStory, scrollPage, setScroll, waitForAnimations, waitForFrames } from "../../../../utils/e2eUtils";

// Behavior tests of the tooltip positioning in a real browser, on the scenes in Tooltip.e2e.story.tsx. Chromium
// supports CSS anchor positioning, so the CSS path is covered here.

test.use({ viewport: { width: 1000, height: 700 } });

type Rect = Awaited<ReturnType<typeof getRect>>;

const tooltip = "[data-testid=tooltipItem]";
const triangle = `${tooltip} > div:first-child`;
const button = "button:has-text('Hover')";
const corners = ["topLeft", "topRight", "bottomLeft", "bottomRight"] as const;

/** Hovers the button and returns the rects of the button, the tooltip and its triangle */
const hover = async (page: Page, anchor: string) => {
  await page.locator(anchor).hover();
  await expect(page.locator(tooltip)).toBeVisible();
  await waitForAnimations(page);
  return {
    anchorRect: await getRect(page, anchor),
    tooltipRect: await getRect(page, tooltip),
    triangleRect: await getRect(page, triangle),
  };
};

const expectInViewport = (page: Page, rect: Rect) => {
  const { width, height } = page.viewportSize()!;
  expect(rect.left).toBeGreaterThanOrEqual(0);
  expect(rect.top).toBeGreaterThanOrEqual(0);
  expect(rect.right).toBeLessThanOrEqual(width);
  expect(rect.bottom).toBeLessThanOrEqual(height);
};

const expectNotCovering = (anchorRect: Rect, tooltipRect: Rect) => {
  const apart =
    tooltipRect.top >= anchorRect.bottom - 1 ||
    tooltipRect.bottom <= anchorRect.top + 1 ||
    tooltipRect.left >= anchorRect.right - 1 ||
    tooltipRect.right <= anchorRect.left + 1;
  expect(apart).toBe(true);
};

/** The text box is inside the tooltip and the screen, e.g. it does not stick out of a tooltip squeezed into a narrow space */
const expectTextFits = async (page: Page) => {
  const textRect = await getRect(page, `${tooltip} > div:last-child`);
  const tooltipRect = await getRect(page, tooltip);
  expect(textRect.left).toBeGreaterThanOrEqual(tooltipRect.left - 1);
  expect(textRect.right).toBeLessThanOrEqual(tooltipRect.right + 1);
  expectInViewport(page, textRect);
};

/** The triangle points to the anchor: its center is within the anchor on the axis it moves along */
const expectTrianglePointsToAnchor = (anchorRect: Rect, triangleRect: Rect, vertical: boolean) => {
  if (vertical) {
    const center = (triangleRect.left + triangleRect.right) / 2;
    expect(center).toBeGreaterThanOrEqual(anchorRect.left);
    expect(center).toBeLessThanOrEqual(anchorRect.right);
  } else {
    const center = (triangleRect.top + triangleRect.bottom) / 2;
    expect(center).toBeGreaterThanOrEqual(anchorRect.top);
    expect(center).toBeLessThanOrEqual(anchorRect.bottom);
  }
};

for (const viewport of [
  { width: 1000, height: 700 },
  { width: 375, height: 667 },
  { width: 320, height: 568 },
]) {
  test.describe(`Tooltip in the corners of a ${viewport.width}px wide screen`, () => {
    test.use({ viewport });

    for (const position of ["top", "bottom", "left", "right", "left-tall", "right-tall"] as const) {
      for (const corner of corners) {
        test(`with position ${position} stays in the screen next to the ${corner} button and points to it`, async ({ page }) => {
          await openStory(page, `e2e-tooltip--corners-${position}`);
          const { anchorRect, tooltipRect, triangleRect } = await hover(page, `[data-testid=${corner}] ${button}`);

          expectInViewport(page, tooltipRect);
          expectNotCovering(anchorRect, tooltipRect);
          await expectTextFits(page);
          const vertical = tooltipRect.top >= anchorRect.bottom - 1 || tooltipRect.bottom <= anchorRect.top + 1;
          expectTrianglePointsToAnchor(anchorRect, triangleRect, vertical);
        });
      }
    }
  });
}

test.describe("Tooltip in the corners of the screen", () => {
  test("opens on the opposite side when there is no room on the given side", async ({ page }) => {
    await openStory(page, "e2e-tooltip--corners-top");
    // no room above the top buttons
    const top = await hover(page, `[data-testid=topLeft] ${button}`);
    expect(top.tooltipRect.top).toBeGreaterThanOrEqual(top.anchorRect.bottom - 1);

    await openStory(page, "e2e-tooltip--corners-right");
    // no room at the right of the right buttons
    const right = await hover(page, `[data-testid=topRight] ${button}`);
    expect(right.tooltipRect.right).toBeLessThanOrEqual(right.anchorRect.left + 1);
  });

  test("keeps the open tooltip in the screen when the window gets narrower", async ({ page }) => {
    await openStory(page, "e2e-tooltip--corners-top");
    await hover(page, `[data-testid=bottomRight] ${button}`);
    await page.setViewportSize({ width: 360, height: 700 });
    await waitForFrames(page);
    expectInViewport(page, await getRect(page, tooltip));
  });
});

for (const viewport of [
  { width: 1000, height: 700 },
  { width: 320, height: 568 },
]) {
  test(`Tooltip with a long text wraps it within a ${viewport.width}px wide screen`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openStory(page, "e2e-tooltip--long-text");
    const { anchorRect, tooltipRect } = await hover(page, button);
    expectInViewport(page, tooltipRect);
    expectNotCovering(anchorRect, tooltipRect);
    await expectTextFits(page);
    // the text is wrapped, the tooltip is not wider than its 300px text box and the triangle
    expect(tooltipRect.right - tooltipRect.left).toBeLessThanOrEqual(320);
  });
}

test("Tooltip in a scrolling container follows the button while scrolling", async ({ page }) => {
  await openStory(page, "e2e-tooltip--scrolling-container");
  const { anchorRect, tooltipRect } = await hover(page, button);
  expect(tooltipRect.bottom).toBeLessThanOrEqual(anchorRect.top + 1);

  await setScroll(page, { top: 20 });
  const tooltipAfter = await getRect(page, tooltip);
  expect(tooltipRect.top - tooltipAfter.top).toBeCloseTo(20, 0);
});

test("Tooltip in a modal stays at the button when the page behind the modal is scrolled", async ({ page }) => {
  await openStory(page, "e2e-tooltip--in-modal");
  await waitForAnimations(page);
  await hover(page, `[data-testid=modalBackdrop] ${button}`);
  const offset = async () => (await getRect(page, `[data-testid=modalBackdrop] ${button}`)).top - (await getRect(page, tooltip)).bottom;
  const before = await offset();

  await scrollPage(page, 300);
  expect(await offset()).toBeCloseTo(before, 0);
  await expect(page.locator(tooltip)).toBeVisible();
});
