import styles from "@/components/DatePicker/DatePicker.module.scss";
import MonthYearButton from "./MonthYearButton";

type Props = {
  years: number[];
  selectedYear?: number;
  onYearClick: (year: number) => void;
};

const YearGrid = (props: Props) => {
  const { years, selectedYear, onYearClick } = props;

  return (
    <div className={styles.yearSelector} data-testid="DatePickerYearsContainer">
      {years.map(year => (
        <MonthYearButton key={year} label={year} onClick={() => onYearClick(year)} selected={year === selectedYear} />
      ))}
    </div>
  );
};

export default YearGrid;
