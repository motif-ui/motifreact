import Button from "./Button";
import ButtonGroupItemProvider from "../ButtonGroupItem/ButtonGroupItemProvider";
import styles from "../../ButtonGroup.module.scss";
import { PropsWithChildren, useState } from "react";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { ButtonGroupItemProps } from "../ButtonGroupItem/ButtonGroupItem";

const ButtonWithDropdown = (props: PropsWithChildren<ButtonGroupItemProps>) => {
  const { label, icon, disabled, action, children } = props;
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false));

  return (
    <div className={`${styles.buttonDropdownContainer} ${disabled ? styles.disabled : ""}`} ref={ref}>
      <Button label={label} icon={icon} disabled={disabled} action={action} type="multiple" />
      <ButtonGroupItemProvider>
        <Button icon="keyboard_arrow_down" type="dropdown" action={() => setOpen(!open)} />
        {open && <div className={styles.button__dropdownItem}>{children}</div>}
      </ButtonGroupItemProvider>
    </div>
  );
};

export default ButtonWithDropdown;
