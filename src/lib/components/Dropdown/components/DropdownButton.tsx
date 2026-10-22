import styles from "../Dropdown.module.scss";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
import { MotifIcon } from "@/components/Motif/Icon";
import { useContext } from "react";
import type { CSSProperties, Ref } from "react";
import type { IconGlobalType, Variant } from "../../../types";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";
import { sanitizeModuleClassesWithOptions } from "../../../../utils/cssUtils";

type Props = {
  label?: string;
  icon?: IconGlobalType;
  ref?: Ref<HTMLButtonElement>;
  variant: Variant;
  shape: "solid" | "textOnly";
  pill?: boolean;
  className?: string;
  style?: CSSProperties;
};

const DropdownButton = ({ label, icon, ref, variant, shape, pill, className, style }: Props) => {
  const { toggleMenu, size, disabled, open } = useContext(DropdownContext);
  const classNames = sanitizeModuleClassesWithOptions(styles, { externalClasses: [className] }, [
    "Button",
    size,
    shape,
    variant,
    open && "open",
    pill && "pill",
  ]);

  return (
    <button
      className={classNames}
      style={style}
      {...(disabled && { disabled })}
      onClick={toggleMenu}
      type="button"
      ref={ref}
      data-testid="dropdown-button"
    >
      {icon && <GlobalIconWrapper icon={icon} className={styles.icon} size={size} />}
      {label && <span>{label}</span>}
      <MotifIcon name="arrow_drop_down" className={styles["Button-DropdownIcon"]} size={size} />
    </button>
  );
};

export default DropdownButton;
