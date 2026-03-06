import DatePicker from "@/components/DatePicker/DatePicker";
import { render, act } from "@testing-library/react";
import { LOCALE_DATE_TR_TR } from "./locale/tr_TR";
import { DatePickerLocale } from "./types";
import { runPickerTests } from "@/components/Motif/Pickers/Picker.test";

export const runDatePickerCommonTests = () => {
  describe("DatePickerCommon", () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    it("should show today with a different style", () => {
      const { container } = render(<DatePicker />);

      const todayButton = container.firstElementChild?.getElementsByClassName("today")[0];
      expect(todayButton).toHaveTextContent(today.getDate().toString());
    });

    it("should show the next month in the picker when right arrow button in the Day Picker is clicked", () => {
      const { getByText } = render(<DatePicker />);

      act(() => getByText("arrow_forward").click());

      const nextMonth = getByText(LOCALE_DATE_TR_TR.months[(month + 1) % 12]);
      expect(nextMonth).toBeInTheDocument();
    });

    it("should show the first month of next the year when the picker currently shows the last month of the year and the right arrow button in the Day Picker is clicked", () => {
      const mockDate = new Date(2025, 11, 31);
      const { getByText } = render(<DatePicker value={mockDate} />);

      act(() => getByText("arrow_forward").click());
      const firstMonth = getByText(LOCALE_DATE_TR_TR.months[0]);
      expect(firstMonth).toBeInTheDocument();
      expect(getByText(mockDate.getFullYear() + 1)).toBeInTheDocument();
    });

    it("should show the previous month in the picker when left arrow button in the Day Picker is clicked", () => {
      const { getByText } = render(<DatePicker />);

      act(() => getByText("arrow_back").click());
      const previousMonth = getByText(LOCALE_DATE_TR_TR.months[(month - 1 + 12) % 12]);
      expect(previousMonth).toBeInTheDocument();
    });

    it("should show the last month of previous the year when the picker currently shows the first month of the year and the left arrow button in the Day Picker is clicked", () => {
      const mockDate = new Date(2025, 0, 1);
      const { getByText } = render(<DatePicker value={mockDate} />);

      act(() => getByText("arrow_back").click());
      const lastMonth = getByText(LOCALE_DATE_TR_TR.months[11]);
      expect(lastMonth).toBeInTheDocument();
      expect(getByText(mockDate.getFullYear() - 1)).toBeInTheDocument();
    });

    it("should show the next year in the picker when right arrow button in the Month Picker is clicked", () => {
      const { getByText } = render(<DatePicker />);

      const monthButton = getByText(LOCALE_DATE_TR_TR.months[month]);
      act(() => monthButton.click());

      act(() => getByText("arrow_forward").click());
      expect(getByText(year + 1)).toBeInTheDocument();
    });

    it("should shift the list of years by 16 when back or forward arrow is clicked in the Year Picker", () => {
      const { getByText, getByTestId } = render(<DatePicker />);

      act(() => getByText(year).click());

      const backArrow = getByText("arrow_back");
      const forwardArrow = getByText("arrow_forward");

      const firstYearInList = parseInt(getByTestId("DatePickerYearsContainer").firstElementChild!.textContent);

      act(() => backArrow.click());
      expect(getByText(firstYearInList - 16)).toBeInTheDocument();

      act(() => forwardArrow.click());
      act(() => forwardArrow.click());
      expect(getByText((firstYearInList + 16).toString())).toBeInTheDocument();
    });

    it("should correctly render the days of month which is currently visible", () => {
      const { getAllByText, getByTestId } = render(<DatePicker value={new Date(2024, 3, 12)} />);

      const dateApril2024 = new Date(2024, 3, 1);
      const daysOfApril2024 = Array.from({ length: dateApril2024.getDate() }, (_, i) => i + 1);
      daysOfApril2024.forEach(day => expect(getAllByText(day)[0]).not.toHaveAttribute("disabled", true));

      const dayButtons = (getByTestId("DatePickerDayContainer") as HTMLDivElement).getElementsByTagName("button");
      expect(dayButtons).toHaveLength(35);

      const day18 = dayButtons[17];
      expect(day18).toHaveTextContent("18");

      const nextMonthsDay2 = dayButtons[31];
      expect(nextMonthsDay2).toHaveTextContent("2");
    });

    it("should render the Year Picker when the year in the Day Picker is clicked. Then it should return to the Day Picker, when a year is clicked in the opened Year Picker", () => {
      const { getByText, getByTestId, queryByTestId, getAllByText } = render(<DatePicker />);

      act(() => getByText(year).click());
      expect(getByTestId("DatePickerYearsContainer")).toBeInTheDocument();

      act(() => getAllByText(year)[1].click());
      expect(queryByTestId("DatePickerYearsContainer")).not.toBeInTheDocument();
      expect(getByText(year)).toBeInTheDocument();
    });

    it("should open the Year Picker when the year in the Month Picker is clicked. Then it should return to the Month Picker when a year is clicked in the opened Year Picker", () => {
      const { getByText, getByTestId, queryByTestId, getAllByText } = render(<DatePicker />);

      act(() => getByText(LOCALE_DATE_TR_TR.months[month]).click());
      expect(getByTestId("DatePickerMonthsContainer")).toBeInTheDocument();
      act(() => getAllByText(year)[0].click());
      expect(getByTestId("DatePickerYearsContainer")).toBeInTheDocument();

      act(() => getAllByText(year)[1].click());
      expect(queryByTestId("DatePickerYearsContainer")).not.toBeInTheDocument();
      expect(getByTestId("DatePickerMonthsContainer")).toBeInTheDocument();
    });

    it("should show the current year in the header and in the years list of the Year Picker", () => {
      const { getByText, getAllByText } = render(<DatePicker />);

      act(() => getByText(year).click());
      expect(getAllByText(year)).toHaveLength(2);
    });

    it("should render the previous month's last days and the next month's first days in the picker as disabled when number of weeks in the current month leaves extra space in the picker", () => {
      const getDaysInfo = (year: number, month: number, firstDayOfTheWeek: number) => {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // days from the previous month to be displayed
        const prevMonthDays = (firstDayOfMonth - firstDayOfTheWeek + 7) % 7;
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        const lastDaysOfPrevMonth = Array.from({ length: prevMonthDays }, (_, i) => (prevMonthLastDate - prevMonthDays + 1 + i).toString());

        // days from the next month to be displayed
        const totalGridCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;
        const nextMonthDays = totalGridCells - (prevMonthDays + daysInMonth);
        const firstDaysOfNextMonth = Array.from({ length: nextMonthDays }, (_, i) => (i + 1).toString());

        // total number of days to show
        const totalNumberOfDaysToShow = prevMonthDays + daysInMonth + nextMonthDays;

        return { lastDaysOfPrevMonth, firstDaysOfNextMonth, totalNumberOfDaysToShow };
      };

      const dateSeptember2024 = new Date(2024, 8, 1);
      const firstDayOfTheWeek = 1; // Monday
      const daysInfo = getDaysInfo(dateSeptember2024.getFullYear(), dateSeptember2024.getMonth(), firstDayOfTheWeek);

      const { getByTestId } = render(<DatePicker value={dateSeptember2024} />);

      const dayButtons = (getByTestId("DatePickerDayContainer") as HTMLDivElement).getElementsByTagName("button");
      expect(dayButtons).toHaveLength(daysInfo.totalNumberOfDaysToShow);

      daysInfo.lastDaysOfPrevMonth.forEach((day, index) => {
        const dayButton = dayButtons[index];
        expect(dayButton.textContent).toBe(day);
        expect(dayButton).toBeDisabled();
      });

      daysInfo.firstDaysOfNextMonth.forEach((day, index) => {
        const dayButton = dayButtons[36 + index];
        expect(dayButton.textContent).toBe(day);
        expect(dayButton).toBeDisabled();
      });
    });

    it("should render the Month Picker when the month name in the Day Picker is clicked. Then it should return to the Day Picker when a month is clicked in the opened Month Picker", () => {
      const { getByText, getByTestId, queryByTestId } = render(<DatePicker />);

      act(() => getByText(LOCALE_DATE_TR_TR.months[month]).click());
      expect(getByTestId("DatePickerMonthsContainer")).toBeInTheDocument();

      act(() => getByText(LOCALE_DATE_TR_TR.monthsShort[month]).click());
      expect(queryByTestId("DatePickerMonthsContainer")).not.toBeInTheDocument();
      expect(getByText(LOCALE_DATE_TR_TR.months[month])).toBeInTheDocument();
    });

    it("should not show the same day of today in different style when the today is not in the currently visible month and year", () => {
      const { container, getByText } = render(<DatePicker />);

      act(() => getByText("arrow_forward").click());
      expect(container.firstElementChild?.getElementsByClassName("today")).toHaveLength(0);

      act(() => getByText("arrow_back").click());
      expect(container.firstElementChild?.getElementsByClassName("today")).toHaveLength(1);
      act(() => getByText(year).click());
      act(() => getByText(year + 1).click());
      expect(container.firstElementChild?.getElementsByClassName("today")).toHaveLength(0);
    });

    it("should not show the selected day in the Day Picker when the selected day is not in the currently visible month and year", () => {
      const date = new Date(2025, 1, 1);
      const { getByText, getAllByText } = render(<DatePicker value={date} />);

      act(() => getByText("arrow_forward").click());
      getAllByText("1").forEach(day => expect(day).not.toHaveClass("selected"));

      act(() => getAllByText("28")[1].click());
      act(() => getByText("arrow_back").click());
      getAllByText("28").forEach(day => expect(day).not.toHaveClass("selected"));

      act(() => getAllByText("28")[1].click());
      act(() => getByText("2025").click());
      act(() => getByText("2026").click());
      getAllByText("28").forEach(day => expect(day).not.toHaveClass("selected"));
    });

    it("should show the current year as selected in the Year Picker", () => {
      const { getByText, getAllByText } = render(<DatePicker />);

      act(() => getByText(year).click());

      expect(getAllByText(year)[1]).toHaveClass("selected");
    });

    it("should show the current month as selected in the Month Picker", () => {
      const { getByText } = render(<DatePicker />);

      act(() => getByText(LOCALE_DATE_TR_TR.months[month]).click());

      const monthButton = getByText(LOCALE_DATE_TR_TR.monthsShort[month]);
      expect(monthButton).toHaveClass("selected");
    });

    it("should not show the name of the current month as selected when any arrow button in the Month Picker is clicked and the current year is changed", () => {
      const { getByText } = render(<DatePicker />);

      act(() => getByText(LOCALE_DATE_TR_TR.months[month]).click());
      const monthButton = getByText(LOCALE_DATE_TR_TR.monthsShort[month]);
      expect(monthButton).toHaveClass("selected");

      act(() => getByText("arrow_forward").click());
      expect(monthButton).not.toHaveClass("selected");

      act(() => getByText("arrow_back").click());
      act(() => getByText("arrow_back").click());
      expect(monthButton).not.toHaveClass("selected");
    });

    it("should still show the correct day as selected when the month is changed and set back to the original month", () => {
      const date = new Date(2025, 1, 1);
      const { getByText, getAllByText } = render(<DatePicker value={date} />);

      expect(getAllByText("1")[0]).toHaveClass("selected");
      act(() => getByText("arrow_forward").click());
      expect(getAllByText("1")[0]).not.toHaveClass("selected");
      act(() => getByText("arrow_back").click());
      expect(getAllByText("1")[0]).toHaveClass("selected");
    });
  });
};

describe("DatePicker", () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  runPickerTests();

  runDatePickerCommonTests();

  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container, getByText, getByTestId } = render(<DatePicker value={new Date(2000, 1, 15)} />);
    expect(container).toMatchSnapshot();

    // variant: borderless
    expect(getByTestId("Picker")).toHaveClass("borderless");

    // locale: Turkish
    expect(getByText("Pt")).toBeInTheDocument();
    expect(getByText("Sa")).toBeInTheDocument();
    expect(getByText("Ct")).toBeInTheDocument();
    expect(getByText(LOCALE_DATE_TR_TR.months[new Date(2000, 1).getMonth()])).toBeInTheDocument();

    // size: md
    expect(getByTestId("Picker")).toHaveClass("md");
  });

  it("should have class name given in the className prop", () => {
    const className = "test-class";
    const { container } = render(<DatePicker className={className} />);
    expect(container.firstElementChild).toHaveClass(className);
  });

  it("should not render clear and ok buttons when removeActionButtons is set to true", () => {
    const { rerender, queryByText } = render(<DatePicker />);
    expect(queryByText("Clear")).toBeInTheDocument();
    expect(queryByText("OK")).toBeInTheDocument();

    rerender(<DatePicker removeActionButtons />);
    expect(queryByText("Clear")).not.toBeInTheDocument();
    expect(queryByText("OK")).not.toBeInTheDocument();
  });

  it("should fire onPickerChange event with 'month' parameter when the picker is switched to Month Picker", () => {
    const onPickerChange = jest.fn();
    const { getByText, queryByText } = render(<DatePicker onPickerChange={onPickerChange} />);

    const monthButton = getByText(LOCALE_DATE_TR_TR.months[month]);
    act(() => monthButton.click());
    expect(onPickerChange).toHaveBeenNthCalledWith(1, "month");

    const yearButtonInMonthPicker = getByText(year);
    act(() => yearButtonInMonthPicker.click());

    const newYearButton = queryByText(year + 1) ?? queryByText(year - 1);
    act(() => newYearButton!.click());
    expect(onPickerChange).toHaveBeenNthCalledWith(3, "month");
  });

  it("should fire onPickerChange event with 'day' parameter when the picker is switched to Day Picker", () => {
    const onPickerChange = jest.fn();
    const { getByText, queryByText } = render(<DatePicker onPickerChange={onPickerChange} />);

    const monthButton = getByText(LOCALE_DATE_TR_TR.months[month]);
    act(() => monthButton.click());

    const newMonthButton = getByText(LOCALE_DATE_TR_TR.monthsShort[(month + 1) % 12]);
    act(() => newMonthButton.click());
    expect(onPickerChange).toHaveBeenNthCalledWith(2, "day");

    const yearButton = getByText(year);
    act(() => yearButton.click());

    const newYearButton = queryByText(year + 1) ?? queryByText(year - 1);
    act(() => newYearButton!.click());
    expect(onPickerChange).toHaveBeenNthCalledWith(4, "day");
  });

  it("should fire onPickerChange event with 'year' parameter when the picker is switched to Year Picker", () => {
    const onPickerChange = jest.fn();
    const { getByText, queryByText } = render(<DatePicker onPickerChange={onPickerChange} />);

    const yearButton = getByText(year);
    act(() => yearButton.click());
    expect(onPickerChange).toHaveBeenNthCalledWith(1, "year");

    const newYearInYearPicker = queryByText(year + 1) ?? queryByText(year - 1);
    const newYear = parseInt(newYearInYearPicker!.textContent);
    act(() => newYearInYearPicker!.click());

    const monthButton = getByText(LOCALE_DATE_TR_TR.months[month]);
    act(() => monthButton.click());

    const yearButtonInMonthPicker = getByText(newYear);
    act(() => yearButtonInMonthPicker.click());
    expect(onPickerChange).toHaveBeenNthCalledWith(4, "year");
  });

  it("should fire onDateChange event when a day is selected and is different than the currently selected day", () => {
    const onDateChange = jest.fn();
    const { getByText } = render(<DatePicker onDateChange={onDateChange} />);

    const dayButton = getByText("10");
    act(() => dayButton.click());
    expect(onDateChange).toHaveBeenCalledWith(new Date(year, month, 10));

    act(() => dayButton.click());
    expect(onDateChange).not.toHaveBeenCalledTimes(2);
  });

  it("should fire onDateChange when the selected date is cleared", () => {
    const onDateChange = jest.fn();
    const { getByText } = render(<DatePicker value={today} onDateChange={onDateChange} />);

    act(() => getByText("Clear").click());
    expect(onDateChange).toHaveBeenCalledWith(undefined);
  });

  it("should clear the selected date when clear button is clicked", () => {
    const { getByText } = render(<DatePicker value={new Date(year, month, 10)} />);

    const day10Button = getByText("10");
    expect(day10Button).toHaveClass("selected");

    const clearButton = getByText("Clear");
    act(() => clearButton.click());
    expect(day10Button).not.toHaveClass("selected");
  });

  it("should fire onOkClick event when the OK button is clicked", () => {
    const onOkClick = jest.fn();
    const { getByText } = render(<DatePicker onOkClick={onOkClick} />);

    const okButton = getByText("OK");
    const day10Button = getByText("10");

    act(() => okButton.click());
    expect(onOkClick).toHaveBeenCalledWith(undefined);

    act(() => day10Button.click());
    act(() => okButton.click());
    expect(onOkClick).toHaveBeenCalledWith(new Date(year, month, 10));
  });

  it("should reflect the locale given in the locale prop", () => {
    const LOCALE_DATE_ES_ES: DatePickerLocale = {
      months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      weekDays: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
      firstDayOfWeek: 3 /* wednesday */,
    };
    const { container, getByText } = render(<DatePicker locale={LOCALE_DATE_ES_ES} value={new Date(2025, 3, 10)} />);

    // Weekdays
    expect(getByText("Do")).toBeInTheDocument();
    expect(getByText("Vi")).toBeInTheDocument();

    // First day of week
    expect(container.firstElementChild?.getElementsByClassName("weekDays")[0].firstElementChild?.textContent).toBe("Mi");

    // Month names
    const monthButton = getByText("Abril");
    expect(monthButton).toBeInTheDocument();

    // Month names short
    act(() => monthButton.click());
    expect(getByText("Dic")).toBeInTheDocument();
  });

  it("should render the given value in the value prop as selected", () => {
    const dateToSelect = new Date(2018, 3, 10);
    const { getByText } = render(<DatePicker value={dateToSelect} />);

    expect(getByText(dateToSelect.getDate())).toHaveClass("selected");
    expect(getByText(LOCALE_DATE_TR_TR.months[dateToSelect.getMonth()])).toBeInTheDocument();
    expect(getByText(dateToSelect.getFullYear())).toBeInTheDocument();
  });
});
