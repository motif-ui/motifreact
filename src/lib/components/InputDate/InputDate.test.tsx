import { fireEvent, render, screen } from "@testing-library/react";
import InputDate from "@/components/InputDate";
import { userEvent } from "@testing-library/user-event";
import { formatDate } from "@/components/InputDate/helper";
import { defaultDateFormat } from "@/components/Motif/Pickers/types";
import { InputSize } from "../Form/types";
import { ReactNode } from "react";
import { LOCALE_DATE_EN_GB } from "@/components/DatePicker/locale/en_GB";
import { LOCALE_DATE_TR_TR } from "@/components/DatePicker/locale/tr_TR";

describe("InputDate", () => {
  const testDate = new Date(2025, 1, 15);
  const formatDateWithDefaultFormatAndTR = (mockStartDate: Date) => formatDate(mockStartDate, defaultDateFormat, LOCALE_DATE_TR_TR);

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
    const { container, getInput } = renderExt(<InputDate />);
    expect(container).toMatchSnapshot();
    // placeholder = DD/MM/YYYY (default)
    expect(getInput()).toHaveAttribute("placeholder", "DD/MM/YYYY");
    // size = md (default)
    expect(container.firstElementChild?.firstElementChild).toHaveClass("md");
  });

  it("should display the date as given format in format prop", () => {
    const { rerender } = render(
      <InputDate
        value={new Date(2025, 1, 2)}
        format={{
          order: ["year", "month", "day"],
          prefix: ["*", "*", "*"],
          delimiter: "-",
          dayFormat: "D",
          monthFormat: "MMM",
          yearFormat: "YY",
        }}
        locale={LOCALE_DATE_EN_GB}
      />,
    );
    expect(screen.queryByDisplayValue("*25-*Feb-*2")).toBeInTheDocument();

    rerender(
      <InputDate
        value={new Date(2025, 1, 2)}
        format={{
          order: ["year", "month", "day"],
          prefix: ["*", "*", "*"],
          delimiter: "-",
          dayFormat: "D",
          monthFormat: "MMMM",
          yearFormat: "YY",
        }}
        locale={LOCALE_DATE_EN_GB}
      />,
    );
    expect(screen.queryByDisplayValue("*25-*February-*2")).toBeInTheDocument();
  });

  it("should let typing value to date input when editable prop is set true", async () => {
    const { rerender, getInput } = renderExt(<InputDate />);

    const input = getInput();
    const value = "15/01/2025";

    await userEvent.type(input, value);
    expect(input).not.toHaveValue(value);

    rerender(<InputDate editable />);

    await userEvent.type(input, value);
    expect(input).toHaveValue(value);
  });

  it("should display the placeholder given in placeholder prop", () => {
    const placeholder = "YYYY/MM/DD";
    const { getInput } = renderExt(<InputDate placeholder={placeholder} />);

    expect(getInput()).toHaveAttribute("placeholder", placeholder);
  });

  it("should display the placeholder as given in format prop when placeholder prop is not given", () => {
    const { getInput } = renderExt(<InputDate format={{ order: ["year", "month", "day"] }} />);

    expect(getInput()).toHaveAttribute("placeholder", "YYYY/MM/DD");
  });

  it("should render in a pill shape when pill prop is true", () => {
    const { getByTestId } = render(<InputDate pill />);
    expect(getByTestId("inputItem")).toHaveClass("pill");
  });

  it("should display the date value given in value prop", () => {
    render(<InputDate value={testDate} />);
    expect(screen.queryByDisplayValue(formatDateWithDefaultFormatAndTR(testDate))).toBeInTheDocument();
  });

  it("should display the date value and close the datepicker when the date is selected from datepicker", async () => {
    const mockCurrentMonth = new Date(2024, 6, 1);
    const mockClickDate = new Date(2024, 6, 18);

    const { getByText, getInput, getPickerContainer } = renderExt(<InputDate value={mockCurrentMonth} />);

    await userEvent.click(getInput());
    await userEvent.click(getByText(mockClickDate.getDate().toString()));
    expect(getInput()).toHaveValue(formatDateWithDefaultFormatAndTR(mockClickDate));
    expect(getPickerContainer()).not.toBeInTheDocument();
  });

  it("should close the datepicker when clicked outside", async () => {
    const { getByText, getInput, getPickerContainer } = renderExt(<InputDate value={testDate} />);

    await userEvent.click(getInput());
    expect(getPickerContainer()).toBeInTheDocument();

    await userEvent.click(document.body);
    expect(getPickerContainer()).not.toBeInTheDocument();

    await userEvent.click(getInput());
    expect(getByText(testDate.getDate())).toHaveClass("selected");
    expect(getInput()).toHaveValue(formatDateWithDefaultFormatAndTR(testDate));
  });

  it("should display the same date in the picker as given in the value prop", async () => {
    const { getInput, getByText } = renderExt(<InputDate value={testDate} />);

    await userEvent.click(getInput());
    expect(getByText(testDate.getDate())).toHaveClass("selected");
  });

  it("should be rendered as disabled when disabled prop is true", async () => {
    const onChange = jest.fn();
    const { getByTestId, getInput } = renderExt(<InputDate disabled editable onChange={onChange} />);
    expect(getByTestId("inputItem")).toHaveClass("disabled");

    await userEvent.click(getInput());
    expect(screen.queryByTestId("Picker")).not.toBeInTheDocument();

    await userEvent.type(getInput(), "12/12/2024");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByDisplayValue("12/12/2024")).not.toBeInTheDocument();
  });

  it("should trigger the onChange event when a date is selected from datepicker", async () => {
    const onChange = jest.fn();
    const { getInput, getByText } = renderExt(<InputDate onChange={onChange} />);

    await userEvent.click(getInput());
    await userEvent.click(getByText(testDate.getDate().toString()));
    expect(onChange).toHaveBeenCalled();
  });

  it("should trigger the onChange event when selected date is changed", async () => {
    const onChange = jest.fn();
    const { getByText, getInput, getClearButton } = renderExt(<InputDate value={testDate} editable onChange={onChange} />);

    fireEvent.change(getInput(), { target: { value: "invalid_date" } });
    expect(onChange).toHaveBeenNthCalledWith(1, undefined);
    fireEvent.change(getInput(), { target: { value: formatDateWithDefaultFormatAndTR(testDate) } });
    expect(onChange).toHaveBeenNthCalledWith(2, testDate);

    await userEvent.click(getInput());
    await userEvent.click(getByText(testDate.getDate().toString()));
    expect(onChange).toHaveBeenCalledTimes(2);

    await userEvent.type(getInput(), "6");
    expect(onChange).toHaveBeenNthCalledWith(3, undefined);

    fireEvent.change(getInput(), { target: { value: formatDateWithDefaultFormatAndTR(testDate) } });
    expect(onChange).toHaveBeenNthCalledWith(4, testDate);

    await userEvent.click(getClearButton());
    expect(onChange).toHaveBeenNthCalledWith(5, undefined);

    await userEvent.type(getInput(), "66/");
    await userEvent.click(getClearButton());
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("should be rendered as success variant when success prop is true", () => {
    const { getByTestId } = render(<InputDate success editable />);
    expect(getByTestId("inputItem")).toHaveClass("success");
  });

  it("should be rendered as error variant when error prop is true", () => {
    const { getByTestId } = render(<InputDate error editable />);
    expect(getByTestId("inputItem")).toHaveClass("error");
  });

  it("should be rendered with the size given in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];

    sizes.forEach(size => {
      const { getByTestId, unmount } = render(<InputDate size={size} />);
      expect(getByTestId("inputItem")).toHaveClass(size);
      unmount();
    });
  });

  it("should display the clear button when a valid date is selected", async () => {
    const { getByText, rerender, getClearButton, getInput } = renderExt(<InputDate value={testDate} />);
    expect(screen.queryByText("cancel_outline")).toBeInTheDocument();

    rerender(<InputDate />);

    await userEvent.click(getInput());
    await userEvent.click(getByText(testDate.getDate().toString()));
    expect(getClearButton()).toBeInTheDocument();
  });

  it("should display the clear button when any text is typed", async () => {
    const { getInput, getClearButton } = renderExt(<InputDate editable />);

    await userEvent.type(getInput(), "1");
    expect(getClearButton()).toBeInTheDocument();
  });

  it("should clear the input value and remove the clear button when the clear button is clicked", async () => {
    const { getInput, getClearButton } = renderExt(<InputDate value={testDate} />);
    await userEvent.click(getClearButton());

    expect(getInput()).toHaveValue("");
    expect(getClearButton()).not.toBeInTheDocument();
  });

  it("should open the datepicker when input is clicked", async () => {
    const { getInput, getPickerContainer } = renderExt(<InputDate />);

    expect(getPickerContainer()).not.toBeInTheDocument();
    await userEvent.click(getInput());
    expect(getPickerContainer()).toBeInTheDocument();
  });

  it("should open the datepicker when editable prop is set true and input is clicked", async () => {
    const { getInput, getPickerContainer } = renderExt(<InputDate editable />);

    expect(getPickerContainer()).not.toBeInTheDocument();
    await userEvent.click(getInput());
    expect(getPickerContainer()).toBeInTheDocument();
  });

  it("should display the date as selected when editable prop is set true and a date is typed in the open month in the picker", async () => {
    const mockCurrentMonth = new Date(2024, 6, 1);
    const mockToday = new Date(2024, 6, 18);

    const { getInput, getByText } = renderExt(<InputDate editable value={mockCurrentMonth} />);

    await userEvent.click(getInput());
    expect(getByText(mockToday.getDate())).not.toHaveClass("selected");

    fireEvent.change(getInput(), { target: { value: formatDateWithDefaultFormatAndTR(mockToday) } });
    expect(getByText(mockToday.getDate())).toHaveClass("selected");
  });
});
