import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { getRect, openStory, waitForAnimations } from "../../../../utils/e2eUtils";

// Behavior tests of the modal dismiss and focus in a real browser, on the scenes in Modal.e2e.story.tsx

test.use({ viewport: { width: 1000, height: 700 } });

const modal = "[data-testid=modalBackdrop]";
const alert = "[data-testid=alertModalBackdrop]";
const popover = "[data-testid=popover]";
const dialog = `${modal} > div`;
const alertDialog = `${alert} > div`;

const openModal = async (page: Page) => {
  await openStory(page, "e2e-modal--with-overlays");
  await page.getByRole("button", { name: "Open modal" }).click();
  await expect(page.locator(dialog)).toBeFocused();
  await waitForAnimations(page);
};

// Clicks the backdrop at the top left corner, outside the dialog
const clickBackdrop = (page: Page, selector: string) => page.locator(selector).click({ position: { x: 5, y: 5 } });

test.describe("Modal with overlays", () => {
  test("stays open on a click in a popover opened in it, and closes the popover first on Escape", async ({ page }) => {
    await openModal(page);
    await page.getByRole("button", { name: "Anchor" }).click();
    await page.getByRole("button", { name: "In popover" }).click();
    await expect(page.locator(popover)).toBeVisible();
    await expect(page.locator(modal)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(popover)).toHaveCount(0);
    await expect(page.locator(modal)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(modal)).toHaveCount(0);
  });

  test("stays open when a text selection started in it is released on the backdrop, and closes on a backdrop click", async ({ page }) => {
    await openModal(page);
    const text = await getRect(page, "[data-testid=text]");
    await page.mouse.move(text.left + 2, (text.top + text.bottom) / 2);
    await page.mouse.down();
    await page.mouse.move(5, 5, { steps: 5 });
    await page.mouse.up();
    await expect(page.locator(modal)).toBeVisible();

    await clickBackdrop(page, modal);
    await expect(page.locator(modal)).toHaveCount(0);
  });

  test("keeps the Tab focus in it and gives the focus back to the opener on close", async ({ page }) => {
    await openModal(page);
    const close = page.locator(`${modal} [data-testid=iconButtonTestId]`);
    const confirm = page.getByRole("button", { name: "Confirm" });

    await page.keyboard.press("Shift+Tab");
    await expect(confirm).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Anchor" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open modal" })).toBeFocused();
  });

  test("closes only the alert opened over it on a backdrop click and Escape", async ({ page }) => {
    await openModal(page);
    const confirm = page.getByRole("button", { name: "Confirm" });

    await confirm.click();
    await expect(page.locator(alertDialog)).toBeFocused();
    await waitForAnimations(page);
    await clickBackdrop(page, alert);
    await expect(page.locator(alert)).toHaveCount(0);
    await expect(page.locator(modal)).toBeVisible();
    await expect(confirm).toBeFocused();

    await confirm.click();
    await expect(page.locator(alertDialog)).toBeFocused();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator(alert)).toHaveCount(0);
    await expect(page.locator(modal)).toBeVisible();
  });

  test("locks the page's scroll while it is open", async ({ page }) => {
    await openModal(page);
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("Escape");
    await expect(page.locator(modal)).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  });
});
