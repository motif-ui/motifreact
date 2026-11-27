import styles from "../../ButtonGroup.module.scss";
import Icon from "@/components/Icon";
import { memo, useContext } from "react";
import { ButtonGroupItemProps } from "@/components/ButtonGroup/components/ButtonGroupItem/ButtonGroupItem";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";
import { PropsWithRef } from "../../../../types";
import { ButtonGroupContext } from "../../ButtonGroupContext";

type Props = ButtonGroupItemProps & {
  type: "single" | "dropdown";
  open?: boolean;
};

const Button = memo((props: PropsWithRef<Props, HTMLButtonElement>) => {
  const { label, disabled, action, icon, type, open, ref } = props;
  const { size } = useContext(ButtonGroupContext);

  return (
    <button
      ref={ref}
      className={sanitizeModuleClasses(styles, "button", `button__${type}`, open && "open")}
      type="button"
      disabled={disabled}
      onClick={action}
      // A dropdown button tells assistive technology that it opens a list and whether the list is open
      {...(type === "dropdown" && { "aria-haspopup": true, "aria-expanded": !!open })}
    >
      {icon && <Icon name={icon} size={size} />} {label}
      {type === "dropdown" && (
        <Icon name="keyboard_arrow_down" size={size} className={sanitizeModuleClasses(styles, "dropdownIcon", open && "open")} />
      )}
    </button>
  );
});

export default Button;
