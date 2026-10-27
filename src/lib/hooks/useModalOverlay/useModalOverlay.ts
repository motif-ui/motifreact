"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { SyntheticEvent } from "react";
import useOverlayState from "../useOverlayState";
import useScrollLock from "../useScrollLock";
import { getFocusables } from "../useOverlayFocus/focusable";
import { ModalOverlayProps, UseModalOverlayReturn } from "./types";

// The open modals that trap the focus, in the order they were opened. Only the topmost one traps it, e.g. a confirmation
// opened over a modal. It is shared by all the instances, and the list is replaced on each change.
const openTraps: { list: symbol[] } = { list: [] };

/**
 * The state of a modal overlay: a dialog in a root that covers the page, e.g. a backdrop.
 * It closes on an outside click or Escape when enabled, but only when it is the topmost overlay, locks the page's scroll,
 * moves the focus into the dialog on open and back on close, and keeps the Tab focus in the dialog while it is open.
 */
const useModalOverlay = (props: ModalOverlayProps): UseModalOverlayReturn => {
  const { open, onClose, duration, closeOnOutsideClick, closeOnEscape } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const insideRefs = useMemo(() => [dialogRef], []);
  const layerRefs = useMemo(() => [rootRef], []);
  // The last focus event marked by insideProps, e.g. a focus in a select's list rendered in its own portal from the dialog
  const insideFocusRef = useRef<Event>(undefined);
  const {
    attached,
    visible,
    hide,
    insideProps: stateInsideProps,
  } = useOverlayState({
    open,
    onClose,
    duration,
    insideRefs,
    layerRefs,
    blocksLayersBelow: true,
    closeOnOutsideClick,
    closeOnEscape,
  });
  useScrollLock(open);

  // Keeps the Tab focus in the dialog while it is the topmost modal, and gives the focus back on close to the element that
  // had it on open, e.g. the button that opened it. The trap is registered before the focus moves into the dialog, so the
  // modals below do not bring it back to theirs.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !attached || !dialog) return;

    const opener = document.activeElement;
    const trap = Symbol("focusTrap");
    openTraps.list = [...openTraps.list, trap];
    const isTopmost = () => openTraps.list.at(-1) === trap;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || e.defaultPrevented || !isTopmost() || !(e.target instanceof Node) || !dialog.contains(e.target)) return;

      const focusables = getFocusables(dialog);
      const first = focusables.at(0);
      const last = focusables.at(-1);
      const wraps = !last || (e.shiftKey ? e.target === first || e.target === dialog : e.target === last);
      if (!wraps) return;
      e.preventDefault();
      (e.shiftKey ? last : first)?.focus();
    };
    // Brings back the focus moved out of the dialog in other ways, e.g. by the code or by a Tab the trap did not handle.
    // React handles the event before it reaches the document, so the events marked by insideProps are known here.
    const handleFocusIn = (e: FocusEvent) => {
      if (!isTopmost() || !(e.target instanceof Node) || dialog.contains(e.target) || insideFocusRef.current === e) return;
      dialog.focus({ preventScroll: true });
    };

    // Bubble phase, so the overlays opened in the dialog that move the focus themselves handle the Tab first, e.g. a select
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      openTraps.list = openTraps.list.filter(other => other !== trap);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);

      // After the trap is removed, so it does not bring the focus back into the dialog.
      // The focus is not moved back when the user moved it elsewhere, e.g. to a modal opened above it.
      const { activeElement } = document;
      const lost = !activeElement || activeElement === document.body || dialog.contains(activeElement);
      lost && opener instanceof HTMLElement && opener.isConnected && opener.focus({ preventScroll: true });
    };
  }, [open, attached]);

  // Moves the focus into the dialog once it is shown. A hidden element cannot get it, and the dialog is still hidden in the
  // first frame of the enter transition, since its visibility changes once the transition has started. So it tries each frame.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!visible || !attached || !dialog) return;

    const frame = { id: 0 };
    const focus = () => {
      if (dialog.contains(document.activeElement)) return;
      dialog.focus({ preventScroll: true });
      if (document.activeElement !== dialog) frame.id = requestAnimationFrame(focus);
    };
    focus();
    return () => cancelAnimationFrame(frame.id);
  }, [visible, attached]);

  const markFocusInside = useCallback((e: SyntheticEvent) => void (insideFocusRef.current = e.nativeEvent), []);
  const insideProps = useMemo(() => ({ ...stateInsideProps, onFocus: markFocusInside }), [stateInsideProps, markFocusInside]);

  return { attached, visible, hide, rootRef, dialogRef, insideProps };
};

export default useModalOverlay;
