import { DropdownMenuItemProps } from "@/components/Dropdown/types";
import styles from "../Dropdown.module.scss";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
import { MouseEvent, useContext } from "react";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";

const DropdownMenuItem = (props: DropdownMenuItemProps) => {
  const { label, header, icon, iconColor, disabled, action } = props;
  const { hideMenu } = useContext(DropdownContext);
  const classNames = sanitizeModuleClasses(
    styles,
    "MenuItem",
    header ? "MenuItem_header" : "MenuItem_clickable",
    disabled && "MenuItem_disabled",
  );

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    action?.(e);
    hideMenu();
  };

  return (
    <li>
      <a className={classNames} {...(!disabled && { onClick: handleClick })}>
        {header ?? (
          <>
            {icon && <GlobalIconWrapper icon={icon} className={styles.icon} style={{ color: iconColor }} />}
            {label && <span>{label}</span>}
          </>
        )}
      </a>
    </li>
  );
};

export default DropdownMenuItem;
