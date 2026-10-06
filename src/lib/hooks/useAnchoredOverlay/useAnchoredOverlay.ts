"use client";

import { useCallback, useMemo, useRef } from "react";
import type { RefObject } from "react";
import useOverlayState from "../useOverlayState";
import useOverlayPosition from "../useOverlayPosition";
import useOverlayFocus from "../useOverlayFocus";
import { OverlayStateProps } from "../useOverlayState/types";
import { OverlayPosition } from "../useOverlayPosition/types";

type Props = {
  anchorRef: RefObject<HTMLElement | null>;
  placement: OverlayPosition;
  /** Limits the overlay's width to the space at its placement, so long content wraps instead of overflowing the screen */
  limitWidth?: boolean;
  /** Bridges the Tab key between the anchor and the overlay */
  tabBridge?: boolean;
} & Omit<OverlayStateProps, "insideRefs">;

/**
 * An overlay attached to an anchor element: open state and dismissal, positioning and keyboard focus in one place.
 * The overlay is expected to be absolutely positioned and rendered in document.body, e.g. with a portal.
 */
const useAnchoredOverlay = <T extends HTMLElement = HTMLDivElement>(props: Props) => {
  const { anchorRef, placement, limitWidth, tabBridge, ...overlayStateProps } = props;
  const overlayRef = useRef<T>(null);
  const insideRefs = useMemo(() => [anchorRef, overlayRef], [anchorRef]);

  const state = useOverlayState({ ...overlayStateProps, insideRefs });
  const position = useOverlayPosition(anchorRef, overlayRef, { placement, limitWidth, enabled: state.attached });

  const { hide } = state;
  const onLeave = useCallback(() => hide("focusLeave"), [hide]);
  useOverlayFocus(anchorRef, overlayRef, { enabled: !!tabBridge && state.open, onLeave });

  return { ...state, ...position, overlayRef };
};

export default useAnchoredOverlay;
