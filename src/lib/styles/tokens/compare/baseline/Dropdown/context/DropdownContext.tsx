import { createContext } from "react";
import { dropdownContextDefaultValues, DropdownContextProps } from "../types";

export const DropdownContext = createContext<DropdownContextProps>(dropdownContextDefaultValues);
