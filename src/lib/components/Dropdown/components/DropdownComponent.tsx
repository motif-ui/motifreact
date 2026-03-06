import { PropsWithRef } from "../../../types";
import { DropdownProps } from "@/components/Dropdown/types";
import DropdownButton from "@/components/Dropdown/components/DropdownButton";
import DropdownMenu from "@/components/Dropdown/components/DropdownMenu";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import styles from "@/components/Dropdown/Dropdown.module.scss";
import usePropsWithThemeDefaults from "../../../motif/hooks/usePropsWithThemeDefaults";
import { useContext, useImperativeHandle } from "react";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";
import useOutsideClick from "../../../hooks/useOutsideClick";

type Props = Omit<DropdownProps, "size" | "disabled">;

const DropdownComponent = (props: PropsWithRef<Props, HTMLDivElement>) => {
  const {
    label,
    icon,
    pill,
    variant = "primary",
    shape = "solid",
    spacing = "callout",
    items,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Dropdown", props);
  const { size, open, hideMenu, disabled } = useContext(DropdownContext);

  const dropdownRef = useOutsideClick<HTMLDivElement>(hideMenu);
  useImperativeHandle(ref, () => dropdownRef.current!, [dropdownRef]);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    size,
    variant,
    shape,
    open && "open",
    pill && "pill",
    disabled && "disabled",
  ]);

  return (
    <div className={classNames} ref={dropdownRef} style={style} data-testid="Dropdown">
      <DropdownButton label={label} icon={icon} />
      {open && !disabled && <DropdownMenu items={items} spacing={spacing} />}
    </div>
  );
};

export default DropdownComponent;
