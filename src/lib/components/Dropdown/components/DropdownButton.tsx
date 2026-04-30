import styles from "../Dropdown.module.scss";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
import { MotifIcon } from "@/components/Motif/Icon";
import { ReactElement, useContext } from "react";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";

type Props = {
  label?: string;
  icon?: string | ReactElement;
};

const DropdownButton = (props: Props) => {
  const { label, icon } = props;
  const { toggleMenu, size, disabled } = useContext(DropdownContext);

  return (
    <button className={styles.Button} {...(disabled && { disabled })} onClick={toggleMenu} type="button">
      {icon && <GlobalIconWrapper icon={icon} className={styles["Button_Icon"]} />}
      {label && <span>{label}</span>}
      <MotifIcon name="arrow_drop_down" className={styles["Button-DropdownIcon"]} size={size} />
    </button>
  );
};

export default DropdownButton;
