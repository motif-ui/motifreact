"use client";

import { useCallback, useMemo, useRef } from "react";
import type { RefObject } from "react";
import useOverlayState, { OverlayStateProps } from "./useOverlayState";
import useOverlayPosition from "./useOverlayPosition";
import useOverlayFocus from "./useOverlayFocus";
import { OverlayPosition } from "./useOverlayPosition/types";

type Options = {
  anchorRef: RefObject<HTMLElement | null>;
  placement: OverlayPosition;
  keepInView?: boolean;
  /** Bridges the Tab key between the anchor and the overlay */
  tabBridge?: boolean;
} & Omit<OverlayStateProps, "insideRefs">;

/**
 * An overlay attached to an anchor element: open state and dismissal, positioning and keyboard focus in one place.
 * The overlay is expected to be absolutely positioned and rendered in document.body, e.g. with a portal.
 */
const useAnchoredOverlay = <T extends HTMLElement = HTMLDivElement>(options: Options) => {
  const { anchorRef, placement, keepInView, tabBridge, ...overlayStateProps } = options;
  const overlayRef = useRef<T>(null);
  const insideRefs = useMemo(() => [anchorRef, overlayRef], [anchorRef]);

  const state = useOverlayState({ ...overlayStateProps, insideRefs });
  const position = useOverlayPosition(anchorRef, overlayRef, { placement, keepInView, enabled: state.attached });

  const { hide } = state;
  const onLeave = useCallback(() => hide("focusLeave"), [hide]);
  useOverlayFocus(anchorRef, overlayRef, { enabled: !!tabBridge && state.open, onLeave });

  return { ...state, ...position, overlayRef };
};

export default useAnchoredOverlay;
