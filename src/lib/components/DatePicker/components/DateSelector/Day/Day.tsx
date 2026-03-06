import styles from "../../../DatePicker.module.scss";
import { useCallback } from "react";
import { sanitizeModuleClasses } from "../../../../../../utils/cssUtils";

export type DayProps = {
  date: Date;
  selected?: boolean;
  selectDirection?: "toLeft" | "toRight";
  partiallySelected?: boolean;
  today?: boolean;
  onClick?: (date: Date) => void;
  disabled?: boolean;
  invisible?: boolean;
};

const Day = (props: DayProps) => {
  const { date, selected, onClick, today, disabled, invisible, partiallySelected, selectDirection } = props;

  const clickHandler = useCallback(() => onClick?.(date), [date, onClick]);

  const classNameDirection = selected && selectDirection;
  const classNamePartiallySelected = !selected && partiallySelected && "partiallySelected";
  const classNameSelectionAndToday = selected ? "selected" : today && "today";
  const conditionalClasses = invisible ? [] : [classNameDirection, classNameSelectionAndToday, classNamePartiallySelected];
  const classes = sanitizeModuleClasses(styles, ...conditionalClasses);

  return (
    <button
      className={classes}
      type="button"
      onClick={clickHandler}
      disabled={disabled || invisible}
      data-date={invisible ? "" : date.getTime()}
    >
      {!invisible && date.getDate()}
    </button>
  );
};

export default Day;
