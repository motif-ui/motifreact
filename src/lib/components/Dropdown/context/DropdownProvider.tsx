import { createContext } from "react";
import { dropdownContextDefaultValues, DropdownContextProps } from "@/components/Dropdown/types";

export const DropdownContext = createContext<DropdownContextProps>(dropdownContextDefaultValues);
