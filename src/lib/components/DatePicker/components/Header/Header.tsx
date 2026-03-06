import styles from "../../DatePicker.module.scss";
import { MotifIcon } from "@/components/Motif/Icon";
import { Size4SM } from "../../../../types";
import HeaderButton from "@/components/DatePicker/components/Header/HeaderButton";

type Props = {
  month?: string;
  year?: string;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  disableButtons?: boolean;
  size: Size4SM;
};

const Header = (props: Props) => {
  const { month, year, onPrevClick, onNextClick, disableButtons, size } = props;

  return (
    <div className={styles.header}>
      {onPrevClick && (
        <button className={styles.arrowButton} onClick={onPrevClick} type="button">
          <MotifIcon name="arrow_back" size={size} />
        </button>
      )}
      <div className={styles.headerMonthYearButtonContainer}>
        {month && <HeaderButton label={month} nextTab="month" previousTab="day" disabled={disableButtons} />}
        {year && <HeaderButton label={year} nextTab="year" previousTab={month ? "day" : "month"} disabled={disableButtons} />}
      </div>
      {onNextClick && (
        <button className={styles.arrowButton} onClick={onNextClick} type="button">
          <MotifIcon name="arrow_forward" size={size} />
        </button>
      )}
    </div>
  );
};

export default Header;
