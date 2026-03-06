import { RefObject, useLayoutEffect, useCallback, useState, CSSProperties, useRef } from "react";
import useDomReady from "../../../hooks/useDomReady";

export const usePopoverPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  itemRef: RefObject<HTMLElement | null>,
  position: "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" | "right" | "left",
  transitionTime: number,
) => {
  const domReady = useDomReady();
  const [attached, setAttached] = useState(false);
  const [visible, setVisible] = useState(false);
  const [initialStyle, setInitialStyle] = useState<CSSProperties>();
  const [finalStyle, setFinalStyle] = useState<CSSProperties>();
  const scrollSize = useRef<{ scrollWidth: number; scrollHeight: number }>({ scrollWidth: 0, scrollHeight: 0 });

  const calculateAndSetInitialStyle = useCallback(() => {
    if (!anchorRef.current) return;

    const { scrollWidth, scrollHeight } = scrollSize.current;
    const { top, left, right, bottom, width, height } = anchorRef.current.getBoundingClientRect();
    const { scrollX, scrollY } = window;

    const absTop = top + scrollY;
    const absBottom = bottom + scrollY;
    const absLeft = left + scrollX;
    const absRight = right + scrollX;
    const absCenterY = absTop + height / 2;
    const absCenterX = absLeft + width / 2;
    const maxHeightForBottoms = scrollHeight - absBottom;

    const calculatedStyles = {
      top: { top: absTop, left: absCenterX, transform: "translate(-50%, -100%)", maxWidth: scrollWidth, maxHeight: absTop },
      bottom: { top: absBottom, left: absCenterX, transform: "translateX(-50%)", maxWidth: scrollWidth, maxHeight: maxHeightForBottoms },
      left: { top: absCenterY, left: absLeft, transform: "translate(-100%, -50%)", maxWidth: absLeft, maxHeight: scrollHeight },
      right: { top: absCenterY, left: absRight, transform: "translateY(-50%)", maxWidth: scrollWidth - absRight, maxHeight: scrollHeight },
      topLeft: { top: absTop, left: absLeft, transform: "translateY(-100%)", maxWidth: scrollWidth - absLeft, maxHeight: absTop },
      topRight: { top: absTop, left: absRight, transform: "translate(-100%, -100%)", maxWidth: absRight, maxHeight: absTop },
      bottomLeft: { top: absBottom, left: absLeft, transform: "none", maxWidth: scrollWidth - absLeft, maxHeight: maxHeightForBottoms },
      bottomRight: { top: absBottom, left: absRight, transform: "translateX(-100%)", maxWidth: absRight, maxHeight: maxHeightForBottoms },
    };

    setInitialStyle(calculatedStyles[position]);
  }, [anchorRef, position]);

  const positionThePopover = useCallback(
    (style?: CSSProperties) => {
      if (!domReady || !style || !itemRef.current || !anchorRef.current) return;
      const { scrollWidth, scrollHeight } = scrollSize.current;
      const { scrollX, scrollY } = window;
      const { top, left, bottom, right } = itemRef.current.getBoundingClientRect();
      const anchorRect = anchorRef.current.getBoundingClientRect();

      const visualLeft = left + scrollX;
      const visualRight = right + scrollX;
      const visualTop = top + scrollY;
      const visualBottom = bottom + scrollY;

      const diffX = visualLeft < 0 ? -visualLeft : visualRight > scrollWidth ? scrollWidth - visualRight : 0;
      const diffY = visualTop < 0 ? -visualTop : visualBottom > scrollHeight ? scrollHeight - visualBottom : 0;

      setFinalStyle({
        ...style,
        left: (style.left as number) + diffX,
        top: (style.top as number) + diffY,
      });

      const anchorCenterY = anchorRect.top + scrollY + anchorRect.height / 2;
      const anchorCenterX = anchorRect.left + scrollX + anchorRect.width / 2;
      const finalVisualLeft = visualLeft + diffX;
      const finalVisualTop = visualTop + diffY;
      const CARET_OFFSET = 6;

      if (position === "left" || position === "right") {
        const caretTop = anchorCenterY - finalVisualTop - CARET_OFFSET;
        itemRef.current.style.setProperty("--caret-top", `${caretTop}px`);
      } else {
        const caretLeft = anchorCenterX - finalVisualLeft - CARET_OFFSET;
        itemRef.current.style.setProperty("--caret-left", `${caretLeft}px`);
      }
    },
    [domReady, itemRef, position, anchorRef],
  );

  useLayoutEffect(() => {
    // Repositions the popover in case of overflow
    if (attached) {
      positionThePopover(initialStyle);
      setVisible(true);
    }
  }, [attached, domReady, initialStyle, positionThePopover]);

  const startShowing = useCallback(() => {
    // Sets initial position
    scrollSize.current = { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight };
    setAttached(true);
    calculateAndSetInitialStyle();
  }, [calculateAndSetInitialStyle]);

  const startHiding = useCallback(
    (immediately?: boolean) => {
      const hide = () => {
        setAttached(false);
        setInitialStyle(undefined);
        setFinalStyle(undefined);
      };

      setVisible(false);
      immediately ? hide() : setTimeout(() => hide(), transitionTime);
    },
    [transitionTime],
  );

  return { attached, visible, positionStyle: finalStyle ?? initialStyle, startShowing, startHiding };
};
