"use client";

import { DropdownProps } from "./types";
import { PropsWithRef } from "../../types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";
import DropdownComponent from "@/components/Dropdown/components/DropdownComponent";

const Dropdown = (p: PropsWithRef<DropdownProps, HTMLButtonElement>) => {
  const { size = "md", disabled, ...props } = usePropsWithThemeDefaults("Dropdown", p);

  return (
    <DropdownContext value={{ size, disabled: !!disabled }}>
      <DropdownComponent {...props} />
    </DropdownContext>
  );
};

Dropdown.displayName = "Dropdown";
export default Dropdown;
