import styles from "../../NavBar.module.scss";
import { NavBarMenuContextProps } from "../../types";
import MenuItem from "./MenuItem";
import useOverlayState from "../../../../hooks/useOverlayState";
import { useCallback, useMemo, useRef, useState } from "react";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";
import { MenuInternalProps } from "./types";
import { NavBarMenuContext } from "@/components/NavBar/NavBarContext";

const Menu = (props: MenuInternalProps) => {
  const { items, subMenuDirection = "right", main } = props;
  const [openMenus, setOpenMenus] = useState<{ id: string; parentId?: string }[]>([]);

  const toggleMenu = useCallback((id: string, parentId?: string) => {
    setOpenMenus(prev => {
      // add if no open menu
      if (!prev.length) return [{ id }];
      // remove if same id comes again
      if (prev.some(m => m.id === id)) {
        return prev.filter(m => m.id !== id);
      }
      // remove items with the same parentId before adding the new one
      const filtered = prev.filter(menuItem => menuItem.parentId !== parentId);
      return [...filtered, { id, parentId }];
    });
  }, []);

  const closeAll = useCallback(() => openMenus.length && setOpenMenus([]), [openMenus.length]);
  const isOpen = useCallback((id: string) => openMenus.some(menuItem => menuItem.id === id), [openMenus]);

  const ref = useRef<HTMLUListElement>(null);
  const insideRefs = useMemo(() => [ref], []);
  useOverlayState({ open: openMenus.length > 0, onClose: closeAll, insideRefs, closeOnOutsideClick: true });
  const value: NavBarMenuContextProps = useMemo(() => ({ toggleMenu, closeAll, isOpen }), [closeAll, isOpen, toggleMenu]);
  const classes = sanitizeModuleClasses(styles, "menu", `menu_${subMenuDirection}`, main && "mainMenu");

  return (
    <ul role={`${main ? "menubar" : "menu"}`} className={classes} ref={ref}>
      <NavBarMenuContext value={value}>
        {items.map((itemProps, idx) => (
          <MenuItem key={idx} {...itemProps} />
        ))}
      </NavBarMenuContext>
    </ul>
  );
};
export default Menu;
