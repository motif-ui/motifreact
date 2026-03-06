import { fireEvent, render, screen } from "@testing-library/react";
import Radio from "@/components/Radio/Radio";
import { InputSize } from "../Form/types";
import { userEvent } from "@testing-library/user-event";

describe("Radio", () => {
  it("should be rendered with only required props", () => {
    expect(render(<Radio value="val" />).container).toMatchSnapshot();
  });

  it("should display label when label prop is given", () => {
    render(<Radio label="Radio" value="radio" />);
    expect(screen.queryByText("Radio")).toBeInTheDocument();
  });

  it("should be checked when checked prop is true", () => {
    const { getByRole } = render(<Radio value="radio" checked />);
    expect(getByRole("radio")).toBeChecked();
  });

  it("should be disabled when disabled prop is given", () => {
    render(<Radio value="radio" disabled />);
    expect(screen.queryByRole("radio")).toBeDisabled();
    expect(screen.queryByRole("radio")?.parentElement).toHaveClass("disabled");
  });
  it("should be readOnly when readOnly prop is given", async () => {
    const handleChange = jest.fn();
    const { getByRole } = render(<Radio value="radio" readOnly onChange={handleChange} />);
    const radio = getByRole("radio");
    await userEvent.click(radio);
    expect(handleChange).not.toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("radio")).not.toBeChecked();
    expect(screen.queryByRole("radio")?.parentElement).toHaveClass("disabled");
  });

  it("should display error by error prop", () => {
    const { container } = render(<Radio value="radio" error />);
    expect(container.firstChild).toHaveClass("error");
  });

  it("should be rendered as success variant when success prop is true", () => {
    const { container } = render(<Radio value="radio" success />);
    expect(container.firstChild).toHaveClass("success");
  });

  it("should fire onChange event when clicked", () => {
    const handleChange = jest.fn();
    const { getByRole } = render(<Radio value="radio" onChange={handleChange} />);
    const radio = getByRole("radio");
    expect(radio).not.toBeChecked();
    fireEvent.click(radio);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(radio).toBeChecked();
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { getByTestId, unmount } = render(<Radio value="radio" size={size} />);
      expect(getByTestId("radioItem")).toHaveClass(size);
      unmount();
    });
  });
});
