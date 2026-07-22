import styles from "../../ButtonGroup.module.scss";
import Icon from "@/components/Icon";
import { memo } from "react";
import { ButtonGroupItemProps } from "@/components/ButtonGroup/components/ButtonGroupItem/ButtonGroupItem";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";

type Props = ButtonGroupItemProps & {
  type: "single" | "dropdown";
  open?: boolean;
};

const Button = memo((props: Props) => {
  const { label, disabled, action, icon, type, open } = props;

  return (
    <button className={`${styles.button} ${styles[`button__${type}`]}`} type="button" disabled={disabled} onClick={action}>
      {icon && <Icon name={icon} className={styles.icon} />} {label}
      {type === "dropdown" && <Icon name="keyboard_arrow_down" className={sanitizeModuleClasses(styles, "dropdownIcon", open && "open")} />}
    </button>
  );
});

export default Button;
