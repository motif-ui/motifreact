import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import InputNumber from "@/components/InputNumber/InputNumber.tsx";
import { InputSize } from "@/components/Form/types.ts";

describe("InputNumber", () => {
  it("should render with only required props", () => {
    expect(render(<InputNumber />).container).toMatchSnapshot();

    const input = screen.getByRole("textbox");

    // Spinner buttons
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();

    // No decimals allowed
    fireEvent.change(input, { target: { value: "3.5" } });
    expect(input).toHaveValue("35");
  });

  it("should display given value when value prop is given", () => {
    render(<InputNumber value={42} />);
    expect(screen.getByRole("textbox")).toHaveValue("42");
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    sizes.forEach(size => {
      const { container, unmount } = render(<InputNumber size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
      unmount();
    });
  });

  it("should render in a pill shape when pill prop is given", () => {
    render(<InputNumber pill />);
    expect(screen.getByTestId("inputItem")).toHaveClass("pill");
  });

  it("should be rendered as disabled when disabled prop is given", () => {
    render(<InputNumber disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByTestId("inputItem")).toHaveClass("disabled");
    expect(screen.getByText("+")).toBeDisabled();
    expect(screen.getByText("-")).toBeDisabled();
  });

  it("should be rendered as readOnly when readOnly prop is given", () => {
    render(<InputNumber readOnly />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    expect(screen.getByText("+")).toBeDisabled();
    expect(screen.getByText("-")).toBeDisabled();
  });

  it("should render icons when iconLeft and iconRight props are given", () => {
    const { rerender } = render(<InputNumber iconLeft="home" />);
    expect(screen.getByText("home")).toBeInTheDocument();

    rerender(<InputNumber iconRight="person" />);
    expect(screen.getByText("person")).toBeInTheDocument();

    rerender(<InputNumber iconLeft="home" iconRight="person" />);
    expect(screen.getByText("home")).toBeInTheDocument();
    expect(screen.getByText("person")).toBeInTheDocument();
  });

  it("should show the clear button when clearable prop and value is given", () => {
    render(<InputNumber value={1} clearable />);
    expect(screen.getByTestId("iconButtonTestId")).toBeInTheDocument();
  });

  it("should clear the value when the clear button is clicked", async () => {
    render(<InputNumber clearable value={50} />);
    await userEvent.click(screen.getByTestId("iconButtonTestId"));
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("should not show spinner buttons when removeSpinner prop is given", () => {
    render(<InputNumber removeSpinner />);
    expect(screen.queryByText("+")).not.toBeInTheDocument();
    expect(screen.queryByText("-")).not.toBeInTheDocument();
  });

  it("should call onChange with the typed value as a number", () => {
    const handleChange = jest.fn();
    render(<InputNumber onChange={handleChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "42" } });
    expect(handleChange).toHaveBeenCalledWith(42);
  });

  it("should call onChange with undefined when the field is cleared", () => {
    const handleChange = jest.fn();
    render(<InputNumber onChange={handleChange} value={5} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });
    expect(handleChange).toHaveBeenCalledWith(undefined);
  });

  it("should filter out non-numeric characters", () => {
    render(<InputNumber />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input).toHaveValue("");
  });

  it("should reject a fully invalid paste and preserve the previous value", () => {
    render(<InputNumber value={25} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "xxx" } });
    expect(input).toHaveValue("25");
  });

  it("should only allow decimals when allowDecimals prop is given", () => {
    const { rerender } = render(<InputNumber />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "3.5" } });
    expect(input).toHaveValue("35");

    rerender(<InputNumber allowDecimals />);
    fireEvent.change(input, { target: { value: "3.5" } });
    expect(input).toHaveValue("3.5");
  });

  it("should only allow one decimal point when allowDecimals is given", () => {
    render(<InputNumber allowDecimals removeSpinner />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "3.5.2" } });
    expect(input).toHaveValue("3.5");
  });

  it("should filter out the minus sign by default", () => {
    render(<InputNumber removeSpinner />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "-5" } });
    expect(input).toHaveValue("5");
  });

  it("should only allow negative values when allowNegative prop is given", () => {
    render(<InputNumber allowNegative removeSpinner />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "-5" } });
    expect(input).toHaveValue("-5");
  });

  it("should delete digits beyond decimalScale when allowDecimals is given", () => {
    render(<InputNumber allowDecimals decimalScale={2} removeSpinner />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "3.141" } });
    expect(input).toHaveValue("3.14");
  });

  it("should enforce maxLength on typed input", () => {
    render(<InputNumber maxLength={3} removeSpinner />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "12345" } });
    expect(input).toHaveValue("123");
  });

  it("should reject typed values that exceed max", () => {
    const handleChange = jest.fn();
    render(<InputNumber max={80} onChange={handleChange} removeSpinner />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "90" } });
    expect(handleChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("");
  });

  it("should keep an empty field empty on blur even when min is defined", () => {
    render(<InputNumber min={20} />);
    const input = screen.getByRole("textbox");
    fireEvent.blur(input);
    expect(input).toHaveValue("");
  });

  it("should clamp to min on blur when the typed value is below min", () => {
    render(<InputNumber min={20} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.blur(input);
    expect(input).toHaveValue("20");
  });

  it("should clamp to max on blur when the value exceeds max", () => {
    render(<InputNumber max={80} value={90} />);
    const input = screen.getByRole("textbox");
    fireEvent.blur(input);
    expect(input).toHaveValue("80");
  });

  it("should clear a single minus sign to empty on blur", () => {
    render(<InputNumber allowNegative />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "-" } });
    fireEvent.blur(input);
    expect(input).toHaveValue("");
  });

  it("should strip a trailing decimal point on blur", () => {
    render(<InputNumber allowDecimals />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "45." } });
    fireEvent.blur(input);
    expect(input).toHaveValue("45");
  });

  it("should increment the value by 1 when the + button is clicked", () => {
    render(<InputNumber value={5} />);
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByRole("textbox")).toHaveValue("6");
  });

  it("should decrement the value by 1 when the - button is clicked", () => {
    render(<InputNumber value={5} />);
    fireEvent.click(screen.getByText("-"));
    expect(screen.getByRole("textbox")).toHaveValue("4");
  });

  it("should increment and decrement by the given step value", () => {
    render(<InputNumber value={5} step={0.5} allowDecimals />);
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByRole("textbox")).toHaveValue("5.5");
    fireEvent.click(screen.getByText("-"));
    expect(screen.getByRole("textbox")).toHaveValue("5");
  });

  it("should not decrement below 0 when allowNegative is not set", () => {
    render(<InputNumber value={0} />);
    fireEvent.click(screen.getByText("-"));
    expect(screen.getByRole("textbox")).toHaveValue("0");
  });

  it("should not decrement below the min", () => {
    render(<InputNumber min={3} value={3} />);
    fireEvent.click(screen.getByText("-"));
    expect(screen.getByRole("textbox")).toHaveValue("3");
  });

  it("should not increment above the max", () => {
    render(<InputNumber max={10} value={10} />);
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByRole("textbox")).toHaveValue("10");
  });
});
