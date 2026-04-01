import { act, render, screen, waitFor } from "@testing-library/react";
import InputDateTime from "./InputDateTime";
import { ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import { InputSize } from "../Form/types";
import { defaultDateFormat } from "../Motif/Pickers/types";
import { formatDateTime } from "./helper";
import { formatDate } from "../InputDate/helper";
import { TimeFormat } from "../Motif/Pickers/types";
import { LOCALE_DATE_TIME_TR_TR } from "@/components/DateTimePicker/locale/tr_TR";
import { DateUtils } from "../../../utils/dateUtils";
import { DateTimePickerLocale } from "@/components/DateTimePicker/types";
import { LOCALE_DATE_TIME_EN_GB } from "@/components/DateTimePicker/locale/en_GB";

describe(InputDateTime, () => {
  const today = new Date();
  const dateValue = new Date(today.getFullYear(), today.getMonth(), 12);
  const sizes: InputSize[] = ["xs", "sm", "md", "lg"];

  const createDateTimeString = (
    dateTime: Date | undefined,
    secondsEnabled: boolean,
    timeFormat: TimeFormat,
    locale: DateTimePickerLocale,
  ) => {
    return formatDateTime(dateTime, defaultDateFormat, secondsEnabled, timeFormat, locale);
  };

  const formatDateTimeValue = createDateTimeString(dateValue, false, "24h", LOCALE_DATE_TIME_TR_TR);
  const renderExt = (ui: ReactNode) => {
    const result = render(ui);

    const getInputText = () => result.container.querySelector("input") as HTMLInputElement;
    const getInput = () => result.getByTestId("inputItem");
    const getDateButton = (date: Date) => result.container.querySelector(`[data-date="${date.getTime()}"]`) as HTMLButtonElement;
    const getPickerContainer = () => screen.queryByTestId("Picker") as HTMLDivElement;
    const getClearButton = () => screen.queryByText("cancel_outline") as HTMLButtonElement;
    const getTimePeriodButton = () => screen.queryByTestId("timePeriodSelector") as HTMLDivElement;
    const getTimeList = () => screen.queryByTestId("timeStripeContainer")?.querySelectorAll("ul") ?? [];

    return {
      ...result,
      getInputText,
      getInput,
      getPickerContainer,
      getDateButton,
      getClearButton,
      getTimePeriodButton,
      getTimeList,
    };
  };

  it("should be rendered with only required props and should have default prop values stated here", async () => {
    const { container, getByText, getInputText, getPickerContainer, getTimeList, getInput } = renderExt(<InputDateTime />);

    expect(container).toMatchSnapshot();

    //placeholder
    expect(getInputText()).toHaveAttribute("placeholder", "DD/MM/YYYY __:__");

    //default size = md
    expect(getInput()).toHaveClass("md");

    //icon
    expect(getByText("event")).toBeInTheDocument();

    //local prop
    await userEvent.click(getInputText());
    expect(getByText("Sa")).toBeInTheDocument();

    //editable = false
    expect(getInputText()).toHaveValue("");
    await userEvent.type(getInputText(), formatDateTimeValue);
    expect(getInputText()).toHaveValue("");

    //24-hour format
    await userEvent.click(getInputText());
    act(() => getByText("schedule").closest("button")?.click());
    await waitFor(() => expect(getPickerContainer()).toBeInTheDocument());
    const [hours] = getTimeList();
    expect(hours.children.length).toBe(24);
    expect(hours.lastElementChild).toHaveTextContent("23");
  });

  it("should display the date as given dateFormat in format prop", () => {
    const { rerender } = render(
      <InputDateTime
        value={new Date(2025, 1, 2)}
        dateFormat={{
          order: ["day", "month", "year"],
          delimiter: " ",
          yearFormat: "YY",
          monthFormat: "MMM",
        }}
        locale={LOCALE_DATE_TIME_EN_GB}
      />,
    );
    expect(screen.queryByDisplayValue("02 Feb 25 00:00")).toBeInTheDocument();

    rerender(
      <InputDateTime
        value={new Date(2025, 1, 2)}
        dateFormat={{
          order: ["month", "day", "year"],
          delimiter: " ",
          yearFormat: "YY",
          monthFormat: "MMMM",
        }}
        locale={LOCALE_DATE_TIME_EN_GB}
      />,
    );

    expect(screen.queryByDisplayValue("February 02 25 00:00")).toBeInTheDocument();
  });

  it("should display the placeholder given in placeholder prop", () => {
    const testPlaceholder = "YYYY/MM/DD";
    const { getByPlaceholderText } = renderExt(<InputDateTime placeholder={testPlaceholder} />);
    expect(getByPlaceholderText(testPlaceholder)).toBeInTheDocument();
  });

  it("should display seconds in the placeholder when secondsEnabled is true", () => {
    const { getByPlaceholderText } = renderExt(<InputDateTime secondsEnabled />);
    expect(getByPlaceholderText("DD/MM/YYYY __:__:__")).toBeInTheDocument();
  });

  it("should display the date value given in value prop", () => {
    render(<InputDateTime value={dateValue} />);
    expect(screen.queryByDisplayValue(formatDateTimeValue)).toBeInTheDocument();
  });

  it("should pass the given name prop to the input inside", () => {
    const { getInputText } = renderExt(<InputDateTime name="inputdatetime" />);
    expect(getInputText()).toHaveAttribute("name", "inputdatetime");
  });

  it("should render seconds time stripe in the picker and seconds part in the input when secondsEnabled is true", async () => {
    const { getInputText, getByText, getTimeList } = renderExt(<InputDateTime secondsEnabled />);

    await userEvent.click(getInputText());

    act(() => getByText("schedule").click());
    expect(getByText("calendar_month").closest("button")).not.toHaveClass("active");
    expect(getByText("schedule").closest("button")).toHaveClass("active");

    const { secondsAbbr } = LOCALE_DATE_TIME_TR_TR;
    expect(getByText(secondsAbbr)).toBeInTheDocument();

    const seconds11 = getTimeList()[2].children.item(11);
    await userEvent.click(seconds11?.firstElementChild as Element);
    const newDate = DateUtils.getDateWithTime(new Date(), { seconds: 11 });
    const formatDateValue = formatDateTime(newDate, defaultDateFormat, true, "24h", LOCALE_DATE_TIME_TR_TR);
    expect(getInputText()).toHaveValue(formatDateValue);
  });

  it("should switch the hours to the correct time period when AM/PM buttons are clicked in 12-hour format", async () => {
    Element.prototype.scrollTo = jest.fn();
    const onChange = jest.fn();

    const { getInputText, getByText, getAllByText, getPickerContainer } = renderExt(
      <InputDateTime timeFormat="12h" value={new Date(2025, 9, 12, 14, 0)} onChange={onChange} />,
    );

    await userEvent.click(getInputText());
    await waitFor(() => expect(getPickerContainer()).toBeInTheDocument());
    act(() => getByText("schedule").closest("button")?.click());

    expect(getAllByText(LOCALE_DATE_TIME_TR_TR.pm)[1]).toHaveClass("selected");
    expect(getInputText().value).toEqual("12/10/2025 02:00 " + LOCALE_DATE_TIME_TR_TR.pm);

    await userEvent.click(getByText(LOCALE_DATE_TIME_TR_TR.am));
    expect(getAllByText(LOCALE_DATE_TIME_TR_TR.am)[1]).toHaveClass("selected");
    expect(getInputText().value).toEqual("12/10/2025 02:00 " + LOCALE_DATE_TIME_TR_TR.am);
    expect(onChange).toHaveBeenCalledWith(new Date(2025, 9, 12, 2, 0));
    jest.resetAllMocks();
  });

  it("should display the value given in value prop", () => {
    const { getInputText } = renderExt(<InputDateTime value={dateValue} />);
    expect(getInputText()).toHaveValue(formatDateTimeValue);
  });

  it("should be rendered as disabled when disabled prop is true", async () => {
    const onChange = jest.fn();
    const { getInputText, getPickerContainer } = renderExt(<InputDateTime disabled editable />);

    expect(getInputText()).toHaveAttribute("disabled");

    await userEvent.click(getInputText());
    expect(onChange).not.toHaveBeenCalled();
    expect(getPickerContainer()).not.toBeInTheDocument();
  });

  it("should be rendered in a pill shape when pill prop is true", () => {
    const { getInput } = renderExt(<InputDateTime pill />);
    expect(getInput()).toHaveClass("pill");
  });

  it("should be rendered as success variant when success prop is true", () => {
    const { getInput } = renderExt(<InputDateTime success />);
    expect(getInput()).toHaveClass("success");
  });

  it("should be rendered as error variant when error prop is true", () => {
    const { getInput } = renderExt(<InputDateTime error />);
    expect(getInput()).toHaveClass("error");
  });

  it.each(sizes)("should be rendered in the %s size given in size prop", size => {
    const { getInput } = renderExt(<InputDateTime size={size} />);
    expect(getInput()).toHaveClass(size);
  });

  it("should open the datepicker when input is clicked", async () => {
    const { getInputText, getPickerContainer } = renderExt(<InputDateTime />);

    expect(getPickerContainer()).not.toBeInTheDocument();
    await userEvent.click(getInputText());
    await waitFor(() => expect(getPickerContainer()).toBeInTheDocument());
  });

  it("should allow typing when editable prop is true", async () => {
    const { getInputText } = renderExt(<InputDateTime editable />);
    await userEvent.type(getInputText(), formatDateTimeValue);
    expect(getInputText()).toHaveValue(formatDateTimeValue);
  });

  it("should display the clear button inside the input when the input contains text content in it", async () => {
    const { getInputText, getClearButton, rerender } = renderExt(<InputDateTime value={dateValue} />);
    expect(getClearButton()).toBeInTheDocument();

    await userEvent.click(getClearButton());
    expect(getClearButton()).not.toBeInTheDocument();
    expect(getInputText()).toHaveValue("");

    rerender(<InputDateTime editable />);
    await userEvent.type(getInputText(), "xxx");
    expect(getClearButton()).toBeInTheDocument();
  });

  it("should close the picker when the picker is open and the user clicks outside", async () => {
    const { getInputText, getPickerContainer } = renderExt(<InputDateTime />);

    await userEvent.click(getInputText());
    await userEvent.click(document.body);
    expect(getPickerContainer()).not.toBeInTheDocument();
  });

  it("should keep the last valid value selected when there is an invalid value in the text input, the picker is open and the user clicks outside", async () => {
    const { getInputText } = renderExt(<InputDateTime value={dateValue} editable />);
    const onChange = jest.fn();

    await userEvent.click(getInputText());
    await userEvent.type(getInputText(), "XXX");

    await userEvent.click(document.body);
    expect(getInputText()).toHaveValue(formatDateTimeValue);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should close the picker and clear input value when the clear icon button is clicked", async () => {
    const { getInputText, getPickerContainer, getClearButton } = renderExt(<InputDateTime />);

    await userEvent.click(getInputText());
    await waitFor(() => expect(getPickerContainer()).toBeInTheDocument());

    await userEvent.click(getClearButton());

    expect(getPickerContainer()).not.toBeInTheDocument();
    expect(getClearButton()).not.toBeInTheDocument();
    expect(getInputText()).toHaveValue("");
  });

  it("should fire onChange event with the new selected value when a valid date and time is typed into the input", async () => {
    const onChange = jest.fn();
    const { getInputText } = renderExt(<InputDateTime editable onChange={onChange} />);

    await userEvent.type(getInputText(), formatDateTimeValue);
    expect(onChange).toHaveBeenCalledWith(dateValue);
  });

  it("should fire onChange when the selected date or time is changed via picker", async () => {
    const onChange = jest.fn();
    const { getInputText, getDateButton } = renderExt(<InputDateTime onChange={onChange} />);

    await userEvent.click(getInputText());
    await userEvent.click(getDateButton(dateValue));
    expect(onChange).toHaveBeenCalledWith(dateValue);
  });

  it("should always show the same selected values in the text input and the picker", async () => {
    const { getInputText, getDateButton, getClearButton, getTimeList, getByText } = renderExt(<InputDateTime editable />);

    await userEvent.click(getInputText());
    await userEvent.click(getDateButton(dateValue));

    expect(getInputText()).toHaveValue(formatDateTimeValue);
    await userEvent.click(getClearButton());
    expect(getInputText()).toHaveValue("");

    await userEvent.click(getInputText());
    await userEvent.type(getInputText(), formatDateTimeValue);
    expect(getDateButton(dateValue)).toHaveClass("selected");

    act(() => getByText("schedule").closest("button")?.click());

    const [hours, minutes] = getTimeList();
    expect(hours.children.item(0)?.firstElementChild as Element).toHaveClass("selected");
    expect(minutes.children.item(0)?.firstElementChild as Element).toHaveClass("selected");
  });

  it("should display the clear button when a date is selected", async () => {
    const { getInputText, getDateButton, getClearButton } = renderExt(<InputDateTime />);

    expect(getClearButton()).not.toBeInTheDocument();

    await userEvent.click(getInputText());
    await userEvent.click(getDateButton(dateValue));

    expect(getInputText()).toHaveValue(formatDateTimeValue);
    expect(getClearButton()).toBeInTheDocument();
  });

  it("should fall back to the previous value when editable is true and the input value is invalid", async () => {
    const { getInputText } = renderExt(<InputDateTime editable value={dateValue} />);

    await userEvent.click(getInputText());
    await userEvent.type(getInputText(), "12/12/202");
    await userEvent.click(document.body);

    expect(getInputText()).toHaveValue(formatDateTimeValue);
  });

  it("should select today as the date when initially no value is selected and any time value (hours, minutes or seconds) is selected via the picker", async () => {
    const { getByText, getInputText, getTimeList } = renderExt(<InputDateTime secondsEnabled />);
    const dateTimeVal = `${formatDate(new Date(), defaultDateFormat, LOCALE_DATE_TIME_TR_TR)} 11:00:00`;

    await userEvent.click(getInputText());

    act(() => getByText("schedule").closest("button")?.click());

    const [hours] = getTimeList();
    await userEvent.click(hours.children.item(11)?.firstElementChild as Element);
    expect(getInputText()).toHaveValue(dateTimeVal);
  });

  it("should select the unselected time values as 00 when initially no value is selected and any time value (hours, minutes or seconds) is selected via the picker", async () => {
    const { getByText, getInputText, getClearButton, getTimeList } = renderExt(<InputDateTime secondsEnabled />);
    const dateTimeVal = `${formatDate(new Date(), defaultDateFormat, LOCALE_DATE_TIME_TR_TR)}`;

    const cases = [
      { col: "hours", expected: "05:00:00" },
      { col: "minutes", expected: "00:05:00" },
      { col: "seconds", expected: "00:00:05" },
    ] as const;

    await cases.reduce(
      (p, { col, expected }) =>
        p.then(async () => {
          await userEvent.click(getInputText());
          act(() => getByText("schedule").closest("button")?.click());

          const [hours, minutes, seconds] = getTimeList();
          const colMap = { hours, minutes, seconds };
          await userEvent.click(colMap[col].children.item(5)?.firstElementChild as Element);

          expect(getInputText()).toHaveValue(`${dateTimeVal} ${expected}`);
          await userEvent.click(getClearButton());
        }),
      Promise.resolve(),
    );
  });

  it("should update the AM/PM suffix in the value when formatTime is 12h and the AM/PM buttons are toggled", async () => {
    const onChange = jest.fn();
    const { getInputText, getDateButton, getByText, getAllByText } = renderExt(<InputDateTime timeFormat="12h" onChange={onChange} />);

    await userEvent.click(getInputText());
    await userEvent.click(getDateButton(dateValue));

    await userEvent.click(getByText(LOCALE_DATE_TIME_TR_TR.pm));
    expect(getAllByText(LOCALE_DATE_TIME_TR_TR.pm)[1]).toHaveClass("selected");
    expect(getInputText().value).toEqual(expect.stringContaining(LOCALE_DATE_TIME_TR_TR.pm));

    await userEvent.click(getByText(LOCALE_DATE_TIME_TR_TR.am));
    expect(getAllByText(LOCALE_DATE_TIME_TR_TR.am)[1]).toHaveClass("selected");
    expect(getInputText().value).toEqual(expect.stringContaining(LOCALE_DATE_TIME_TR_TR.am));
  });

  it("should append AM/PM to the value when formatTime is 12h and a valid date/time is selected", async () => {
    const onChange = jest.fn();
    const { getInputText, getDateButton } = renderExt(<InputDateTime timeFormat="12h" onChange={onChange} />);

    await userEvent.click(getInputText());
    await userEvent.click(getDateButton(dateValue));
    expect(getInputText().value).toEqual(expect.stringContaining(LOCALE_DATE_TIME_TR_TR.am));
  });
});
