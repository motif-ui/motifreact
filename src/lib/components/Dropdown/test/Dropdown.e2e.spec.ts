import { test, expect } from "@playwright/test";
import { disableCssAnchor, getRect, isPainted, openStory, scrollPage, setScroll, waitForFrames } from "../../../../utils/e2eUtils";

// Behavior tests of the Dropdown in a real browser, on the scenes in Dropdown.e2e.story.tsx.

test.use({ viewport: { width: 1000, height: 700 } });

const dropdown = '[data-testid="Dropdown"]';
const button = '[data-testid="dropdown-button"]';

test.describe("Dropdown open/close behavior", () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-dropdown--default");
  });

  test("opens on button click", async ({ page }) => {
    await expect(page.locator(dropdown)).toHaveCount(0);
    await page.locator(button).click();
    await expect(page.locator(dropdown)).toHaveCount(1);
  });

  test("closes on second button click", async ({ page }) => {
    await page.locator(button).click();
    await expect(page.locator(dropdown)).toHaveCount(1);
    await page.locator(button).click();
    await expect(page.locator(dropdown)).toHaveCount(0);
  });

  test("closes on outside click", async ({ page }) => {
    await page.locator(button).click();
    await expect(page.locator(dropdown)).toHaveCount(1);
    await page.mouse.click(5, 5);
    await expect(page.locator(dropdown)).toHaveCount(0);
  });

  test("closes on Escape key", async ({ page }) => {
    await page.locator(button).click();
    await expect(page.locator(dropdown)).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(page.locator(dropdown)).toHaveCount(0);
  });

  test("triggers the item action and closes on item click", async ({ page }) => {
    await page.locator(button).click();
    await page.locator(`${dropdown} a:has-text("Item 1")`).click();
    await expect(page.getByTestId("last-action")).toHaveText("item1");
    await expect(page.locator(dropdown)).toHaveCount(0);
  });

  test("does not close when a disabled item is clicked", async ({ page }) => {
    await page.locator(button).click();
    await page.locator(`${dropdown} a:has-text("Disabled")`).click({ force: true });
    await expect(page.locator(dropdown)).toHaveCount(1);
  });
});

test("Dropdown is placed below-right of the button by default", async ({ page }) => {
  await openStory(page, "e2e-dropdown--default");
  await page.locator(button).click();
  await waitForFrames(page);
  await expect(page.locator(dropdown)).toHaveClass(/bottom/);
  const buttonRect = await getRect(page, button);
  const dropdownRect = await getRect(page, dropdown);
  expect(dropdownRect.top).toBeGreaterThanOrEqual(buttonRect.bottom - 1);
  expect(Math.round(dropdownRect.right)).toBeLessThanOrEqual(Math.round(buttonRect.right) + 1);
});

test("Dropdown flips to the top when there is not enough space below", async ({ page }) => {
  await openStory(page, "e2e-dropdown--near-the-bottom-edge");
  await page.locator(button).click();
  await waitForFrames(page);
  await expect(page.locator(dropdown)).toHaveClass(/top/);
  const buttonRect = await getRect(page, button);
  const dropdownRect = await getRect(page, dropdown);
  expect(dropdownRect.bottom).toBeLessThanOrEqual(buttonRect.top + 1);
});

test("Dropdown re-places when the viewport is resized", async ({ page }) => {
  await openStory(page, "e2e-dropdown--near-the-bottom-edge");
  await page.locator(button).click();
  await waitForFrames(page);
  await expect(page.locator(dropdown)).toHaveClass(/top/);

  await page.setViewportSize({ width: 1000, height: 1200 });
  await waitForFrames(page);
  await expect(page.locator(dropdown)).toHaveClass(/bottom/);
});

test.describe("Dropdown when the page is scrolled (JS fallback)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(disableCssAnchor);
    await openStory(page, "e2e-dropdown--page-scroll");
    await page.locator(button).click();
    await waitForFrames(page);
  });

  test("follows the button", async ({ page }) => {
    const buttonBefore = await getRect(page, button);
    const dropdownBefore = await getRect(page, dropdown);

    await scrollPage(page, 100);

    const buttonAfter = await getRect(page, button);
    const dropdownAfter = await getRect(page, dropdown);

    expect(buttonAfter.top - buttonBefore.top).toBeCloseTo(-100, 0);
    expect(dropdownAfter.top - buttonAfter.top).toBeCloseTo(dropdownBefore.top - buttonBefore.top, 0);
  });
});

test.describe("Dropdown in a scrolling container", () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-dropdown--scrolling-container");
    await setScroll(page, { left: 300 });
    await page.locator(button).click();
    await expect(page.locator(dropdown)).toHaveCount(1);
  });

  test("follows the button with CSS anchor positioning", async ({ page }) => {
    const positionAnchor = await page.locator(dropdown).evaluate(el => el.style.getPropertyValue("position-anchor"));
    expect(positionAnchor).not.toBe("");

    const buttonBefore = await getRect(page, button);
    const dropdownBefore = await getRect(page, dropdown);
    await setScroll(page, { left: 250 });
    const buttonAfter = await getRect(page, button);
    const dropdownAfter = await getRect(page, dropdown);

    expect(buttonAfter.left - buttonBefore.left).toBeCloseTo(50, 0);
    expect(dropdownAfter.right - buttonAfter.right).toBeCloseTo(dropdownBefore.right - buttonBefore.right, 0);
  });

  test("is hidden while the button is clipped by the container and shown again when scrolled back", async ({ page }) => {
    await expect.poll(() => isPainted(page, dropdown)).toBe(true);

    await setScroll(page, { top: 120 });
    await expect.poll(() => isPainted(page, dropdown)).toBe(false);
    await expect(page.locator(dropdown)).toHaveCount(1);

    await setScroll(page, { top: 0 });
    await expect.poll(() => isPainted(page, dropdown)).toBe(true);
  });
});
