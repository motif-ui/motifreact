import styles from "../Picker.module.scss";
import Button from "@/components/Button";
import { Size4SM } from "../../../../types";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";

type Props = {
  size: Size4SM;
  onClearClick?: () => void;
  onOkClick?: () => void;
  spread?: boolean;
};

const PickerActions = (props: Props) => {
  const { size, onOkClick, onClearClick, spread } = props;

  const classes = sanitizeModuleClasses(styles, "actions", spread && "actionsSpread");

  return (
    <div className={classes}>
      <Button variant="secondary" label="Clear" size={size} onClick={onClearClick} />
      <Button variant="primary" label="OK" size={size} onClick={onOkClick} />
    </div>
  );
};

export default PickerActions;
