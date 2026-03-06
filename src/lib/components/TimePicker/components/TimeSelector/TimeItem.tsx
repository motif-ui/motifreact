import styles from "../../TimePicker.module.scss";
import { memo } from "react";
import { twoDigits } from "@/components/Motif/Pickers/helper";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";

type Props = {
  value: number;
  selected?: boolean;
  onClick: (value: number) => void;
};

const TimeItem = memo((props: Props) => {
  const { value, selected, onClick } = props;
  const className = sanitizeModuleClasses(styles, selected && "selected");

  return (
    <li>
      <button onClick={() => onClick(value)} type="button" className={className}>
        {twoDigits(value)}
      </button>
    </li>
  );
});

export default TimeItem;
