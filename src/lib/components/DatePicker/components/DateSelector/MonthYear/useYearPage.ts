import { useCallback, useEffect, useMemo, useState } from "react";
import { calculateYears } from "@/components/DatePicker/components/helper";

const displayedYearsCount = 16;

const getFirstYear = (year: number) => year - displayedYearsCount / 2;

/**
 * Holds the page of years shown in a year grid. The page is centered on the given year, and moves to it again only when the
 * year leaves the page, so picking a year on the current page does not shift the grid.
 */
const useYearPage = (year: number) => {
  const [firstYear, setFirstYear] = useState(() => getFirstYear(year));

  useEffect(() => {
    setFirstYear(first => (year >= first && year < first + displayedYearsCount ? first : getFirstYear(year)));
  }, [year]);

  const years = useMemo(() => calculateYears(firstYear, firstYear + displayedYearsCount), [firstYear]);
  const showPrevPage = useCallback(() => setFirstYear(first => first - displayedYearsCount), []);
  const showNextPage = useCallback(() => setFirstYear(first => first + displayedYearsCount), []);

  return { years, showPrevPage, showNextPage };
};

export default useYearPage;
