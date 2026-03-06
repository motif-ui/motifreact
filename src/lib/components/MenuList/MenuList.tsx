"use client";

import MainMenu from "@/components/MenuList/components/MainMenu";
import { MenuListProps } from "./types";
import { useEffect, useMemo, useState } from "react";
import useToggle from "../../hooks/useToggle";
import { PropsWithRef } from "../../types";
import { MenuListContext } from "./MenuListContext";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const MenuList = (p: PropsWithRef<MenuListProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("MenuList", p);
  const {
    items,
    darkMode,
    logo,
    footerText,
    enableCollapseButton,
    defaultCollapsed,
    onCollapsedChange,
    variant = "solid",
    size,
    style,
    className,
    ref,
  } = props;
  const { visible, toggle } = useToggle(!defaultCollapsed);
  const isControlled = props.collapsed !== undefined;
  const collapsed = isControlled ? !!props.collapsed : !visible;

  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  const contextValue = useMemo(
    () => ({
      darkMode,
      collapsed,
      toggle,
      variant,
      openSubmenus,
      setOpenSubmenus,
    }),
    [collapsed, darkMode, openSubmenus, toggle, variant],
  );

  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  return (
    <MenuListContext value={contextValue}>
      <MainMenu
        items={items}
        style={style}
        className={className}
        ref={ref}
        logo={logo}
        footerText={footerText}
        enableCollapseButton={enableCollapseButton}
        size={size}
      />
    </MenuListContext>
  );
};

MenuList.displayName = "MenuList";
export default MenuList;
