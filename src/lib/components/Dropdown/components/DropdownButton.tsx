import styles from "../Dropdown.module.scss";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
import { MotifIcon } from "@/components/Motif/Icon";
import { useContext } from "react";
import type { RefObject } from "react";
import type { IconGlobalType, Variant } from "../../../types";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

type Props = {
  label?: string;
  icon?: IconGlobalType;
  anchorRef: RefObject<HTMLButtonElement | null>;
  variant: Variant;
  shape: "solid" | "textOnly";
  pill?: boolean;
};

const DropdownButton = ({ label, icon, anchorRef, variant, shape, pill }: Props) => {
  const { toggleMenu, size, disabled, open } = useContext(DropdownContext);
  const classNames = sanitizeModuleClasses(styles, ["Button", size, shape, variant, open && "open", pill && "pill"]);

  return (
    <button
      className={classNames}
      {...(disabled && { disabled })}
      onClick={toggleMenu}
      type="button"
      ref={anchorRef}
      data-testid="dropdown-button"
    >
      {icon && <GlobalIconWrapper icon={icon} className={styles.icon} size={size} />}
      {label && <span>{label}</span>}
      <MotifIcon name="arrow_drop_down" className={styles["Button-DropdownIcon"]} size={size} />
    </button>
  );
};

export default DropdownButton;
