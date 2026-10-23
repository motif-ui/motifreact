import { test, expect, Page } from "@playwright/test";
import { openStory } from "../../../../utils/e2eUtils";

// Behavior tests of the gaps and paddings in a real browser, on the scenes in Grid.e2e.story.tsx. The unit tests only
// check the classes, while these check what the classes and the CSS variables resolve to.

type Size = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

// Screen widths in the ranges of base (and xs), md and lg breakpoints
const viewports = { base: 500, md: 800, lg: 1100 };

const styleOf = (page: Page, selector: string, property: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el, property) => getComputedStyle(el).getPropertyValue(property), property);

const gapsOf = async (page: Page, selector: string) => ({
  column: await styleOf(page, selector, "column-gap"),
  row: await styleOf(page, selector, "row-gap"),
});

// The px value of a gap token in the current theme, so the tests do not depend on the token values
const token = (page: Page, size: Size) =>
  page.evaluate(size => {
    const probe = document.createElement("div");
    probe.style.width = `var(--theme-grid-gutter-gutter-${size})`;
    document.body.append(probe);
    const { width } = getComputedStyle(probe);
    probe.remove();
    return width;
  }, size);

const openAt = async (page: Page, story: string, width: number) => {
  await page.setViewportSize({ width, height: 800 });
  await openStory(page, `e2e-grid--${story}`);
};

test.describe("Responsive gaps", () => {
  test("applies each breakpoint to its width and above", async ({ page }) => {
    await openAt(page, "responsive-gaps", viewports.base);
    expect(await gapsOf(page, ".responsive-row")).toEqual({ column: await token(page, "sm"), row: await token(page, "sm") });

    await openAt(page, "responsive-gaps", viewports.md);
    expect(await gapsOf(page, ".responsive-row")).toEqual({ column: await token(page, "xl"), row: await token(page, "xl") });
  });

  test("gives columnGap precedence over gap, even over a bigger breakpoint of gap", async ({ page }) => {
    await openAt(page, "responsive-gaps", viewports.base);
    expect(await gapsOf(page, ".precedence-row")).toEqual({ column: await token(page, "sm"), row: await token(page, "sm") });

    await openAt(page, "responsive-gaps", viewports.md);
    expect(await gapsOf(page, ".precedence-row")).toEqual({ column: await token(page, "xs"), row: await token(page, "xl") });
  });
});

test.describe("Row gaps", () => {
  const expectations: Record<string, Record<keyof typeof viewports, Size>> = {
    // without gap props, the Row uses the gaps of its Grid
    ".inheriting-row": { base: "sm", md: "sm", lg: "xl" },
    // a base value overrides the Grid on all breakpoints
    ".base-row": { base: "xs", md: "xs", lg: "xs" },
    // below its smallest breakpoint, the Row uses the gaps of its Grid
    ".partial-row": { base: "sm", md: "xxl", lg: "xxl" },
  };

  for (const viewport of Object.keys(viewports) as (keyof typeof viewports)[]) {
    test(`resolves the gaps of the Rows on ${viewport}`, async ({ page }) => {
      await openAt(page, "row-gaps", viewports[viewport]);
      for (const [row, sizes] of Object.entries(expectations)) {
        const size = await token(page, sizes[viewport]);
        expect(await gapsOf(page, row), row).toEqual({ column: size, row: size });
      }
    });
  }
});

test.describe("Nested grids", () => {
  for (const viewport of ["base", "lg"] as const) {
    test(`keep the gaps and the padding of the outer Grid and Row out of the inner Grid on ${viewport}`, async ({ page }) => {
      await openAt(page, "nested-grids", viewports[viewport]);
      expect(await styleOf(page, ".outer-row", "column-gap")).toBe(await token(page, "lg"));
      expect(await gapsOf(page, ".inner-row")).toEqual({ column: await token(page, "xs"), row: await token(page, "xs") });
      expect(await styleOf(page, ".inner", "padding-top")).toBe(await token(page, "sm"));
    });
  }
});

test.describe("Rows nested in a Col", () => {
  for (const viewport of ["base", "lg"] as const) {
    test(`size their own cols with their own gaps, separated by the row gap of the parent Row on ${viewport}`, async ({ page }) => {
      await openAt(page, "nested-rows", viewports[viewport]);
      // the gaps of the parent Row are not inherited, the nested Row uses the gaps of the Grid
      expect(await gapsOf(page, ".nested-row")).toEqual({ column: await token(page, "sm"), row: await token(page, "sm") });
      expect(await gapsOf(page, ".second-nested-row")).toEqual({ column: await token(page, "xs"), row: await token(page, "xs") });
      expect(await styleOf(page, ".second-nested-row", "margin-top")).toBe(await token(page, "md"));
      expect(await styleOf(page, ".nested-row", "margin-top")).toBe("0px");

      const widths = await page.locator(".nested-row > *").evaluateAll(cols => cols.map(col => col.getBoundingClientRect().width));
      const gap = parseFloat(await token(page, "sm"));
      const rowWidth = await page.locator(".nested-row").evaluate(el => el.getBoundingClientRect().width);
      // the same formula as calculate-grid-flex-width in Grid.module.scss
      const colWidth = (size: number) => (rowWidth * size) / 12 - (1 - size / 12) * gap;
      expect(widths[0]).toBeCloseTo(colWidth(4), 0);
      expect(widths[1]).toBeCloseTo(colWidth(8), 0);
    });
  }
});

test.describe("Col widths", () => {
  // The cols of a row fill it exactly, without wrapping, when the col sizes add up to 12
  const expectFilledRow = async (page: Page, row: string) => {
    const layout = await page.locator(row).evaluate(el => {
      const gap = parseFloat(getComputedStyle(el).columnGap);
      const cols = [...el.children].map(col => col.getBoundingClientRect());
      return {
        tops: new Set(cols.map(col => col.top)).size,
        filled: cols.reduce((sum, col) => sum + col.width, 0) + gap * (cols.length - 1),
        width: el.getBoundingClientRect().width,
      };
    });
    expect(layout.tops, `${row} is on one line`).toBe(1);
    expect(layout.filled).toBeCloseTo(layout.width, 0);
  };

  for (const viewport of ["base", "lg"] as const) {
    test(`are calculated with the gap of their row on ${viewport}`, async ({ page }) => {
      await openAt(page, "col-widths", viewports[viewport]);
      await expectFilledRow(page, ".widest-row");
      await expectFilledRow(page, ".no-gap-row");
      await expectFilledRow(page, ".custom-row");
      expect(await styleOf(page, ".no-gap-row", "column-gap")).toBe("0px");
    });
  }

  test("use the custom values given with the public CSS variables", async ({ page }) => {
    await openAt(page, "col-widths", viewports.base);
    expect(await styleOf(page, ".custom-row", "column-gap")).toBe("30px");

    await openAt(page, "col-widths", viewports.lg);
    expect(await styleOf(page, ".custom-row", "column-gap")).toBe("120px");
  });
});

test.describe("Paddings", () => {
  for (const viewport of ["base", "lg"] as const) {
    test(`are independent of the gaps and responsive on ${viewport}`, async ({ page }) => {
      await openAt(page, "paddings", viewports[viewport]);
      expect(await styleOf(page, ".default-padding", "padding")).toBe(await token(page, "sm"));
      expect(await styleOf(page, ".responsive-padding", "padding")).toBe(await token(page, viewport === "lg" ? "xxl" : "xs"));
      expect(await styleOf(page, ".lean", "padding")).toBe("0px");
    });
  }

  test("use the custom values given with the public CSS variables, over the smaller breakpoints of the prop", async ({ page }) => {
    await openAt(page, "paddings", viewports.base);
    expect(await styleOf(page, ".custom-padding", "padding")).toBe(await token(page, "lg"));

    await openAt(page, "paddings", viewports.md);
    expect(await styleOf(page, ".custom-padding", "padding")).toBe("120px");
  });
});

test("stretchItems makes the contents of the cols in the same row equal in height", async ({ page }) => {
  await openAt(page, "stretch-items", viewports.lg);
  const heights = await page.locator(".stretch-row .item").evaluateAll(items => items.map(item => item.getBoundingClientRect().height));
  expect(heights[0]).toBeGreaterThan(0);
  expect(heights[0]).toBeCloseTo(heights[1], 0);
});
