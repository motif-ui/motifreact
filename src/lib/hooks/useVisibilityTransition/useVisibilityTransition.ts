"use client";

import { useEffect, useState } from "react";

/**
 * Enter/exit transition phases of an element driven by an open state.
 * - attached: whether the element should be in the DOM, it stays true during the exit transition
 * - visible: whether the element should be shown, use it to trigger the CSS transitions
 * Without a duration, both follow open immediately.
 */
const useVisibilityTransition = (open: boolean, duration?: number) => {
  // Becomes true a couple of frames after opening, so the browser paints the hidden state first and the enter transition runs
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Updates the phases while rendering the open change, so they are rendered with it instead of in an extra render
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    setEntered(false);
    setExiting(!open && !!duration);
  }

  useEffect(() => {
    if (!duration) return;

    if (open) {
      const frames: number[] = [];
      const outerFrame = requestAnimationFrame(() => frames.push(requestAnimationFrame(() => setEntered(true))));
      frames.push(outerFrame);
      return () => frames.forEach(frame => cancelAnimationFrame(frame));
    }

    if (exiting) {
      const timeout = setTimeout(() => setExiting(false), duration);
      return () => clearTimeout(timeout);
    }
  }, [open, exiting, duration]);

  return { attached: open || exiting, visible: duration ? open && entered : open };
};

export default useVisibilityTransition;
