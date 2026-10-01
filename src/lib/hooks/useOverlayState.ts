"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import useToggle, { type ToggleState } from "./useToggle";
import { OverlayCloseReason } from "src/lib/types";

type Options = {
  /** Controlled open state. When it is not given, the overlay manages its own state */
  open?: boolean;
  /** Initial open state for the uncontrolled usage */
  defaultOpen?: boolean;
  /** Length in ms of the enter/exit transition */
  duration?: number;
  /** Called once per open cycle, when the overlay starts closing or when a close is requested in the controlled usage */
  onClose?: (reason: OverlayCloseReason) => void;
  /** Elements that are part of the overlay. Clicks and scrolls inside them do not close it */
  insideRefs?: RefObject<HTMLElement | null>[];
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  /** Closes the overlay when a scroll moves the inside elements, e.g. a page or a container scroll */
  closeOnScroll?: boolean;
};

type UseOverlayStateReturn = {
  open: boolean;
  /** Whether the overlay should be in the DOM, it stays true during the exit transition */
  attached: boolean;
  /** Whether the overlay should be shown, use it to trigger the enter/exit transitions */
  visible: boolean;
  toggleState?: ToggleState;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  close: (reason: OverlayCloseReason) => void;
};

const useOverlayState = (options: Options): UseOverlayStateReturn => {
  const { open, defaultOpen = false, duration, onClose, insideRefs, closeOnOutsideClick, closeOnEscape, closeOnScroll } = options;
  const controlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlled ? open : internalOpen;

  const { visible, toggleState, show: showToggle, hide: hideToggle } = useToggle({ duration });
  const attached = visible || !!toggleState;

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const attachedRef = useRef(attached);
  attachedRef.current = attached;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const insideRefsRef = useRef(insideRefs);
  insideRefsRef.current = insideRefs;

  // Keeps onClose to be called once per open cycle, whether the close is requested from inside or made by the open prop
  const closeNotifiedRef = useRef(!isOpen);
  const notifyClose = useCallback((reason: OverlayCloseReason) => {
    if (closeNotifiedRef.current) return;
    closeNotifiedRef.current = true;
    onCloseRef.current?.(reason);
  }, []);

  useEffect(() => {
    if (isOpen) {
      closeNotifiedRef.current = false;
      showToggle();
    } else {
      notifyClose("programmatic");
      attachedRef.current && hideToggle();
    }
  }, [isOpen, showToggle, hideToggle, notifyClose]);

  const close = useCallback(
    (reason: OverlayCloseReason) => {
      if (!isOpenRef.current) return;
      notifyClose(reason);
      !controlled && setInternalOpen(false);
    },
    [controlled, notifyClose],
  );

  const show = useCallback(() => {
    !controlled && setInternalOpen(true);
  }, [controlled]);

  const hide = useCallback(() => close("programmatic"), [close]);

  const toggle = useCallback(() => {
    isOpenRef.current ? hide() : show();
  }, [hide, show]);

  useEffect(() => {
    if (!isOpen) return;

    const isInside = (target: EventTarget | null) =>
      target instanceof Node && !!insideRefsRef.current?.some(ref => ref.current?.contains(target));
    const movesInside = (target: EventTarget | null) =>
      target === document || (target instanceof Node && !!insideRefsRef.current?.some(ref => ref.current && target.contains(ref.current)));

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => !isInside(e.target) && close("outsideClick");
    const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && close("escape");
    const handleScroll = (e: Event) => !isInside(e.target) && movesInside(e.target) && close("scroll");

    if (closeOnOutsideClick) {
      document.addEventListener("mouseup", handleOutsideClick);
      document.addEventListener("touchend", handleOutsideClick);
    }
    closeOnEscape && document.addEventListener("keydown", handleKeyDown);
    closeOnScroll && window.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
      document.removeEventListener("touchend", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isOpen, close, closeOnOutsideClick, closeOnEscape, closeOnScroll]);

  return { open: isOpen, attached, visible, toggleState, show, hide, toggle, close };
};

export default useOverlayState;
