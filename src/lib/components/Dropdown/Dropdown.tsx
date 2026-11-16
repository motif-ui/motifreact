"use client";

import { PropsWithRef } from "src/lib/types";
import { DropdownProps } from "@/components/Dropdown/types";
import DropdownButton from "@/components/Dropdown/components/DropdownButton";
import DropdownMenuItem from "@/components/Dropdown/components/DropdownMenuItem";
import { sanitizeModuleClasses, sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import styles from "@/components/Dropdown/Dropdown.module.scss";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { useMemo, useRef } from "react";
import { DropdownContext } from "src/lib/components/Dropdown/context/DropdownContext";
import useAnchoredOverlay from "../../hooks/useAnchoredOverlay";
import { createPortal } from "react-dom";
import { mergeRefs } from "../../../utils/reactUtils";

const Dropdown = (props: PropsWithRef<DropdownProps, HTMLButtonElement>) => {
  const {
    size = "md",
    disabled,
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

  const anchorRef = useRef<HTMLButtonElement>(null);
  const {
    open,
    hide,
    attached,
    overlayRef,
    insideProps,
    style: overlayStyle,
    placement,
  } = useAnchoredOverlay({
    anchorRef,
    placement: "bottomRight",
    toggleOnAnchorClick: true,
    tabBridge: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    inactive: disabled,
  });
  const mergedRef = useMemo(() => mergeRefs(anchorRef, ref), [ref]);

  const side = placement.startsWith("top") ? "top" : "bottom";
  const buttonClassNames = sanitizeModuleRootClasses(styles, className, [size, shape, variant, open && "open", pill && "pill"]);
  const overlayClassNames = sanitizeModuleClasses(styles, "Menu", size, spacing, side);

  return (
    <DropdownContext value={{ size, disabled, hideMenu: hide }}>
      <DropdownButton className={buttonClassNames} style={style} label={label} icon={icon} ref={mergedRef} />
      {attached &&
        createPortal(
          <div className={overlayClassNames} ref={overlayRef} style={overlayStyle} {...insideProps} data-testid="dropdown-menu">
            <ul className={styles.MenuList}>
              {items.map((item, index) => (
                <DropdownMenuItem key={index} {...item} />
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </DropdownContext>
  );
};

Dropdown.displayName = "Dropdown";
export default Dropdown;
