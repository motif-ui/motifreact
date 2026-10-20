import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Grid } from "../../index";
import type { Size7 } from "../../types";
import { runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { StandardPropsWithRef } from "../../../lib/types";

const DEFAULT_GUTTER = "sm";

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
        expect(container.firstChild).toHaveClass(`gutter-x-${DEFAULT_GUTTER}`);
        expect(container.firstChild).toHaveClass(`gutter-y-${DEFAULT_GUTTER}`);
      },
    },
  );

  it("should render with gutter-x and gutter-y classes based on gutter, gutterX, gutterY props", () => {
    const gutterSizes: Size7[] = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"];

    const child = (
      <Grid.Row>
        <Grid.Col />
      </Grid.Row>
    );

    gutterSizes.forEach(size => {
      const { container: c1 } = render(<Grid gutter={size}>{child}</Grid>);
      expect(c1.firstChild).toHaveClass(`gutter-x-${size}`);
      expect(c1.firstChild).toHaveClass(`gutter-y-${size}`);

      const { container: c2 } = render(<Grid gutterX={size}>{child}</Grid>);
      expect(c2.firstChild).toHaveClass(`gutter-x-${size}`);
      expect(c2.firstChild).toHaveClass(`gutter-y-${DEFAULT_GUTTER}`);

      const { container: c3 } = render(<Grid gutterY={size}>{child}</Grid>);
      expect(c3.firstChild).toHaveClass(`gutter-x-${DEFAULT_GUTTER}`);
      expect(c3.firstChild).toHaveClass(`gutter-y-${size}`);

      const { container: c4 } = render(
        <Grid gutterX={size} gutterY={size}>
          {child}
        </Grid>,
      );
      expect(c4.firstChild).toHaveClass(`gutter-x-${size}`);
      expect(c4.firstChild).toHaveClass(`gutter-y-${size}`);
    });
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
  it("should apply independent gutter classes to outer and inner grids", () => {
    const { container } = render(
      <Grid gutterX="md" gutterY="md">
        <Grid.Row>
          <Grid.Col md={8}>
            <Grid gutterX="xs" gutterY="xs">
              <Grid.Row>
                <Grid.Col md={6}>inner</Grid.Col>
              </Grid.Row>
            </Grid>
          </Grid.Col>
          <Grid.Col md={4}>outer</Grid.Col>
        </Grid.Row>
      </Grid>,
    );

    const grids = container.querySelectorAll("[class*='Root']");
    const outerGrid = grids[0];
    const innerGrid = grids[1];

    expect(outerGrid).toHaveClass("gutter-x-md");
    expect(outerGrid).toHaveClass("gutter-y-md");
    expect(innerGrid).toHaveClass("gutter-x-xs");
    expect(innerGrid).toHaveClass("gutter-y-xs");
    expect(innerGrid).not.toHaveClass("gutter-x-md");
  });

  it("should render outer and inner col size classes at the correct nesting level", () => {
    const { container } = render(
      <Grid gutterX="md">
        <Grid.Row>
          <Grid.Col md={8}>
            <Grid gutterX="xs">
              <Grid.Row>
                <Grid.Col md={6}>inner</Grid.Col>
              </Grid.Row>
            </Grid>
          </Grid.Col>
          <Grid.Col md={4}>outer</Grid.Col>
        </Grid.Row>
      </Grid>,
    );

    const outerGrid = container.querySelector("[class*='Root'][class*='gutter-x-md']")!;
    const innerGrid = container.querySelector("[class*='Root'][class*='gutter-x-xs']")!;

    expect(outerGrid.querySelector(".col-md-8")).toBeInTheDocument();
    expect(outerGrid.querySelector(".col-md-4")).toBeInTheDocument();
    expect(innerGrid.querySelector(".col-md-6")).toBeInTheDocument();
    expect(innerGrid.querySelector(".col-md-8")).not.toBeInTheDocument();
  });
});
