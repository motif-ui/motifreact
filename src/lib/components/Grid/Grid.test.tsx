import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Grid } from "../../index";
import { Size4SM } from "../../types";
describe("Grid", () => {
  it("should render with only required props", () => {
    expect(
      render(
        <Grid>
          <Grid.Row>
            <Grid.Col />
          </Grid.Row>
        </Grid>,
      ).container,
    ).toMatchSnapshot();
  });

  it("should be rendered with the given size in gutter prop", () => {
    const gutterSizes: Size4SM[] = ["xs", "sm", "md", "lg"];

    gutterSizes.forEach(size => {
      const { container } = render(
        <Grid gutter={size}>
          <Grid.Row>
            <Grid.Col />
          </Grid.Row>
        </Grid>,
      );
      expect(container.firstChild).toHaveClass(`gutter-${size}`);
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
  it("should align items accordingly if justifyCols prop is set", async () => {
    render(
      <Grid>
        <Grid.Row justifyCols="center">
          <Grid.Col />
        </Grid.Row>
      </Grid>,
    );
    expect(await screen.findByTestId("grid-row")).toHaveClass("center");
    expect(await screen.findByTestId("grid-row")).not.toHaveClass("left");
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
          <Grid.Col size={12} sm={10} md={8} lg={6} xl={3}>
            Column
          </Grid.Col>
        </Grid.Row>
      </Grid>,
    );
    expect(container.querySelector(".col-size-12")).toBeInTheDocument();
    expect(container.querySelector(".col-xl-3")).toBeInTheDocument();
    expect(container.querySelector(".col-lg-6")).toBeInTheDocument();
    expect(container.querySelector(".col-md-8")).toBeInTheDocument();
    expect(container.querySelector(".col-sm-10")).toBeInTheDocument();
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
});
