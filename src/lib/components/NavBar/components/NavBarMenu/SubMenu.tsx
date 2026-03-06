import styles from "../../NavBar.module.scss";
import Icon from "@/components/Icon";
import { type MouseEvent, useId } from "react";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import { SubMenuItemProps, SubMenuProps } from "./types";
import { useNavBarMenuContext } from "@/components/NavBar/NavBarContext";

const SubMenu = ({ items }: SubMenuProps) => {
  return (
    <ul role="menu" className={styles.subMenu}>
      {items.map((itemProps, idx) => (
        <SubMenuItem key={idx} {...itemProps} />
      ))}
    </ul>
  );
};

/* This component is not put into a separate file because of a possible Circular dependency issue in rollup build */
const SubMenuItem = (props: SubMenuItemProps) => {
  const { parentId, items, label, icon, href, target, onClick } = props;
  const id = useId();
  const { isOpen, toggleMenu, closeAll } = useNavBarMenuContext();

  const clickHandler = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    items?.length ? toggleMenu(id, parentId) : closeAll();
  };

  return (
    <li role="none" className={styles.subMenuItem}>
      <a role="menuitem" onClick={clickHandler} {...{ href, target }}>
        {icon && <Icon name={icon} size="md" />}
        <span className={styles.label}>{label}</span>
        {items && <MotifIcon name="arrow_drop_down" className={styles.dropdown} size="md" />}
      </a>
      {items?.length && isOpen(id) && <SubMenu items={items.map(i => ({ ...i, parentId: id }))} />}
    </li>
  );
};

export default SubMenu;
