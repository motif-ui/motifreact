import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import InputTime from "@/components/InputTime";
import { userEvent } from "@testing-library/user-event";
import { InputSize } from "../Form/types";
import { Time } from "@/components/TimePicker/types";
import { ReactNode } from "react";

describe("InputTime", () => {
  const testTime: Time = { hours: 9, minutes: 15 };
  const testTimeWithSecond: Time = { hours: 14, minutes: 30, seconds: 45 };
  const testTimeStr = testTime.hours!.toString().padStart(2, "0") + ":" + testTime.minutes!.toString().padStart(2, "0");
  const testTimeWithSecondStr =
    testTimeWithSecond.hours!.toString() + ":" + testTimeWithSecond.minutes!.toString() + ":" + testTimeWithSecond.seconds!.toString();
  const renderExt = (ui: ReactNode) => {
    const result = render(ui);

    const getPickerContainer = () => screen.queryByTestId("Picker");

    const getInput = () => result.container.querySelector("input") as HTMLInputElement;

    const getClearButton = () => screen.queryByText("cancel_outline") as HTMLButtonElement;

    const getOkButton = () => screen.getByText("OK");

    const hasValueBothInPickerAndInput = (expectedValue: string) => {
      expect(getInput()).toHaveValue(expectedValue);
      const pickerInput = screen.queryByDisplayValue(expectedValue);
      pickerInput && expect(pickerInput).toBeInTheDocument();
    };

    return {
      ...result,
      getPickerContainer,
      getInput,
      getClearButton,
      getOkButton,
      hasValueBothInPickerAndInput,
    };
  };

  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container, getInput } = renderExt(<InputTime />);
    expect(container).toMatchSnapshot();
    expect(getInput()).toHaveAttribute("placeholder", "__:__");
    expect(container.firstElementChild?.firstElementChild).toHaveClass("md");
  });

  it("should let typing value to time input when editable prop is set true", async () => {
    const { rerender, getInput } = renderExt(<InputTime />);

    const input = getInput();

    await userEvent.type(input, testTimeStr);
    expect(input).not.toHaveValue(testTimeStr);
    rerender(<InputTime editable />);
    await userEvent.clear(input);
    await userEvent.type(input, testTimeStr);
    expect(input).toHaveValue(testTimeStr);
  });

  it("should display the placeholder given in placeholder prop", () => {
    const placeholder = "HH:MM:SS";
    const { getInput } = renderExt(<InputTime placeholder={placeholder} />);

    expect(getInput()).toHaveAttribute("placeholder", placeholder);
  });

  it("should display the time with seconds when secondsEnabled prop is true", () => {
    render(<InputTime value={testTimeWithSecond} secondsEnabled />);
    expect(screen.queryByDisplayValue(testTimeWithSecondStr)).toBeInTheDocument();
  });

  it("should render the seconds selection reel in the picker when secondsEnabled prop is true", async () => {
    const { getInput } = renderExt(<InputTime secondsEnabled />);
    await userEvent.click(getInput());
    expect(screen.queryByText("Sn")).toBeInTheDocument();
  });

  it("should render in a pill shape when pill prop is true", () => {
    const { getByTestId } = renderExt(<InputTime pill />);
    expect(getByTestId("inputItem")).toHaveClass("pill");
  });

  it("should render the time given in the value prop, both in the input and the picker", () => {
    const { hasValueBothInPickerAndInput } = renderExt(<InputTime value={testTime} />);
    hasValueBothInPickerAndInput("09:15");
  });

  it("should render the time both in the picker and the input when the time is selected via the picker", async () => {
    const { getInput, getAllByText, hasValueBothInPickerAndInput } = renderExt(<InputTime />);
    await userEvent.click(getInput());
    await userEvent.click(getAllByText("14")[0]);
    await userEvent.click(getAllByText("30")[0]);
    hasValueBothInPickerAndInput("14:30");
  });

  it("should append ':__' to the placeholder when secondsEnabled prop is true and placeholder prop is not given", () => {
    const { getInput } = renderExt(<InputTime secondsEnabled />);
    expect(getInput()).toHaveAttribute("placeholder", "__:__:__");
  });

  it("should close the time picker when clicked outside or OK button is clicked", async () => {
    const { getInput, getPickerContainer, getOkButton } = renderExt(<InputTime />);
    await userEvent.click(getInput());
    expect(getPickerContainer()).toBeInTheDocument();
    await userEvent.click(document.body);
    await waitFor(() => {
      expect(getPickerContainer()).not.toBeInTheDocument();
    });
    await userEvent.click(getInput());
    expect(getPickerContainer()).toBeInTheDocument();
    await userEvent.click(getOkButton());
    expect(getPickerContainer()).not.toBeInTheDocument();
  });

  it("should be rendered as disabled when disabled prop is true", async () => {
    const onChange = jest.fn();
    const { getByTestId, getInput, getPickerContainer } = renderExt(<InputTime disabled onChange={onChange} />);
    expect(getByTestId("inputItem")).toHaveClass("disabled");
    const input = getInput();
    await userEvent.click(input);
    expect(getPickerContainer()).not.toBeInTheDocument();
    await userEvent.type(input, testTimeStr);
    expect(onChange).not.toHaveBeenCalled();
    expect(input).not.toHaveValue(testTimeStr);
  });

  it("should trigger the onChange event when selected time is changed in the input", () => {
    const onChange = jest.fn();
    const { getInput } = renderExt(<InputTime value={testTime} onChange={onChange} />);
    const input = getInput();

    fireEvent.change(input, { target: { value: "invalid_time" } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: testTimeStr } });
    expect(onChange).toHaveBeenNthCalledWith(1, testTime);

    fireEvent.change(input, { target: { value: "16:45" } });
    expect(onChange).toHaveBeenNthCalledWith(2, { hours: 16, minutes: 45 });
  });

  it("should trigger the onChange event when a complete time is selected from timepicker", async () => {
    const onChange = jest.fn();
    const { getInput, getAllByText } = renderExt(<InputTime onChange={onChange} />);

    await userEvent.click(getInput());
    await userEvent.click(getAllByText("23")[0]);
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.click(getAllByText("59")[0]);
    expect(onChange).toHaveBeenCalledWith({ hours: 23, minutes: 59 });
  });

  it("should be rendered as success variant when success prop is true", () => {
    const { getByTestId } = render(<InputTime success editable />);
    expect(getByTestId("inputItem")).toHaveClass("success");
  });

  it("should be rendered as error variant when error prop is true", () => {
    const { getByTestId } = render(<InputTime error editable />);
    expect(getByTestId("inputItem")).toHaveClass("error");
  });

  it("should be rendered with the size given in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];

    sizes.forEach(size => {
      const { getByTestId, unmount } = render(<InputTime size={size} />);
      expect(getByTestId("inputItem")).toHaveClass(size);
      unmount();
    });
  });

  it("should display the input clear button when complete/incomplete time is selected from picker", async () => {
    const { getInput, getAllByText, getClearButton } = renderExt(<InputTime />);
    await userEvent.click(getInput());
    await userEvent.click(getAllByText("23")[0]);
    expect(getClearButton()).not.toBeInTheDocument();

    await userEvent.click(getAllByText("59")[0]);
    expect(getClearButton()).toBeInTheDocument();
  });

  it("should display the input clear button when a complete time is provided via value prop", () => {
    const { getClearButton } = renderExt(<InputTime value={testTime} />);
    expect(getClearButton()).toBeInTheDocument();
  });

  it("should display the input clear button when complete time is typed in editable input", async () => {
    const { getInput, getClearButton } = renderExt(<InputTime editable />);
    const input = getInput();
    await userEvent.type(input, "14:30");
    expect(getClearButton()).toBeInTheDocument();
  });

  it("should remove incomplete time and clear button when clicked outside", async () => {
    const { getInput, getAllByText, getClearButton } = renderExt(<InputTime />);
    await userEvent.click(getInput());
    await userEvent.click(getAllByText("15")[0]);
    await userEvent.click(document.body);
    expect(getClearButton()).not.toBeInTheDocument();
    expect(getInput()).toHaveValue("");
  });

  it("should clear the time and remove the clear button in the input when the clear button in the input is clicked", async () => {
    const { hasValueBothInPickerAndInput, getClearButton } = renderExt(<InputTime value={testTime} />);
    await userEvent.click(getClearButton());
    hasValueBothInPickerAndInput("");
    expect(getClearButton()).not.toBeInTheDocument();
  });

  it("should open the timepicker when input is clicked", async () => {
    const { getInput, getPickerContainer } = renderExt(<InputTime />);
    expect(getPickerContainer()).not.toBeInTheDocument();
    await userEvent.click(getInput());
    expect(getPickerContainer()).toBeInTheDocument();
  });

  it("should not trigger onChange when invalid time format is entered in editable input", () => {
    const onChange = jest.fn();
    const { getInput } = renderExt(<InputTime editable onChange={onChange} />);
    const input = getInput();

    const invalidFormats = ["25:30", "12:70", "ab:cd", "12", "12:", ":30", "12:30:70", "24:00"];
    invalidFormats.forEach(invalidFormat => {
      fireEvent.change(input, { target: { value: invalidFormat } });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it("should display the time icon in the input field", () => {
    render(<InputTime />);
    const timeIcon = screen.getByText("schedule");
    expect(timeIcon).toBeInTheDocument();
    expect(timeIcon).toHaveClass("icon");
  });
  it("should sync input and picker values when typing in editable input", async () => {
    const { getInput } = renderExt(<InputTime editable />);
    const input = getInput();

    await userEvent.type(input, testTimeStr);

    await waitFor(() => {
      expect(input).toHaveValue(testTimeStr);
    });

    await userEvent.click(input);
    const timeInfo = screen.queryByTestId("timeInfo");

    await waitFor(() => {
      expect(timeInfo).toBeInTheDocument();
    });

    expect(timeInfo?.children[0].textContent).toBe(testTime.hours!.toString().padStart(2, "0"));
    expect(timeInfo?.children[1].textContent).toBe(testTime.minutes!.toString().padStart(2, "0"));
  });

  it("should clear input and close picker when incomplete time is selected and no valid value is set", async () => {
    const { getInput, getPickerContainer, getAllByText, hasValueBothInPickerAndInput, getClearButton } = renderExt(<InputTime />);
    await userEvent.click(getInput());
    await userEvent.click(getAllByText("15")[0]);
    await userEvent.click(getClearButton());

    expect(getPickerContainer()).not.toBeInTheDocument();

    hasValueBothInPickerAndInput("");
  });

  it("should clear selected time when picker's clear button is clicked and not close the picker", async () => {
    const { getInput, getPickerContainer, hasValueBothInPickerAndInput } = renderExt(<InputTime />);
    await userEvent.type(getInput(), testTimeStr);
    await userEvent.click(getInput());
    await userEvent.click(screen.getByText("Clear"));
    expect(getPickerContainer()).toBeInTheDocument();
    hasValueBothInPickerAndInput("");
  });

  it("should display the input clear button when input has any value and picker is open", async () => {
    const { getInput, getClearButton } = renderExt(<InputTime editable />);

    // Valid
    await userEvent.type(getInput(), "12:34");
    expect(getClearButton()).toBeInTheDocument();

    // Invalid
    await userEvent.clear(getInput());
    await userEvent.type(getInput(), "99:99");
    expect(getClearButton()).toBeInTheDocument();

    // Incomplete
    await userEvent.clear(getInput());
    await userEvent.type(getInput(), "12:");
    expect(getClearButton()).toBeInTheDocument();
  });

  it("should clear input value when no value is selected and invalid/incomplete value is entered then outside is clicked", async () => {
    const { getInput, hasValueBothInPickerAndInput } = renderExt(<InputTime />);

    // Invalid
    await userEvent.type(getInput(), "99:99");
    await userEvent.click(document.body);
    hasValueBothInPickerAndInput("");

    // Incomplete
    await userEvent.type(getInput(), "12:");
    await userEvent.click(document.body);
    hasValueBothInPickerAndInput("");
  });

  it("should restore previous valid value when input has a valid value, then invalid/incomplete value is entered and outside is clicked", async () => {
    const { getInput } = renderExt(<InputTime value={testTime} />);
    const input = getInput();

    expect(input).toHaveValue(testTimeStr);

    // Invalid
    await waitFor(() => {
      fireEvent.change(input, { target: { value: "25:70" } });
    });
    await userEvent.click(document.body);
    await waitFor(() => {
      expect(input).toHaveValue(testTimeStr);
    });

    // Incomplete
    await waitFor(() => {
      fireEvent.change(input, { target: { value: "12:" } });
    });
    await userEvent.click(document.body);
    await waitFor(() => {
      expect(input).toHaveValue(testTimeStr);
    });
  });

  it("should display the time in the given format in format prop", () => {
    const { getInput, rerender } = renderExt(<InputTime value={{ hours: 9, minutes: 15 }} format="12h" />);
    expect(getInput()).toHaveValue("09:15 ÖÖ");

    rerender(<InputTime value={{ hours: 14, minutes: 15 }} format="12h" />);
    expect(getInput()).toHaveValue("02:15 ÖS");

    rerender(<InputTime value={{ hours: 14, minutes: 15 }} format="24h" />);
    expect(getInput()).toHaveValue("14:15");
  });
});
