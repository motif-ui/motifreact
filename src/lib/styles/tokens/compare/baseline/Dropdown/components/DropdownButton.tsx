import styles from "../DropdownBaseline.module.scss";
import GlobalIconWrapper from "../../../../../../components/Motif/GlobalIconWrapper/GlobalIconWrapper";
import { MotifIcon } from "@/components/Motif/Icon";
import { useContext } from "react";
import type { CSSProperties, Ref } from "react";
import type { IconGlobalType } from "../../../../../../types";
import { DropdownContext } from "../context/DropdownContext";

type Props = {
  label?: string;
  icon?: IconGlobalType;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
};

const DropdownButton = ({ label, icon, ref, className, style }: Props) => {
  const { size, disabled } = useContext(DropdownContext);

  return (
    <button className={className} style={style} {...(disabled && { disabled })} type="button" ref={ref} data-testid="dropdown-button">
      {icon && <GlobalIconWrapper icon={icon} className={styles.icon} size={size} />}
      {label && <span>{label}</span>}
      <MotifIcon name="arrow_drop_down" className={styles.arrowIcon} size={size} />
    </button>
  );
};

export default DropdownButton;
