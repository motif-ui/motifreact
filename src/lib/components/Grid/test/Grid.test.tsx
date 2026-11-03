import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Grid } from "../../../index.ts";
import type { GapProps, GridSpacing } from "../types.ts";
import { runSnapshotDefaultsAndStandardPropsTest } from "../../../../utils/testUtils.tsx";
import { StandardPropsWithRef } from "../../../types.ts";

// The tests below check the classes only. How the classes resolve to the gaps and paddings is tested in a real browser,
// see test/Grid.e2e.spec.ts

const DEFAULT_GAP = "sm";

const gapClassesOf = (element: Element) => [...element.classList].filter(cls => /^(row-|column-)?gap-/.test(cls)).sort();
const paddingClassesOf = (element: Element) => [...element.classList].filter(cls => cls.startsWith("padding-")).sort();

type SpacingProps = GapProps & { padding?: GridSpacing; gutter?: "lg" };

const renderGrid = (gridProps: SpacingProps = {}, rowProps: GapProps = {}) => {
  const { container, unmount } = render(
    <Grid {...gridProps}>
      <Grid.Row {...rowProps}>
        <Grid.Col />
      </Grid.Row>
    </Grid>,
  );
  const grid = container.firstChild as Element;
  const row = screen.getByTestId("grid-row");
  const classes = { gap: gapClassesOf(grid), padding: paddingClassesOf(grid), rowGap: gapClassesOf(row) };
  unmount();
  return classes;
};

describe("Grid", () => {
  runSnapshotDefaultsAndStandardPropsTest(
    (props: StandardPropsWithRef<HTMLDivElement>) =>
      render(
        <Grid {...props}>
          <Grid.Row>
            <Grid.Col />
          </Grid.Row>
        </Grid>,
      ),
    {
      assertDefaults: ({ container }) => {
        expect(gapClassesOf(container.firstChild as Element)).toEqual([`gap-${DEFAULT_GAP}`]);
        expect(paddingClassesOf(container.firstChild as Element)).toEqual([`padding-${DEFAULT_GAP}`]);
      },
    },
  );

  it("should render gap classes for each breakpoint based on gap, rowGap, columnGap props", () => {
    expect(renderGrid({ gap: "md" }).gap).toEqual(["gap-md"]);
    expect(renderGrid({ gap: { base: "xs", mdUp: "lg", xxlUp: "xxl" } }).gap).toEqual(["gap-md-lg", "gap-xs", "gap-xxl-xxl"]);
    expect(renderGrid({ gap: "md", rowGap: { lgUp: "xl" }, columnGap: "xs" }).gap).toEqual(["column-gap-xs", "gap-md", "row-gap-lg-xl"]);
    expect(renderGrid({ gap: "none", rowGap: { mdUp: "none" } }).gap).toEqual(["gap-none", "row-gap-md-none"]);
  });

  it("should render padding classes for each breakpoint independent of gaps", () => {
    expect(renderGrid({ padding: "xl" }).padding).toEqual(["padding-xl"]);
    expect(renderGrid({ padding: { base: "none", lgUp: "xxl" } }).padding).toEqual(["padding-lg-xxl", "padding-none"]);
    expect(renderGrid({ gap: "xl" }).padding).toEqual([`padding-${DEFAULT_GAP}`]);
  });

  it("should use the deprecated gutter as the base gap and padding when they have no base value", () => {
    expect(renderGrid({ gutter: "lg" })).toMatchObject({ gap: ["gap-lg"], padding: ["padding-lg"] });
    expect(renderGrid({ gutter: "lg", gap: "sm", padding: "xs" })).toMatchObject({ gap: ["gap-sm"], padding: ["padding-xs"] });
    expect(renderGrid({ gutter: "lg", gap: { mdUp: "xl" }, padding: { mdUp: "xs" } })).toMatchObject({
      gap: ["gap-lg", "gap-md-xl"],
      padding: ["padding-lg", "padding-md-xs"],
    });
    expect(renderGrid({ gap: { mdUp: "xl" } }).gap).toEqual(["gap-md-xl", `gap-${DEFAULT_GAP}`]);
    expect(renderGrid({ gutter: "lg", rowGap: "xs" }).gap).toEqual(["gap-lg", "row-gap-xs"]);
  });

  it("should fill the container when fluid prop is true", () => {
    const { container } = render(
      <Grid fluid>
        <Grid.Row>
          <Grid.Col />
        </Grid.Row>
      </Grid>,
    );
    expect(container.firstChild).toHaveClass("fluid");
  });

  it("should remove the padding around when leanToEdge is true", () => {
    const { container } = render(
      <Grid leanToEdge>
        <Grid.Row>
          <Grid.Col>Padded Col</Grid.Col>
        </Grid.Row>
      </Grid>,
    );
    expect(container.firstChild).toHaveClass("leanToEdge");
  });
});

describe("Row", () => {
  it("should align items accordingly if justifyCols prop is set", () => {
    const justifyCols = ["start", "center", "end", "evenly", "apart"] as const;

    justifyCols.forEach(justify => {
      const { unmount } = render(
        <Grid>
          <Grid.Row justifyCols={justify}>
            <Grid.Col />
          </Grid.Row>
        </Grid>,
      );
      const row = screen.getByTestId("grid-row");
      expect(row).toHaveClass(justify);
      unmount();
    });
  });

  it("should render the cols width the width of their contents when colsAuto is set true", async () => {
    render(
      <Grid>
        <Grid.Row colsAuto>
          <Grid.Col />
        </Grid.Row>
      </Grid>,
    );
    expect(await screen.findByTestId("grid-row")).toHaveClass("colsAuto");
  });

  it("should stretch the content of the cols when stretchItems is set true", () => {
    render(
      <Grid>
        <Grid.Row stretchItems>
          <Grid.Col />
        </Grid.Row>
      </Grid>,
    );
    expect(screen.getByTestId("grid-row")).toHaveClass("stretchItems");
  });

  it("should render gap classes for each breakpoint based on gap, rowGap, columnGap props, and none without them", () => {
    expect(renderGrid({ gap: "md" }).rowGap).toEqual([]);
    expect(renderGrid({ gap: "md" }, { gap: "xl" }).rowGap).toEqual(["gap-xl"]);
    expect(renderGrid({ gap: "md" }, { gap: { mdUp: "xl" } }).rowGap).toEqual(["gap-md-xl"]);
    expect(renderGrid({ gap: "md" }, { rowGap: "lg", columnGap: { base: "xs", lgUp: "xxl" } }).rowGap).toEqual([
      "column-gap-lg-xxl",
      "column-gap-xs",
      "row-gap-lg",
    ]);
  });

  it("should apply className and style", () => {
    render(
      <Grid>
        <Grid.Row className="custom-row" style={{ color: "red" }}>
          <Grid.Col />
        </Grid.Row>
      </Grid>,
    );
    const row = screen.getByTestId("grid-row");
    expect(row).toHaveClass("row", "custom-row");
    expect(row).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });
});

describe("Col", () => {
  it("should apply different classes based on screen size", () => {
    const { container } = render(
      <Grid>
        <Grid.Row>
          <Grid.Col size={12} xs={6} sm={10} md={8} lg={6} xl={3} xxl={6}>
            Column
          </Grid.Col>
        </Grid.Row>
      </Grid>,
    );
    expect(container.querySelector(".col-size-12")).toBeInTheDocument();
    expect(container.querySelector(".col-xxl-6")).toBeInTheDocument();
    expect(container.querySelector(".col-xl-3")).toBeInTheDocument();
    expect(container.querySelector(".col-lg-6")).toBeInTheDocument();
    expect(container.querySelector(".col-md-8")).toBeInTheDocument();
    expect(container.querySelector(".col-sm-10")).toBeInTheDocument();
    expect(container.querySelector(".col-xs-6")).toBeInTheDocument();
  });

  it("should fill the width of [size prop] / 12", () => {
    const { getByText } = render(
      <Grid>
        <Grid.Row>
          <Grid.Col size={2}>Size-2</Grid.Col>
          <Grid.Col size={10}>Size-10</Grid.Col>
        </Grid.Row>
      </Grid>,
    );
    expect(getByText("Size-2").parentElement).toHaveClass("col-size-2");
    expect(getByText("Size-10").parentElement).toHaveClass("col-size-10");
  });
});
