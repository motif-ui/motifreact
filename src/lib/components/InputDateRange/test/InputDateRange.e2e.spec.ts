import { test, expect } from "@playwright/test";
import { getRect, setScroll, storyUrl } from "../../../../utils/e2eUtils";

// Behavior tests of the picker positioning in a real browser, on the scenes in InputDateRange.e2e.story.tsx. Chromium
// supports CSS anchor positioning, so the CSS path is covered here.

test.use({ viewport: { width: 1000, height: 700 } });

test.describe("InputDateRange in a scrolling container", () => {
  const picker = "[data-testid=Picker]";
  const input = "[data-mtf-component=mtf-input-text]";

  test("opens the picker aligned with the input and follows it while scrolling", async ({ page }) => {
    await page.goto(storyUrl("e2e-inputdaterange--scrolling-container"));
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
