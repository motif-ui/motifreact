import { render, screen } from "@testing-library/react";
import InputText from "@/components/InputText/InputText";
import { userEvent } from "@testing-library/user-event";
import { InputSize } from "../Form/types";
import Icon from "@/components/Icon";
import MotifProvider from "../../motif/context/MotifProvider";
import { TextTransform } from "@/components/Motif/InputText/types.ts";

describe("InputText", () => {
  it("should be rendered with only required props", () => {
    expect(render(<InputText />).container).toMatchSnapshot();
  });

  it("should display given value when value prop is given", () => {
    const value = "Entered Text";
    render(<InputText value={value} />);
    expect(screen.getByDisplayValue(value));
  });

  it("should toggle clearable icon visibility when input value changes", async () => {
    render(<InputText clearable placeholder="Test" />);
    const user = userEvent.setup();
    expect(screen.queryByTestId("iconButtonTestId")).not.toBeInTheDocument();
    const input = screen.getByPlaceholderText("Test");
    await user.type(input, "Hello");
    expect(screen.getByTestId("iconButtonTestId")).toBeInTheDocument();
  });

  it("should clear the input when clear button is clicked", async () => {
    render(<InputText clearable value="Hello" />);
    await userEvent.click(screen.getByTestId("iconButtonTestId"));
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("should be rendered with the size given in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    for (const size of sizes) {
      const { container } = render(<InputText size={size} />);
      expect(container.firstElementChild).toHaveClass(size);
    }
  });

  it("should only allow number of characters defined in the maxLength prop", () => {
    const maxLength = 5;
    const { getByTestId } = render(<InputText maxLength={maxLength} />);
    expect(getByTestId("inputItem").querySelector("input")).toHaveAttribute("maxlength", String(maxLength));
  });

  it("should render icons given as string, standalone or together", () => {
    const { rerender } = render(<InputText iconLeft="home" />);
    expect(screen.getByText("home")).toBeInTheDocument();

    rerender(<InputText iconRight="info" />);
    expect(screen.getByText("info")).toBeInTheDocument();

    rerender(<InputText iconRight="info" iconLeft="home" />);
    expect(screen.getByText("home")).toBeInTheDocument();
    expect(screen.getByText("info")).toBeInTheDocument();
  });

  it("should render icons given as components", () => {
    const { rerender } = render(<InputText iconLeft={<i>icon1</i>} />);
    expect(screen.getByText("icon1")).toBeInTheDocument();

    rerender(<InputText iconRight={<Icon name="info" />} />);
    expect(screen.getByText("info")).toBeInTheDocument();
  });

  it("triggers onChange callback when value is changed", async () => {
    const handleChange = jest.fn();
    const value = "Entered Text";
    const user = userEvent.setup();
    render(<InputText onChange={handleChange} value="" placeholder="Test" />);
    const input = screen.getByPlaceholderText("Test");
    await user.type(input, value);

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue(value);
  });

  it("should be rendered as disabled when disabled prop is given", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    const value = "Entered Text";
    render(<InputText onChange={handleChange} value={value} disabled />);
    const input = screen.getByDisplayValue(value);
    await user.type(input, "Test");

    expect(handleChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(value);
    expect(input).toBeDisabled();
    expect(screen.getByTestId("inputItem")).toHaveClass("disabled");
  });

  it("should be rendered as readOnly when readOnly prop is given", async () => {
    const handleChange = jest.fn();
    const value = "Entered Text";
    render(<InputText onChange={handleChange} value={value} readOnly />);
    const input = screen.getByDisplayValue(value);
    await userEvent.type(input, "Test");

    expect(handleChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(value);
  });

  it("should be rendered as success variant when success prop is given", () => {
    render(<InputText success />);
    expect(screen.getByTestId("inputItem")).toHaveClass("success");
  });

  it("should be rendered as error variant when error prop is given", () => {
    render(<InputText error />);
    expect(screen.getByTestId("inputItem")).toHaveClass("error");
  });

  it("should render in a pill shape when pill prop is true", () => {
    const { getByTestId } = render(<InputText pill />);
    expect(getByTestId("inputItem")).toHaveClass("pill");
  });

  it("should apply textTransform without moving the caret when editing mid-string", async () => {
    render(<InputText textTransform="uppercase" value="ABC" onChange={jest.fn()} placeholder="Test" />);
    const input = screen.getByDisplayValue<HTMLInputElement>("ABC");
    await userEvent.type(input, "x", { initialSelectionStart: 1, initialSelectionEnd: 1 });

    expect(input).toHaveValue("AXBC");
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(2);
  });

  it("should transform typed value according to the textTransform prop", async () => {
    const cases: { textTransform: TextTransform; typed: string; expected: string }[] = [
      { textTransform: "uppercase", typed: "hello world", expected: "HELLO WORLD" },
      { textTransform: "lowercase", typed: "HELLO WORLD", expected: "hello world" },
      { textTransform: "capitalize", typed: "hello world", expected: "Hello World" },
    ];

    for (const { textTransform, typed, expected } of cases) {
      const handleChange = jest.fn();
      const { unmount } = render(<InputText textTransform={textTransform} value="" onChange={handleChange} placeholder="Test" />);
      const input = screen.getByPlaceholderText("Test");
      await userEvent.type(input, typed);

      expect(input).toHaveValue(expected);
      unmount();
    }
  });

  it("should apply locale-aware textTransform when locale is set to tr", async () => {
    const cases: { textTransform: TextTransform; typed: string; expected: string }[] = [
      { textTransform: "uppercase", typed: "istanbul", expected: "İSTANBUL" },
      { textTransform: "lowercase", typed: "ISTANBUL", expected: "ıstanbul" },
      { textTransform: "capitalize", typed: "istanbul", expected: "İstanbul" },
    ];

    for (const { textTransform, typed, expected } of cases) {
      const { unmount } = render(
        <MotifProvider locale="tr">
          <InputText textTransform={textTransform} value="" onChange={jest.fn()} placeholder="Test" />
        </MotifProvider>,
      );
      const input = screen.getByPlaceholderText("Test");
      await userEvent.type(input, typed);

      expect(input).toHaveValue(expected);
      unmount();
    }
  });
});
