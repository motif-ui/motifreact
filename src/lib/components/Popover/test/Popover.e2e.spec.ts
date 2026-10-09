import { test, expect } from "@playwright/test";
import { getRect, isPainted, setScroll, storyUrl } from "../../../../utils/e2eUtils";

// Behavior tests of the Popover positioning in a real browser, on the scenes in Popover.e2e.story.tsx. Chromium
// supports CSS anchor positioning, so the CSS path is covered here.

test.use({ viewport: { width: 1000, height: 700 } });

test.describe("Popover in a scrolling container", () => {
  const popover = "[data-testid=popover]";
  const anchor = "button:has-text('Anchor')";

  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl("e2e-popover--scrolling-container"));
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
  await page.goto(storyUrl("e2e-popover--growing-content"));
  await page.getByRole("button", { name: "Anchor" }).click();
  await expect(page.locator(popover)).toHaveClass(/visible/);
  expect((await getRect(page, popover)).left).toBeGreaterThanOrEqual(0);

  await page.getByRole("button", { name: "Grow" }).click();
  const grown = await getRect(page, popover);
  expect(grown.right - grown.left).toBeGreaterThan(500);
  expect(grown.left).toBeGreaterThanOrEqual(0);
});

test("Popover wraps long text within the screen instead of stretching out of it", async ({ page }) => {
  const popover = "[data-testid=popover]";
  await page.goto(storyUrl("e2e-popover--long-text"));
  await expect(page.locator(popover)).toHaveClass(/visible/);

  const rect = await getRect(page, popover);
  const anchorRect = await getRect(page, "button:has-text('Anchor')");
  expect(rect.left).toBeGreaterThanOrEqual(0);
  expect(rect.right).toBeLessThanOrEqual(1000);
  // wrapped into several lines above the anchor
  expect(rect.bottom - rect.top).toBeGreaterThan(60);
  expect(rect.bottom).toBeLessThanOrEqual(anchorRect.top + 1);
  await expect(page.locator(popover)).toHaveClass(/top/);
});

test("Popover taller than the screen opens next to its anchor when the page can be scrolled to it", async ({ page }) => {
  const popover = "[data-testid=popover]";
  await page.goto(storyUrl("e2e-popover--tall-content"));
  await expect(page.locator(popover)).toHaveClass(/visible/);

  const rect = await getRect(page, popover);
  const anchorRect = await getRect(page, "button:has-text('Anchor')");
  // below the anchor instead of being pushed up over it, and out of the 700px high screen
  expect(rect.top).toBeGreaterThanOrEqual(anchorRect.bottom - 1);
  expect(rect.bottom).toBeGreaterThan(700);
  await expect(page.locator(popover)).toHaveClass(/bottom/);
});

test.describe("Popover near the right edge", () => {
  const popovers = "[data-testid=popover]";

  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl("e2e-popover--near-the-right-edge"));
    await expect(page.locator(popovers).first()).toHaveClass(/visible/);
  });

  test("flips fixed width content that does not fit instead of cutting it off", async ({ page }) => {
    const form = page.locator(popovers).filter({ hasText: "Popover item" });
    await expect(form).toHaveClass(/bottomRight/);
    const { right, cutOff } = await form.evaluate(el => {
      const wrapper = el.firstElementChild as HTMLElement;
      // the Popover's wrapper hides overflowing content, so the content is cut off when it is wider than the wrapper
      return { right: el.getBoundingClientRect().right, cutOff: wrapper.scrollWidth > wrapper.clientWidth };
    });
    expect(cutOff).toBe(false);
    expect(right).toBeLessThanOrEqual(1000);
  });

  test("stays in the screen when the window gets narrower", async ({ page }) => {
    const text = page.locator(popovers).filter({ hasText: "Lorem ipsum" });
    await page.setViewportSize({ width: 600, height: 700 });
    await expect.poll(() => text.evaluate(el => Math.round(el.getBoundingClientRect().right))).toBeLessThanOrEqual(600);
    expect(await text.evaluate(el => el.getBoundingClientRect().left)).toBeGreaterThanOrEqual(0);
  });
});
