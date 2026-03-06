import { render, screen } from "@testing-library/react";
import TimePicker from "@/components/TimePicker";
import { Time, TimePickerLocale } from "../TimePicker/types";
import { userEvent } from "@testing-library/user-event";
import { runPickerTests } from "@/components/Motif/Pickers/Picker.test";

const timeValue: Time = { hours: 11, minutes: 43, seconds: 13 };
const checkSelection = (list: HTMLUListElement, index: number, isSelected: boolean) =>
  isSelected
    ? expect(list.children.item(index)?.firstElementChild).toHaveClass("selected")
    : expect(list.children.item(index)?.firstElementChild).not.toHaveClass("selected");

const checkTimeInfo = (element: HTMLElement, index: number, value: string | undefined) =>
  expect(element.children[index].textContent).toBe(value);

export const runTimePickerCommonTests = () => {
  describe("TimePickerCommon", () => {
    it("should display the clicked item as selected", async () => {
      const user = userEvent.setup();
      render(<TimePicker secondsEnabled />);

      const timeInfo = screen.getByTestId("timeInfo");
      const [hours, minutes, seconds] = Array.from(screen.getByTestId("timeStripeContainer").querySelectorAll("ul"));

      checkSelection(hours, timeValue.hours!, false);
      checkSelection(minutes, timeValue.minutes!, false);
      checkSelection(seconds, timeValue.seconds!, false);
      checkTimeInfo(timeInfo, 0, "__");
      checkTimeInfo(timeInfo, 1, "__");
      checkTimeInfo(timeInfo, 2, "__");

      await user.click(hours.children.item(timeValue.hours!)?.firstElementChild as Element);
      await user.click(minutes.children.item(timeValue.minutes!)?.firstElementChild as Element);
      await user.click(seconds.children.item(timeValue.seconds!)?.firstElementChild as Element);

      checkSelection(hours, timeValue.hours!, true);
      checkSelection(minutes, timeValue.minutes!, true);
      checkSelection(seconds, timeValue.seconds!, true);
      checkTimeInfo(timeInfo, 0, timeValue.hours?.toString());
      checkTimeInfo(timeInfo, 1, timeValue.minutes?.toString());
      checkTimeInfo(timeInfo, 2, timeValue.seconds?.toString());
    });
  });
};

describe("TimePicker", () => {
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

  runTimePickerCommonTests();

  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container } = render(<TimePicker />);
    expect(container).toMatchSnapshot();

    // variant = borderless (default)
    expect(container.firstElementChild).toHaveClass("borderless");

    // labels = Sa,Da (default)
    expect(screen.queryByText("Sa")).toBeInTheDocument();
    expect(screen.queryByText("Da")).toBeInTheDocument();

    // size = md (default)
    expect(container.firstElementChild?.firstElementChild).toHaveClass("md");

    // format = 24h (default)
    expect(screen.queryByTestId("timePeriodSelector")).not.toBeInTheDocument();
    const stripes = screen.getByTestId("timeStripeContainer").querySelectorAll("ul");
    expect(stripes[0].children.length).toBe(24); // 24-hour format
  });

  it("should display time info given in the value prop", () => {
    render(<TimePicker value={timeValue} secondsEnabled />);

    const timeInfo = screen.getByTestId("timeInfo");

    checkTimeInfo(timeInfo, 0, timeValue.hours?.toString());
    checkTimeInfo(timeInfo, 1, timeValue.minutes?.toString());
    checkTimeInfo(timeInfo, 2, timeValue.seconds?.toString());
  });

  it("should select the time value given in the value prop", () => {
    render(<TimePicker value={timeValue} secondsEnabled />);

    const isSelected = true;
    const [hours, minutes, seconds] = Array.from(screen.getByTestId("timeStripeContainer").querySelectorAll("ul"));
    checkSelection(hours, timeValue.hours!, isSelected);
    checkSelection(minutes, timeValue.minutes!, isSelected);
    checkSelection(seconds, timeValue.seconds!, isSelected);
  });

  it("should scroll to and show the time values given in the value prop", () => {
    const mockScroll = (Element.prototype.scrollTo = jest.fn());
    const unnecessaryProps = { left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => {} };

    // Mock ul
    const ulRect = { top: 100, ...unnecessaryProps };
    jest.spyOn(HTMLUListElement.prototype, "getBoundingClientRect").mockImplementation(() => ulRect);

    // Mock li: each call returns the next rect in liRects
    const liRects = [
      { top: 91.75, ...unnecessaryProps }, // hours
      { top: 95, ...unnecessaryProps }, // minutes
      { top: 98, ...unnecessaryProps }, // seconds
    ];
    jest.spyOn(HTMLLIElement.prototype, "getBoundingClientRect").mockImplementation(() => liRects.shift()!);

    render(<TimePicker value={timeValue} secondsEnabled />);

    // Expected top values
    const expectedTops = [
      91.75 - 100 - 4, // hours
      95 - 100 - 4, // minutes
      98 - 100 - 4, // seconds
    ];

    expect(mockScroll).toHaveBeenNthCalledWith(1, expect.objectContaining({ top: expectedTops[0] }));
    expect(mockScroll).toHaveBeenNthCalledWith(2, expect.objectContaining({ top: expectedTops[1] }));
    expect(mockScroll).toHaveBeenNthCalledWith(3, expect.objectContaining({ top: expectedTops[2] }));
  });

  it("should enable selecting and showing seconds info when secondsEnabled is true", () => {
    render(<TimePicker secondsEnabled />);

    expect(screen.queryByText("Sn")).toBeInTheDocument();
    expect(screen.getByTestId("timeStripeContainer").querySelectorAll("ul").length).toBe(3);
    expect(screen.getByTestId("timeInfo")).toHaveTextContent("__ : __ : __");
  });

  it("should render all the time information with the time format given in the format prop", () => {
    // Test 12-hour format
    const { rerender } = render(<TimePicker value={{ hours: 14, minutes: 30 }} format="12h" />);

    const timeInfo = screen.getByTestId("timeInfo");
    expect(timeInfo.textContent).toContain("02");
    expect(timeInfo.textContent).toContain("30");

    expect(screen.getByTestId("timePeriodSelector")).toBeInTheDocument();

    const stripes = screen.getByTestId("timeStripeContainer").querySelectorAll("ul");
    expect(stripes[0].children.length).toBe(12); // 12-hour format

    // Test 24-hour format
    rerender(<TimePicker value={{ hours: 14, minutes: 30 }} format="24h" />);

    expect(timeInfo.textContent).toContain("14");
    expect(timeInfo.textContent).toContain("30");

    expect(screen.queryByTestId("timePeriodSelector")).not.toBeInTheDocument();

    expect(stripes[0].children.length).toBe(24);
  });

  it("should trigger the given onOkClick event with the time value when OK button is clicked", async () => {
    const user = userEvent.setup();
    const handleOkClick = jest.fn();

    const { rerender } = render(<TimePicker onOkClick={handleOkClick} />);

    await user.click(screen.queryByText("OK") as Element);
    expect(handleOkClick).toHaveBeenCalledWith(undefined);

    rerender(<TimePicker value={timeValue} onOkClick={handleOkClick} />);

    await user.click(screen.queryByText("OK") as Element);
    expect(handleOkClick).toHaveBeenNthCalledWith(2, expect.objectContaining({ hours: timeValue.hours, minutes: timeValue.minutes }));
  });

  it("should clear the time when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<TimePicker value={timeValue} secondsEnabled />);

    await user.click(screen.queryByText("Clear") as Element);

    const emptyVal = "__";
    const timeInfo = screen.getByTestId("timeInfo");
    checkTimeInfo(timeInfo, 0, emptyVal);
    checkTimeInfo(timeInfo, 1, emptyVal);
    checkTimeInfo(timeInfo, 2, emptyVal);

    const isSelected = false;
    const [hours, minutes, seconds] = Array.from(screen.getByTestId("timeStripeContainer").querySelectorAll("ul"));
    checkSelection(hours, timeValue.hours!, isSelected);
    checkSelection(minutes, timeValue.minutes!, isSelected);
    checkSelection(seconds, timeValue.seconds!, isSelected);
  });

  it("should trigger onTimeChange event with the changed values when time is changed", async () => {
    const user = userEvent.setup();
    const minutes = 56;
    const handleTimeChange = jest.fn();

    render(<TimePicker onTimeChange={handleTimeChange} />);

    await user.click(screen.queryByText(minutes) as Element);

    expect(handleTimeChange).toHaveBeenCalledWith(expect.objectContaining({ minutes }));
  });

  it("should trigger onClearClick when clear button is clicked", async () => {
    const user = userEvent.setup();
    const handleClearClick = jest.fn();

    render(<TimePicker onClearClick={handleClearClick} />);

    await user.click(screen.queryByText("Clear") as Element);

    expect(handleClearClick).toHaveBeenCalled();
  });

  it("should trigger onTimeChange event with undefined value when time is already selected and clear button is clicked", async () => {
    const handleTimeChange = jest.fn();
    const { getByText, rerender } = render(<TimePicker onTimeChange={handleTimeChange} />);
    rerender(<TimePicker value={timeValue} onTimeChange={handleTimeChange} />);

    await userEvent.click(getByText("Clear"));
    expect(handleTimeChange).toHaveBeenCalledWith(undefined);
  });

  it("should not trigger onTimeChange event when time is not selected and clear button is clicked", async () => {
    const handleTimeChange = jest.fn();
    const { getByText } = render(<TimePicker onTimeChange={handleTimeChange} />);

    await userEvent.click(getByText("Clear"));
    expect(handleTimeChange).not.toHaveBeenCalled();
  });

  it("should apply the styles in the css class given in className prop", () => {
    const testClassName = "testClassName";
    const { container } = render(<TimePicker className={testClassName} />);
    expect(container.firstChild).toHaveClass(testClassName);
  });

  it("should display as empty value when time value is not given or selected", () => {
    render(<TimePicker secondsEnabled />);

    const timeInfo = screen.getByTestId("timeInfo");
    checkTimeInfo(timeInfo, 0, "__");
    checkTimeInfo(timeInfo, 1, "__");
    checkTimeInfo(timeInfo, 2, "__");
  });

  it("should change time when AM/PM buttons are clicked in 12-hour format", async () => {
    const handleTimeChange = jest.fn();

    render(<TimePicker value={{ hours: 14, minutes: 30 }} format="12h" onTimeChange={handleTimeChange} />);

    await userEvent.click(screen.getByText("ÖÖ"));

    expect(handleTimeChange).toHaveBeenCalledWith({
      hours: 2, // 14:30 (2:30 PM) -> 2:30 AM
      minutes: 30,
    });
  });

  it("should convert midnight (12:00 AM) to noon (12:00 PM) when PM button is clicked", async () => {
    const handleTimeChange = jest.fn();

    render(<TimePicker value={{ hours: 0, minutes: 0 }} format="12h" onTimeChange={handleTimeChange} />);

    await userEvent.click(screen.getByText("ÖS"));

    expect(handleTimeChange).toHaveBeenCalledWith({
      hours: 12, // 0:00 (12:00 AM) -> 12:00 PM
      minutes: 0,
    });
  });

  it("should convert noon (12:00 PM) to midnight (12:00 AM) when AM button is clicked", async () => {
    const handleTimeChange = jest.fn();

    render(<TimePicker value={{ hours: 12, minutes: 0 }} format="12h" onTimeChange={handleTimeChange} />);

    await userEvent.click(screen.getByText("ÖÖ"));

    expect(handleTimeChange).toHaveBeenCalledWith({
      hours: 0, // 12:00 PM -> 0:00 (12:00 AM)
      minutes: 0,
    });
  });

  it("should reflect the locale given in the locale prop", () => {
    const LOCALE_TIME_ES_ES: TimePickerLocale = {
      secondsAbbr: "Sg",
      hoursAbbr: "Hr",
      minutesAbbr: "Mi",
      am: "AM",
      pm: "PM",
    };
    const { getByText } = render(<TimePicker locale={LOCALE_TIME_ES_ES} secondsEnabled format="12h" />);

    expect(getByText("Sg")).toBeInTheDocument();
    expect(getByText("Hr")).toBeInTheDocument();
    expect(getByText("Mi")).toBeInTheDocument();
    expect(getByText("AM")).toBeInTheDocument();
    expect(getByText("PM")).toBeInTheDocument();
  });

  it("should fire onPeriodChange when AM/PM buttons are clicked in 12-hour format", async () => {
    const handlePeriodChange = jest.fn();

    render(<TimePicker value={{ hours: 14, minutes: 30 }} format="12h" onPeriodChange={handlePeriodChange} />);

    await userEvent.click(screen.getByText("ÖÖ"));
    expect(handlePeriodChange).toHaveBeenCalledWith("am");
    await userEvent.click(screen.getByText("ÖS"));
    expect(handlePeriodChange).toHaveBeenCalledWith("pm");
  });
});
