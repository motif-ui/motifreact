import { act, render } from "@testing-library/react";
import MonthPicker from "./MonthPicker";
import { t, runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { StandardPropsWithRef } from "../../types";
import { getDateLocale } from "src/i18n/helper.ts";

describe("MonthPicker", () => {
  const { monthsShort } = getDateLocale(t);

  runSnapshotDefaultsAndStandardPropsTest((props: StandardPropsWithRef<HTMLDivElement>) => render(<MonthPicker {...props} />), {
    assertDefaults: ({ getByTestId, getByText }) => {
      // variant: borderless
      expect(getByTestId("Picker")).toHaveClass("borderless");
      // size: md
      expect(getByTestId("Picker")).toHaveClass("md");
      // locale: English
      expect(getByText(monthsShort[0])).toBeInTheDocument();
    },
  });

  it("should show only the twelve months", () => {
    const { getByTestId, queryByText } = render(<MonthPicker />);

    expect(getByTestId("DatePickerMonthsContainer").children).toHaveLength(12);
    expect(queryByText("arrow_back")).not.toBeInTheDocument();
    expect(queryByText("arrow_forward")).not.toBeInTheDocument();
  });

  it("should show the month in the value prop as selected", () => {
    const { getByText } = render(<MonthPicker value={3} />);
    expect(getByText(monthsShort[3])).toHaveClass("selected");
  });

  it("should call onMonthChange with the index of the clicked month and select it", () => {
    const onMonthChange = jest.fn();
    const { getByText } = render(<MonthPicker value={3} onMonthChange={onMonthChange} />);

    act(() => getByText(monthsShort[0]).click());

    expect(onMonthChange).toHaveBeenCalledTimes(1);
    expect(onMonthChange).toHaveBeenCalledWith(0);
    expect(getByText(monthsShort[0])).toHaveClass("selected");
    expect(getByText(monthsShort[3])).not.toHaveClass("selected");
  });

  it("should not call onMonthChange when the selected month is clicked again", () => {
    const onMonthChange = jest.fn();
    const { getByText } = render(<MonthPicker value={3} onMonthChange={onMonthChange} />);

    act(() => getByText(monthsShort[3]).click());
    expect(onMonthChange).not.toHaveBeenCalled();
  });

  it("should select the new month when the value prop changes", () => {
    const { rerender, getByText } = render(<MonthPicker value={3} />);

    rerender(<MonthPicker value={7} />);
    expect(getByText(monthsShort[7])).toHaveClass("selected");
    expect(getByText(monthsShort[3])).not.toHaveClass("selected");
  });

  it("should show the month names in the locale prop", () => {
    const locale = { monthsShort: ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"] };
    const { getByText } = render(<MonthPicker locale={locale} />);
    expect(getByText("M12")).toBeInTheDocument();
  });
});
