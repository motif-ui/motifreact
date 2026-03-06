import styles from "../../NavBar.module.scss";
import Icon from "@/components/Icon";
import { MotifIcon } from "@/components/Motif/Icon";
import { type MouseEvent, useId } from "react";
import SubMenu from "./SubMenu";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";
import { MenuItemProps } from "./types";
import { useNavBarMenuContext } from "@/components/NavBar/NavBarContext";

const MenuItem = (props: MenuItemProps) => {
  const { onClick, items, label, icon, href, target, active } = props;
  const id = useId();
  const { isOpen, toggleMenu, closeAll } = useNavBarMenuContext();

  const clickHandler = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    items?.length ? toggleMenu(id) : closeAll();
  };

  const className = sanitizeModuleClasses(styles, "menuBarItem", active && "active");
  return (
    <li role="none" className={className}>
      <a role="menuitem" onClick={clickHandler} {...{ href, target }}>
        {icon && <Icon name={icon} size="md" />}
        <span className={styles.label}>{label}</span>
        {items && <MotifIcon name="keyboard_arrow_down" size="md" className={styles.dropdown} />}
      </a>
      {items && isOpen(id) && <SubMenu items={items.map(i => ({ ...i, parentId: id }))} />}
    </li>
  );
};

export default MenuItem;
