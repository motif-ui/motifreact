"use client";

import { PropsWithRef } from "../../../../../types";
import { DropdownProps } from "./types";
import DropdownButton from "./components/DropdownButton";
import DropdownMenuItem from "./components/DropdownMenuItem";
import { sanitizeModuleClasses, sanitizeModuleRootClasses } from "../../../../../../utils/cssUtils";
import styles from "./DropdownBaseline.module.scss";
import usePropsWithThemeDefaults from "../../../../../motif/hooks/usePropsWithThemeDefaults";
import { useMemo, useRef } from "react";
import { DropdownContext } from "./context/DropdownContext";
import useAnchoredOverlay from "../../../../../hooks/useAnchoredOverlay";
import { createPortal } from "react-dom";
import { mergeRefs } from "../../../../../../utils/reactUtils";

const Dropdown = (props: PropsWithRef<DropdownProps, HTMLButtonElement>) => {
  const {
    size = "md",
    disabled,
    label,
    icon,
    pill,
    variant,
    shape = "solid",
    spacing = "callout",
    items,
    ref,
    overlayRef,
    style,
    className,
  } = usePropsWithThemeDefaults("Dropdown", props);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const {
    open,
    hide,
    attached,
    overlayRef: menuRef,
    insideProps,
    style: overlayStyle,
    placement,
  } = useAnchoredOverlay({
    anchorRef,
    overlayRef,
    placement: "bottomRight",
    toggleOnAnchorClick: true,
    tabBridge: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    inactive: disabled,
  });
  const mergedRef = useMemo(() => mergeRefs(anchorRef, ref), [ref]);

  const side = placement.startsWith("top") ? "top" : "bottom";
  // solid defaults to primary; textOnly stays neutral unless a variant is given.
  const variantClass = variant ?? (shape === "solid" && "primary");
  const buttonClassNames = sanitizeModuleRootClasses(styles, className, [size, shape, variantClass, open && "open", pill && "pill"]);
  const overlayClassNames = sanitizeModuleClasses(styles, "Menu", size, spacing, side);

  return (
    <DropdownContext value={{ size, disabled, hideMenu: hide }}>
      <DropdownButton className={buttonClassNames} style={style} label={label} icon={icon} ref={mergedRef} />
      {attached &&
        createPortal(
          <div className={overlayClassNames} ref={menuRef} style={overlayStyle} {...insideProps} data-testid="dropdown-menu">
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
