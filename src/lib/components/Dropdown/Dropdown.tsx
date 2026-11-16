"use client";

import { DropdownProps } from "./types";
import { PropsWithRef } from "../../types";
import DropdownComponent from "@/components/Dropdown/components/DropdownComponent";

const Dropdown = (p: PropsWithRef<DropdownProps, HTMLButtonElement>) => {
  return <DropdownComponent {...p} />;
};

Dropdown.displayName = "Dropdown";
export default Dropdown;
