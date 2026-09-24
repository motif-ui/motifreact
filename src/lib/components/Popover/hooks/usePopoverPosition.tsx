import { RefObject, useEffect, useLayoutEffect, useRef } from "react";
import useControlledVisibility from "src/lib/hooks/useControlledVisibility";
import { useOverlayPosition } from "src/lib/hooks/useOverlayPosition";
import { OverlayPosition } from "src/lib/types";

export const usePopoverPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  placeOn: OverlayPosition,
  open: boolean | undefined,
  onClose: (() => void) | undefined,
) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { visible, attached, hideWithoutTransition } = useControlledVisibility({ open, duration: 300 });
  const { positionStyle, updatePosition, clearPosition } = useOverlayPosition(anchorRef, popoverRef, placeOn, attached);

  useEffect(() => {
    if (!open && attached) onClose?.();
  }, [attached, open, onClose]);

  useLayoutEffect(() => {
    if (!attached) {
      if (open) updatePosition({ capture: true });
      else clearPosition();
    }
  }, [attached, clearPosition, open, updatePosition]);

  useEffect(() => {
    if (!attached) return;
    const handleResize = () => {
      hideWithoutTransition();

      if (open) onClose?.();
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [attached, hideWithoutTransition, onClose, open]);

  useLayoutEffect(() => {
    if (!attached || !positionStyle || !popoverRef.current || !anchorRef.current) return;

    const { scrollX, scrollY } = window;
    const { top, left } = popoverRef.current.getBoundingClientRect();
    const anchorRect = anchorRef.current.getBoundingClientRect();
    const visualLeft = left + scrollX;
    const visualTop = top + scrollY;
    const anchorCenterY = anchorRect.top + scrollY + anchorRect.height / 2;
    const anchorCenterX = anchorRect.left + scrollX + anchorRect.width / 2;
    const CARET_OFFSET = 6;

    if (placeOn === "left" || placeOn === "right") {
      popoverRef.current.style.setProperty("--caret-top", `${anchorCenterY - visualTop - CARET_OFFSET}px`);
    } else {
      popoverRef.current.style.setProperty("--caret-left", `${anchorCenterX - visualLeft - CARET_OFFSET}px`);
    }
  }, [attached, positionStyle, placeOn, anchorRef]);

  return { attached, visible: visible && !!positionStyle, positionStyle, popoverRef };
};
