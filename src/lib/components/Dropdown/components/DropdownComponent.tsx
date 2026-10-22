import { PropsWithRef } from "../../../types";
import { DropdownProps } from "@/components/Dropdown/types";
import DropdownButton from "@/components/Dropdown/components/DropdownButton";
import DropdownMenu from "@/components/Dropdown/components/DropdownMenu";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import styles from "@/components/Dropdown/Dropdown.module.scss";
import usePropsWithThemeDefaults from "../../../motif/hooks/usePropsWithThemeDefaults";
import { useContext, useMemo, useRef } from "react";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";
import useAnchoredOverlay from "../../../hooks/useAnchoredOverlay";
import { createPortal } from "react-dom";
import { mergeRefs } from "../../../../utils/reactUtils";

type Props = Omit<DropdownProps, "size" | "disabled">;

const DropdownComponent = (props: PropsWithRef<Props, HTMLButtonElement>) => {
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

  const anchorRef = useRef<HTMLButtonElement>(null);
  const {
    attached,
    overlayRef,
    insideProps,
    style: overlayStyle,
    placement,
  } = useAnchoredOverlay({
    anchorRef,
    placement: "bottomRight",
    tabBridge: true,
    open: open && !disabled,
    onClose: hideMenu,
    closeOnOutsideClick: true,
    closeOnEscape: true,
  });
  const mergedRef = useMemo(() => mergeRefs(anchorRef, ref), [ref]);

  const side = placement.startsWith("top") ? "top" : "bottom";
  const overlayClassNames = sanitizeModuleRootClasses(styles, undefined, [size, spacing, side, disabled && "disabled"]);

  return (
    <>
      <DropdownButton
        className={className}
        style={style}
        label={label}
        icon={icon}
        ref={mergedRef}
        variant={variant}
        shape={shape}
        pill={pill}
      />
      {attached &&
        createPortal(
          <div className={overlayClassNames} ref={overlayRef} style={overlayStyle} {...insideProps} data-testid="Dropdown">
            {open && !disabled && <DropdownMenu items={items} />}
          </div>,
          document.body,
        )}
    </>
  );
};

export default DropdownComponent;
