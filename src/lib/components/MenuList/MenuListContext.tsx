import { createContext } from "react";
import { menuListContextDefaultValues, MenuListContextProps } from "@/components/MenuList/types";

export const MenuListContext = createContext<MenuListContextProps>(menuListContextDefaultValues);
