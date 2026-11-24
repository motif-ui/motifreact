import { act, render } from "@testing-library/react";
import YearPicker from "./YearPicker";
import { runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { StandardPropsWithRef } from "../../types";

describe("YearPicker", () => {
  const year = 2013;

  runSnapshotDefaultsAndStandardPropsTest((props: StandardPropsWithRef<HTMLDivElement>) => render(<YearPicker value={year} {...props} />), {
    assertDefaults: ({ getByTestId }) => {
      // variant: borderless
      expect(getByTestId("Picker")).toHaveClass("borderless");
      // size: md
      expect(getByTestId("Picker")).toHaveClass("md");
    },
  });

  const getYears = (container: HTMLElement) => [...container.children].map(button => Number(button.textContent));
  const yearsFrom = (first: number) => Array.from({ length: 16 }, (_, index) => first + index);

  it("should show the year in the value prop in the header and sixteen years around it, with the year selected", () => {
    const { getByTestId, getAllByText } = render(<YearPicker value={year} />);

    expect(getYears(getByTestId("DatePickerYearsContainer"))).toEqual(yearsFrom(2005));
    const [headerYear, gridYear] = getAllByText(year);
    expect(headerYear.closest("div")).toHaveClass("headerMonthYearButtonContainer");
    expect(gridYear).toHaveClass("selected");
  });

  it("should show the current year in the header and the years around it, with nothing selected, when there is no value", () => {
    const currentYear = new Date().getFullYear();
    const { getByTestId, getAllByText } = render(<YearPicker />);

    expect(getYears(getByTestId("DatePickerYearsContainer"))).toEqual(yearsFrom(currentYear - 8));
    expect(getAllByText(currentYear)).toHaveLength(2);
    expect(getByTestId("DatePickerYearsContainer").querySelector(".selected")).toBeNull();
  });

  it("should call onYearChange with the clicked year, show it in the header and keep the years on the page", () => {
    const onYearChange = jest.fn();
    const { getByTestId, getAllByText } = render(<YearPicker value={year} onYearChange={onYearChange} />);

    act(() => getAllByText(2018)[0].click());

    expect(onYearChange).toHaveBeenCalledTimes(1);
    expect(onYearChange).toHaveBeenCalledWith(2018);
    const [headerYear, gridYear] = getAllByText(2018);
    expect(headerYear.closest("div")).toHaveClass("headerMonthYearButtonContainer");
    expect(gridYear).toHaveClass("selected");
    expect(getYears(getByTestId("DatePickerYearsContainer"))).toEqual(yearsFrom(2005));
  });

  it("should not call onYearChange when the selected year is clicked again", () => {
    const onYearChange = jest.fn();
    const { getAllByText } = render(<YearPicker value={year} onYearChange={onYearChange} />);

    act(() => getAllByText(year)[1].click());
    expect(onYearChange).not.toHaveBeenCalled();
  });

  it("should show the previous and next sixteen years when the arrow buttons are clicked, keeping the selected year in the header", () => {
    const { getByTestId, getByText } = render(<YearPicker value={year} />);

    act(() => getByText("arrow_forward").click());
    expect(getYears(getByTestId("DatePickerYearsContainer"))).toEqual(yearsFrom(2021));
    expect(getByText(year)).toBeInTheDocument();

    act(() => getByText("arrow_back").click());
    act(() => getByText("arrow_back").click());
    expect(getYears(getByTestId("DatePickerYearsContainer"))).toEqual(yearsFrom(1989));
    expect(getByText(year)).toBeInTheDocument();
  });

  it("should show the page of the new year when the value prop changes to a year outside the page", () => {
    const { rerender, getByTestId, getAllByText } = render(<YearPicker value={year} />);

    rerender(<YearPicker value={2050} />);
    expect(getYears(getByTestId("DatePickerYearsContainer"))).toEqual(yearsFrom(2042));
    expect(getAllByText(2050)[1]).toHaveClass("selected");
  });
});
