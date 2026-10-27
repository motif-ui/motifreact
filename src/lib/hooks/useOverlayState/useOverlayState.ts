"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject, SyntheticEvent } from "react";
import useVisibilityTransition from "../useVisibilityTransition";
import useDomReady from "../useDomReady";
import { OverlayCloseReason } from "src/lib/types";
import { Layer, OverlayStateProps, UseOverlayStateReturn } from "./types";

/**
 * The open overlays in the order they were opened, shared by all the instances (this is why it is defined outside the hook).
 */
const openLayers: { list: RefObject<Layer>[] } = { list: [] };

const useOverlayState = (props: OverlayStateProps): UseOverlayStateReturn => {
  const {
    open,
    defaultOpen,
    duration,
    onClose,
    insideRefs,
    layerRefs,
    blocksLayersBelow,
    closeOnOutsideClick,
    closeOnEscape,
    closeOnScroll,
  } = props;
  const controlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(!!defaultOpen);
  const isOpen = controlled ? open : internalOpen;
  const transition = useVisibilityTransition(isOpen, duration);
  const domReady = useDomReady();
  const attached = transition.attached && domReady;
  const { visible } = transition;
  const onCloseRef = useRef(onClose);
  // The last event marked by insideProps. React handles an event before it reaches the document, so the last one is enough.
  // It is per instance, so an event inside one overlay is not counted as inside another one.
  const insideEventRef = useRef<Event>(undefined);

  // This overlay's entry in openLayers, replaced on each render, while its place in the order is kept from its opening
  const layer = { refs: layerRefs ?? insideRefs ?? [], closeOnEscape: !!closeOnEscape, blocksLayersBelow: !!blocksLayersBelow };
  const layerRef = useRef(layer);

  onCloseRef.current = onClose;
  layerRef.current = layer;

  const hide = useCallback(
    (reason?: OverlayCloseReason) => {
      if (!isOpen) return;
      // Only the closes requested by the user are notified, the ones made by the code that owns the overlay are not
      if (reason) onCloseRef.current?.(reason);
      // In the controlled usage the parent decides whether to close it
      if (!controlled) setInternalOpen(false);
    },
    [controlled, isOpen],
  );

  const show = useCallback(() => {
    !controlled && setInternalOpen(true);
  }, [controlled]);

  const toggle = useCallback(() => {
    isOpen ? hide() : show();
  }, [isOpen, hide, show]);

  useEffect(() => {
    if (!isOpen) return;
    openLayers.list = [...openLayers.list, layerRef];
    return () => void (openLayers.list = openLayers.list.filter(other => other !== layerRef));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const layersAbove = () => openLayers.list.slice(openLayers.list.indexOf(layerRef) + 1).map(({ current }) => current);
    const isOnLayerAbove = (target: EventTarget | null) =>
      target instanceof Node && layersAbove().some(({ refs }) => refs.some(ref => ref.current?.contains(target)));
    const isTopmostOnEscape = () => !layersAbove().some(({ closeOnEscape, blocksLayersBelow }) => closeOnEscape || blocksLayersBelow);
    const isInside = (target: EventTarget | null) => target instanceof Node && !!insideRefs?.some(ref => ref.current?.contains(target));
    const movesInside = (target: EventTarget | null) =>
      target === document || (target instanceof Node && !!insideRefs?.some(ref => ref.current && target.contains(ref.current)));

    // React handles the event before it reaches the document, so the events marked by insideProps are known here
    const isOutside = (e: Event) => !isInside(e.target) && insideEventRef.current !== e && !isOnLayerAbove(e.target);
    /**
     * An outside click is a click whose press also started outside. So a text selection started inside and released
     * outside does not close it, and neither does scrolling the page by touch, since the browser fires no click after it.
     */
    const press = { outside: false };
    const handlePointerDown = (e: PointerEvent) => void (press.outside = isOutside(e));
    const handleClick = (e: MouseEvent) => press.outside && isOutside(e) && hide("outsideClick");
    const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && isTopmostOnEscape() && hide("escape");
    const handleScroll = (e: Event) => !isInside(e.target) && movesInside(e.target) && hide("scroll");

    if (closeOnOutsideClick) {
      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("click", handleClick);
    }
    closeOnEscape && document.addEventListener("keydown", handleKeyDown);
    closeOnScroll && window.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isOpen, hide, insideRefs, closeOnOutsideClick, closeOnEscape, closeOnScroll]);

  const markInside = useCallback((e: SyntheticEvent) => void (insideEventRef.current = e.nativeEvent), []);
  const insideProps = useMemo(() => ({ onPointerDown: markInside, onClick: markInside }), [markInside]);

  return { open: isOpen, attached, visible, show, hide, toggle, insideProps };
};

export default useOverlayState;
