import { runPickerTests } from "@/components/Motif/Pickers/Picker.test";
import { render, within } from "@testing-library/react";
import DateRangePicker from "@/components/DateRangePicker/DateRangePicker";
import { LOCALE_DATE_RANGE_TR_TR } from "@/components/DateRangePicker/locale/tr_TR";
import { formatDate } from "@/components/InputDate/helper";
import { LOCALE_DATE_TR_TR } from "@/components/DatePicker/locale/tr_TR";
import { userEvent } from "@testing-library/user-event";
import { DateUtils } from "../../../utils/dateUtils";
import { ReactNode } from "react";
import { defaultDateFormat } from "../Motif/Pickers/types";

describe("DateRangePicker", () => {
  const today = new Date(2023, 5, 15);
  today.setHours(0, 0, 0, 0);
  const dropdownDays: number[] = [7, 30, 180, 365];
  const year = today.getFullYear();
  const month = today.getMonth();

  const formatDateWithDefaultFormatAndTR = (mockStartDate: Date) => formatDate(mockStartDate, defaultDateFormat, LOCALE_DATE_RANGE_TR_TR);

  beforeAll(() => {
    jest.spyOn(DateUtils, "getTodayTimeless").mockReturnValue(today);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  runPickerTests();

  const renderExt = (ui: ReactNode) => {
    const result = render(ui);

    const getFirstPicker = () => Array.from(result.getByTestId("DateRangePickerContainer").children)[1] as HTMLElement;
    const getSecondPicker = () => Array.from(result.getByTestId("DateRangePickerContainer").children)[2] as HTMLElement;
    const getFirstInput = () => result.getAllByTestId("inputItem")[0].querySelector("input") as HTMLInputElement;
    const getSecondInput = () => result.getAllByTestId("inputItem")[1].querySelector("input") as HTMLInputElement;

    return {
      ...result,
      getFirstPicker,
      getSecondPicker,
      getFirstInput,
      getSecondInput,
    };
  };

  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { getFirstPicker, getByTestId, container } = renderExt(
      <DateRangePicker locale={LOCALE_DATE_RANGE_TR_TR} value={[new Date(2000, 1, 15), new Date(2000, 1, 18)]} />,
    );
    expect(container).toMatchSnapshot();
    const pickerContainer = getByTestId("Picker");
    // locale: TR
    expect(within(getFirstPicker()).getByText("Çr")).toBeInTheDocument();
    expect(within(getFirstPicker()).getByText("Pe")).toBeInTheDocument();

    // variant: borderless
    expect(pickerContainer).toHaveClass("borderless");

    // size: md
    expect(pickerContainer).toHaveClass("md");
  });

  it("should render a dropdown to select predefined date ranges", async () => {
    const { queryByText, getByTestId } = renderExt(<DateRangePicker />);
    await userEvent.click(getByTestId("Dropdown").firstElementChild!);

    expect(queryByText(LOCALE_DATE_RANGE_TR_TR.today)).toBeInTheDocument();
    dropdownDays.forEach(day => {
      expect(queryByText(`${LOCALE_DATE_RANGE_TR_TR.last} ${day} ${LOCALE_DATE_RANGE_TR_TR.days}`)).toBeInTheDocument();
    });
  });

  it("should select clicked the date range in the pickers when an item from the dropdown is clicked ", async () => {
    const { getByText, getByTestId, getFirstPicker } = renderExt(<DateRangePicker />);
    const dropdownTrigger = getByTestId("Dropdown").firstElementChild as HTMLButtonElement;
    await userEvent.click(dropdownTrigger);

    const lastXDays = 7;
    const chosenDay = getByText(`${LOCALE_DATE_RANGE_TR_TR.last} ${lastXDays} ${LOCALE_DATE_RANGE_TR_TR.days}`);
    await userEvent.click(chosenDay);

    const startDateInMillis = new Date(year, month, today.getDate() - lastXDays + 1).getTime();
    const startDateButton = getFirstPicker().querySelector(`[data-date="${startDateInMillis}"]`);
    const endDateButton = getFirstPicker().querySelector(`[data-date="${today.getTime()}"]`);
    expect(startDateButton).toHaveClass("selected");
    expect(endDateButton).toHaveClass("selected");
  });

  it("should render the end date in one of the pickers visible when an item from the dropdown is clicked ", async () => {
    const { getByText, getByTestId, rerender, getFirstPicker } = renderExt(<DateRangePicker />);
    const dropdownTrigger = getByTestId("Dropdown").firstElementChild as HTMLButtonElement;
    await userEvent.click(dropdownTrigger);

    const chosenDay = getByText(`${LOCALE_DATE_RANGE_TR_TR.last} ${dropdownDays[2]} ${LOCALE_DATE_RANGE_TR_TR.days}`);
    await userEvent.click(chosenDay);

    const endDateButton = getFirstPicker().querySelector(`[data-date="${today.getTime()}"]`);
    expect(endDateButton).toHaveClass("selected");

    rerender(<DateRangePicker value={[new Date(year - 5, month, today.getDate()), new Date(year - 5, month, today.getDate())]} />);
    await userEvent.click(dropdownTrigger);
    await userEvent.click(chosenDay);
    const endDateButtonSecond = getFirstPicker().querySelector(`[data-date="${today.getTime()}"]`);
    expect(endDateButtonSecond).toHaveClass("selected");
  });

  it("should render the end date in one of the pickers visible when an item from the dropdown is clicked and picker is showing past date", async () => {
    const { getByText, getByTestId, container } = renderExt(<DateRangePicker />);
    for (let i = 0; i < 10; i++) {
      await userEvent.click(getByText("arrow_back"));
    }

    const dropdownTrigger = getByTestId("Dropdown").firstElementChild as HTMLButtonElement;
    await userEvent.click(dropdownTrigger);

    const chosenDay = getByText(`${LOCALE_DATE_RANGE_TR_TR.last} ${dropdownDays[1]} ${LOCALE_DATE_RANGE_TR_TR.days}`);
    await userEvent.click(chosenDay);

    const endDateButton = container.querySelector(`[data-date="${today.getTime()}"]`);
    expect(endDateButton).toHaveClass("selected");
  });

  it("should reflect the date range to the inputs when an item from the dropdown is clicked", async () => {
    const { getByText, getByTestId, getFirstInput, getSecondInput } = renderExt(<DateRangePicker />);
    const dropdownTrigger = getByTestId("Dropdown").firstElementChild as HTMLButtonElement;
    await userEvent.click(dropdownTrigger);

    const chosenDay = getByText(`${LOCALE_DATE_RANGE_TR_TR.last} ${dropdownDays[0]} ${LOCALE_DATE_RANGE_TR_TR.days}`);
    await userEvent.click(chosenDay);

    expect(getFirstInput().value).toBe(formatDateWithDefaultFormatAndTR(new Date(year, month, today.getDate() - 6)));
    expect(getSecondInput().value).toBe(formatDateWithDefaultFormatAndTR(today));
  });

  it("should render 2 text inputs to type start and end dates", () => {
    const mockStartDate = new Date(year, month, 1);
    const mockEndDate = new Date(year, month, 18);
    const { getFirstInput, getSecondInput } = renderExt(<DateRangePicker value={[mockStartDate, mockEndDate]} />);
    expect(getFirstInput().value).toBe(formatDateWithDefaultFormatAndTR(mockStartDate));
    expect(getSecondInput().value).toBe(formatDateWithDefaultFormatAndTR(mockEndDate));
  });

  it("should select a single day in one of the pickers visible when a date is typed in the correct format in the first text input", async () => {
    // When current date is visible in one of the pickers visible
    const mockFirstDate = new Date(year, month, today.getDate() - 1);
    const { rerender, getFirstInput, getFirstPicker } = renderExt(<DateRangePicker />);

    const startInput = getFirstInput();
    await userEvent.type(startInput, formatDateWithDefaultFormatAndTR(mockFirstDate));
    expect(startInput.value).toBe(formatDateWithDefaultFormatAndTR(mockFirstDate));

    const firstPicker = getFirstPicker();
    const targetButton = firstPicker.querySelector(`[data-date="${mockFirstDate.getTime()}"]`);
    expect(targetButton).toHaveClass("selected");

    // When current date is not visible in one of the pickers visible
    rerender(<DateRangePicker />);
    const mockSecondDate = new Date(year - 1, month, 10);
    await userEvent.clear(startInput);
    await userEvent.type(startInput, formatDateWithDefaultFormatAndTR(mockSecondDate));
    expect(startInput.value).toBe(formatDateWithDefaultFormatAndTR(mockSecondDate));

    const targetButtonSecond = firstPicker.querySelector(`[data-date="${mockSecondDate.getTime()}"]`);
    expect(targetButtonSecond).toHaveClass("selected");
  });

  it("should select a single day in one of the pickers visible when the inputs are empty and a date is typed in the correct format in the second text input", async () => {
    // When current date is visible in one of the pickers visible
    const mockFutureDate = new Date(year, month, today.getDate() + 30);
    const { rerender, getSecondInput, getSecondPicker } = renderExt(<DateRangePicker />);

    const endInput = getSecondInput();
    await userEvent.type(endInput, formatDateWithDefaultFormatAndTR(mockFutureDate));
    expect(endInput.value).toBe(formatDateWithDefaultFormatAndTR(mockFutureDate));

    const secondPicker = getSecondPicker();
    const targetButton = secondPicker.querySelector(`[data-date="${mockFutureDate.getTime()}"]`);
    expect(targetButton).toHaveClass("selected");

    // When current date is not visible in one of the pickers visible
    rerender(<DateRangePicker />);
    const mockPastDate = new Date(year - 5, month, 10);
    await userEvent.clear(endInput);
    await userEvent.type(endInput, formatDateWithDefaultFormatAndTR(mockPastDate));
    expect(endInput.value).toBe(formatDateWithDefaultFormatAndTR(mockPastDate));

    const targetButtonSecond = secondPicker.querySelector(`[data-date="${mockPastDate.getTime()}"]`);
    expect(targetButtonSecond).toHaveClass("selected");
  });

  it("should reorder the dates in the text inputs when a date less than the one in the first input is typed into the second input", async () => {
    const mockBiggerDate = new Date(year + 5, month, today.getDate());
    const mockLowerDate = new Date(year - 5, month, today.getDate());
    const { getFirstInput, getSecondInput } = renderExt(<DateRangePicker />);

    const firstInput = getFirstInput();
    await userEvent.type(firstInput, formatDateWithDefaultFormatAndTR(mockBiggerDate));
    expect(firstInput.value).toBe(formatDateWithDefaultFormatAndTR(mockBiggerDate));

    const secondInput = getSecondInput();
    await userEvent.type(secondInput, formatDateWithDefaultFormatAndTR(mockLowerDate));

    expect(firstInput.value).toBe(formatDateWithDefaultFormatAndTR(mockLowerDate));
    expect(secondInput.value).toBe(formatDateWithDefaultFormatAndTR(mockBiggerDate));
  });

  it("should reorder the dates in the text inputs when a date more than the in the second picker is typed into the first picker", async () => {
    const mockBiggerDate = new Date(year + 5, month, today.getDate());
    const mockLowerDate = new Date(year - 5, month, today.getDate());
    const { getFirstInput, getSecondInput } = renderExt(<DateRangePicker />);

    const secondInput = getSecondInput();
    await userEvent.type(secondInput, formatDateWithDefaultFormatAndTR(mockLowerDate));
    expect(secondInput.value).toBe(formatDateWithDefaultFormatAndTR(mockLowerDate));

    const firstInput = getFirstInput();
    await userEvent.type(firstInput, formatDateWithDefaultFormatAndTR(mockBiggerDate));

    expect(firstInput.value).toBe(formatDateWithDefaultFormatAndTR(mockLowerDate));
    expect(secondInput.value).toBe(formatDateWithDefaultFormatAndTR(mockBiggerDate));
  });

  it("should render the current month in the first picker and the next month in the second picker when the value prop is not given", () => {
    const { getFirstPicker, getSecondPicker } = renderExt(<DateRangePicker />);
    expect(within(getSecondPicker()).getByText(LOCALE_DATE_TR_TR.months[today.getMonth() + 1])).toBeInTheDocument();
    expect(within(getFirstPicker()).getByText(LOCALE_DATE_TR_TR.months[today.getMonth()])).toBeInTheDocument();
  });

  it("should render a left arrow in the first picker", () => {
    const { getFirstPicker } = renderExt(<DateRangePicker />);
    const backArrow = within(getFirstPicker()).getByText("arrow_back");
    expect(backArrow).toBeInTheDocument();
  });

  it("should render a right arrow in the second picker", () => {
    const { getSecondPicker } = renderExt(<DateRangePicker />);
    const forwardArrow = within(getSecondPicker()).getByText("arrow_forward");
    expect(forwardArrow).toBeInTheDocument();
  });

  it("should swipe the months to the left and render the previous month in the first picker when left arrow button is clicked", async () => {
    const { getByText, getByTestId } = renderExt(<DateRangePicker value={[new Date(year, month, 1), new Date(year, month, 18)]} />);
    const previousMonthLabel = LOCALE_DATE_TR_TR.months[today.getMonth() - 1];
    await userEvent.click(getByText("arrow_back"));
    const firstVisiblePicker = Array.from(getByTestId("DateRangePickerContainer").children)[0] as HTMLElement;
    const pastMonth = within(firstVisiblePicker).getByText(previousMonthLabel);
    expect(pastMonth).toBeInTheDocument();
  });

  it("should swipe the months to the right and render the next month in the second picker when right arrow button is clicked", async () => {
    const { getByText, getByTestId } = renderExt(<DateRangePicker value={[new Date(year, month, 1), new Date(year, month, 18)]} />);
    const futureMonthLabel = LOCALE_DATE_TR_TR.months[today.getMonth() + 2];
    await userEvent.click(getByText("arrow_forward"));
    const lastPicker = Array.from(getByTestId("DateRangePickerContainer").children)[3] as HTMLElement;
    const futureMonth = within(lastPicker).getByText(futureMonthLabel);
    expect(futureMonth).toBeInTheDocument();
  });

  it("should render the dates in hovered style, between the single selected date and the date currently hovered", async () => {
    const { container } = renderExt(<DateRangePicker value={[new Date(year, month, 5)]} />);
    const hoverButtonBeforeFirst = container.querySelector(`[data-date="${new Date(year, month, 3).getTime()}"]`) as HTMLButtonElement;
    const hoverButtonBeforeSecond = container.querySelector(`[data-date="${new Date(year, month, 4).getTime()}"]`) as HTMLButtonElement;
    const hoverButtonAfterFirst = container.querySelector(`[data-date="${new Date(year, month, 6).getTime()}"]`) as HTMLButtonElement;
    const hoverButtonAfterSecond = container.querySelector(`[data-date="${new Date(year, month, 7).getTime()}"]`) as HTMLButtonElement;
    await userEvent.hover(hoverButtonBeforeFirst);
    expect(hoverButtonBeforeFirst).toHaveClass("isInRange");
    expect(hoverButtonBeforeSecond).toHaveClass("isInRange");
    await userEvent.hover(hoverButtonAfterSecond);
    expect(hoverButtonAfterSecond).toHaveClass("isInRange");
    expect(hoverButtonAfterFirst).toHaveClass("isInRange");
  });

  it("should not render the dates hovered when start and end dates are selected", async () => {
    const { container } = renderExt(<DateRangePicker value={[new Date(year, month, 5), new Date(year, month, 7)]} />);
    const hoverButtonBeforeFirst = container.querySelector(`[data-date="${new Date(year, month, 3).getTime()}"]`) as HTMLButtonElement;
    const hoverButtonBeforeSecond = container.querySelector(`[data-date="${new Date(year, month, 4).getTime()}"]`) as HTMLButtonElement;
    const hoverButtonAfterFirst = container.querySelector(`[data-date="${new Date(year, month, 6).getTime()}"]`) as HTMLButtonElement;
    const hoverButtonAfterSecond = container.querySelector(`[data-date="${new Date(year, month, 9).getTime()}"]`) as HTMLButtonElement;
    await userEvent.hover(hoverButtonBeforeFirst);
    expect(hoverButtonBeforeFirst).not.toHaveClass("isInRange");
    expect(hoverButtonBeforeSecond).not.toHaveClass("isInRange");
    await userEvent.hover(hoverButtonAfterSecond);
    expect(hoverButtonAfterSecond).not.toHaveClass("isInRange");
    expect(hoverButtonAfterFirst).not.toHaveClass("isInRange");
  });

  it("should render start, end and the dates between as selected when both dates are selected", () => {
    const mockStartDate = new Date(year, month, 5);
    const mockEndDate = new Date(year, month, 7);

    const { container } = renderExt(<DateRangePicker value={[mockStartDate, mockEndDate]} />);
    const hoverButtonInRange = container.querySelector(`[data-date="${new Date(year, month, 6).getTime()}"]`) as HTMLButtonElement;
    const hoverButtonStart = container.querySelector(`[data-date="${mockStartDate.getTime()}"]`) as HTMLButtonElement;
    const hoverButtonEnd = container.querySelector(`[data-date="${mockEndDate.getTime()}"]`) as HTMLButtonElement;

    expect(hoverButtonInRange).toHaveClass("partiallySelected");
    expect(hoverButtonStart).toHaveClass("selected");
    expect(hoverButtonEnd).toHaveClass("selected");
  });

  it("should render Clear and OK buttons", () => {
    const { queryByText } = renderExt(<DateRangePicker />);
    expect(queryByText("Clear")).toBeInTheDocument();
    expect(queryByText("OK")).toBeInTheDocument();
  });

  it("should not render Clear and OK buttons when removeActionButtons is true", () => {
    const { queryByText } = renderExt(<DateRangePicker removeActionButtons />);
    expect(queryByText("Clear")).not.toBeInTheDocument();
    expect(queryByText("OK")).not.toBeInTheDocument();
  });

  it("should show today with a different style", () => {
    const { container } = renderExt(<DateRangePicker />);
    const todayButton = container.querySelector(`[data-date="${today.getTime()}"]`) as HTMLButtonElement;
    expect(todayButton).toHaveClass("today");
  });

  it("should replace the first input value and clear the second input when both inputs are already selected and a new date is chosen", async () => {
    const mockClickedDate = new Date(year, month, 18);
    const { getFirstPicker, getFirstInput, getSecondInput } = renderExt(
      <DateRangePicker value={[new Date(year, month, 1), new Date(year, month, 10)]} />,
    );

    const endDateButton = getFirstPicker().querySelector(`[data-date="${mockClickedDate.getTime()}"]`) as HTMLButtonElement;
    await userEvent.click(endDateButton);
    expect(getFirstInput().value).toBe(formatDateWithDefaultFormatAndTR(mockClickedDate));
    expect(getSecondInput().value).toBe("");
  });

  it("should clear all inputs and selected dates in the pickers when Clear button is clicked", async () => {
    const mockStartDate = new Date(year, month, 1);
    const mockEndDate = new Date(year, month, 3);
    const { queryByText, getFirstInput, getSecondInput, getFirstPicker } = renderExt(
      <DateRangePicker value={[mockStartDate, mockEndDate]} />,
    );

    const clearButton = queryByText("Clear") as HTMLButtonElement;
    await userEvent.click(clearButton);

    expect(getFirstInput().value).toBe("");
    expect(getSecondInput().value).toBe("");

    const firstPicker = getFirstPicker();
    const startDateButton = firstPicker.querySelector(`[data-date="${mockStartDate.getTime()}"]`);
    const endDateButton = firstPicker.querySelector(`[data-date="${mockEndDate.getTime()}"]`);

    expect(startDateButton).not.toHaveClass("selected");
    expect(endDateButton).not.toHaveClass("selected");
  });

  it("should show the date range in the pickers as given in the value prop", () => {
    const mockStartDate = new Date(year - 20, month, 1);
    const mockEndDate = new Date(year - 20, month + 1, 25);
    const { getFirstPicker, getSecondPicker } = renderExt(<DateRangePicker value={[mockStartDate, mockEndDate]} />);

    const firstPicker = getFirstPicker();
    const secondPicker = getSecondPicker();
    const startDateButton = firstPicker.querySelector(`[data-date="${mockStartDate.getTime()}"]`);
    const endDateButton = secondPicker.querySelector(`[data-date="${mockEndDate.getTime()}"]`);

    expect(startDateButton).toHaveClass("selected");
    expect(endDateButton).toHaveClass("selected");
  });
});
