import "@testing-library/jest-dom";
import Switch from "@/components/Switch/Switch";
import { fireEvent, render, screen } from "@testing-library/react";
import { InputSize } from "../Form/types";
import { userEvent } from "@testing-library/user-event";

describe("Switch", () => {
  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container } = render(<Switch />);
    expect(container).toMatchSnapshot();

    // size: md
    expect(container.firstElementChild).toHaveClass("md");
  });

  it("should display label when label prop is given", () => {
    render(<Switch label="This Is Switch Label" />);
    expect(screen.getByText("This Is Switch Label")).toBeInTheDocument();
  });

  it("should be rendered as switch-on when selected prop is given", () => {
    const { container } = render(<Switch checked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(container.firstChild).toHaveClass("checked");
  });

  it("should be rendered as disabled when disabled prop is given", () => {
    const { container } = render(<Switch label="label" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(container.firstChild).toHaveClass("disabled");
    expect(container.firstChild).not.toHaveClass("checked");
    fireEvent.mouseDown(screen.getByTestId("switchSliderItem"));
    fireEvent.mouseUp(screen.getByTestId("switchSliderItem"));
    expect(container.firstChild).not.toHaveClass("checked");
    screen.getByText("label").click(); // label
    expect(container.firstChild).not.toHaveClass("checked");
  });

  it("should be rendered as readOnly when readOnly prop is given", async () => {
    const { container } = render(<Switch label="label" readOnly />);
    expect(container.firstChild).toHaveClass("disabled");
    await userEvent.click(screen.getByTestId("switchSliderItem"));
    expect(container.firstChild).not.toHaveClass("checked");
    screen.getByText("label").click(); // label
    expect(container.firstChild).not.toHaveClass("checked");
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { container, unmount } = render(<Switch size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
      unmount();
    });
  });
});
