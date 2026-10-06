"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import useVisibilityTransition from "../useVisibilityTransition";
import useDomReady from "../useDomReady";
import { OverlayCloseReason } from "src/lib/types";
import { OverlayStateProps, UseOverlayStateReturn } from "./types";

const useOverlayState = (props: OverlayStateProps): UseOverlayStateReturn => {
  const { open, defaultOpen, duration, onClose, insideRefs, closeOnOutsideClick, closeOnEscape, closeOnScroll } = props;
  const controlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(!!defaultOpen);
  const isOpen = controlled ? open : internalOpen;
  const transition = useVisibilityTransition(isOpen, duration);
  // Overlays are rendered in the document, e.g. with a portal, so they are attached only after mount, never on the server
  const domReady = useDomReady();
  const attached = transition.attached && domReady;
  const { visible } = transition;
  const onCloseRef = useRef(onClose);
  // The last event marked by insideProps. React handles an event before it reaches the document, so the last one is enough.
  // It is per instance, so an event inside one overlay is not counted as inside another one.
  const insideEventRef = useRef<Event>(undefined);
  // Keeps the close made by the open prop from being notified again after a close request in the same open cycle
  const closeNotifiedRef = useRef(!isOpen);
  // A tap fires touchend and then a compatibility mouseup, kept so they are handled as a single outside click
  const lastTouchEndRef = useRef(-Infinity);
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
      if (!controlled) {
        // Does nothing when it is closed, since onClose is already notified in that case and the state is already closed
        notifyClose(reason);
        setInternalOpen(false);
      } else if (isOpen) {
        // Each request is notified, since the parent may keep it open and decide again on the next one
        closeNotifiedRef.current = true;
        onCloseRef.current?.(reason);
      }
    },
    [controlled, isOpen, notifyClose],
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
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (e.type === "touchend") {
        lastTouchEndRef.current = e.timeStamp;
      } else if (e.timeStamp - lastTouchEndRef.current < 1000) {
        // Tap mouse up delay: 1000ms => Browsers fire the compatibility mouse events
        // of a tap within about 300ms after touchend, kept longer for slow devices
        return;
      }
      !isInside(e.target) && insideEventRef.current !== e && hide("outsideClick");
    };
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
  }, [isOpen, hide, insideRefs, closeOnOutsideClick, closeOnEscape, closeOnScroll]);

  const markInside = useCallback((e: SyntheticEvent) => void (insideEventRef.current = e.nativeEvent), []);
  const insideProps = useMemo(() => ({ onMouseUp: markInside, onTouchEnd: markInside }), [markInside]);

  return { open: isOpen, attached, visible, show, hide, toggle, insideProps };
};

export default useOverlayState;
