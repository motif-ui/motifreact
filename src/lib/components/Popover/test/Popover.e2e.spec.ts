import { test, expect } from "@playwright/test";
import { disableCssAnchor, getRect, isPainted, openStory, scrollPage, setScroll, waitForFrames } from "../../../../utils/e2eUtils";

// Behavior tests of the Popover positioning in a real browser, on the scenes in Popover.e2e.story.tsx. Chromium
// supports CSS anchor positioning, so the CSS path is covered here.

test.use({ viewport: { width: 1000, height: 700 } });

test.describe("Popover in a scrolling container", () => {
  const popover = "[data-testid=popover]";
  const anchor = "button:has-text('Anchor')";

  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-popover--scrolling-container");
    await setScroll(page, { left: 300 });
    expect(await page.getByTestId("scroller").evaluate(el => el.scrollLeft)).toBe(300);
    await page.locator(anchor).click();
    await expect(page.locator(popover)).toHaveClass(/visible/);
    // the anchor is 400px away from the right edge, so it opens at the given placement
    await expect(page.locator(popover)).toHaveClass(/bottomLeft/);
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

[
  { path: "CSS anchor positioning", init: undefined },
  { path: "JS positioning", init: disableCssAnchor },
].forEach(({ path, init }) =>
  test.describe(`Popover whose content grows, with ${path}`, () => {
    const popover = "[data-testid=popover]";

    test.beforeEach(async ({ page }) => {
      if (init) await page.addInitScript(init);
    });

    test("stays in the screen when it is centered and shifted", async ({ page }) => {
      await openStory(page, "e2e-popover--growing-content");
      await page.getByRole("button", { name: "Anchor" }).click();
      await expect(page.locator(popover)).toHaveClass(/visible/);
      expect((await getRect(page, popover)).left).toBeGreaterThanOrEqual(0);

      await page.getByRole("button", { name: "Grow" }).click();
      // the popover is fitted again before the next frame is painted, so it is measured after that
      await waitForFrames(page);
      const grown = await getRect(page, popover);
      expect(grown.right - grown.left).toBeGreaterThan(500);
      expect(grown.left).toBeGreaterThanOrEqual(0);
    });

    test("stays in the screen and keeps its placement when it is aligned near the edge", async ({ page }) => {
      await openStory(page, "e2e-popover--growing-near-the-right-edge");
      await expect(page.locator(popover)).toHaveClass(/bottomLeft/);
      const anchorRect = await getRect(page, "button:has-text('Anchor')");
      expect((await getRect(page, popover)).left).toBeCloseTo(anchorRect.left, 0);

      await page.getByRole("button", { name: "Grow" }).click();
      await waitForFrames(page);
      // as wide as its content instead of cutting it off, since its width limit is calculated again
      expect(await page.locator(popover).evaluate(el => Math.round(el.getBoundingClientRect().width))).toBeGreaterThanOrEqual(400);
      const isCutOff = await page.locator(popover).evaluate(el => el.firstElementChild!.scrollWidth > el.firstElementChild!.clientWidth);
      expect(isCutOff).toBe(false);
      // shifted to the left to stay in the 1000px wide screen, with the popover's 8px distance from its edge
      expect(Math.round((await getRect(page, popover)).right)).toBeLessThanOrEqual(992);
      await expect(page.locator(popover)).toHaveClass(/bottomLeft/);
    });
  }),
);

test("Popover wraps long text within the screen instead of stretching out of it", async ({ page }) => {
  const popover = "[data-testid=popover]";
  await openStory(page, "e2e-popover--long-text");
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

test("Popover taller than the screen is kept in the screen from its top edge, even if it covers the anchor", async ({ page }) => {
  const popover = "[data-testid=popover]";
  await openStory(page, "e2e-popover--tall-content");
  await expect(page.locator(popover)).toHaveClass(/visible/);

  const rect = await getRect(page, popover);
  // its start is visible, and the rest is out of the 700px high screen
  expect(rect.top).toBeGreaterThanOrEqual(-1);
  expect(rect.bottom).toBeGreaterThan(700);
});

test.describe("Popover near the right edge", () => {
  const popovers = "[data-testid=popover]";

  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-popover--near-the-right-edge");
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

test.describe("Popover shifted into the screen", () => {
  test.beforeEach(async ({ page }) => {
    await openStory(page, "e2e-popover--shifted-into-the-screen");
    await expect(page.locator("[data-testid=popover]").first()).toHaveClass(/visible/);
  });

  [
    { index: 0, placement: "bottomLeft", anchor: "Left" },
    { index: 1, placement: "topRight", anchor: "Right" },
  ].forEach(({ index, placement, anchor }) =>
    test(`keeps the caret of ${placement} at its anchor`, async ({ page }) => {
      const popover = page.getByTestId("popover").nth(index);
      await expect(popover).toHaveClass(new RegExp(placement));
      const anchorRect = await getRect(page, `button:has-text('${anchor}')`);
      const { left, right, caretCenter } = await popover.evaluate(el => {
        // the caret is the ::before of the popover's wrapper, absolutely positioned in the popover
        const caret = getComputedStyle(el.firstElementChild!, "::before");
        const rect = el.getBoundingClientRect();
        return { left: rect.left, right: rect.right, caretCenter: rect.left + parseFloat(caret.marginLeft) + parseFloat(caret.width) / 2 };
      });
      // shifted: the popover's aligned edge is not at the anchor's edge
      expect(placement === "bottomLeft" ? left < anchorRect.left : right > anchorRect.right).toBe(true);
      expect(caretCenter).toBeGreaterThan(anchorRect.left);
      expect(caretCenter).toBeLessThan(anchorRect.right);
    }),
  );

  test("keeps the given alignment and the caret at the anchor when it is wider than the screen", async ({ page }) => {
    // narrower than the 700px content, so the popover starts at the left edge of the screen, kept away from it by its margin
    await page.setViewportSize({ width: 500, height: 700 });
    const popover = page.getByTestId("popover").first();
    await expect.poll(() => popover.evaluate(el => Math.round(el.getBoundingClientRect().left))).toBe(8);
    await expect(popover).toHaveClass(/bottomLeft/);

    const anchorRect = await getRect(page, "button:has-text('Left')");
    const caretCenter = await popover.evaluate(el => {
      const caret = getComputedStyle(el.firstElementChild!, "::before");
      return el.getBoundingClientRect().left + parseFloat(caret.marginLeft) + parseFloat(caret.width) / 2;
    });
    expect(caretCenter).toBeGreaterThan(anchorRect.left);
    expect(caretCenter).toBeLessThan(anchorRect.right);
  });
});

test("Popover flipped to the other alignment keeps its caret at the spot of the anchor that placeOn asks for", async ({ page }) => {
  await openStory(page, "e2e-popover--flipped-alignment");
  const popover = page.getByTestId("popover");
  // bottomRight does not fit at the left edge of the screen, so it is flipped to bottomLeft
  await expect(popover).toHaveClass(/bottomLeft/);

  const anchorRect = await getRect(page, "button:has-text('bottomRight')");
  const caretCenter = await popover.evaluate(el => {
    const caret = getComputedStyle(el.firstElementChild!, "::before");
    return el.getBoundingClientRect().left + parseFloat(caret.marginLeft) + parseFloat(caret.width) / 2;
  });
  // near the anchor's right edge, as for bottomRight
  expect(caretCenter).toBeGreaterThan((anchorRect.left + anchorRect.right) / 2);
  expect(caretCenter).toBeLessThan(anchorRect.right);
});

test("Popover keeps the same distance from the screen edge whether it is shifted or not", async ({ page }) => {
  await openStory(page, "e2e-popover--flipped-alignment");
  const popover = page.getByTestId("popover");
  await expect(popover).toHaveClass(/visible/);
  // the visible box is the popover's wrapper
  const visibleLeft = () => popover.evaluate(el => Math.round(el.firstElementChild!.getBoundingClientRect().left));
  // aligned with the anchor, which is 8px away from the edge
  expect(await visibleLeft()).toBe(8);

  // narrower than the popover, so it is shifted and kept away from the edge by its margin
  await page.setViewportSize({ width: 280, height: 700 });
  await expect.poll(visibleLeft).toBe(8);
});

test("Popovers on the same anchor stay attached to it when one of them closes", async ({ page }) => {
  await openStory(page, "e2e-popover--shared-anchor");
  const bottom = page.getByTestId("popover").filter({ hasText: "Bottom" });
  await expect(page.getByTestId("popover").filter({ hasText: "Top" })).toHaveClass(/visible/);
  await expect(bottom).toHaveClass(/visible/);

  await page.getByRole("button", { name: "Close top" }).click();
  await expect(page.getByTestId("popover").filter({ hasText: "Top" })).toHaveCount(0);
  const anchorRect = await getRect(page, "button:has-text('Anchor')");
  const bottomRect = await getRect(page, "[data-testid=popover]:has-text('Bottom')");
  // still right below its anchor, so it did not lose the anchor's name
  expect(bottomRect.top).toBeGreaterThanOrEqual(anchorRect.bottom - 1);
  expect(bottomRect.top - anchorRect.bottom).toBeLessThan(20);
  await expect.poll(() => isPainted(page, "[data-testid=popover]:has-text('Bottom')")).toBe(true);
});

test("Popover does not close when a text selection started in it ends outside", async ({ page }) => {
  await openStory(page, "e2e-popover--scrolling-container");
  await page.locator("button:has-text('Anchor')").click();
  const popover = page.getByTestId("popover");
  await expect(popover).toHaveClass(/visible/);

  // the press has to start on the popover's text, so it is placed and painted before it is measured
  await waitForFrames(page);
  const text = await getRect(page, "[data-testid=popover] div div");
  const start = { x: text.left + 2, y: (text.top + text.bottom) / 2 };
  const pressedOnPopover = await page.evaluate(({ x, y }) => !!document.elementFromPoint(x, y)?.closest("[data-testid=popover]"), start);
  expect(pressedOnPopover).toBe(true);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(text.left + 2, 650, { steps: 5 });
  await page.mouse.up();
  await expect(popover).toHaveClass(/visible/);

  // a click that starts outside still closes it
  await page.mouse.click(5, 650);
  await expect(popover).toHaveCount(0);
});

test("Popover follows the anchor in a scrolling container with JS positioning", async ({ page }) => {
  await page.addInitScript(disableCssAnchor);
  await openStory(page, "e2e-popover--scrolling-container");
  await setScroll(page, { left: 300 });
  await page.locator("button:has-text('Anchor')").click();
  const popover = "[data-testid=popover]";
  await expect(page.locator(popover)).toHaveClass(/visible/);
  const offset = async () => (await getRect(page, popover)).left - (await getRect(page, "button:has-text('Anchor')")).left;
  const before = await offset();

  await setScroll(page, { left: 250 });
  expect(await offset()).toBeCloseTo(before, 0);
});

// The JS fallback expects a body that is not positioned, so only CSS anchor positioning is tested here
test("Popover is placed at its anchor when the body is positioned away from the document's origin", async ({ page }) => {
  await openStory(page, "e2e-popover--positioned-body");
  const popover = "[data-testid=popover]";
  await expect(page.locator(popover)).toHaveClass(/visible/);
  await waitForFrames(page);

  const anchorRect = await getRect(page, "button:has-text('Anchor')");
  const popoverRect = await getRect(page, popover);
  expect(popoverRect.left).toBeCloseTo(anchorRect.left, 0);
  expect(popoverRect.top).toBeGreaterThanOrEqual(anchorRect.bottom - 1);
  expect(popoverRect.top - anchorRect.bottom).toBeLessThan(20);
});

[
  { path: "CSS anchor positioning", init: undefined },
  { path: "JS positioning", init: disableCssAnchor },
].forEach(({ path, init }) =>
  test(`Popover in a modal stays at its anchor when the page behind the modal is scrolled, with ${path}`, async ({ page }) => {
    if (init) await page.addInitScript(init);
    await openStory(page, "e2e-popover--in-modal");
    const popover = "[data-testid=popover]";
    await expect(page.locator(popover)).toHaveClass(/visible/);
    const offset = async () => (await getRect(page, popover)).top - (await getRect(page, "button:has-text('Anchor')")).bottom;
    const before = await offset();
    expect(before).toBeGreaterThanOrEqual(-1);
    expect(before).toBeLessThan(20);

    await scrollPage(page, 300);
    expect(await offset()).toBeCloseTo(before, 0);
  }),
);

test("Popover in a modal is not moved by the wheel, since the page behind the modal does not scroll", async ({ page }) => {
  await openStory(page, "e2e-popover--in-modal");
  const popover = "[data-testid=popover]";
  await expect(page.locator(popover)).toHaveClass(/visible/);
  const before = await getRect(page, popover);

  await page.mouse.move(5, 5);
  await page.mouse.wheel(0, 500);
  await waitForFrames(page);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  expect((await getRect(page, popover)).top).toBeCloseTo(before.top, 0);
});
