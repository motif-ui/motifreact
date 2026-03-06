import { RefObject, MouseEvent } from "react";
import { useContext, useRef } from "react";
import styles from "../MenuList.module.scss";
import Icon from "@/components/Icon";
import { MenuListContext } from "@/components/MenuList/MenuListContext";
import { MenuItemCommonProps } from "@/components/MenuList/types";
import Tooltip from "@/components/Tooltip";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { MotifIcon } from "@/components/Motif/Icon";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";
import Chip from "@/components/Chip";

const menuItemRenderer = (props: MenuItemCommonProps) => <MenuItem key={`${props.level} ${props.id}`} {...props} />;

const MenuItem = (props: MenuItemCommonProps) => {
  const { label, icon, active, disabled, href, targetBlank, items, action, level, id, subMenuRenderer, chip } = props;
  const { darkMode, collapsed, setOpenSubmenus, openSubmenus } = useContext(MenuListContext);

  const toggleSubMenu = (id: string) =>
    setOpenSubmenus(prev => (prev.some(i => i.startsWith(id)) ? prev.filter(i => !i.startsWith(id)) : [...prev, id]));

  const subMenuOpen = items && openSubmenus.includes(id);
  const menuRef = useRef<HTMLLIElement>(null);
  const subMenuRef = useOutsideClick<HTMLDivElement>(() => {
    collapsed && setOpenSubmenus([]);
  }, [menuRef as RefObject<HTMLElement>]);

  const mainMenuItem = level === 0;
  const subMenuItem = level > 0;
  const nestedSubMenuItem = level > 1;

  const classNames = sanitizeModuleClasses(
    styles,
    "menuItem",
    collapsed ? "collapsed" : "expanded",
    mainMenuItem && "mainMenuItem",
    subMenuItem && "subMenuItem",
    darkMode && "dark",
    active && !disabled && "active",
    disabled && "disabled",
    subMenuOpen && "subMenuOpen",
    nestedSubMenuItem && "nestedSubMenuItem",
  );

  const itemAttributes = {
    ...(href && { href }),
    ...(href && targetBlank && { target: "_blank" }),
    ...(!disabled && {
      onClick: items
        ? (e: MouseEvent<HTMLAnchorElement>) => {
            action?.(e);
            toggleSubMenu(id);
          }
        : action,
    }),
  };

  const menuItemElement = (
    <a className={classNames} {...itemAttributes}>
      {icon && <Icon name={icon} size="md" />}
      {(subMenuItem || !collapsed) && (
        <>
          <span className={styles.label}>
            {label}
            {chip && <Chip variant={chip.variant} label={chip.label} size="xs" />}
          </span>
          {items && <MotifIcon name="keyboard_arrow_down" size="md" className={styles.arrowIcon} />}
        </>
      )}
    </a>
  );

  const maybeWithTooltip =
    collapsed && mainMenuItem && !subMenuOpen ? (
      <Tooltip text={label} position="right">
        {menuItemElement}
      </Tooltip>
    ) : (
      menuItemElement
    );

  return (
    <li className={styles.menuItemContainer} ref={menuRef}>
      {maybeWithTooltip}
      {subMenuOpen && (
        <div ref={subMenuRef}>
          {subMenuRenderer?.({
            items,
            level: level + 1,
            parentMenuId: id,
            menuItemRenderer,
          })}
        </div>
      )}
    </li>
  );
};

export default MenuItem;
