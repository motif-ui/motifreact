import styles from "../Picker.module.scss";
import Button from "@/components/Button";
import { Size4SM } from "../../../../types";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";
import { useMotifContext } from "src/lib/motif/context/MotifProvider.tsx";

type Props = {
  size: Size4SM;
  onClearClick?: () => void;
  onOkClick?: () => void;
  spread?: boolean;
  locale?: unknown;
};

const PickerActions = (props: Props) => {
  const { size, onOkClick, onClearClick, spread } = props;
  const { t } = useMotifContext();

  const classes = sanitizeModuleClasses(styles, "actions", spread && "actionsSpread");

  return (
    <div className={classes}>
      <Button variant="secondary" label={t("g.clear")} size={size} onClick={onClearClick} />
      <Button variant="primary" label={t("g.submit")} size={size} onClick={onOkClick} />
    </div>
  );
};

export default PickerActions;
