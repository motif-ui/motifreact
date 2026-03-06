import styles from "../../../DatePicker.module.scss";
import { sanitizeModuleClasses } from "../../../../../../utils/cssUtils";

type Props = {
  label: string | number;
  selected?: boolean;
  onClick: () => void;
};

const MonthYearButton = (props: Props) => {
  const { label, selected, onClick } = props;
  const className = sanitizeModuleClasses(styles, selected && "selected");

  return (
    <button className={className} type="button" onClick={onClick}>
      {label}
    </button>
  );
};

export default MonthYearButton;
