import styles from "../SelectBaseline.module.scss";
import { MotifIconButton } from "@/components/Motif/Icon";
import { SelectItem } from "../types";
import { InputSize } from "@/components/Form/types";
import { sanitizeModuleClasses } from "../../../../../../../utils/cssUtils";

type Props = {
  item: SelectItem;
  removeHandler: (item: SelectItem) => void;
  size: InputSize;
};

const SelectedItem = (props: Props) => {
  const { item, removeHandler, size } = props;
  const classNames = sanitizeModuleClasses(styles, "selectionChip", size);
  return (
    <div className={classNames}>
      <span className={styles.label}>{item.label}</span>
      <MotifIconButton name="close" className={styles.closeIcon} onClick={() => removeHandler(item)} />
    </div>
  );
};

export default SelectedItem;
