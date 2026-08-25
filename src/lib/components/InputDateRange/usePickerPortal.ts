"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";
import { usePopoverPosition } from "@/components/Popover/hooks/usePopoverPosition";
import { OverlayPosition } from "src/lib/types";

export const usePickerPortal = (
  anchorRef: RefObject<HTMLElement | null>,
  pickerRef: RefObject<HTMLDivElement | null>,
  visible: boolean,
  onOpen: () => void,
  onHide: () => void,
) => {
  const [alignment, setAlignment] = useState<OverlayPosition>("bottomLeft");
  const { startShowing, startHiding, attached, positionStyle } = usePopoverPosition(anchorRef, pickerRef, alignment, 0, true);

  useEffect(() => {
    if (visible) {
      startShowing();
    } else {
      startHiding(true);
      anchorRef.current?.querySelector("input")?.blur();
    }
  }, [visible, startShowing, startHiding, anchorRef]);

  useEffect(() => {
    if (!visible) return;

    const handleResize = () => onHide();
    const handleScroll = () => {
      if (pickerRef.current?.contains(document.activeElement)) return;
      onHide();
    };

    window.addEventListener("scroll", handleScroll, { capture: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, onHide]);

  const handleTabNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !visible || !pickerRef.current || !anchorRef.current) return;

      const focusableSelector = 'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const isVisible = (el: HTMLElement) => el.offsetParent !== null;
      const wrapperEls = Array.from(anchorRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter(isVisible);
      const pickerEls = Array.from(pickerRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter(isVisible);
      const lastInWrapper = wrapperEls.at(-1);
      const firstInPicker = pickerEls.at(0);
      const lastInPicker = pickerEls.at(-1);
      const inPicker = pickerRef.current.contains(e.target as Node);

      if (!e.shiftKey && e.target === lastInWrapper && firstInPicker) {
        e.preventDefault();
        firstInPicker.focus({ preventScroll: true });
      } else if (inPicker && e.shiftKey && e.target === firstInPicker) {
        e.preventDefault();
        lastInWrapper?.focus({ preventScroll: true });
      } else if (inPicker && !e.shiftKey && e.target === lastInPicker) {
        const allEls = Array.from(document.querySelectorAll<HTMLElement>(focusableSelector)).filter(el => !pickerRef.current!.contains(el));
        const nextEl = allEls.at(allEls.findLastIndex(el => anchorRef.current!.contains(el)) + 1);
        onHide();
        if (nextEl) {
          e.preventDefault();
          nextEl.focus({ preventScroll: true });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible, onHide],
  );

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

  return { attached, pickerStyle, openPicker, handleTabNavigation };
};
