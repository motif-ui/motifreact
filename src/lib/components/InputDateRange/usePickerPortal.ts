"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RefObject } from "react";
import { usePopoverPosition, PopoverPosition } from "@/components/Popover/hooks/usePopoverPosition";

const PICKER_TOP_OFFSET = 2;

export const usePickerPortal = (
  anchorRef: RefObject<HTMLElement | null>,
  pickerRef: RefObject<HTMLDivElement | null>,
  visible: boolean,
  onOpen: () => void,
) => {
  const [alignment, setAlignment] = useState<PopoverPosition>("bottomLeft");
  const { startShowing, startHiding, attached, positionStyle } = usePopoverPosition(anchorRef, pickerRef, alignment, 0, false);

  useEffect(() => {
    visible ? startShowing() : startHiding(true);
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
