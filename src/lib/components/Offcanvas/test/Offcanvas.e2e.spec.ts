import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { getRect, openStory, waitForAnimations } from "../../../../utils/e2eUtils";

// Behavior tests of the offcanvas in a real browser, on the scene in Offcanvas.e2e.story.tsx. The unit tests only check the
// classes, while these check where the panel is painted, its size, and how it is dismissed and keeps the focus.

const viewport = { width: 1200, height: 800 };
test.use({ viewport });

const backdrop = "[data-testid=offcanvasBackdrop]";
const panel = `${backdrop} > aside`;
const closeButton = `${panel} [data-testid=iconButtonTestId]`;
const popover = "[data-testid=popover]";

type Options = {
  position?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg";
  closable?: boolean;
  removeBackdrop?: boolean;
  includePadding?: boolean;
  longTitle?: boolean;
};

// Sets the props with the controls of the scene, opens the offcanvas and waits until it has slid in
const openOffcanvas = async (page: Page, options: Options = {}) => {
  const { position = "left", size = "md", closable = true, removeBackdrop = false, includePadding = false, longTitle = false } = options;
  await openStory(page, "e2e-offcanvas--playground");
  await page.getByLabel("Position").selectOption(position);
  await page.getByLabel("Size").selectOption(size);
  await page.getByLabel("Closable").setChecked(closable);
  await page.getByLabel("Remove backdrop").setChecked(removeBackdrop);
  await page.getByLabel("Include padding").setChecked(includePadding);
  await page.getByLabel("Long title").setChecked(longTitle);
  await page.getByRole("button", { name: "Open offcanvas" }).click();
  await expect(page.locator(panel)).toBeFocused();
  await waitForAnimations(page);
};

// Clicks the backdrop in the middle of the area that the panel leaves free, e.g. right of a left panel. A big panel may cover
// the center of the screen, so a fixed point would hit the panel.
const clickBackdrop = async (page: Page) => {
  const { width, height } = page.viewportSize()!;
  const { top, bottom, left, right } = await getRect(page, panel);
  const gaps = [
    { size: left, x: left / 2, y: height / 2 },
    { size: width - right, x: (right + width) / 2, y: height / 2 },
    { size: top, x: width / 2, y: top / 2 },
    { size: height - bottom, x: width / 2, y: (bottom + height) / 2 },
  ];
  const { x, y } = gaps.reduce((largest, gap) => (gap.size > largest.size ? gap : largest));
  await page.mouse.click(x, y);
};

// The px value of a length variable in the current theme, so the tests do not depend on the token values
const lengthOf = (page: Page, variable: string) =>
  page.evaluate(variable => {
    const probe = document.createElement("div");
    probe.style.width = `var(${variable})`;
    document.body.append(probe);
    const { width } = getComputedStyle(probe);
    probe.remove();
    return parseFloat(width);
  }, variable);

const computedSizeOf = (page: Page, selector: string) =>
  page.locator(selector).evaluate(el => {
    const { width, height } = getComputedStyle(el);
    return { width: parseFloat(width), height: parseFloat(height) };
  });

test.describe("Position", () => {
  test("sticks the panel to the left edge, on the whole height", async ({ page }) => {
    await openOffcanvas(page, { position: "left" });
    const rect = await getRect(page, panel);
    expect(rect.left).toBe(0);
    expect(rect.top).toBe(0);
    expect(rect.bottom).toBe(viewport.height);
  });

  test("sticks the panel to the right edge, on the whole height", async ({ page }) => {
    await openOffcanvas(page, { position: "right" });
    const rect = await getRect(page, panel);
    expect(rect.right).toBe(viewport.width);
    expect(rect.top).toBe(0);
    expect(rect.bottom).toBe(viewport.height);
  });

  test("sticks the panel to the top edge, on the whole width", async ({ page }) => {
    await openOffcanvas(page, { position: "top" });
    const rect = await getRect(page, panel);
    expect(rect.top).toBe(0);
    expect(rect.left).toBe(0);
    expect(rect.right).toBe(viewport.width);
  });

  test("sticks the panel to the bottom edge, on the whole width", async ({ page }) => {
    await openOffcanvas(page, { position: "bottom" });
    const rect = await getRect(page, panel);
    expect(rect.bottom).toBe(viewport.height);
    expect(rect.left).toBe(0);
    expect(rect.right).toBe(viewport.width);
  });
});

test.describe("Size", () => {
  const sizes = [
    { size: "sm", width: "--base-sizing-320x", height: "--base-sizing-256x" },
    { size: "md", width: "--base-sizing-480x", height: "--base-sizing-400x" },
    { size: "lg", width: "--base-sizing-760x", height: "--base-sizing-600x" },
  ] as const;

  sizes.forEach(({ size, width, height }) => {
    test(`gives the ${size} width to a left panel and the ${size} height to a top panel`, async ({ page }) => {
      await openOffcanvas(page, { position: "left", size });
      expect((await computedSizeOf(page, panel)).width).toBe(await lengthOf(page, width));

      await openOffcanvas(page, { position: "top", size });
      expect((await computedSizeOf(page, panel)).height).toBe(await lengthOf(page, height));
    });
  });

  test("does not let the panel take more than 85% of a small screen", async ({ page }) => {
    const small = { width: 360, height: 300 };
    await page.setViewportSize(small);

    await openOffcanvas(page, { position: "right", size: "lg" });
    expect((await computedSizeOf(page, panel)).width).toBeCloseTo(small.width * 0.85, 0);
    // The rest of the screen stays as the backdrop, so the user can still close it with a click
    await page.mouse.click(5, small.height / 2);
    await expect(page.locator(backdrop)).toHaveCount(0);

    await openOffcanvas(page, { position: "bottom", size: "lg" });
    expect((await computedSizeOf(page, panel)).height).toBeCloseTo(small.height * 0.85, 0);
  });

  test("keeps the token size when it fits in 85% of the screen", async ({ page }) => {
    await openOffcanvas(page, { position: "left", size: "sm" });
    expect((await computedSizeOf(page, panel)).width).toBe(await lengthOf(page, "--base-sizing-320x"));
  });
});

test.describe("Dismiss", () => {
  test("closes on the close button, Escape and a backdrop click when closable", async ({ page }) => {
    await openOffcanvas(page);
    await page.locator(closeButton).click();
    await expect(page.locator(backdrop)).toHaveCount(0);

    await openOffcanvas(page);
    await page.keyboard.press("Escape");
    await expect(page.locator(backdrop)).toHaveCount(0);

    await openOffcanvas(page);
    await clickBackdrop(page);
    await expect(page.locator(backdrop)).toHaveCount(0);
  });

  test("closes on a click in the free area left by a big panel that covers the center of the screen", async ({ page }) => {
    await openOffcanvas(page, { position: "top", size: "lg" });
    const { bottom } = await getRect(page, panel);
    expect(bottom).toBeGreaterThan(viewport.height / 2);

    await clickBackdrop(page);
    await expect(page.locator(backdrop)).toHaveCount(0);
  });

  test("stays open on a click in the panel", async ({ page }) => {
    await openOffcanvas(page);
    await page.getByTestId("text").click();
    await expect(page.locator(backdrop)).toBeVisible();
  });

  test("has no close button and stays open on Escape and a backdrop click when not closable", async ({ page }) => {
    await openOffcanvas(page, { closable: false });
    await expect(page.locator(closeButton)).toHaveCount(0);

    await page.keyboard.press("Escape");
    await clickBackdrop(page);
    await expect(page.locator(backdrop)).toBeVisible();

    // It is closed only by the app, e.g. with a button in it
    await page.getByRole("button", { name: "Close from inside" }).click();
    await expect(page.locator(backdrop)).toHaveCount(0);
  });

  test("closes on Escape pressed during the enter transition and opens again", async ({ page }) => {
    await openStory(page, "e2e-offcanvas--playground");
    await page.getByRole("button", { name: "Open offcanvas" }).click();
    await expect(page.locator(panel)).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator(backdrop)).toHaveCount(0);

    await page.getByRole("button", { name: "Open offcanvas" }).click();
    // The panel gets the focus once its enter transition has started
    await expect(page.locator(panel)).toBeFocused();
    await waitForAnimations(page);
    expect((await getRect(page, panel)).left).toBe(0);
  });

  test("stays open when a text selection started in it is released on the backdrop", async ({ page }) => {
    await openOffcanvas(page);
    const text = await getRect(page, "[data-testid=text]");
    await page.mouse.move(text.left + 2, (text.top + text.bottom) / 2);
    await page.mouse.down();
    await page.mouse.move(viewport.width / 2, viewport.height / 2, { steps: 5 });
    await page.mouse.up();
    await expect(page.locator(backdrop)).toBeVisible();
  });

  test("stays open on a click in a popover opened in it, and closes the popover first on Escape", async ({ page }) => {
    await openOffcanvas(page);
    await page.getByRole("button", { name: "Anchor" }).click();
    await page.getByRole("button", { name: "In popover" }).click();
    await expect(page.locator(popover)).toBeVisible();
    await expect(page.locator(backdrop)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(popover)).toHaveCount(0);
    await expect(page.locator(backdrop)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(backdrop)).toHaveCount(0);
  });
});

test.describe("Backdrop", () => {
  test("darkens the page by default", async ({ page }) => {
    await openOffcanvas(page);
    await expect(page.locator(backdrop)).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("is transparent with removeBackdrop, but still covers the page and closes on a click", async ({ page }) => {
    await openOffcanvas(page, { removeBackdrop: true });
    await expect(page.locator(backdrop)).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

    // The controls behind it cannot be reached while it is open
    const covered = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.closest("[data-testid=offcanvasBackdrop]") !== null,
      {
        x: viewport.width / 2,
        y: viewport.height / 2,
      },
    );
    expect(covered).toBe(true);

    await clickBackdrop(page);
    await expect(page.locator(backdrop)).toHaveCount(0);
  });
});

test.describe("Content and header", () => {
  test("adds the padding to the content only with includePadding", async ({ page }) => {
    const content = `${panel} > div:last-child`;
    await openOffcanvas(page);
    await expect(page.locator(content)).toHaveCSS("padding-top", "0px");

    await openOffcanvas(page, { includePadding: true });
    await expect(page.locator(content)).toHaveCSS("padding-top", `${await lengthOf(page, "--base-sizing-16x")}px`);
  });

  test("uses the same title font in every size", async ({ page }) => {
    const title = `${panel} span`;
    const fonts = [];
    for (const size of ["sm", "md", "lg"] as const) {
      await openOffcanvas(page, { size });
      fonts.push(
        await page
          .locator(title)
          .first()
          .evaluate(el => getComputedStyle(el).font),
      );
    }
    expect(new Set(fonts).size).toBe(1);
  });

  test("wraps a long title and keeps the close button in the panel", async ({ page }) => {
    await openOffcanvas(page, { size: "sm", longTitle: true });
    const panelRect = await getRect(page, panel);
    const closeRect = await getRect(page, closeButton);
    expect(closeRect.right).toBeLessThanOrEqual(panelRect.right);
    await expect(page.locator(closeButton)).toBeInViewport();

    const title = page.locator(`${panel} span`).first();
    const { titleRight, lineHeight, height } = await title.evaluate(el => ({
      titleRight: el.getBoundingClientRect().right,
      lineHeight: parseFloat(getComputedStyle(el).lineHeight),
      height: el.getBoundingClientRect().height,
    }));
    expect(titleRight).toBeLessThanOrEqual(closeRect.left);
    expect(height).toBeGreaterThan(lineHeight);
  });
});

test.describe("Focus and scroll", () => {
  test("keeps the Tab focus in the panel and gives the focus back to the opener on close", async ({ page }) => {
    await openOffcanvas(page);
    const close = page.locator(closeButton);
    const last = page.getByRole("button", { name: "Close from inside" });

    await page.keyboard.press("Shift+Tab");
    await expect(last).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Anchor" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open offcanvas" })).toBeFocused();
  });

  test("locks the page's scroll while it is open", async ({ page }) => {
    await openOffcanvas(page);
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("Escape");
    await expect(page.locator(backdrop)).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  });
});
