import { fireEvent, getByTestId, render, screen } from "@testing-library/react";
import Chip from "@/components/Chip/Chip";
import { Size4SM } from "../../types";

describe("Chip", () => {
  it("should be rendered with only required props", () => {
    expect(render(<Chip label="test" />).container).toMatchSnapshot();
  });

  it("should render icon and label together when there are both set", () => {
    render(<Chip label="test" icon="info" />);
    expect(screen.getByText("info")).toBeDefined();
    expect(screen.getByText("test")).toBeDefined();
  });

  it("should be removed when close icon is clicked", () => {
    const { container } = render(<Chip label="test" closable />);
    expect(screen.getByTestId("iconButtonTestId")).toBeDefined();
    fireEvent(screen.getByTestId("iconButtonTestId"), new MouseEvent("click", { bubbles: true }));
    expect(container.childElementCount).toBe(0);
  });

  it("should be rendered as pill when pill is set", () => {
    const { container } = render(<Chip label="test" pill />);
    expect(getByTestId(container, "chipItem")).toHaveClass("pill");
  });

  it("should be as solid shape by default", () => {
    const { container } = render(<Chip label="test" />);
    expect(getByTestId(container, "chipItem")).toHaveClass("solid");
  });

  it("should be rendered as outlined when outline prop is set", () => {
    const { container } = render(<Chip label="test" shape="outline" />);
    expect(getByTestId(container, "chipItem")).toHaveClass("outline");
  });

  it("should render with the colors of the given variant prop", () => {
    const { container } = render(<Chip label="test" variant="secondary" />);
    expect(getByTestId(container, "chipItem")).toHaveClass("secondary");
  });

  it("should be rendered with the size given in size prop", () => {
    const sizes: Size4SM[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { getByTestId, unmount } = render(<Chip label="test" size={size} />);
      expect(getByTestId("chipItem")).toHaveClass(size);
      unmount();
    });
  });

  it("should be rendered as medium sized as default if no size prop is given", () => {
    const { container } = render(<Chip label="test" />);
    expect(getByTestId(container, "chipItem")).toHaveClass("md");
  });

  it("should trigger onClose event when close icon is clicked", () => {
    const onClose = jest.fn();
    render(<Chip label="test" variant="secondary" onClose={onClose} closable />);
    fireEvent(screen.getByText("cancel"), new MouseEvent("click", { bubbles: true }));
    expect(onClose).toHaveBeenCalled();
  });
});
