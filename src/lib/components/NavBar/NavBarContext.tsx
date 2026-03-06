import { createContext, useContext } from "react";
import { NavBarContextProps, navBarMenuContextDefaults, NavBarMenuContextProps } from "@/components/NavBar/types";

export const NavBarContext = createContext<NavBarContextProps>({ variant: "neutral" });
export const useNavBarContext = () => useContext(NavBarContext);

export const NavBarMenuContext = createContext<NavBarMenuContextProps>(navBarMenuContextDefaults);
export const useNavBarMenuContext = () => useContext(NavBarMenuContext);
