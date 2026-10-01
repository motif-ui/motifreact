"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import type { RefObject } from "react";
import { useOverlayPosition } from "src/lib/hooks/useOverlayPosition";
import { OverlayPosition } from "src/lib/types";
import useOverlayFocus from "src/lib/hooks/useOverlayFocus";

export const usePickerOverlay = (
  anchorRef: RefObject<HTMLElement | null>,
  pickerRef: RefObject<HTMLDivElement | null>,
  visible: boolean,
  onOpen: () => void,
  onHide: () => void,
) => {
  const [alignment, setAlignment] = useState<OverlayPosition>("bottomLeft");
  const [attached, setAttached] = useState(false);
  const { positionStyle, updatePosition } = useOverlayPosition(anchorRef, pickerRef, alignment);

  useLayoutEffect(() => {
    if (visible && !attached) {
      updatePosition({ capture: true });
      setAttached(true);
    } else if (!visible && attached) {
      setAttached(false);
    }
  }, [visible, attached, updatePosition]);

  useEffect(() => {
    if (!visible) {
      anchorRef.current?.querySelector("input")?.blur();
      return;
    }

    const handleResize = () => onHide();
    const handleScroll = () => {
      if (!pickerRef.current?.contains(document.activeElement)) onHide();
    };

    window.addEventListener("scroll", handleScroll, { capture: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, onHide]);

  const { onKeyDown: handleTabNavigation } = useOverlayFocus(anchorRef, pickerRef, { enabled: visible, onLeave: onHide });

  const pickerStyle = useMemo(() => {
    const isTop = alignment.startsWith("top");
    return {
      ...positionStyle,
      maxWidth: undefined,
      maxHeight: undefined,
      ...(isTop &&
        typeof positionStyle?.top === "number" && { top: `calc(${positionStyle.top}px - var(--base-sizing-2x) )`, marginTop: 0 }),
    };
  }, [alignment, positionStyle]);

  const openPicker = useCallback(() => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) {
      const vertical = window.innerHeight - rect.bottom >= rect.top ? "bottom" : "top";
      const horizontal = window.innerWidth - rect.left >= rect.right ? "Left" : "Right";
      setAlignment(`${vertical}${horizontal}`);
    }
    onOpen();
  }, [anchorRef, onOpen]);

  return { attached, pickerStyle, alignment, openPicker, handleTabNavigation };
};
