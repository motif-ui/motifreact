import { render, screen } from "@testing-library/react";
import InputDateRange, { RANGE_ARROW } from "@/components/InputDateRange/InputDateRange";
import { formatDate } from "@/components/InputDate/helper";
import { userEvent } from "@testing-library/user-event";
import { InputSize } from "../Form/types";
import { ReactNode } from "react";
import { DateUtils } from "../../../utils/dateUtils";
import { defaultDateFormat } from "../Motif/Pickers/types";

describe("InputDateRange", () => {
  const user = userEvent.setup();
  const testDateArr = [new Date(2025, 4, 12), new Date(2025, 4, 21)];
  const placeholder = "__ / __ / ____"; // default formata göre "DD/MM/YYYY"

  const createDateRangeString = (inputDate1: Date | undefined, inputDate2: Date | undefined) => {
    const date1 = formatDate(inputDate1, defaultDateFormat);
    const date2 = formatDate(inputDate2, defaultDateFormat);
    return `${date1} ${RANGE_ARROW} ${date2}`.trim();
  };

  const renderExt = (ui: ReactNode) => {
    const result = render(ui);

    const getInputText = () => result.container.firstElementChild?.firstElementChild;
    const getDateRangeInput = () => result.container.firstElementChild!.querySelector("input") as HTMLInputElement;
    const getDateButton = (date: Date) => result.container.querySelector('[data-date="' + date.getTime() + '"]') as HTMLButtonElement;
    const getPickerContainer = () => screen.queryByTestId("Picker");

    return {
      ...result,
      getInputText,
      getDateRangeInput,
      getPickerContainer,
      getDateButton,
    };
  };

  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container, getByText, getDateRangeInput, getInputText } = renderExt(<InputDateRange />);
    expect(container).toMatchSnapshot();
    // placeholder = DD/MM/YYYY ⮕ DD/MM/YYYY (default)
    expect(getDateRangeInput()).toHaveAttribute("placeholder", `${placeholder} ${RANGE_ARROW} ${placeholder}`);
    // size = md (default)
    expect(getInputText()).toHaveClass("md");
    // icon
    expect(getByText("calendar_expand_horizontal")).toBeInTheDocument();
  });

  it("should display the dates as given format in format prop with an arrow between them", () => {
    render(
      <InputDateRange
        value={testDateArr}
        format={{
          order: ["year", "month", "day"],
          prefix: ["*", "*", "*"],
          delimiter: "-",
          dayFormat: "D",
          monthFormat: "M",
          yearFormat: "YY",
        }}
      />,
    );
    expect(screen.queryByDisplayValue(`*25-*5-*12 ${RANGE_ARROW} *25-*5-*21`)).toBeInTheDocument();
  });

  it("should display the placeholder given in placeholder prop", () => {
    const placeholder = `YYYY/MM/DD ${RANGE_ARROW} YYYY/MM/DD`;
    const { getDateRangeInput } = renderExt(<InputDateRange placeholder={placeholder} />);
    expect(getDateRangeInput()).toHaveAttribute("placeholder", placeholder);
  });

  it("should display the placeholder as given in format prop when placeholder prop is not given", () => {
    const placeholder = `____ / __ / __ ${RANGE_ARROW} ____ / __ / __`;
    const { getDateRangeInput } = renderExt(<InputDateRange format={{ order: ["year", "month", "day"] }} />);
    expect(getDateRangeInput()).toHaveAttribute("placeholder", placeholder);
  });

  it("should render in a pill shape when pill prop is true", () => {
    const { getInputText } = renderExt(<InputDateRange pill />);
    expect(getInputText()).toHaveClass("pill");
  });

  it("should display the start end end dates given in value prop", () => {
    const testDateString = createDateRangeString(testDateArr[0], testDateArr[1]);
    renderExt(<InputDateRange value={testDateArr} />);
    expect(screen.queryByDisplayValue(testDateString)).toBeInTheDocument();
  });

  it("should display dates and close the date range picker when both dates are selected and OK button clicked", async () => {
    const dateStart = new Date(2025, 4, 19);
    const dateEnd = new Date(2025, 4, 30);

    const testDateString = createDateRangeString(dateStart, dateEnd);

    const { getByText, getDateRangeInput, getPickerContainer, getDateButton } = renderExt(<InputDateRange value={[dateStart, dateEnd]} />);

    await user.click(getDateRangeInput());
    await user.click(getDateButton(dateStart));
    await user.click(getDateButton(dateEnd));

    const okButton = getByText("OK") as HTMLButtonElement;
    await user.click(okButton);

    expect(getDateRangeInput()).toHaveValue(testDateString);
    expect(getPickerContainer()).not.toBeInTheDocument();
  });

  it("should close the datepicker when clicked outside", async () => {
    const { getDateRangeInput, getPickerContainer } = renderExt(<InputDateRange value={testDateArr} />);

    await user.click(getDateRangeInput());
    expect(getPickerContainer()).toBeInTheDocument();

    await user.click(document.body);
    expect(getPickerContainer()).not.toBeInTheDocument();
  });

  it("should render the same start and end dates in the picker as specified in the value prop", async () => {
    const { getDateRangeInput, getDateButton } = renderExt(<InputDateRange value={testDateArr} />);

    await user.click(getDateRangeInput());
    expect(getDateButton(testDateArr[0])).toHaveClass("selected");
    expect(getDateButton(testDateArr[1])).toHaveClass("selected");
  });

  it("should be rendered as disabled when disabled prop is true", async () => {
    const { getDateRangeInput, getPickerContainer } = renderExt(<InputDateRange disabled />);
    expect(getDateRangeInput()).toHaveAttribute("disabled");
    await user.click(getDateRangeInput());
    expect(getPickerContainer()).not.toBeInTheDocument();
  });

  it("should trigger the onChange event when a date is selected from datepicker", async () => {
    const onChange = jest.fn();
    const { getDateRangeInput, getDateButton } = renderExt(<InputDateRange onChange={onChange} />);
    await user.click(getDateRangeInput());
    await user.click(getDateButton(testDateArr[0]));
    expect(onChange).toHaveBeenCalled();
  });

  it("should trigger the onChange event when selected date is changed", async () => {
    const onChange = jest.fn();
    const { getDateRangeInput, getDateButton } = renderExt(<InputDateRange value={testDateArr} onChange={onChange} />);

    await user.click(getDateRangeInput());
    await user.click(getDateButton(testDateArr[0]));
    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(screen.queryByText("cancel_outline") as HTMLButtonElement);
    expect(onChange).toHaveBeenNthCalledWith(2, undefined);
  });

  it("should be rendered as success variant when success prop is true", () => {
    const { getInputText } = renderExt(<InputDateRange success />);
    expect(getInputText()).toHaveClass("success");
  });

  it("should be rendered as error variant when error prop is true", () => {
    const { getInputText } = renderExt(<InputDateRange error />);
    expect(getInputText()).toHaveClass("error");
  });

  it("should be rendered with the size given in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];

    sizes.forEach(size => {
      const { getInputText } = renderExt(<InputDateRange size={size} />);
      expect(getInputText()).toHaveClass(size);
    });
  });

  it("should display the clear button when a date or range is selected", () => {
    render(<InputDateRange value={testDateArr} />);
    expect(screen.queryByText("cancel_outline")).toBeInTheDocument();
  });

  it("should display the clear button when a date is selected", async () => {
    const { getDateRangeInput, getDateButton } = renderExt(<InputDateRange />);
    await user.click(getDateRangeInput());
    await user.click(getDateButton(DateUtils.getTodayTimeless()));
    expect(screen.queryByText("cancel_outline")).toBeInTheDocument();
  });

  it("should clear the input value when the clear button is clicked", async () => {
    const { getDateRangeInput } = renderExt(<InputDateRange value={testDateArr} />);
    const clearButton = screen.queryByText("cancel_outline") as HTMLButtonElement;

    await user.click(clearButton);
    expect(getDateRangeInput()).toHaveValue("");
    expect(getDateRangeInput()).toHaveAttribute("placeholder", `${placeholder} ${RANGE_ARROW} ${placeholder}`);
  });

  it("should remove the clear button when the clear button is clicked", async () => {
    render(<InputDateRange value={testDateArr} />);
    const clearButton = screen.queryByText("cancel_outline") as HTMLButtonElement;
    await user.click(clearButton);
    expect(clearButton).not.toBeInTheDocument();
  });

  it("should open the datepicker when input is clicked", async () => {
    const { getDateRangeInput, getPickerContainer } = renderExt(<InputDateRange />);

    expect(getPickerContainer()).not.toBeInTheDocument();
    await user.click(getDateRangeInput());
    expect(getPickerContainer()).toBeInTheDocument();
  });

  it("should clear the input, close the picker when clicked outside with only one date selected", async () => {
    const { getDateRangeInput, getDateButton, getPickerContainer } = renderExt(<InputDateRange />);

    await user.click(getDateRangeInput());
    await user.click(getDateButton(DateUtils.getTodayTimeless()));

    await user.click(document.body);
    expect(getPickerContainer()).not.toBeInTheDocument();
    expect(getDateRangeInput()).toHaveValue("");
  });

  it("should close the picker and clear input value when the clear icon button is clicked", async () => {
    const dateStart = new Date(2025, 4, 19);
    const dateEnd = new Date(2025, 4, 30);
    const { getDateRangeInput, getPickerContainer, getDateButton } = renderExt(<InputDateRange value={[dateStart, dateEnd]} />);

    await user.click(getDateRangeInput());
    await user.click(getDateButton(dateStart));
    await user.click(getDateButton(dateEnd));

    const clearButton = screen.queryByText("cancel_outline") as HTMLButtonElement;
    await user.click(clearButton);

    expect(getPickerContainer()).not.toBeInTheDocument();
  });

  it("should keep the picker open and clear the input when Clear button in the picker is clicked", async () => {
    const { getDateRangeInput } = renderExt(<InputDateRange value={testDateArr} />);

    await user.click(getDateRangeInput());
    const clearButton = screen.getByText("Clear");
    await user.click(clearButton);
  });

  it("should reorder the start-end values when they are not given in the correct order", () => {
    const testDateString = createDateRangeString(testDateArr[0], testDateArr[1]);
    const { getDateRangeInput } = renderExt(<InputDateRange value={testDateArr.reverse()} />);
    expect(getDateRangeInput()).toHaveValue(testDateString);
  });
});
