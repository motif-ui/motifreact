"use client";

import { ReactElement, RefObject } from "react";
import styles from "../../../DatePicker.module.scss";
import { DayProps } from "@/components/DatePicker/components/DateSelector/Day/Day";
import { Size4SM } from "../../../../../types";
import { DatePickerLocale } from "@/components/DatePicker/types";
import Header from "@/components/DatePicker/components/Header/Header";
import WeekDays from "@/components/DatePicker/components/DateSelector/Day/WeekDays";

type Props = {
  size: Size4SM;
  locale: DatePickerLocale;
  month: number;
  year: number;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  disabledMonthYearClick?: boolean;
  daysRef?: RefObject<HTMLDivElement | null>;
  dates: Date[];
  renderDay: (date: Date) => ReactElement<DayProps>;
};

const DaySelector = (props: Props) => {
  const { size, locale, month, year, onPrevClick, onNextClick, disabledMonthYearClick, daysRef, dates, renderDay } = props;

  return (
    <div className={`${styles.daySelector} ${styles[size]}`}>
      <Header
        month={locale.months[month]}
        year={year.toString()}
        onPrevClick={onPrevClick}
        onNextClick={onNextClick}
        disableButtons={disabledMonthYearClick}
        size={size}
      />
      <WeekDays locale={locale} />
      <div className={styles.days} ref={daysRef} data-testid="DatePickerDayContainer">
        {dates.map(renderDay)}
      </div>
    </div>
  );
};

export default DaySelector;
