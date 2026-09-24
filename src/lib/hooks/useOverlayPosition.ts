"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import { OverlayPosition } from "src/lib/types";
import useDomReady from "./useDomReady";

export const useOverlayPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  overlayRef: RefObject<HTMLElement | null>,
  placement: OverlayPosition,
  overlayReady?: boolean,
) => {
  const domReady = useDomReady();
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

    setInitialStyle(calculatedStyles[placement]);
  }, [anchorRef, placement]);

  const positionTheOverlay = useCallback(
    (style?: CSSProperties) => {
      if (!domReady || !style || !overlayRef.current || !anchorRef.current) return;
      const { scrollWidth, scrollHeight } = scrollSize.current;
      const { scrollX, scrollY } = window;
      const { top, left, bottom, right } = overlayRef.current.getBoundingClientRect();

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
    },
    [domReady, overlayRef, anchorRef],
  );

  const updatePosition = useCallback(
    (options?: { capture?: boolean }) => {
      if (options?.capture) {
        scrollSize.current = { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight };
      }
      setFinalStyle(undefined);
      calculateAndSetInitialStyle();
    },
    [calculateAndSetInitialStyle],
  );

  const clearPosition = useCallback(() => {
    setInitialStyle(undefined);
    setFinalStyle(undefined);
  }, []);

  useLayoutEffect(() => {
    positionTheOverlay(initialStyle);
  }, [domReady, initialStyle, positionTheOverlay, overlayReady]);

  return { positionStyle: finalStyle ?? initialStyle, updatePosition, clearPosition };
};
