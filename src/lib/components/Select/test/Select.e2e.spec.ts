import { test, expect } from "@playwright/test";
import { disableCssAnchor, getRect, isPainted, openStory, scrollPage, setScroll, waitForFrames } from "../../../../utils/e2eUtils";

// Behavior tests of the Select in a real browser, on the scenes in Select.e2e.story.tsx.

test.use({ viewport: { width: 1000, height: 700 } });

const listbox = '[role="listbox"]';
const combobox = '[role="combobox"]';

test.describe("Select open/close behavior", () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-select--default");
  });

  test("opens on click", async ({ page }) => {
    await expect(page.locator(listbox)).toHaveCount(0);
    await page.locator(combobox).click();
    await expect(page.locator(listbox)).toHaveCount(1);
    await expect(page.locator(combobox)).toHaveAttribute("aria-expanded", "true");
  });

  test("closes on second click", async ({ page }) => {
    await page.locator(combobox).click();
    await expect(page.locator(listbox)).toHaveCount(1);
    await page.locator(combobox).click();
    await expect(page.locator(listbox)).toHaveCount(0);
    await expect(page.locator(combobox)).toHaveAttribute("aria-expanded", "false");
  });

  test("closes on outside click", async ({ page }) => {
    await page.locator(combobox).click();
    await expect(page.locator(listbox)).toHaveCount(1);
    await page.mouse.click(5, 5);
    await expect(page.locator(listbox)).toHaveCount(0);
  });

  test("closes on Escape key", async ({ page }) => {
    await page.locator(combobox).click();
    await expect(page.locator(listbox)).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(page.locator(listbox)).toHaveCount(0);
  });

  test("selects the item and closes on item click", async ({ page }) => {
    await page.locator(combobox).click();
    await page.locator(`${listbox} label:has-text("Item 2")`).click();
    await expect(page.getByTestId("selected")).toHaveText("item2");
    await expect(page.locator(`${combobox} input`)).toHaveValue("Item 2");
    await expect(page.locator(listbox)).toHaveCount(0);
  });
});

test("Multiple Select stays open while the items are selected", async ({ page }) => {
  await openStory(page, "e2e-select--multiple");
  await page.locator(combobox).click();
  await page.locator(`${listbox} label:has-text("Item 1")`).click();
  await page.locator(`${listbox} label:has-text("Item 3")`).click();
  await expect(page.locator(listbox)).toHaveCount(1);
  await expect(page.locator(`${combobox} input`)).toHaveValue("Item 1, Item 3");
});

test("Select dropdown is placed below the select with the same width by default", async ({ page }) => {
  await openStory(page, "e2e-select--default");
  await page.locator(combobox).click();
  await waitForFrames(page);
  await expect(page.locator(combobox)).not.toHaveClass(/dropUp/);
  const selectRect = await getRect(page, combobox);
  const listboxRect = await getRect(page, listbox);
  expect(listboxRect.top).toBeGreaterThanOrEqual(selectRect.bottom - 1);
  expect(listboxRect.top - selectRect.bottom).toBeLessThan(2);
  expect(listboxRect.left).toBeCloseTo(selectRect.left, 0);
  expect(listboxRect.right).toBeCloseTo(selectRect.right, 0);
});

test("Select dropdown flips to the top when there is not enough space below", async ({ page }) => {
  await openStory(page, "e2e-select--near-the-bottom-edge");
  await page.locator(combobox).click();
  await waitForFrames(page);
  await expect(page.locator(combobox)).toHaveClass(/dropUp/);
  await expect(page.locator(listbox)).toHaveClass(/dropUp/);
  const selectRect = await getRect(page, combobox);
  const listboxRect = await getRect(page, listbox);
  expect(listboxRect.bottom).toBeLessThanOrEqual(selectRect.top + 1);
});

test("Select dropdown re-places when the viewport is resized", async ({ page }) => {
  await openStory(page, "e2e-select--near-the-bottom-edge");
  await page.locator(combobox).click();
  await waitForFrames(page);
  await expect(page.locator(listbox)).toHaveClass(/dropUp/);

  await page.setViewportSize({ width: 1000, height: 1200 });
  await waitForFrames(page);
  await expect(page.locator(listbox)).not.toHaveClass(/dropUp/);
  await expect(page.locator(combobox)).not.toHaveClass(/dropUp/);
});

test.describe("Select when the page is scrolled (JS fallback)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(disableCssAnchor);
    await openStory(page, "e2e-select--page-scroll");
    await page.locator(combobox).click();
    await waitForFrames(page);
  });

  test("follows the select", async ({ page }) => {
    const selectBefore = await getRect(page, combobox);
    const listboxBefore = await getRect(page, listbox);

    await scrollPage(page, 100);

    const selectAfter = await getRect(page, combobox);
    const listboxAfter = await getRect(page, listbox);

    expect(selectAfter.top - selectBefore.top).toBeCloseTo(-100, 0);
    expect(listboxAfter.top - selectAfter.top).toBeCloseTo(listboxBefore.top - selectBefore.top, 0);
  });
});

test.describe("Select in a scrolling container", () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-select--scrolling-container");
    await setScroll(page, { left: 300 });
    await page.locator(combobox).click();
    await expect(page.locator(listbox)).toHaveCount(1);
  });

  test("follows the select with CSS anchor positioning", async ({ page }) => {
    const positionAnchor = await page.locator(listbox).evaluate(el => el.style.getPropertyValue("position-anchor"));
    expect(positionAnchor).not.toBe("");

    const selectBefore = await getRect(page, combobox);
    const listboxBefore = await getRect(page, listbox);
    await setScroll(page, { left: 250 });
    const selectAfter = await getRect(page, combobox);
    const listboxAfter = await getRect(page, listbox);

    expect(selectAfter.left - selectBefore.left).toBeCloseTo(50, 0);
    expect(listboxAfter.left - selectAfter.left).toBeCloseTo(listboxBefore.left - selectBefore.left, 0);
  });

  test("is hidden while the select is clipped by the container and shown again when scrolled back", async ({ page }) => {
    await expect.poll(() => isPainted(page, listbox)).toBe(true);

    await setScroll(page, { top: 120 });
    await expect.poll(() => isPainted(page, listbox)).toBe(false);
    await expect(page.locator(listbox)).toHaveCount(1);

    await setScroll(page, { top: 0 });
    await expect.poll(() => isPainted(page, listbox)).toBe(true);
  });
});
