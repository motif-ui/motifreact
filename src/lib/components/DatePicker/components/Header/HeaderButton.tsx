import { useContext } from "react";
import { DatePickerContext } from "@/components/DatePicker/context/DatePickerProvider";

type Props = {
  label?: string;
  previousTab: "month" | "day";
  nextTab: "month" | "year";
  disabled?: boolean;
};

const HeaderButton = (props: Props) => {
  const { label, previousTab, nextTab, disabled } = props;
  const { onYearMonthTabSelected } = useContext(DatePickerContext);

  return (
    <button onClick={() => onYearMonthTabSelected(nextTab, previousTab)} disabled={disabled} type="button">
      {label}
    </button>
  );
};

export default HeaderButton;
