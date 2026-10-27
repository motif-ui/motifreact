"use client";

import Button from "./Button";
import ButtonGroupItemProvider from "../ButtonGroupItem/ButtonGroupItemProvider";
import styles from "../../ButtonGroup.module.scss";
import { PropsWithChildren, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import useAnchoredOverlay from "../../../../hooks/useAnchoredOverlay";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";
import { ButtonGroupItemProps } from "../ButtonGroupItem/ButtonGroupItem";
import { ButtonGroupContext } from "../../ButtonGroupContext";

const ButtonWithDropdown = (props: PropsWithChildren<ButtonGroupItemProps>) => {
  const { label, icon, disabled, action, children } = props;
  const { size } = useContext(ButtonGroupContext);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const {
    open,
    attached,
    style,
    overlayRef: dropdownRef,
    insideProps,
  } = useAnchoredOverlay({
    anchorRef,
    placement: "bottomRight",
    toggleOnAnchorClick: true,
    tabBridge: true,
    closeOnOutsideClick: true,
    inactive: disabled,
  });

  return (
    <>
      <Button ref={anchorRef} label={label} icon={icon} disabled={disabled} open={open} action={action} type="dropdown" />
      {attached &&
        createPortal(
          <ButtonGroupItemProvider>
            <div className={sanitizeModuleClasses(styles, "button__dropdownItem", size)} style={style} ref={dropdownRef} {...insideProps}>
              {children}
            </div>
          </ButtonGroupItemProvider>,
          document.body,
        )}
    </>
  );
};

export default ButtonWithDropdown;
