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

// The px value of a length variable in the current theme, so the tests do not depend on the token values
const lengthOf = (page: Page, variable: string) =>
  page.evaluate(variable => {
    const probe = document.createElement("div");
    probe.style.width = `var(${variable})`;
    document.body.append(probe);
    const { width } = getComputedStyle(probe);
    probe.remove();
    return width;
  }, variable);

// The px value of a gap token
const token = (page: Page, size: Size) => lengthOf(page, `--theme-grid-gutter-gutter-${size}`);

const rectsOf = (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els =>
    els.map(el => {
      const { top, bottom, left, right, width } = el.getBoundingClientRect();
      return { top, bottom, left, right, width };
    }),
  );

// The expected width of a col of the given size, with the same formula as calculate-grid-flex-width in Grid.module.scss
const expectedColWidth = async (page: Page, row: string, size: number) => {
  const { width, gap } = await page.locator(row).evaluate(el => ({
    width: el.getBoundingClientRect().width,
    gap: parseFloat(getComputedStyle(el).columnGap),
  }));
  return (width * size) / 12 - (1 - size / 12) * gap;
};

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

test.describe("Responsive col sizes", () => {
  const expectSizes = async (page: Page, row: string, sizes: number[], lines: number) => {
    const rects = await rectsOf(page, `${row} > *`);
    expect(new Set(rects.map(rect => rect.top)).size, `${row} is on ${lines} line(s)`).toBe(lines);
    for (const [i, size] of sizes.entries()) {
      expect(rects[i].width, `col ${i + 1} of ${row}`).toBeCloseTo(await expectedColWidth(page, row, size), 0);
    }
  };

  test("use size below their smallest breakpoint", async ({ page }) => {
    await openAt(page, "responsive-cols", viewports.base);
    await expectSizes(page, ".responsive-cols-row", [12, 12, 12], 3);
  });

  test("apply each breakpoint to its width and above, over size", async ({ page }) => {
    await openAt(page, "responsive-cols", viewports.md);
    await expectSizes(page, ".responsive-cols-row", [6, 6, 6], 2);

    await openAt(page, "responsive-cols", viewports.lg);
    await expectSizes(page, ".responsive-cols-row", [4, 4, 4], 1);
  });

  test("apply xs from its breakpoint", async ({ page }) => {
    await openAt(page, "responsive-cols", viewports.base);
    await expectSizes(page, ".xs-cols-row", [6, 6], 1);
  });

  for (const viewport of ["base", "lg"] as const) {
    test(`let a col without a size fill the rest of the row on ${viewport}`, async ({ page }) => {
      await openAt(page, "responsive-cols", viewports[viewport]);
      const [sized, filling] = await rectsOf(page, ".filling-row > *");
      const row = (await rectsOf(page, ".filling-row"))[0];
      expect(sized.width).toBeCloseTo(await expectedColWidth(page, ".filling-row", 4), 0);
      expect(sized.top).toBe(filling.top);
      expect(filling.right).toBeCloseTo(row.right, 0);
    });
  }
});

test("Cols wrap onto a new line when their sizes add up to more than 12, separated by the row gap", async ({ page }) => {
  await openAt(page, "wrapping", viewports.lg);
  const rects = await rectsOf(page, ".wrapping-row > *");
  expect(rects[0].top).toBe(rects[1].top);
  expect(rects[1].left - rects[0].right).toBeCloseTo(parseFloat(await token(page, "xs")), 0);
  expect(rects[2].top - rects[0].bottom).toBeCloseTo(parseFloat(await token(page, "lg")), 0);
  for (const rect of rects) expect(rect.width).toBeCloseTo(await expectedColWidth(page, ".wrapping-row", 6), 0);
});

test.describe("justifyCols", () => {
  // The space before the first col, between the cols (without the gap) and after the last col
  const spacesOf = async (page: Page, justify: string) => {
    const row = `.justify-${justify}`;
    const [rowRect] = await rectsOf(page, row);
    const [first, second] = await rectsOf(page, `${row} > *`);
    const gap = parseFloat(await styleOf(page, row, "column-gap"));
    expect(first.top, `${row} is on one line`).toBe(second.top);
    return { before: first.left - rowRect.left, between: second.left - first.right - gap, after: rowRect.right - second.right };
  };

  test.beforeEach(async ({ page }) => {
    await openAt(page, "justify-cols", viewports.lg);
  });

  test("start puts the cols at the start of the row", async ({ page }) => {
    const spaces = await spacesOf(page, "start");
    expect(spaces.before).toBeCloseTo(0, 0);
    expect(spaces.between).toBeCloseTo(0, 0);
    expect(spaces.after).toBeGreaterThan(0);
  });

  test("end puts the cols at the end of the row", async ({ page }) => {
    const spaces = await spacesOf(page, "end");
    expect(spaces.before).toBeGreaterThan(0);
    expect(spaces.between).toBeCloseTo(0, 0);
    expect(spaces.after).toBeCloseTo(0, 0);
  });

  test("center puts the cols in the middle of the row", async ({ page }) => {
    const spaces = await spacesOf(page, "center");
    expect(spaces.before).toBeGreaterThan(0);
    expect(spaces.between).toBeCloseTo(0, 0);
    expect(spaces.before).toBeCloseTo(spaces.after, 0);
  });

  test("apart puts the free space between the cols", async ({ page }) => {
    const spaces = await spacesOf(page, "apart");
    expect(spaces.before).toBeCloseTo(0, 0);
    expect(spaces.between).toBeGreaterThan(0);
    expect(spaces.after).toBeCloseTo(0, 0);
  });

  test("evenly puts equal spaces around the cols", async ({ page }) => {
    const spaces = await spacesOf(page, "evenly");
    expect(spaces.before).toBeGreaterThan(0);
    expect(spaces.between).toBeCloseTo(spaces.before, 0);
    expect(spaces.after).toBeCloseTo(spaces.before, 0);
  });
});

test("colsAuto sizes the cols without a size by their contents instead of sharing the row equally", async ({ page }) => {
  await openAt(page, "cols-auto", viewports.lg);
  const equal = await rectsOf(page, ".equal-row > *");
  expect(equal[0].width).toBeCloseTo(equal[1].width, 0);

  const auto = await rectsOf(page, ".auto-row > *");
  const [row] = await rectsOf(page, ".auto-row");
  expect(auto[0].width).toBeLessThan(auto[1].width);
  expect(auto[1].right).toBeLessThan(row.right);
});

test.describe("Container widths", () => {
  const containerSizes = { base: "xs", md: "md", lg: "lg" } as const;

  for (const viewport of Object.keys(viewports) as (keyof typeof viewports)[]) {
    test(`limit the width of a Grid that is not fluid and center it on ${viewport}`, async ({ page }) => {
      await openAt(page, "containers", viewports[viewport]);
      const [grid] = await rectsOf(page, ".container");
      const [parent] = await rectsOf(page, "#storybook-root");
      expect(grid.width).toBeCloseTo(parseFloat(await lengthOf(page, `--theme-grid-container-${containerSizes[viewport]}`)), 0);
      expect(grid.left - parent.left).toBeCloseTo(parent.right - grid.right, 0);

      const [fluid] = await rectsOf(page, ".fluid");
      expect(fluid.width).toBeCloseTo(parent.width, 0);
    });
  }
});

test.describe("Deprecated gutter", () => {
  test("sets both the gaps and the padding", async ({ page }) => {
    await openAt(page, "gutter", viewports.base);
    const lg = await token(page, "lg");
    expect(await gapsOf(page, ".gutter-row")).toEqual({ column: lg, row: lg });
    expect(await styleOf(page, ".gutter", "row-gap")).toBe(lg);
    expect(await styleOf(page, ".gutter", "padding")).toBe(lg);
  });

  test("is overridden by gap and padding, and remains as the base value of a responsive gap", async ({ page }) => {
    await openAt(page, "gutter", viewports.base);
    const lg = await token(page, "lg");
    expect(await gapsOf(page, ".gutter-overridden-row")).toEqual({ column: lg, row: lg });
    expect(await styleOf(page, ".gutter-overridden", "padding")).toBe(await token(page, "xs"));

    await openAt(page, "gutter", viewports.md);
    const xl = await token(page, "xl");
    expect(await gapsOf(page, ".gutter-overridden-row")).toEqual({ column: xl, row: xl });
    expect(await styleOf(page, ".gutter-overridden", "padding")).toBe(await token(page, "xs"));
  });

  for (const viewport of ["base", "lg"] as const) {
    test(`of a Grid stays out of the Grids nested in it on ${viewport}`, async ({ page }) => {
      await openAt(page, "nested-gutters", viewports[viewport]);
      const [xs, sm] = [await token(page, "xs"), await token(page, "sm")];
      const outer = await token(page, viewport === "lg" ? "xl" : "md");

      expect(await gapsOf(page, ".outer-gutter-row")).toEqual({ column: outer, row: outer });
      expect(await styleOf(page, ".outer-gutter", "padding")).toBe(outer);
      // a nested Grid with its own gutter uses it, and one without uses the default instead of the outer gutter
      expect(await gapsOf(page, ".inner-gutter-row")).toEqual({ column: xs, row: xs });
      expect(await styleOf(page, ".inner-gutter", "padding")).toBe(xs);
      expect(await gapsOf(page, ".inner-default-row")).toEqual({ column: sm, row: sm });
      expect(await styleOf(page, ".inner-default", "padding")).toBe(sm);

      // the cols of each Grid are sized with the gap of their own Row
      for (const row of [".inner-gutter-row", ".inner-default-row"]) {
        for (const rect of await rectsOf(page, `${row} > *`)) expect(rect.width).toBeCloseTo(await expectedColWidth(page, row, 6), 0);
      }
      if (viewport === "lg") {
        const [wide, narrow] = await rectsOf(page, ".outer-gutter-row > *");
        expect(wide.top).toBe(narrow.top);
        expect(wide.width).toBeCloseTo(await expectedColWidth(page, ".outer-gutter-row", 8), 0);
        expect(narrow.width).toBeCloseTo(await expectedColWidth(page, ".outer-gutter-row", 4), 0);
      }
    });
  }
});
