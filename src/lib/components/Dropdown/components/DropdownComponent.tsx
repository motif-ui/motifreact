import { PropsWithRef } from "../../../types";
import { DropdownProps } from "@/components/Dropdown/types";
import DropdownButton from "@/components/Dropdown/components/DropdownButton";
import DropdownMenu from "@/components/Dropdown/components/DropdownMenu";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import styles from "@/components/Dropdown/Dropdown.module.scss";
import usePropsWithThemeDefaults from "../../../motif/hooks/usePropsWithThemeDefaults";
import { useContext, useMemo, useRef } from "react";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";
import useAnchoredOverlay from "src/lib/hooks/useAnchoredOverlay";
import { createPortal } from "react-dom";
import { mergeRefs } from "../../../../utils/reactUtils";

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
    open,
    onClose: hideMenu,
    closeOnOutsideClick: true,
    closeOnEscape: true,
  });
  const mergedRef = useMemo(() => mergeRefs(overlayRef, ref), [overlayRef, ref]);

  const side = placement.startsWith("top") ? "top" : "bottom";
  const classNames = sanitizeModuleRootClasses(styles, className, [size, spacing, side, disabled && "disabled"]);

  return (
    <>
      <DropdownButton label={label} icon={icon} anchorRef={anchorRef} variant={variant} shape={shape} pill={pill} />
      {attached &&
        createPortal(
          <div className={classNames} ref={mergedRef} style={{ ...style, ...overlayStyle }} {...insideProps} data-testid="Dropdown">
            {open && !disabled && <DropdownMenu items={items} />}
          </div>,
          document.body,
        )}
    </>
  );
};

export default DropdownComponent;
