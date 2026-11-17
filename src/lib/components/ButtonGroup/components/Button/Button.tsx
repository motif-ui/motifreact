import styles from "../../ButtonGroup.module.scss";
import Icon from "@/components/Icon";
import { memo } from "react";
import { ButtonGroupItemProps } from "@/components/ButtonGroup/components/ButtonGroupItem/ButtonGroupItem";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";
import { PropsWithRef } from "../../../../types";

type Props = ButtonGroupItemProps & {
  type: "single" | "dropdown";
  open?: boolean;
};

const Button = memo((props: PropsWithRef<Props, HTMLButtonElement>) => {
  const { label, disabled, action, icon, type, open, ref } = props;

  return (
    <button
      ref={ref}
      className={sanitizeModuleClasses(styles, "button", `button__${type}`, open && "open")}
      type="button"
      disabled={disabled}
      onClick={action}
    >
      {icon && <Icon name={icon} className={styles.icon} />} {label}
      {type === "dropdown" && (
        <Icon name="keyboard_arrow_down" className={sanitizeModuleClasses(styles, "icon", "dropdownIcon", open && "open")} />
      )}
    </button>
  );
});

export default Button;
