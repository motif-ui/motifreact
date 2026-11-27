import styles from "@/components/DatePicker/DatePicker.module.scss";
import MonthYearButton from "./MonthYearButton";

type Props = {
  monthsShort: string[];
  selectedMonth?: number;
  onMonthClick: (month: number) => void;
};

const MonthGrid = (props: Props) => {
  const { monthsShort, selectedMonth, onMonthClick } = props;

  return (
    <div className={styles.monthSelector} data-testid="DatePickerMonthsContainer">
      {monthsShort.map((label, month) => (
        <MonthYearButton key={month} label={label} onClick={() => onMonthClick(month)} selected={month === selectedMonth} />
      ))}
    </div>
  );
};

export default MonthGrid;
