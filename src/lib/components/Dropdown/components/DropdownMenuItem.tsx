import { DropdownMenuItemProps } from "@/components/Dropdown/types";
import styles from "../Dropdown.module.scss";
import Icon from "@/components/Icon";
import { MouseEvent, useContext } from "react";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";

const DropdownMenuItem = (props: DropdownMenuItemProps) => {
  const { label, header, icon, iconColor, disabled, action } = props;
  const { size, hideMenu } = useContext(DropdownContext);
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
            {icon && <Icon name={icon} className={styles["MenuItem-Icon"]} color={iconColor} size={size} />}
            {label && <span>{label}</span>}
          </>
        )}
      </a>
    </li>
  );
};

export default DropdownMenuItem;
