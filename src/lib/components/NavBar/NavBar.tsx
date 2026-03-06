"use client";

import styles from "./NavBar.module.scss";
import { PropsWithRef } from "../../types";
import { NavBarProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { useState } from "react";
import NavBarSearch from "./components/NavBarSearch";
import NavBarButton from "./components/NavBarButton";
import NavBarLogo from "./components/NavBarLogo";
import Menu from "./components/NavBarMenu/Menu";
import { MotifIconButton } from "@/components/Motif/Icon";
import { NavBarContext } from "@/components/NavBar/NavBarContext";

const NavBar = (props: PropsWithRef<NavBarProps, HTMLElement>) => {
  const {
    variant = "neutral",
    elevated,
    ref,
    className,
    style,
    logo,
    search,
    button,
    mainMenu,
    actionMenu,
  } = usePropsWithThemeDefaults("NavBar", props);
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  const classNames = sanitizeModuleRootClasses(styles, className, [variant, elevated && "elevated", menuCollapsed && "menuCollapsed"]);
  return (
    <nav className={classNames} style={style} ref={ref}>
      <NavBarContext value={{ variant }}>
        {mainMenu && (
          <MotifIconButton name="density_medium" size="xl" onClick={() => setMenuCollapsed(p => !p)} className={styles.hamburger} />
        )}
        {logo && <NavBarLogo {...logo} />}
        <div className={styles.mainMenuContainer}>{mainMenu && <Menu {...mainMenu} main />}</div>
        {search && <NavBarSearch {...search} />}
        {button && <NavBarButton {...button} />}
        {actionMenu && <Menu {...actionMenu} />}
      </NavBarContext>
    </nav>
  );
};

NavBar.displayName = "NavBar";
export default NavBar;
