import { createContext, PropsWithChildren, useState } from "react";
import { dropdownContextDefaultValues, DropdownContextProps } from "@/components/Dropdown/types";
import { Size4SM } from "../../../types";

export const DropdownContext = createContext<DropdownContextProps>(dropdownContextDefaultValues);

type Props = {
  size: Size4SM;
  disabled: boolean;
};

export const DropdownProvider = (props: PropsWithChildren<Props>) => {
  const { disabled, size, children } = props;
  const [open, setOpen] = useState<boolean>(false);
  const toggleMenu = () => setOpen(prev => !prev);
  const hideMenu = () => setOpen(false);

  const value: DropdownContextProps = {
    open,
    size,
    toggleMenu,
    hideMenu,
    disabled,
  };

  return <DropdownContext value={value}>{children}</DropdownContext>;
};
