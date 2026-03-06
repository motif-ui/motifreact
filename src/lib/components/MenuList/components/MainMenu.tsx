import styles from "../MenuList.module.scss";
import { MainMenuProps, SubMenuItemProps } from "@/components/MenuList/types";
import { useContext, useEffect } from "react";
import { MenuListContext } from "@/components/MenuList/MenuListContext";
import MenuItem from "@/components/MenuList/components/MenuItem";
import { PropsWithRef } from "../../../types";
import { subMenuRenderer } from "@/components/MenuList/components/SubMenu";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";

const MainMenu = (props: PropsWithRef<MainMenuProps, HTMLDivElement>) => {
  const { items, logo, footerText, enableCollapseButton, ref, className, style, size } = props;
  const { collapsed, setOpenSubmenus, darkMode, variant, toggle } = useContext(MenuListContext);

  const searchActiveSubmenuTree = (items: SubMenuItemProps[], parentMenuId: string): string[] =>
    items.flatMap((item, index) => {
      const id = `${parentMenuId}-${index}`;
      const childIds: string[] = item.items?.length ? searchActiveSubmenuTree(item.items, id) : [];
      return item.active || childIds.length ? [id, ...childIds] : childIds;
    });

  useEffect(() => {
    const openSubMenus = searchActiveSubmenuTree(items, "0");
    setOpenSubmenus(openSubMenus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maybeLogoContainer = (!collapsed && logo) || enableCollapseButton;

  const classNames = sanitizeModuleRootClasses(styles, className, [darkMode && "dark", collapsed && "collapsed", size, variant]);

  return (
    <div className={classNames} ref={ref} style={style}>
      {maybeLogoContainer && (
        <div className={styles.logoContainer}>
          {logo && !collapsed && <img src={logo} alt="logo" className={styles.logo} />}
          {enableCollapseButton && (
            <button className={styles.collapseButton} onClick={() => toggle()} data-testid="menuListCollapseButton">
              <svg width="22" height="22" viewBox="1 1 22 22" fill="none">
                <path d="M3 21V19H21V21H3ZM3 13V11H21V13H3ZM3 5V3H21V5H3Z" fill="black" />
              </svg>
            </button>
          )}
        </div>
      )}
      <ul className={styles.mainMenu}>
        {items.map((item, index) => (
          <MenuItem {...item} key={index} level={0} id={`0-${index}`} subMenuRenderer={subMenuRenderer} />
        ))}
      </ul>
      {footerText && !collapsed && <span className={styles.footerText}>{footerText}</span>}
    </div>
  );
};

export default MainMenu;
