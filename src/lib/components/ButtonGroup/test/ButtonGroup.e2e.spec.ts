import { test, expect } from "@playwright/test";
import { disableCssAnchor, getRect, isPainted, openStory, scrollPage, setScroll, waitForFrames } from "../../../../utils/e2eUtils";

// Behavior tests of the ButtonGroup submenu in a real browser, on the scenes in ButtonGroup.e2e.story.tsx.

test.use({ viewport: { width: 1000, height: 700 } });

const button = "button:has-text('Menu')";
// the submenu is rendered in document.body, next to the storybook root
const submenu = "body > div:has(> button:has-text('Sub 1'))";

test.describe("ButtonGroup submenu open/close behavior", () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-buttongroup--default");
  });

  test("opens on button click and triggers the action of the button", async ({ page }) => {
    await expect(page.locator(submenu)).toHaveCount(0);
    await page.locator(button).click();
    await expect(page.locator(submenu)).toHaveCount(1);
    await expect(page.locator(button)).toHaveClass(/open/);
    await expect(page.getByTestId("last-action")).toHaveText("menu");
  });

  test("closes on second button click", async ({ page }) => {
    await page.locator(button).click();
    await expect(page.locator(submenu)).toHaveCount(1);
    await page.locator(button).click();
    await expect(page.locator(submenu)).toHaveCount(0);
    await expect(page.locator(button)).not.toHaveClass(/open/);
  });

  test("closes on outside click", async ({ page }) => {
    await page.locator(button).click();
    await expect(page.locator(submenu)).toHaveCount(1);
    await page.mouse.click(5, 5);
    await expect(page.locator(submenu)).toHaveCount(0);
  });

  test("closes on Escape key", async ({ page }) => {
    await page.locator(button).click();
    await expect(page.locator(submenu)).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(page.locator(submenu)).toHaveCount(0);
  });

  test("closes when the other button of the group is clicked", async ({ page }) => {
    await page.locator(button).click();
    await expect(page.locator(submenu)).toHaveCount(1);
    await page.locator("button:has-text('Item')").first().click();
    await expect(page.getByTestId("last-action")).toHaveText("item");
    await expect(page.locator(submenu)).toHaveCount(0);
  });

  test("triggers the action of the submenu item and stays open", async ({ page }) => {
    await page.locator(button).click();
    await page.locator(`${submenu} button:has-text('Sub 1')`).click();
    await expect(page.getByTestId("last-action")).toHaveText("sub1");
    await expect(page.locator(submenu)).toHaveCount(1);
  });

  test("does not trigger the action of a disabled submenu item", async ({ page }) => {
    await page.locator(button).click();
    await expect(page.locator(`${submenu} button:has-text('Sub Disabled')`)).toBeDisabled();
    await page.locator(`${submenu} button:has-text('Sub Disabled')`).click({ force: true });
    await expect(page.getByTestId("last-action")).toHaveText("menu");
    await expect(page.locator(submenu)).toHaveCount(1);
  });
});

test("ButtonGroup submenu is placed below the button, aligned with its right edge by default", async ({ page }) => {
  await openStory(page, "e2e-buttongroup--default");
  await page.locator(button).click();
  await waitForFrames(page);
  const buttonRect = await getRect(page, button);
  const submenuRect = await getRect(page, submenu);
  expect(submenuRect.top).toBeGreaterThanOrEqual(buttonRect.bottom);
  expect(submenuRect.top - buttonRect.bottom).toBeLessThan(10);
  expect(submenuRect.right).toBeLessThanOrEqual(buttonRect.right);
  expect(buttonRect.right - submenuRect.right).toBeLessThan(10);
});

test("ButtonGroup submenu flips to the top when there is not enough space below", async ({ page }) => {
  await openStory(page, "e2e-buttongroup--near-the-bottom-edge");
  await page.locator(button).click();
  await waitForFrames(page);
  const buttonRect = await getRect(page, button);
  const submenuRect = await getRect(page, submenu);
  expect(submenuRect.bottom).toBeLessThanOrEqual(buttonRect.top);
  expect(buttonRect.top - submenuRect.bottom).toBeLessThan(10);
});

test("ButtonGroup submenu re-places when the viewport is resized", async ({ page }) => {
  await openStory(page, "e2e-buttongroup--near-the-bottom-edge");
  await page.locator(button).click();
  await waitForFrames(page);
  expect((await getRect(page, submenu)).bottom).toBeLessThanOrEqual((await getRect(page, button)).top);

  await page.setViewportSize({ width: 1000, height: 1200 });
  await waitForFrames(page);
  expect((await getRect(page, submenu)).top).toBeGreaterThanOrEqual((await getRect(page, button)).bottom);
});

test.describe("ButtonGroup submenu wider than its button at the left edge of a narrow screen", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  // CSS anchor positioning and the JS fallback keep the submenu in the screen in different ways, so both are tested
  for (const mode of ["CSS anchor positioning", "JS fallback"]) {
    test(`is fully visible with ${mode}`, async ({ page }) => {
      if (mode === "JS fallback") await page.addInitScript(disableCssAnchor);
      await openStory(page, "e2e-buttongroup--near-the-left-edge");
      await page.locator(button).click();
      await waitForFrames(page);

      const buttonRect = await getRect(page, button);
      const submenuRect = await getRect(page, submenu);
      // the case itself: aligned with the button's right edge, the submenu would start left of the screen
      expect(submenuRect.right - submenuRect.left).toBeGreaterThan(buttonRect.right);

      expect(submenuRect.left).toBeGreaterThanOrEqual(0);
      expect(submenuRect.right).toBeLessThanOrEqual(375);
      expect(submenuRect.top).toBeGreaterThanOrEqual(buttonRect.bottom);
      await expect.poll(() => isPainted(page, submenu)).toBe(true);
    });
  }
});

test.describe("ButtonGroup submenu when the page is scrolled (JS fallback)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(disableCssAnchor);
    await openStory(page, "e2e-buttongroup--page-scroll");
    await page.locator(button).click();
    await waitForFrames(page);
  });

  test("follows the button", async ({ page }) => {
    const buttonBefore = await getRect(page, button);
    const submenuBefore = await getRect(page, submenu);

    await scrollPage(page, 100);

    const buttonAfter = await getRect(page, button);
    const submenuAfter = await getRect(page, submenu);

    expect(buttonAfter.top - buttonBefore.top).toBeCloseTo(-100, 0);
    expect(submenuAfter.top - buttonAfter.top).toBeCloseTo(submenuBefore.top - buttonBefore.top, 0);
  });
});

test.describe("ButtonGroup submenu in a scrolling container", () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-buttongroup--scrolling-container");
    await setScroll(page, { left: 300 });
    await page.locator(button).click();
    await expect(page.locator(submenu)).toHaveCount(1);
  });

  test("follows the button with CSS anchor positioning", async ({ page }) => {
    const positionAnchor = await page.locator(submenu).evaluate(el => el.style.getPropertyValue("position-anchor"));
    expect(positionAnchor).not.toBe("");

    const buttonBefore = await getRect(page, button);
    const submenuBefore = await getRect(page, submenu);
    await setScroll(page, { left: 250 });
    const buttonAfter = await getRect(page, button);
    const submenuAfter = await getRect(page, submenu);

    expect(buttonAfter.left - buttonBefore.left).toBeCloseTo(50, 0);
    expect(submenuAfter.right - buttonAfter.right).toBeCloseTo(submenuBefore.right - buttonBefore.right, 0);
  });

  test("is hidden while the button is clipped by the container and shown again when scrolled back", async ({ page }) => {
    await expect.poll(() => isPainted(page, submenu)).toBe(true);

    await setScroll(page, { top: 120 });
    await expect.poll(() => isPainted(page, submenu)).toBe(false);
    await expect(page.locator(submenu)).toHaveCount(1);

    await setScroll(page, { top: 0 });
    await expect.poll(() => isPainted(page, submenu)).toBe(true);
  });
});
