"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject, SyntheticEvent } from "react";
import useVisibilityTransition from "./useVisibilityTransition";
import { OverlayCloseReason } from "src/lib/types";

export type OverlayStateProps = {
  /** Controlled open state. When it is not given, the overlay manages its own state */
  open?: boolean;
  /** Initial open state for the uncontrolled usage */
  defaultOpen?: boolean;
  /** Length in ms of the enter/exit transition */
  duration?: number;
  /** Called once per open cycle, when the overlay starts closing or when a close is requested in the controlled usage */
  onClose?: (reason?: OverlayCloseReason) => void;
  /**
   * Elements that are part of the overlay. Clicks and scrolls inside them do not close it.
   * Pass a stable array (e.g. with useMemo), otherwise the listeners are added again on each render.
   */
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
  show: () => void;
  /** Closes the overlay with the given reason, passed to onClose. In the controlled usage it only calls onClose. */
  hide: (reason?: OverlayCloseReason) => void;
  toggle: () => void;
  /**
   * Handlers to spread on an element whose React subtree belongs to the overlay, e.g. the overlay root.
   * Clicks in nested overlays rendered in their own portals bubble through the React tree, so they are not counted as outside.
   */
  insideProps: { onMouseUp: (e: SyntheticEvent) => void; onTouchEnd: (e: SyntheticEvent) => void };
};

const useOverlayState = (options: OverlayStateProps): UseOverlayStateReturn => {
  const { open, defaultOpen, duration, onClose, insideRefs, closeOnOutsideClick, closeOnEscape, closeOnScroll } = options;
  const controlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(!!defaultOpen);
  const isOpen = controlled ? open : internalOpen;
  const { attached, visible } = useVisibilityTransition(isOpen, duration);
  const onCloseRef = useRef(onClose);
  // Events marked by insideProps, per instance so an event inside one overlay is not counted as inside another one
  const [insideEvents] = useState(() => new WeakSet<Event>());
  // Keeps onClose to be called once per open cycle, whether the close is requested from inside or made by the open prop
  const closeNotifiedRef = useRef(!isOpen);
  const notifyClose = useCallback((reason?: OverlayCloseReason) => {
    if (closeNotifiedRef.current) return;
    closeNotifiedRef.current = true;
    onCloseRef.current?.(reason);
  }, []);

  onCloseRef.current = onClose;

  // Starts a new open cycle when opened, and notifies the close made by the open prop in the controlled usage
  useEffect(() => {
    if (isOpen) {
      closeNotifiedRef.current = false;
    } else {
      notifyClose();
    }
  }, [isOpen, notifyClose]);

  const hide = useCallback(
    (reason?: OverlayCloseReason) => {
      // Does nothing when it is closed, since onClose is already notified in that case and the state is already closed
      notifyClose(reason);
      !controlled && setInternalOpen(false);
    },
    [controlled, notifyClose],
  );

  const show = useCallback(() => {
    !controlled && setInternalOpen(true);
  }, [controlled]);

  const toggle = useCallback(() => {
    isOpen ? hide() : show();
  }, [isOpen, hide, show]);

  useEffect(() => {
    if (!isOpen) return;

    const isInside = (target: EventTarget | null) => target instanceof Node && !!insideRefs?.some(ref => ref.current?.contains(target));
    const movesInside = (target: EventTarget | null) =>
      target === document || (target instanceof Node && !!insideRefs?.some(ref => ref.current && target.contains(ref.current)));

    // React handles the event before it reaches the document, so the events marked by insideProps are known here
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => !isInside(e.target) && !insideEvents.has(e) && hide("outsideClick");
    const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && hide("escape");
    const handleScroll = (e: Event) => !isInside(e.target) && movesInside(e.target) && hide("scroll");

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
  }, [isOpen, hide, insideRefs, insideEvents, closeOnOutsideClick, closeOnEscape, closeOnScroll]);

  const markInside = useCallback(
    (e: SyntheticEvent) => {
      insideEvents.add(e.nativeEvent);
    },
    [insideEvents],
  );
  const insideProps = useMemo(() => ({ onMouseUp: markInside, onTouchEnd: markInside }), [markInside]);

  return { open: isOpen, attached, visible, show, hide, toggle, insideProps };
};

export default useOverlayState;
