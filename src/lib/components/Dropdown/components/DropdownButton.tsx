import Icon from "@/components/Icon";
import styles from "../Dropdown.module.scss";
import { MotifIcon } from "@/components/Motif/Icon";
import { useContext } from "react";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";

type Props = {
  label?: string;
  icon?: string;
};

const DropdownButton = (props: Props) => {
  const { label, icon } = props;
  const { toggleMenu, size, disabled } = useContext(DropdownContext);

  return (
    <button className={styles.Button} {...(disabled && { disabled })} onClick={toggleMenu} type="button">
      {icon && <Icon name={icon} size={size} />}
      {label && <span>{label}</span>}
      <MotifIcon name="arrow_drop_down" className={styles["Button-DropdownIcon"]} size={size} />
    </button>
  );
};

export default DropdownButton;
