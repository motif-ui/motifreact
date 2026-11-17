import styles from "../Select.module.scss";
import { MotifIconButton } from "@/components/Motif/Icon";
import { SelectItem } from "@/components/Select/types";
import { InputSize } from "../../Form/types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

type Props = {
  item: SelectItem;
  removeHandler: (item: SelectItem) => void;
  size: InputSize;
  disabled?: boolean;
};

const SelectedItem = (props: Props) => {
  const { item, removeHandler, size, disabled } = props;
  const classNames = sanitizeModuleClasses(styles, "selectionChip", size);
  return (
    <div className={classNames}>
      <span className={styles.label}>{item.label}</span>
      {!disabled && <MotifIconButton name="close" className={styles.closeIcon} onClick={() => removeHandler(item)} />}
    </div>
  );
};

export default SelectedItem;
