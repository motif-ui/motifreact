"use client";

import { DropdownProps } from "./types";
import { PropsWithRef } from "../../types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { DropdownProvider } from "@/components/Dropdown/context/DropdownProvider";
import DropdownComponent from "@/components/Dropdown/components/DropdownComponent";

const Dropdown = (p: PropsWithRef<DropdownProps, HTMLDivElement>) => {
  const { size = "md", disabled, ...props } = usePropsWithThemeDefaults("Dropdown", p);

  return (
    <DropdownProvider size={size} disabled={!!disabled}>
      <DropdownComponent {...props} />
    </DropdownProvider>
  );
};

Dropdown.displayName = "Dropdown";
export default Dropdown;
