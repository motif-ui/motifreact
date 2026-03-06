import styles from "./Select.module.scss";
import { MotifIcon } from "@/components/Motif/Icon";
import { memo } from "react";
import { SelectItem } from "@/components/Select/types";
import { InputSize } from "../Form/types";
import { sanitizeModuleClasses } from "../../../utils/cssUtils";
import { getFilterableValue } from "@/components/Select/helper";

type Props = {
  item: SelectItem;
  size: InputSize;
  isSelected: boolean;
  onChange: (item: SelectItem) => void;
};

const SelectLi = memo((props: Props) => {
  const { isSelected, item, size, onChange } = props;
  const classNames = sanitizeModuleClasses(styles, "option", isSelected && "selected");
  return (
    <li role="option" className={classNames} aria-selected={isSelected} key={item.value}>
      <input type="checkbox" id={item.value} checked={isSelected} onChange={() => onChange(item)} />
      <label htmlFor={item.value} className={styles.labelWrapper}>
        <span className={styles.labelText}>{getFilterableValue(item)}</span>
        {isSelected && <MotifIcon name="check" className={styles.iconSelected} size={size} />}
      </label>
    </li>
  );
});

export default SelectLi;
