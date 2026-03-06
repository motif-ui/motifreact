import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import InputPassword from "./InputPassword";
import { InputSize } from "../Form/types";

describe("InputPassword", () => {
  it("should be rendered with only required props", () => {
    expect(render(<InputPassword />).container).toMatchSnapshot();
  });

  it("should display given value when value prop is given", () => {
    const value = "Entered Text";
    render(<InputPassword value={value} />);
    expect(screen.getByDisplayValue(value));
  });

  it("should be rendered with the size given in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    for (const size of sizes) {
      const { container } = render(<InputPassword size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
    }
  });

  it("triggers onChange callback when value is changed", async () => {
    const handleChange = jest.fn();
    const value = "Entered Text";
    const user = userEvent.setup();
    render(<InputPassword onChange={handleChange} value="" />);
    const input = screen.getByTestId("inputPassword").querySelector("input");
    await user.type(input!, value);

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue(value);
  });

  it("should reveal the password when the visibility icon is clicked.", async () => {
    const { getByTestId, getByRole } = render(<InputPassword toggleMask />);
    const input = getByTestId("inputPassword").querySelector("input");
    const button = getByRole("button");
    const user = userEvent.setup();

    expect(input).toHaveAttribute("type", "password");

    await user.click(button);
    expect(input).toHaveAttribute("type", "text");

    await user.click(button);
    expect(input).toHaveAttribute("type", "password");
  });

  it("should be rendered as disabled when disabled prop is given", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    const value = "Entered Text";
    render(<InputPassword onChange={handleChange} value={value} disabled />);
    const input = screen.getByDisplayValue(value);
    await user.type(input, "Test");

    expect(handleChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(value);
    expect(input).toHaveAttribute("disabled");
    expect(screen.getByTestId("inputPassword")).toHaveClass("disabled");
  });

  it("should be rendered as readOnly when readOnly prop is given", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    const value = "Entered Text";
    render(<InputPassword onChange={handleChange} value={value} readOnly />);
    const input = screen.getByDisplayValue(value);
    await user.type(input, "Test");

    expect(handleChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(value);
    expect(input).toHaveAttribute("readonly");
    expect(screen.getByTestId("inputPassword")).toHaveClass("disabled");
  });

  it("should render icon when icon is set", () => {
    const { getByText } = render(<InputPassword icon="check" />);
    expect(getByText("check")).toBeInTheDocument();
  });

  it("should be rendered as success variant when success prop is given", () => {
    render(<InputPassword success />);
    expect(screen.getByTestId("inputPassword")).toHaveClass("success");
  });

  it("should be rendered as error variant when error prop is given", () => {
    render(<InputPassword error />);
    expect(screen.getByTestId("inputPassword")).toHaveClass("error");
  });

  it("should not render the visibility toggle button when toggleMask is not given", () => {
    render(<InputPassword />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("should render in a pill shape when pill prop is true", () => {
    const { getByTestId } = render(<InputPassword pill />);
    expect(getByTestId("inputPassword")).toHaveClass("pill");
  });
});
