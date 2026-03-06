import { getByTestId, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Divider from "./Divider";

describe("Divider", () => {
  it("should be rendered with only required props", () => {
    expect(render(<Divider />).container).toMatchSnapshot();
  });

  it("should be rendered as small sized as default if no size prop is given", () => {
    const { container } = render(<Divider />);
    expect(getByTestId(container, "dividerItem")).toHaveClass("md");
  });

  it("should be rendered with the size given in size prop", () => {
    const { rerender, getByTestId } = render(<Divider size="lg" />);
    expect(getByTestId("dividerItem")).toHaveClass("lg");

    rerender(<Divider size="md" />);
    expect(getByTestId("dividerItem")).toHaveClass("md");

    rerender(<Divider size="sm" />);
    expect(getByTestId("dividerItem")).toHaveClass("sm");
  });

  it("should be rendered with the correct gaps and positions depending on the orientation ", () => {
    const { rerender, getByTestId } = render(<Divider orientation="horizontal" gap="sm" />);
    expect(getByTestId("dividerItem")).toHaveClass("horizontal");
    expect(getByTestId("dividerItem")).toHaveClass("gap-sm");

    rerender(<Divider orientation="vertical" gap="sm" />);
    expect(getByTestId("dividerItem")).toHaveClass("vertical");
    expect(getByTestId("dividerItem")).toHaveClass("gap-sm");
  });

  it("should be rendered as given in orientation prop", () => {
    const { rerender, getByTestId } = render(<Divider orientation="horizontal" />);
    expect(getByTestId("dividerItem")).toHaveClass("horizontal");
    rerender(<Divider orientation="vertical" />);
    expect(getByTestId("dividerItem")).toHaveClass("vertical");
  });

  it("should be rendered as given in shape prop", () => {
    const { rerender, getByTestId } = render(<Divider shape="solid" />);
    expect(getByTestId("dividerItem")).toHaveClass("solid");
    rerender(<Divider shape="dotted" />);
    expect(getByTestId("dividerItem")).toHaveClass("dotted");
    rerender(<Divider shape="dashed" />);
    expect(getByTestId("dividerItem")).toHaveClass("dashed");
  });
});
