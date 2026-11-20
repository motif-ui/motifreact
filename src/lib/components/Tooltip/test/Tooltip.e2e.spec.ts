import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { disableCssAnchor, getRect, openStory, scrollPage, setScroll, waitForAnimations, waitForFrames } from "../../../../utils/e2eUtils";

// Behavior tests of the tooltip positioning in a real browser, on the scenes in Tooltip.e2e.story.tsx. Chromium
// supports CSS anchor positioning, so the CSS path is covered here.

test.use({ viewport: { width: 1000, height: 700 } });

type Rect = Awaited<ReturnType<typeof getRect>>;

const tooltip = "[data-testid=tooltipItem]";
const triangle = `${tooltip} > div:first-child`;
const button = "button:has-text('Hover')";

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

const expectTextFits = async (page: Page) => {
  const textRect = await getRect(page, `${tooltip} > div:last-child`);
  const tooltipRect = await getRect(page, tooltip);
  expect(textRect.left).toBeGreaterThanOrEqual(tooltipRect.left - 1);
  expect(textRect.right).toBeLessThanOrEqual(tooltipRect.right + 1);
  expectInViewport(page, textRect);
};

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

test.describe("Tooltip shifted into the screen", () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-tooltip--shifted-into-the-screen");
  });

  [
    { anchor: "Left", placement: "top", shift: 1 },
    { anchor: "Right", placement: "bottom", shift: -1 },
  ].forEach(({ anchor, placement, shift }) =>
    test(`keeps the triangle of ${placement} at its anchor`, async ({ page }) => {
      const { anchorRect, tooltipRect, triangleRect } = await hover(page, `button:has-text('${anchor}')`);
      await expect(page.locator(tooltip)).toHaveClass(new RegExp(placement));
      const tooltipCenter = (tooltipRect.left + tooltipRect.right) / 2;
      const anchorCenter = (anchorRect.left + anchorRect.right) / 2;
      expect((tooltipCenter - anchorCenter) * shift).toBeGreaterThan(20);
      expectInViewport(page, tooltipRect);
      await expectTextFits(page);
      expectTrianglePointsToAnchor(anchorRect, triangleRect, true);
    }),
  );
});

test.describe("Tooltip with no room on its side", () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-tooltip--opposite-side");
  });

  test("opens on the opposite side when there is no room at the right of its anchor", async ({ page }) => {
    const { anchorRect, tooltipRect, triangleRect } = await hover(page, "button:has-text('Right')");
    await expect(page.locator(tooltip)).toHaveClass(/left/);
    expect(tooltipRect.right).toBeLessThanOrEqual(anchorRect.left + 1);
    expectInViewport(page, tooltipRect);
    await expectTextFits(page);
    expectTrianglePointsToAnchor(anchorRect, triangleRect, false);
  });
});

test.describe("Tall tooltip at the left or right of its anchor near the screen edge", () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-tooltip--tall-at-the-edges");
  });

  ["Top left", "Top right", "Bottom left", "Bottom right"].forEach(anchor =>
    test(`is shifted vertically into the screen and keeps the triangle at the ${anchor.toLowerCase()} anchor`, async ({ page }) => {
      const { anchorRect, tooltipRect, triangleRect } = await hover(page, `button:has-text('${anchor}')`);
      await expect(page.locator(tooltip)).toHaveClass(anchor.endsWith("left") ? /right/ : /left/);
      expectInViewport(page, tooltipRect);
      expectNotCovering(anchorRect, tooltipRect);
      await expectTextFits(page);
      expectTrianglePointsToAnchor(anchorRect, triangleRect, false);
    }),
  );
});

test.describe("Tooltip near the right edge", () => {
  [
    { path: "CSS anchor positioning", init: undefined },
    { path: "JS positioning", init: disableCssAnchor },
  ].forEach(({ path, init }) =>
    test(`stays in the screen when the window gets narrower, with ${path}`, async ({ page }) => {
      if (init) await page.addInitScript(init);
      await openStory(page, "e2e-tooltip--shifted-into-the-screen");
      await hover(page, "button:has-text('Right')");
      await page.setViewportSize({ width: 360, height: 700 });
      await waitForFrames(page);
      expectInViewport(page, await getRect(page, tooltip));
    }),
  );
});

for (const viewport of [
  { width: 1000, height: 700 },
  { width: 320, height: 568 },
]) {
  test(`Tooltip wraps long text within a ${viewport.width}px wide screen instead of stretching out of it`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openStory(page, "e2e-tooltip--long-text");
    const { anchorRect, tooltipRect } = await hover(page, button);
    expectInViewport(page, tooltipRect);
    expectNotCovering(anchorRect, tooltipRect);
    await expectTextFits(page);
    expect(tooltipRect.right - tooltipRect.left).toBeLessThanOrEqual(320);
  });
}

[
  { path: "CSS anchor positioning", init: undefined },
  { path: "JS positioning", init: disableCssAnchor },
].forEach(({ path, init }) =>
  test(`Tooltip follows the anchor in a scrolling container, with ${path}`, async ({ page }) => {
    if (init) await page.addInitScript(init);
    await openStory(page, "e2e-tooltip--scrolling-container");
    const { anchorRect, tooltipRect } = await hover(page, button);
    expect(tooltipRect.bottom).toBeLessThanOrEqual(anchorRect.top + 1);

    await setScroll(page, { top: 20 });
    const tooltipAfter = await getRect(page, tooltip);
    expect(tooltipRect.top - tooltipAfter.top).toBeCloseTo(20, 0);
  }),
);

[
  { path: "CSS anchor positioning", init: undefined },
  { path: "JS positioning", init: disableCssAnchor },
].forEach(({ path, init }) =>
  test(`Tooltip in a modal stays at its anchor when the page behind the modal is scrolled, with ${path}`, async ({ page }) => {
    if (init) await page.addInitScript(init);
    await openStory(page, "e2e-tooltip--in-modal");
    await waitForAnimations(page);
    await hover(page, `[data-testid=modalBackdrop] ${button}`);
    const offset = async () => (await getRect(page, `[data-testid=modalBackdrop] ${button}`)).top - (await getRect(page, tooltip)).bottom;
    const before = await offset();

    await scrollPage(page, 300);
    expect(await offset()).toBeCloseTo(before, 0);
    await expect(page.locator(tooltip)).toBeVisible();
  }),
);

test("Tooltip in a modal is not moved by the wheel, since the page behind the modal does not scroll", async ({ page }) => {
  await openStory(page, "e2e-tooltip--in-modal");
  await waitForAnimations(page);
  const { tooltipRect } = await hover(page, `[data-testid=modalBackdrop] ${button}`);

  await page.mouse.wheel(0, 500);
  await waitForFrames(page);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator(tooltip)).toBeVisible();
  expect((await getRect(page, tooltip)).top).toBeCloseTo(tooltipRect.top, 0);
});

[
  { path: "CSS anchor positioning", init: undefined },
  { path: "JS positioning", init: disableCssAnchor },
].forEach(({ path, init }) =>
  test(`Tooltip whose content grows stays in the screen when it is centered and shifted, with ${path}`, async ({ page }) => {
    if (init) await page.addInitScript(init);
    await openStory(page, "e2e-tooltip--growing-content");
    const { anchorRect, tooltipRect } = await hover(page, button);
    expect(tooltipRect.right - tooltipRect.left).toBeLessThan(150);

    await page.locator(button).click();
    await waitForFrames(page);
    const grown = await getRect(page, tooltip);
    expect(grown.right - grown.left).toBeGreaterThan(200);
    expectInViewport(page, grown);
    expectNotCovering(anchorRect, grown);
    await expectTextFits(page);
    expectTrianglePointsToAnchor(anchorRect, await getRect(page, triangle), true);
  }),
);

test("Tooltip taller than the screen is kept in the screen from its top edge and stays open, even if it covers the anchor", async ({
  page,
}) => {
  await openStory(page, "e2e-tooltip--tall-content");
  const { anchorRect, tooltipRect } = await hover(page, button);
  expect(tooltipRect.top).toBeGreaterThanOrEqual(-1);
  expect(tooltipRect.bottom).toBeGreaterThan(700);
  expect(tooltipRect.top).toBeLessThan(anchorRect.bottom);

  const framesHidden = await page.evaluate(
    () =>
      new Promise<number>(resolve => {
        let hidden = 0;
        let frames = 0;
        const check = () => {
          if (!document.querySelector("[data-testid=tooltipItem]")?.className.includes("visible")) hidden++;
          if (++frames < 60) requestAnimationFrame(check);
          else resolve(hidden);
        };
        requestAnimationFrame(check);
      }),
  );
  expect(framesHidden).toBe(0);
});
