import { DateTimePicker } from "../../index";
import { runPickerTests } from "@/components/Motif/Pickers/Picker.test";
import { runDatePickerCommonTests } from "@/components/DatePicker/DatePicker.test";
import { runTimePickerCommonTests } from "@/components/TimePicker/TimePicker.test";
import { act, render, waitFor } from "@testing-library/react";
import { LOCALE_DATE_TR_TR } from "@/components/DatePicker/locale/tr_TR";
import { LOCALE_DATE_TIME_TR_TR } from "@/components/DateTimePicker/locale/tr_TR";
import { DateTimePickerLocale } from "../DateTimePicker/types";
import { userEvent } from "@testing-library/user-event";

describe("DateTimePicker", () => {
  beforeEach(() => {
    Element.prototype.scrollTo = jest.fn();
    jest.spyOn(HTMLUListElement.prototype, "getBoundingClientRect").mockImplementation(() => ({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    jest.spyOn(HTMLLIElement.prototype, "getBoundingClientRect").mockImplementation(() => ({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  runPickerTests();

  runDatePickerCommonTests();

  runTimePickerCommonTests();

  it("should render the date picker button", () => {
    const { getByText } = render(<DateTimePicker />);
    expect(getByText("calendar_month")).toBeInTheDocument();
  });

  it("should render the time picker button", () => {
    const { getByText } = render(<DateTimePicker />);
    expect(getByText("schedule")).toBeInTheDocument();
  });

  it("should render the date picker by default", () => {
    const { getByText } = render(<DateTimePicker />);
    expect(getByText("calendar_month").closest("button")).toHaveClass("active");
    expect(getByText("schedule").closest("button")).not.toHaveClass("active");
    LOCALE_DATE_TIME_TR_TR.weekDays.forEach(weekDay => expect(getByText(weekDay)).toBeInTheDocument());
  });

  it("should switch to the time picker when time picker button is clicked", () => {
    const { getByText, getAllByText } = render(<DateTimePicker secondsEnabled />);
    act(() => getByText("schedule").click());
    expect(getByText("calendar_month").closest("button")).not.toHaveClass("active");
    expect(getByText("schedule").closest("button")).toHaveClass("active");

    const { hoursAbbr, minutesAbbr, secondsAbbr } = LOCALE_DATE_TIME_TR_TR;
    expect(getByText(hoursAbbr)).toBeInTheDocument();
    expect(getByText(minutesAbbr)).toBeInTheDocument();
    expect(getByText(secondsAbbr)).toBeInTheDocument();

    expect(getAllByText("59").length).toBe(2);
  });

  it("should switch to the date picker when date picker button is clicked", () => {
    const { getByText } = render(<DateTimePicker />);
    act(() => getByText("schedule").click());
    act(() => getByText("calendar_month").click());
    expect(getByText("schedule").closest("button")).not.toHaveClass("active");
    expect(getByText("calendar_month").closest("button")).toHaveClass("active");
    LOCALE_DATE_TIME_TR_TR.weekDays.forEach(weekDay => expect(getByText(weekDay)).toBeInTheDocument());
  });

  it("should switch to the time picker and select 00 for time parts when there is no selected value and a date is selected from the date picker", async () => {
    const { getAllByText, getByTestId } = render(<DateTimePicker />);
    const day11 = getByTestId("DatePickerDayContainer").children[10] as HTMLButtonElement;
    await userEvent.click(day11);

    const hours = getAllByText("00")[0];
    expect(hours).toBeInTheDocument();
    const minutes = getAllByText("00")[1];
    await waitFor(() => {
      expect(hours).toHaveClass("selected");
      expect(minutes).toHaveClass("selected");
    });
  });

  it("should render today's date in the top label by default as not active when the value is not set", () => {
    const { getByText, getAllByText } = render(<DateTimePicker />);

    const today = new Date();
    const monthAndDay = LOCALE_DATE_TR_TR.monthsShort[today.getMonth()] + " " + today.getDate();
    expect(getByText(monthAndDay)).toBeInTheDocument();
    expect(getAllByText(today.getFullYear())[0]).toBeInTheDocument();
    expect(getByText(monthAndDay).parentElement).not.toHaveClass("active");
  });

  it("should render time label with underscores divided with colons when no time value is set", () => {
    const { getByText } = render(<DateTimePicker />);
    expect(getByText("__:__")).toBeInTheDocument();
  });

  it("should trigger onDateChange event when the date is changed", () => {
    const mockToday = new Date("August 4, 2025 00:00:00");
    const handeDateChange = jest.fn();
    const { getByText } = render(<DateTimePicker onDateChange={handeDateChange} value={mockToday} />);

    act(() => getByText("19").click());
    const selectedDate = new Date("August 19, 2025 00:00:00");
    expect(handeDateChange).toHaveBeenCalledWith(selectedDate);
  });

  it("should trigger onTimeChange event when the time is changed", () => {
    const handleTimeChange = jest.fn();
    const { getByText, getAllByText } = render(<DateTimePicker onTimeChange={handleTimeChange} />);

    act(() => getByText("schedule").parentElement!.click());
    act(() => getAllByText("18")[0].click());
    expect(handleTimeChange).toHaveBeenCalledWith({ hours: 18 });
    act(() => getByText("59").click());
    expect(handleTimeChange).toHaveBeenCalledWith({ hours: 18, minutes: 59 });
  });

  it("should not render clear and ok buttons when removeActionButtons is set to true", () => {
    const { rerender, queryByText } = render(<DateTimePicker />);
    expect(queryByText("Clear")).toBeInTheDocument();
    expect(queryByText("OK")).toBeInTheDocument();

    rerender(<DateTimePicker removeActionButtons />);
    expect(queryByText("Clear")).not.toBeInTheDocument();
    expect(queryByText("OK")).not.toBeInTheDocument();
  });

  it("should trigger onClearClick event when the clear button is clicked", () => {
    const handleClearClick = jest.fn();
    const { getByText } = render(<DateTimePicker onClearClick={handleClearClick} value={new Date(2000, 10, 11, 12, 13, 14)} />);
    act(() => getByText("Clear").click());
    expect(handleClearClick).toHaveBeenCalled();
  });

  it("should trigger onOKClick event when the OK button is clicked", () => {
    const handleOkClick = jest.fn();
    const date = new Date(2000, 10, 11, 12, 13, 14);
    const { getByText } = render(<DateTimePicker onOkClick={handleOkClick} value={date} />);
    act(() => getByText("OK").click());
    expect(handleOkClick).toHaveBeenCalledWith(date);

    act(() => getByText("Clear").click());
    act(() => getByText("OK").click());
    expect(handleOkClick).toHaveBeenCalledWith(undefined);
  });

  it("should enable seconds sections when secondsEnabled is set to true", () => {
    const { getByText, getAllByText } = render(<DateTimePicker secondsEnabled />);
    expect(getByText("__:__:__")).toBeInTheDocument();
    act(() => getByText("schedule").click());
    act(() => getAllByText("59")[1].click());
    expect(getByText("__:__:59")).toBeInTheDocument();
  });

  it("should reflect the locale given in the locale prop", () => {
    const LOCALE_DATETIME_CUSTOM: DateTimePickerLocale = {
      months: [
        "MyJanuary",
        "MyFebruary",
        "MyMarch",
        "MyApril",
        "MyMay",
        "MyJune",
        "MyJuly",
        "MyAugust",
        "MySeptember",
        "MyOctober",
        "MyNovember",
        "MyDecember",
      ],
      monthsShort: ["Ja1", "Fe2", "Ma3", "Ap4", "Ma5", "Ju6", "Ju7", "Ag8", "Se9", "O10", "N11", "D12"],
      weekDays: ["5D", "6D", "7D", "1D", "2D", "3D", "4D"],
      firstDayOfWeek: 3 /* 1D */,
      hoursAbbr: "H1",
      minutesAbbr: "M2",
      secondsAbbr: "S3",
      am: "AM",
      pm: "PM",
    };
    const { container, getByText, getAllByText } = render(
      <DateTimePicker locale={LOCALE_DATETIME_CUSTOM} secondsEnabled timeFormat="12h" />,
    );
    const thisMonth = new Date().getMonth();

    // Weekdays
    expect(getByText("5D")).toBeInTheDocument();
    expect(getByText("7D")).toBeInTheDocument();

    // First day of week
    expect(container.firstElementChild?.getElementsByClassName("weekDays")[0].firstElementChild?.textContent).toBe("1D");

    // Month names
    const monthButton = getByText(LOCALE_DATETIME_CUSTOM.months[thisMonth]);
    expect(monthButton).toBeInTheDocument();

    // Month names short
    act(() => monthButton.click());
    expect(getByText("D12")).toBeInTheDocument();
    act(() => getByText("D12").click());

    // Time abbreviations
    act(() => getByText("schedule").click());
    expect(getByText("H1")).toBeInTheDocument();
    expect(getByText("M2")).toBeInTheDocument();
    expect(getByText("S3")).toBeInTheDocument();
    expect(getAllByText("AM")).toHaveLength(2);
    expect(getByText("PM")).toBeInTheDocument();
  });

  it("should put clicked time value on the top label as active", () => {
    const { getByText, getAllByText } = render(<DateTimePicker secondsEnabled />);

    expect(getByText("__:__:__")).not.toHaveClass("active");
    act(() => getByText("schedule").click());

    const timeParts = getAllByText("00");
    act(() => timeParts[0].click());
    expect(getByText("00:__:__")).toHaveClass("active");
    act(() => timeParts[1].click());
    expect(getByText("00:00:__")).toHaveClass("active");
    act(() => timeParts[2].click());
    expect(getByText("00:00:00")).toHaveClass("active");
  });

  it("should clear selected classes, active classes, time values and set date label as today when the clear button is clicked", () => {
    const { getByText, getAllByText } = render(<DateTimePicker value={new Date("August 1, 2020 23:59:59")} />);
    act(() => getByText("Clear").click());
    expect(getByText("__:__")).not.toHaveClass("active");
    const today = new Date();
    expect(getByText(LOCALE_DATE_TR_TR.monthsShort[today.getMonth()] + " " + today.getDate()).parentElement).not.toHaveClass("active");
    expect(getAllByText(today.getFullYear())[0].parentElement).not.toHaveClass("active");
  });

  it("should clear selected time values when a date is not selected and the clear button is clicked", async () => {
    const { getAllByText, getByTestId, getByText } = render(<DateTimePicker />);
    const day11 = getByTestId("DatePickerDayContainer").children[10] as HTMLButtonElement;
    await userEvent.click(day11);

    const hours = getAllByText("00")[0];
    const minutes = getAllByText("00")[1];
    await waitFor(() => {
      expect(hours).toHaveClass("selected");
      expect(minutes).toHaveClass("selected");
      expect(getByText("00:00")).toBeInTheDocument();
    });

    await userEvent.click(getByText("Clear"));
    await waitFor(() => {
      expect(hours).not.toHaveClass("selected");
      expect(minutes).not.toHaveClass("selected");
      expect(getByText("__:__")).toBeInTheDocument();
    });
  });

  it("should show Time Period Selector when timeFormat is 12h", () => {
    const { getByText, getByTestId } = render(<DateTimePicker timeFormat="12h" />);

    act(() => getByText("schedule").click());

    expect(getByTestId("timePeriodSelector")).toBeInTheDocument();
  });

  it("should render time period info near the time value in 12-hour format", () => {
    const date = new Date("August 1, 2020 14:30:00");
    const { getByText, getByTestId } = render(<DateTimePicker timeFormat="12h" value={date} />);

    act(() => getByText("schedule").click());
    expect(getByTestId("dateTimeInfo").textContent).toContain(`02:30${LOCALE_DATE_TIME_TR_TR.pm}`);
  });

  it("should render time period as AM when timeFormat is 12h and no complete time value is selected yet", () => {
    const { getByText, getByTestId } = render(<DateTimePicker timeFormat="12h" />);

    act(() => getByText("schedule").click());
    expect(getByTestId("dateTimeInfo").textContent).toContain(LOCALE_DATE_TIME_TR_TR.am);
  });

  it("should change time when AM/PM buttons are clicked in 12-hour format", async () => {
    const handleTimeChange = jest.fn();
    const { getByText } = render(
      <DateTimePicker timeFormat="12h" value={new Date("August 1, 2020 14:30:00")} onTimeChange={handleTimeChange} />,
    );

    act(() => getByText("schedule").click());

    await userEvent.click(getByText("ÖÖ")); // Click AM

    expect(handleTimeChange).toHaveBeenCalledWith({
      hours: 2, // 14:30 (2:30 PM) -> 2:30 AM
      minutes: 30,
      seconds: 0,
    });
  });

  it("should convert midnight (12:00 AM) to noon (12:00 PM) when timeFormat is 12h and PM button is clicked (and vice versa when AM button is clicked)", async () => {
    const handleTimeChange = jest.fn();

    const { getByText } = render(
      <DateTimePicker timeFormat="12h" value={new Date("August 1, 2020 00:00:00")} onTimeChange={handleTimeChange} />,
    );
    act(() => getByText("schedule").click());
    await userEvent.click(getByText("ÖS")); // Click PM
    expect(handleTimeChange).toHaveBeenCalledWith({
      hours: 12, // 0:00 (12:00 AM) -> 12:00 PM
      minutes: 0,
      seconds: 0,
    });

    await userEvent.click(getByText("ÖÖ")); // Click AM
    expect(handleTimeChange).toHaveBeenCalledWith({
      hours: 0, // 12:00 PM -> 0:00 (12:00 AM)
      minutes: 0,
      seconds: 0,
    });
  });

  it("should display correct AM/PM period based on hour value in 12h format", () => {
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    const { getByText, getAllByText, rerender } = render(<DateTimePicker timeFormat="12h" value={date} />);

    act(() => getByText("schedule").click());

    // AM
    expect(getAllByText("ÖÖ")[1]).toHaveClass("selected");
    expect(getByText("ÖS")).not.toHaveClass("selected");

    const date1 = new Date();
    date1.setHours(15, 0, 0, 0);
    rerender(<DateTimePicker timeFormat="12h" value={date1} />);
    act(() => getByText("schedule").click());
    // PM
    expect(getAllByText("ÖS")[1]).toHaveClass("selected");
    expect(getByText("ÖÖ")).not.toHaveClass("selected");
  });

  it("should render 12 hours to select when timeFormat is 12h", () => {
    const { getByText, getByTestId } = render(<DateTimePicker timeFormat="12h" />);

    act(() => getByText("schedule").click());

    const ulListFirst = getByTestId("timeStripeContainer").querySelectorAll("ul")[0];

    expect(ulListFirst.children.length).toBe(12);
  });

  it("should render selected date as active in the top label in MMM DYYYY format", () => {
    const date = new Date("August 1, 2020 23:59:59");
    const { getByText, getAllByText } = render(<DateTimePicker value={date} />);

    const dateText = LOCALE_DATE_TR_TR.monthsShort[date.getMonth()] + " " + date.getDate();
    expect(getByText(dateText).parentElement).toHaveClass("active");

    const yearLabel = getAllByText(date.getFullYear())[0];
    expect(yearLabel.parentElement).toHaveClass("active");
    expect(yearLabel.parentElement).toHaveTextContent("Ağu 12020");
  });
  it("should render the selected time text in the time format given in the timeFormat prop", () => {
    const date = new Date("August 1, 2020 14:30:00");
    const { rerender, getByText, queryByTestId, getByTestId } = render(<DateTimePicker value={date} timeFormat="12h" />);

    act(() => getByText("schedule").click());

    const dateTimeInfo = getByTestId("dateTimeInfo");
    expect(dateTimeInfo.textContent).toContain("02:30");

    expect(queryByTestId("timePeriodSelector")).toBeInTheDocument();

    rerender(<DateTimePicker value={date} timeFormat="24h" />);
    act(() => getByText("schedule").click());
    expect(dateTimeInfo.textContent).toContain("14:30");

    expect(queryByTestId("timePeriodSelector")).not.toBeInTheDocument();
  });
});
