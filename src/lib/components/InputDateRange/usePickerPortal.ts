"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import type { RefObject } from "react";
import { usePopoverPosition } from "@/components/Popover/hooks/usePopoverPosition";

type PickerAlignment = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";

const PICKER_TOP_OFFSET = 2;

export const usePickerPortal = (
  anchorRef: RefObject<HTMLElement | null>,
  pickerRef: RefObject<HTMLDivElement | null>,
  visible: boolean,
  onOpen: () => void,
) => {
  const [alignment, setAlignment] = useState<PickerAlignment>("bottomLeft");
  const { startShowing, startHiding, attached, positionStyle } = usePopoverPosition(anchorRef, pickerRef, alignment, 0);

  // usePopoverPosition sets --caret-top/--caret-left directly on the DOM node after its
  // own useLayoutEffect. We clear them in the next layoutEffect (hooks run in order).
  useLayoutEffect(() => {
    if (!pickerRef.current) return;
    pickerRef.current.style.removeProperty("--caret-top");
    pickerRef.current.style.removeProperty("--caret-left");
  });

  useEffect(() => {
    if (visible) startShowing();
    else startHiding(true);
  }, [visible, startShowing, startHiding]);

  const pickerStyle = useMemo(() => {
    const isTop = alignment.startsWith("top");
    return {
      ...positionStyle,
      maxWidth: undefined,
      maxHeight: undefined,
      ...(isTop && typeof positionStyle?.top === "number" && { top: positionStyle.top - PICKER_TOP_OFFSET, marginTop: 0 }),
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

  return { attached, pickerStyle, openPicker };
};
